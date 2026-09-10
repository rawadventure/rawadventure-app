#!/usr/bin/env python3
"""Miroir Trello du kanban local (roadmap.json = source de vérité).

Deux modes, choisis automatiquement :
  - le tableau « Raw Adventure App » n'existe pas → création complète
    (listes, étiquettes R1-R10, cartes des tâches non-done) ;
  - le tableau existe → synchronisation : nouvelles tâches ajoutées,
    changements de statut répercutés (déplacement de liste), tâches
    passées done déplacées dans « Fait », titres/descriptions réalignés.
    Les cartes ajoutées à la main sur Trello (sans identifiant Rx-y)
    ne sont jamais touchées.

Spec validée par Stéphane (10 sept 2026) :
  - listes : À faire / En cours / En review / Fait / Hors-scope V1
  - une étiquette par bloc R1-R10
  - titre « Rx-y · label » + « [bloquant] » si priorité bloquante
  - description : bloc + priorité + renvois docs pour R4-13→17 et R9-15

Usage :
  source ~/.trello-env && python3 kanban/push-trello.py            # applique
  source ~/.trello-env && python3 kanban/push-trello.py --dry-run  # montre sans rien toucher
"""

import json
import os
import sys
import time
import urllib.parse
import urllib.request

API = "https://api.trello.com/1"
BOARD_NAME = "Raw Adventure App"
ROADMAP = os.path.join(os.path.dirname(__file__), "roadmap.json")

STATUS_TO_LIST = {
    "todo": "À faire",
    "doing": "En cours",
    "review": "En review",
    "done": "Fait",
    "blocked": "Hors-scope V1",
}
LISTS = ["À faire", "En cours", "En review", "Fait", "Hors-scope V1"]
LABEL_COLORS = ["green", "yellow", "orange", "red", "purple",
                "blue", "sky", "lime", "pink", "black"]

# Renvois docs spécifiques (spec du 10 sept)
DOC_REFS = {
    "R4-13": "docs/contenu/arbitrages-et-demandes-phase1.md",
    "R4-14": "docs/contenu/arbitrages-et-demandes-phase1.md",
    "R4-15": "docs/contenu/arbitrages-et-demandes-phase1.md",
    "R4-16": "docs/contenu/arbitrages-et-demandes-phase1.md",
    "R4-17": "docs/contenu/arbitrages-et-demandes-phase1.md",
    "R9-15": "docs/contenu/arbitrages-et-demandes-phase1.md + docs/tests/salve-phase1-s1-s8.md",
}


# ---------------------------------------------------------------------------
# Logique pure (testée dans test_push_trello.py, aucun appel réseau)
# ---------------------------------------------------------------------------

def desired_state(blocks):
    """État attendu du tableau, par identifiant de tâche (Rx-y).

    Une tâche done qui n'a jamais eu de carte n'en recevra pas ; mais si sa
    carte existe déjà, elle sera déplacée dans « Fait » (voir plan_sync).
    """
    out = {}
    for blk in blocks:
        for t in blk["tasks"]:
            title = f"{t['id']} · {t['label']}"
            if t.get("priority") == "bloquant":
                title += " [bloquant]"
            desc_lines = [f"Bloc : {blk['id']} — {blk['title']}"]
            if t.get("priority"):
                desc_lines.append(f"Priorité : {t['priority']}")
            if t["id"] in DOC_REFS:
                desc_lines.append(f"Docs : {DOC_REFS[t['id']]}")
            out[t["id"]] = {
                "title": title,
                "desc": "\n".join(desc_lines),
                "list": STATUS_TO_LIST[t["status"]],
                "block": blk["id"],
                "status": t["status"],
            }
    return out


def card_task_id(card_name):
    """« R4-13 · Validation… [bloquant] » → « R4-13 ». None si carte manuelle."""
    if " · " not in card_name:
        return None
    return card_name.split(" · ")[0].strip()


def plan_sync(blocks, cards, list_name_by_id):
    """Compare roadmap.json aux cartes du tableau, renvoie les opérations.

    cards : [{id, name, desc, idList}] ; list_name_by_id : {idList: nom}.
    Opérations : ("create", task_id) / ("move", card_id, liste, titre)
                 / ("update", card_id, titre, desc) / ("skip_manual", nom).
    """
    desired = desired_state(blocks)
    ops = []
    seen = set()
    for c in cards:
        tid = card_task_id(c["name"])
        if tid is None or tid not in desired:
            ops.append(("skip_manual", c["name"]))
            continue
        seen.add(tid)
        d = desired[tid]
        if list_name_by_id.get(c["idList"]) != d["list"]:
            ops.append(("move", c["id"], d["list"], d["title"]))
        if c["name"] != d["title"] or (c.get("desc") or "") != d["desc"]:
            ops.append(("update", c["id"], d["title"], d["desc"]))
    for tid, d in desired.items():
        if tid in seen or d["status"] == "done":
            continue
        ops.append(("create", tid))
    return ops


# ---------------------------------------------------------------------------
# Appels API
# ---------------------------------------------------------------------------

KEY = os.environ.get("TRELLO_KEY")
TOKEN = os.environ.get("TRELLO_TOKEN")


