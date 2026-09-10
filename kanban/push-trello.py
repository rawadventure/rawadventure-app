#!/usr/bin/env python3
"""Push du kanban local (roadmap.json) vers un nouveau tableau Trello.

Miroir de partage pour Mimi & Jacky — roadmap.json reste la source de vérité.
Spec validée par Stéphane (10 sept 2026) :
  - nouveau tableau « Raw Adventure App »
  - listes : À faire / En cours / En review / Fait / Hors-scope V1
  - une étiquette par bloc R1-R10
  - cartes : seulement les tâches non-done
  - titre « Rx-y · label » + « [bloquant] » si priorité bloquante
  - description : bloc + priorité + renvois docs pour R4-13→17 et R9-15

Usage :
  TRELLO_KEY=... TRELLO_TOKEN=... python3 kanban/push-trello.py
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


def main():
    if not KEY or not TOKEN:
        sys.exit("TRELLO_KEY et TRELLO_TOKEN requis (voir https://trello.com/power-ups/admin).")

    with open(ROADMAP) as f:
        blocks = json.load(f)["blocks"]

    # Garde anti-doublon : ne pas recréer le tableau s'il existe déjà.
    existing = call("GET", "/members/me/boards", fields="name,closed,url")
    for b in existing:
        if b["name"] == BOARD_NAME and not b["closed"]:
            sys.exit(f"Tableau « {BOARD_NAME} » existe déjà : {b['url']}\n"
                     "Supprimer/renommer d'abord, ou adapter BOARD_NAME.")

    print(f"Création du tableau « {BOARD_NAME} »…")
    board = call("POST", "/boards/", name=BOARD_NAME, defaultLists="false",
                 desc="Miroir du kanban local (kanban/roadmap.json = source de vérité). "
                      "Tâches restantes V1, partagé avec Mimi & Jacky.")
    board_id = board["id"]

    list_ids = {}
    for name in LISTS:
        lst = call("POST", "/lists", name=name, idBoard=board_id, pos="bottom")
        list_ids[name] = lst["id"]
    print(f"  {len(LISTS)} listes créées.")

    label_ids = {}
    for i, blk in enumerate(blocks):
        lab = call("POST", "/labels", name=f"{blk['id']} · {blk['title']}",
                   color=LABEL_COLORS[i % len(LABEL_COLORS)], idBoard=board_id)
        label_ids[blk["id"]] = lab["id"]
    print(f"  {len(label_ids)} étiquettes créées.")

    count = 0
    for blk in blocks:
        for t in blk["tasks"]:
            if t["status"] == "done":
                continue
            title = f"{t['id']} · {t['label']}"
            if t.get("priority") == "bloquant":
                title += " [bloquant]"
            desc_lines = [f"Bloc : {blk['id']} — {blk['title']}"]
            if t.get("priority"):
                desc_lines.append(f"Priorité : {t['priority']}")
            if t["id"] in DOC_REFS:
                desc_lines.append(f"Docs : {DOC_REFS[t['id']]}")
            call("POST", "/cards",
                 idList=list_ids[STATUS_TO_LIST[t["status"]]],
                 name=title, desc="\n".join(desc_lines),
                 idLabels=label_ids[blk["id"]], pos="bottom")
            count += 1
            print(f"  carte {count} : {title}")
    print(f"\nTerminé : {count} cartes sur {board['url']}")


if __name__ == "__main__":
    main()
