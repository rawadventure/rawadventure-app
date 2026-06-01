// Kanban local Raw Adventure — serveur Express (localhost only, port 3737).
// Source de vérité = roadmap.json. Sert l'UI, met à jour les statuts,
// et lance Claude Code dans Terminal sur la tâche cliquée.

const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROADMAP = path.join(__dirname, 'roadmap.json');
const PROJECT_PATH = path.resolve(__dirname, '..'); // racine du repo RawAdventureRN
const PORT = 3737;

const app = express();
app.use(express.json());

// --- Helpers roadmap ---------------------------------------------------------

function readRoadmap() {
  return JSON.parse(fs.readFileSync(ROADMAP, 'utf8'));
}

function writeRoadmap(data) {
  fs.writeFileSync(ROADMAP, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// Retrouve une tâche par son id + le bloc parent (pour récupérer le brief).
function findTask(roadmap, taskId) {
  for (const block of roadmap.blocks) {
    const task = block.tasks.find((t) => t.id === taskId);
    if (task) return { task, block };
  }
  return { task: null, block: null };
}

// --- Routes ------------------------------------------------------------------

// UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// État brut consommé par le front (auto-refresh)
app.get('/roadmap.json', (req, res) => {
  res.sendFile(ROADMAP);
});

// Déplacement de carte entre colonnes
app.post('/update-status', (req, res) => {
  const { taskId, status } = req.body;
  const allowed = ['todo', 'doing', 'done', 'blocked'];
  if (!taskId || !allowed.includes(status)) {
    return res.status(400).json({ error: 'taskId ou status invalide' });
  }
  const roadmap = readRoadmap();
  const { task } = findTask(roadmap, taskId);
  if (!task) return res.status(404).json({ error: 'tâche introuvable' });

  task.status = status;
  task.updatedAt = new Date().toISOString();
  writeRoadmap(roadmap);
  res.json({ ok: true, task });
});

// Lancement de Claude Code dans Terminal sur la tâche
app.post('/launch', (req, res) => {
  const { taskId } = req.body;
  const roadmap = readRoadmap();
  const { task, block } = findTask(roadmap, taskId);
  if (!task) return res.status(404).json({ error: 'tâche introuvable' });

  // Le brief le plus spécifique : celui de la tâche sinon celui du bloc.
  const briefPath = task.brief || block.brief;

  // Construit la commande shell selon l'état de session.
  let cmd;
  if (task.sessionId) {
    // Reprise d'une session existante.
    cmd = `cd '${PROJECT_PATH}' && claude --resume ${task.sessionId}`;
  } else {
    // Nouveau chat amorcé avec le contexte de la tâche.
    const prompt =
      `Reprise tâche ${task.id}: ${task.label}. ` +
      `Brief: ${briefPath}. ` +
      `Lis le brief puis propose-moi par où commencer.`;
    // Échappe les apostrophes pour la chaîne entre guillemets doubles côté shell.
    const safePrompt = prompt.replace(/"/g, '\\"');
    cmd = `cd '${PROJECT_PATH}' && claude "${safePrompt}"`;
  }

  // Pré-positionne le fichier .current-task pour le hook Stop.
  fs.writeFileSync(path.join(__dirname, '.current-task'), task.id, 'utf8');

  // Ouvre Terminal.app et exécute la commande.
  const osa = `tell application "Terminal" to do script "${cmd.replace(/"/g, '\\"')}"`;
  exec(`osascript -e '${osa}'`, (err) => {
    if (err) {
      console.error('Erreur osascript:', err.message);
      return res.status(500).json({ error: 'échec ouverture Terminal' });
    }
    res.json({ ok: true, launched: task.id, resumed: !!task.sessionId });
  });
});

// Affiche un brief .md du projet (lecture seule, confiné au repo).
app.get('/brief', (req, res) => {
  const rel = req.query.path || '';
  // Sécurité : on résout dans le projet et on refuse toute sortie du repo.
  const abs = path.resolve(PROJECT_PATH, rel);
  if (!abs.startsWith(PROJECT_PATH + path.sep) || !abs.endsWith('.md')) {
    return res.status(400).send('Chemin de brief invalide');
  }
  if (!fs.existsSync(abs)) return res.status(404).send('Brief introuvable : ' + rel);
  const md = fs.readFileSync(abs, 'utf8');
  // Rendu minimal : on échappe et on affiche en <pre> (pas de moteur Markdown embarqué).
  const safe = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">` +
    `<title>${rel}</title>` +
    `<style>body{background:#1b1f1b;color:#e8eae6;font:14px/1.5 -apple-system,sans-serif;margin:0;padding:24px}` +
    `pre{white-space:pre-wrap;word-wrap:break-word}h1{font-size:15px;color:#9aa39a}</style></head>` +
    `<body><h1>${rel}</h1><pre>${safe}</pre></body></html>`
  );
});

// Sauvegarde de session — appelé par le hook save-session.js
app.post('/save-session', (req, res) => {
  const { taskId, sessionId } = req.body;
  if (!taskId || !sessionId) {
    return res.status(400).json({ error: 'taskId et sessionId requis' });
  }
  const roadmap = readRoadmap();
  const { task } = findTask(roadmap, taskId);
  if (!task) return res.status(404).json({ error: 'tâche introuvable' });

  task.sessionId = sessionId;
  task.updatedAt = new Date().toISOString();
  if (task.status === 'todo') task.status = 'doing';
  writeRoadmap(roadmap);
  res.json({ ok: true, task });
});

// --- Démarrage (localhost uniquement) ----------------------------------------

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Kanban Raw Adventure sur http://localhost:${PORT}`);
  console.log(`Projet ciblé : ${PROJECT_PATH}`);
});