def call(method, path, **params):
    params["key"] = KEY
    params["token"] = TOKEN
    qs = urllib.parse.urlencode(params)
    url = f"{API}{path}?{qs}"
    req = urllib.request.Request(url, method=method)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:  # rate limit
                time.sleep(2 * (attempt + 1))
                continue
            body = e.read().decode(errors="replace")
            sys.exit(f"Erreur Trello {e.code} sur {method} {path} : {body}")
    return None


def find_board():
    for b in call("GET", "/members/me/boards", fields="name,closed,url"):
        if b["name"] == BOARD_NAME and not b["closed"]:
            return b
    return None


def ensure_labels(board_id, blocks):
    """Renvoie {bloc: idLabel}, en créant les étiquettes manquantes."""
    existing = {l["name"]: l["id"]
                for l in call("GET", f"/boards/{board_id}/labels", limit="100")}
    out = {}
    for i, blk in enumerate(blocks):
        name = f"{blk['id']} · {blk['title']}"
        if name not in existing:
            lab = call("POST", "/labels", name=name,
                       color=LABEL_COLORS[i % len(LABEL_COLORS)], idBoard=board_id)
            existing[name] = lab["id"]
        out[blk["id"]] = existing[name]
    return out


def create_board(blocks):
    print(f"Création du tableau « {BOARD_NAME} »…")
    board = call("POST", "/boards/", name=BOARD_NAME, defaultLists="false",
                 desc="Miroir du kanban local (kanban/roadmap.json = source de vérité). "
                      "Tâches restantes V1, partagé avec Mimi & Jacky.")
    board_id = board["id"]
    list_ids = {}
    for name in LISTS:
        lst = call("POST", "/lists", name=name, idBoard=board_id, pos="bottom")
        list_ids[name] = lst["id"]
    label_ids = ensure_labels(board_id, blocks)
    desired = desired_state(blocks)
    count = 0
    for tid, d in desired.items():
        if d["status"] == "done":
            continue
        call("POST", "/cards", idList=list_ids[d["list"]], name=d["title"],
             desc=d["desc"], idLabels=label_ids[d["block"]], pos="bottom")
        count += 1
        print(f"  carte {count} : {d['title']}")
    print(f"\nTerminé : {count} cartes sur {board['url']}")


def sync_board(board, blocks, dry_run):
    board_id = board["id"]
    lists = call("GET", f"/boards/{board_id}/lists", fields="name")
    list_name_by_id = {l["id"]: l["name"] for l in lists}
    list_id_by_name = {l["name"]: l["id"] for l in lists}
    missing = [n for n in LISTS if n not in list_id_by_name]
    if missing:
        sys.exit(f"Listes manquantes sur le tableau : {missing}. "
                 "Les recréer sur Trello avec ces noms exacts, ou supprimer le tableau.")
    cards = call("GET", f"/boards/{board_id}/cards",
                 fields="name,desc,idList", limit="1000")

    ops = plan_sync(blocks, cards, list_name_by_id)
    creates = [o for o in ops if o[0] == "create"]
    moves = [o for o in ops if o[0] == "move"]
    updates = [o for o in ops if o[0] == "update"]
    manual = [o for o in ops if o[0] == "skip_manual"]

    if not (creates or moves or updates):
        print("Tableau déjà à jour — rien à faire.")
        if manual:
            print(f"({len(manual)} carte(s) manuelle(s) laissée(s) telle(s) quelle(s))")
        return

    prefix = "[dry-run] " if dry_run else ""
    desired = desired_state(blocks)
    label_ids = None if dry_run else ensure_labels(board_id, blocks)

    for _, card_id, list_name, title in moves:
        print(f"{prefix}déplace → {list_name} : {title}")
        if not dry_run:
            call("PUT", f"/cards/{card_id}", idList=list_id_by_name[list_name])
    for _, card_id, title, desc in updates:
        print(f"{prefix}met à jour : {title}")
        if not dry_run:
            call("PUT", f"/cards/{card_id}", name=title, desc=desc)
    for _, tid in creates:
        d = desired[tid]
        print(f"{prefix}crée dans {d['list']} : {d['title']}")
        if not dry_run:
            call("POST", "/cards", idList=list_id_by_name[d["list"]],
                 name=d["title"], desc=d["desc"],
                 idLabels=label_ids[d["block"]], pos="bottom")
    for _, name in manual:
        print(f"{prefix}carte manuelle ignorée : {name}")

    verb = "à appliquer" if dry_run else "appliquée(s)"
    print(f"\n{len(creates)} création(s), {len(moves)} déplacement(s), "
          f"{len(updates)} mise(s) à jour {verb}. {board['url']}")


def main():
    dry_run = "--dry-run" in sys.argv
    if not KEY or not TOKEN:
        sys.exit("TRELLO_KEY et TRELLO_TOKEN requis — lancer d'abord : source ~/.trello-env")
    with open(ROADMAP) as f:
        blocks = json.load(f)["blocks"]
    board = find_board()
    if board is None:
        if dry_run:
            sys.exit("Pas de tableau existant — le dry-run ne s'applique qu'à la synchronisation.")
        create_board(blocks)
    else:
        sync_board(board, blocks, dry_run)


if __name__ == "__main__":
    main()
