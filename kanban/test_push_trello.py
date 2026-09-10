"""Tests de la logique pure de push-trello.py (plan_sync, desired_state).

Lancer : python3 -m unittest kanban.test_push_trello -v
(ou depuis kanban/ : python3 -m unittest test_push_trello -v)
Aucun appel réseau — uniquement le calcul du plan de synchronisation.
"""

import importlib.util
import os
import unittest

spec = importlib.util.spec_from_file_location(
    "push_trello", os.path.join(os.path.dirname(__file__), "push-trello.py"))
push_trello = importlib.util.module_from_spec(spec)
spec.loader.exec_module(push_trello)

plan_sync = push_trello.plan_sync
desired_state = push_trello.desired_state
card_task_id = push_trello.card_task_id

BLOCKS = [
    {"id": "R1", "title": "App — parcours", "tasks": [
        {"id": "R1-1", "label": "Tâche faite avant le premier push",
         "status": "done", "priority": None},
        {"id": "R1-2", "label": "Tâche en cours", "status": "doing",
         "priority": "bloquant"},
        {"id": "R1-3", "label": "Nouvelle tâche", "status": "todo",
         "priority": "important"},
    ]},
    {"id": "R10", "title": "Hors-scope", "tasks": [
        {"id": "R10-1", "label": "Différé", "status": "blocked",
         "priority": "hors-scope"},
    ]},
]

LISTS = {"L_TODO": "À faire", "L_DOING": "En cours", "L_REVIEW": "En review",
         "L_DONE": "Fait", "L_HS": "Hors-scope V1"}


def card(cid, name, desc, id_list):
    return {"id": cid, "name": name, "desc": desc, "idList": id_list}


class DesiredStateTest(unittest.TestCase):
    def test_titre_avec_bloquant_et_description(self):
        d = desired_state(BLOCKS)
        self.assertEqual(d["R1-2"]["title"], "R1-2 · Tâche en cours [bloquant]")
        self.assertEqual(d["R1-2"]["desc"],
                         "Bloc : R1 — App — parcours\nPriorité : bloquant")
        self.assertEqual(d["R1-2"]["list"], "En cours")

    def test_statuts_vers_listes(self):
        d = desired_state(BLOCKS)
        self.assertEqual(d["R1-1"]["list"], "Fait")
        self.assertEqual(d["R1-3"]["list"], "À faire")
        self.assertEqual(d["R10-1"]["list"], "Hors-scope V1")

    def test_renvoi_docs(self):
        blocks = [{"id": "R9", "title": "Tests", "tasks": [
            {"id": "R9-15", "label": "Salve", "status": "todo",
             "priority": "bloquant"}]}]
        d = desired_state(blocks)
        self.assertIn("Docs :", d["R9-15"]["desc"])
        self.assertIn("salve-phase1-s1-s8.md", d["R9-15"]["desc"])


class CardTaskIdTest(unittest.TestCase):
    def test_extraction(self):
        self.assertEqual(card_task_id("R4-13 · Validation S2 [bloquant]"), "R4-13")

    def test_carte_manuelle(self):
        self.assertIsNone(card_task_id("Idée de Mimi : revoir les couleurs"))


class PlanSyncTest(unittest.TestCase):
    def test_tableau_a_jour_aucune_operation(self):
        d = desired_state(BLOCKS)
        cards = [
            card("c2", d["R1-2"]["title"], d["R1-2"]["desc"], "L_DOING"),
            card("c3", d["R1-3"]["title"], d["R1-3"]["desc"], "L_TODO"),
            card("c4", d["R10-1"]["title"], d["R10-1"]["desc"], "L_HS"),
        ]
        self.assertEqual(plan_sync(BLOCKS, cards, LISTS), [])

    def test_nouvelle_tache_creee(self):
        d = desired_state(BLOCKS)
        cards = [
            card("c2", d["R1-2"]["title"], d["R1-2"]["desc"], "L_DOING"),
            card("c4", d["R10-1"]["title"], d["R10-1"]["desc"], "L_HS"),
        ]
        ops = plan_sync(BLOCKS, cards, LISTS)
        self.assertEqual(ops, [("create", "R1-3")])

    def test_done_sans_carte_jamais_creee(self):
        # R1-1 est done et absente du tableau : elle ne doit PAS être créée.
        ops = plan_sync(BLOCKS, [], LISTS)
        created = [tid for op, tid in ops if op == "create"]
        self.assertNotIn("R1-1", created)
        self.assertEqual(sorted(created), ["R1-2", "R1-3", "R10-1"])

    def test_changement_statut_deplace_la_carte(self):
        d = desired_state(BLOCKS)
        # R1-2 (doing) est encore dans « À faire » sur le tableau.
        cards = [
            card("c2", d["R1-2"]["title"], d["R1-2"]["desc"], "L_TODO"),
            card("c3", d["R1-3"]["title"], d["R1-3"]["desc"], "L_TODO"),
            card("c4", d["R10-1"]["title"], d["R10-1"]["desc"], "L_HS"),
        ]
        ops = plan_sync(BLOCKS, cards, LISTS)
        self.assertEqual(ops, [("move", "c2", "En cours", d["R1-2"]["title"])])

    def test_tache_passee_done_va_dans_fait(self):
        d = desired_state(BLOCKS)
        # R1-1 (done) a une carte qui traîne dans « En cours ».
        cards = [
            card("c1", d["R1-1"]["title"], d["R1-1"]["desc"], "L_DOING"),
            card("c2", d["R1-2"]["title"], d["R1-2"]["desc"], "L_DOING"),
            card("c3", d["R1-3"]["title"], d["R1-3"]["desc"], "L_TODO"),
            card("c4", d["R10-1"]["title"], d["R10-1"]["desc"], "L_HS"),
        ]
        ops = plan_sync(BLOCKS, cards, LISTS)
        self.assertEqual(ops, [("move", "c1", "Fait", d["R1-1"]["title"])])

    def test_label_modifie_met_a_jour_titre(self):
        d = desired_state(BLOCKS)
        cards = [
            card("c2", "R1-2 · Ancien libellé", d["R1-2"]["desc"], "L_DOING"),
            card("c3", d["R1-3"]["title"], d["R1-3"]["desc"], "L_TODO"),
            card("c4", d["R10-1"]["title"], d["R10-1"]["desc"], "L_HS"),
        ]
        ops = plan_sync(BLOCKS, cards, LISTS)
        self.assertEqual(ops, [("update", "c2", d["R1-2"]["title"],
                                d["R1-2"]["desc"])])

    def test_carte_manuelle_ignoree(self):
        d = desired_state(BLOCKS)
        cards = [
            card("cm", "Idée de Mimi", "", "L_TODO"),
            card("c2", d["R1-2"]["title"], d["R1-2"]["desc"], "L_DOING"),
            card("c3", d["R1-3"]["title"], d["R1-3"]["desc"], "L_TODO"),
            card("c4", d["R10-1"]["title"], d["R10-1"]["desc"], "L_HS"),
        ]
        ops = plan_sync(BLOCKS, cards, LISTS)
        self.assertEqual(ops, [("skip_manual", "Idée de Mimi")])


if __name__ == "__main__":
    unittest.main()
