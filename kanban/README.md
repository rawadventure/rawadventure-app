# Kanban — Suivi production contenu Raw Adventure

Tableau kanban local (localhost) pour suivre l'avancement des 8 blocs A-H de
production copy/contenu. Source de vérité : `roadmap.json`.

## Lancer le matin

```bash
cd kanban
npm install        # une seule fois
node server.js     # démarre sur http://localhost:3737
```

Puis ouvrir **http://localhost:3737** dans le navigateur.

## Travailler sur une tâche

1. Avant chaque session Claude Code sur une tâche, écrire son ID dans `.current-task` :
   ```bash
   echo "B-J3" > kanban/.current-task
   ```
   (Le bouton **Lancer chat** / **Reprendre** de chaque carte fait ce `echo`
   automatiquement et ouvre Terminal avec Claude Code.)

2. Travailler normalement dans Claude Code.

3. **Fin de session** : le hook `Stop` exécute `save-session.js`, qui lit
   `.current-task` et le `session_id`, puis met à jour `roadmap.json`
   (sessionId + updatedAt, et statut `todo` → `doing`).

4. Glisser-déposer la carte vers **Fait** quand la tâche est terminée.

## Les boutons d'une carte

- **Lancer chat** : nouveau chat Claude Code amorcé avec le brief de la tâche.
- **Reprendre** (si une session existe) : `claude --resume <sessionId>`.
- **Voir brief** : ouvre le fichier `.md` du brief en lecture seule.

## Drag & drop

Glisser une carte d'une colonne à l'autre (À faire / En cours / Fait / Bloqué)
met à jour le statut via `POST /update-status`. Le tableau se rafraîchit
automatiquement toutes les 5 secondes.

## Le hook Stop

Configuré dans `.claude/settings.json`. Si le hook ne se déclenche pas,
vérifier que la commande pointe bien vers ce dossier :

```json
"command": "node $CLAUDE_PROJECT_DIR/kanban/save-session.js"
```

## Sécurité

Le serveur écoute uniquement sur `127.0.0.1` (pas d'exposition réseau).
Seule dépendance : `express`. Aucun framework front (vanilla JS).

## Historique

- **2026-06-01** — Création du système kanban (51 tâches sur les 8 blocs A-H
  de production copy/contenu). Source de vérité : `roadmap.json`.
