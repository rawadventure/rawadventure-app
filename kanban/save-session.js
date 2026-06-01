// Hook Stop de Claude Code — sauvegarde automatique du session_id.
// Lit le JSON du hook sur stdin, lit kanban/.current-task (id de la tâche en cours),
// puis met à jour roadmap.json : sessionId + updatedAt, et status->doing si todo.
// Écrit directement le fichier (fonctionne même si le serveur n'est pas lancé).

const fs = require('fs');
const path = require('path');

const ROADMAP = path.join(__dirname, 'roadmap.json');
const CURRENT_TASK = path.join(__dirname, '.current-task');

// Lit l'intégralité de stdin.
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  try {
    main(raw);
  } catch (e) {
    // Un hook ne doit jamais bloquer la fin de session : on logue et on sort proprement.
    console.error('save-session: ' + e.message);
    process.exit(0);
  }
});

function main(raw) {
  // 1. Récupère le session_id depuis le payload du hook.
  let payload = {};
  try {
    payload = JSON.parse(raw || '{}');
  } catch {
    payload = {};
  }
  const sessionId = payload.session_id;
  if (!sessionId) {
    console.error('save-session: pas de session_id dans le payload, abandon.');
    process.exit(0);
  }

  // 2. Lit l'id de la tâche en cours (positionné en début de session).
  if (!fs.existsSync(CURRENT_TASK)) {
    console.error('save-session: pas de .current-task, rien à sauvegarder.');
    process.exit(0);
  }
  const taskId = fs.readFileSync(CURRENT_TASK, 'utf8').trim();
  if (!taskId) {
    console.error('save-session: .current-task vide, abandon.');
    process.exit(0);
  }

  // 3. Met à jour roadmap.json.
  const roadmap = JSON.parse(fs.readFileSync(ROADMAP, 'utf8'));
  let found = null;
  for (const block of roadmap.blocks) {
    const t = block.tasks.find((x) => x.id === taskId);
    if (t) {
      found = t;
      break;
    }
  }
  if (!found) {
    console.error(`save-session: tâche ${taskId} introuvable dans roadmap.json.`);
    process.exit(0);
  }

  found.sessionId = sessionId;
  found.updatedAt = new Date().toISOString();
  if (found.status === 'todo') found.status = 'doing';

  fs.writeFileSync(ROADMAP, JSON.stringify(roadmap, null, 2) + '\n', 'utf8');
  console.error(`save-session: ${taskId} <- session ${sessionId}`);
  process.exit(0);
}
