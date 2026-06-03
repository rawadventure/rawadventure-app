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
  const allowed = ['todo', 'doing', 'review', 'done', 'blocked'];
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

// --- Sync : déduit les statuts depuis les marqueurs **Statut** des briefs ----

// Mappe une ligne de marqueur "**Statut** : ..." vers un statut kanban.
// L'ordre des tests compte : "à valider" (review) doit primer sur "validé" (done).
function statusFromMarker(line) {
  const l = line.toLowerCase();
  // À vérifier : draft Claude, ou contenu explicitement à faire valider/réécrire.
  if (/draft|à valider|a valider|à réécrire|à compléter|à finaliser|à affiner|proposition|placeholder/.test(l)) {
    return 'review';
  }
  // Fait : contenu validé par Mimi & Jacky.
  // NB : "à valider" (review) est déjà traité au-dessus, donc ici "valid[ée]" = validé/validées.
  if (/valid[ée]/.test(l)) return 'done';
  // À faire : contenu pas encore produit.
  if (/à remplir|a remplir|à produire|a produire|à créer|a creer/.test(l)) return 'todo';
  return null; // marqueur non concluant
}

// Construit des regex d'ancrage à partir des tokens distinctifs de l'id de tâche
// (ceux qui contiennent un chiffre : J1, 15j, S0.1, IA22, D26...).
function anchorRegexes(taskId) {
  const parts = taskId.split('-').slice(1); // retire la lettre de bloc
  const regs = [];
  for (const p of parts) {
    if (!/\d/.test(p)) continue;
    let pat = p
      .replace(/\./g, '\\.')        // S0.1 -> S0\.1
      .replace(/^IA/, 'IA-?')        // IA22 -> IA-?22 (matche IA-22 et IA22)
      .replace(/j$/i, '\\s*j(our)?'); // 15j -> 15\s*j(our)?
    try {
      regs.push(new RegExp('\\b' + pat, 'i'));
    } catch {
      /* token non regexable, ignoré */
    }
  }
  return regs;
}

// Pour une tâche, retrouve la ligne **Statut** la plus pertinente dans son brief.
// Priorité : (1) ancre explicite task.anchor (titre de section exact, déterministe),
// (2) ancrage heuristique par token distinctif de l'id, (3) premier **Statut** global.
function findMarkerForTask(text, task) {
  const lines = text.split('\n');
  const statutIdx = [];
  lines.forEach((l, i) => {
    if (/\*\*statut/i.test(l)) statutIdx.push(i);
  });
  if (!statutIdx.length) return null;

  // Cherche le premier **Statut** dans les 30 lignes suivant un titre donné.
  const nearStatut = (headingLine) => {
    const near = statutIdx.find((si) => si >= headingLine && si < headingLine + 30);
    return near != null ? lines[near] : null;
  };

  // 1. Ancre explicite : titre de section contenant exactement task.anchor.
  if (task.anchor) {
    const a = task.anchor.toLowerCase();
    for (let i = 0; i < lines.length; i++) {
      if (/^#{1,6}\s/.test(lines[i]) && lines[i].toLowerCase().includes(a)) {
        const m = nearStatut(i);
        if (m) return m;
        return null; // section trouvée mais sans **Statut** propre : pas de détection
      }
    }
  }

  // 2. Ancrage heuristique par token distinctif (J3, 15j, IA-22…).
  const regs = anchorRegexes(task.id);
  if (regs.length) {
    for (let i = 0; i < lines.length; i++) {
      if (/^#{1,6}\s/.test(lines[i]) && regs.some((r) => r.test(lines[i]))) {
        const m = nearStatut(i);
        if (m) return m;
      }
    }
  }

  // 3. Repli : premier **Statut** global du brief (statut au niveau du bloc).
  return lines[statutIdx[0]];
}

// Évalue l'état réel du repo pour une tâche de dev (champ task.check).
// La tâche est "réalisée" (done) si TOUTES les conditions sont vraies :
//   check.exists   : [chemins] qui doivent exister (fichiers ou dossiers)
//   check.absent   : [chemins] qui doivent NE PAS exister (suppressions/nettoyage)
//   check.contains : [[chemin, sous-chaîne], ...] le fichier doit contenir la chaîne
// Tout chemin est résolu dans le repo et confiné à celui-ci (sécurité).
function isDevTaskDone(check) {
  if (!check) return false;
  const inRepo = (rel) => {
    const abs = path.resolve(PROJECT_PATH, rel);
    return abs.startsWith(PROJECT_PATH + path.sep) ? abs : null;
  };
  for (const rel of check.exists || []) {
    const abs = inRepo(rel);
    if (!abs || !fs.existsSync(abs)) return false;
  }
  for (const rel of check.absent || []) {
    const abs = inRepo(rel);
    if (!abs || fs.existsSync(abs)) return false;
  }
  for (const [rel, needle] of check.contains || []) {
    const abs = inRepo(rel);
    if (!abs || !fs.existsSync(abs)) return false;
    if (!fs.readFileSync(abs, 'utf8').includes(needle)) return false;
  }
  return true;
}

// --- Bloc « Lancement » : généré depuis l'audit release (source de vérité) ----
//
// L'audit docs/release/phase0-release-readiness-audit.md est la photo fraîche et
// priorisée de ce qu'il reste à faire pour sortir l'app. On le transforme en blocs
// kanban à chaque sync : chaque ligne de tableau = une carte. Le statut vient de
// l'emoji de l'audit, la priorité d'une grille de mots-clés (récap §10), et le
// libellé est reformulé en langage clair pour Stéphane (non-dev).

const AUDIT_REL = 'docs/release/phase0-release-readiness-audit.md';

// Sections de l'audit (## N. …) → blocs kanban, titres en clair.
const AUDIT_SECTIONS = {
  '1': { id: 'R1', title: 'App — parcours utilisateur' },
  '2': { id: 'R2', title: 'App — compte & abonnement' },
  '3': { id: 'R3', title: 'App — notifications' },
  '4': { id: 'R4', title: 'Contenu — validations Mimi & Jacky' },
  '5': { id: 'R5', title: 'Contenu — vidéos à tourner' },
  '6': { id: 'R6', title: 'Mise en vente — comptes & build' },
  '7': { id: 'R7', title: 'Légal' },
  '8': { id: 'R8', title: 'Supabase — réglages tableau de bord' },
  '9': { id: 'R9', title: 'Tests & qualité' }
};

// Emoji de statut de l'audit → colonne kanban.
function auditStatus(cell) {
  if (cell.includes('✅')) return 'done';
  if (cell.includes('🔶')) return 'doing';
  if (cell.includes('🟡')) return 'review';
  if (cell.includes('⏸')) return 'blocked';
  if (cell.includes('❌')) return 'todo';
  return 'todo';
}

// Glossaire : élément technique de l'audit → libellé clair.
// Clé = texte d'élément nettoyé (sans ** ni `), en minuscules.
const AUDIT_GLOSS = {
  'subscriptioncontext': 'Mémoire de l’abonnement dans l’app (SubscriptionContext)',
  'webhook stripe edge function': 'Brancher Stripe à l’app : confirmer les paiements (webhook)',
  'deep link subscription-success': 'Retour dans l’app après paiement réussi (deep link)',
  'table supabase subscriptions': 'Base de données : table des abonnements',
  'écran gestion abonnement profil': 'Écran « gérer mon abonnement » (Profil, IA-71)',
  'paywall fin phase 0 (j14)': 'Écran d’abonnement en fin de Phase 0 (J14)',
  'rls policies': 'Règles de sécurité d’accès aux données (RLS)',
  'eas build config': 'Configurer la fabrication des apps (EAS Build)',
  'env vars supabase prod vs dev': 'Séparer les clés Supabase test / production',
  'storage buckets pour vidéos': 'Espace de stockage des vidéos (Supabase)',
  'redirect urls whitelist': 'Autoriser les liens de retour dans l’app (Supabase)',
  'crash reporting (sentry / autre)': 'Détection des plantages (Sentry)',
  'analytics (mixpanel / posthog)': 'Statistiques d’usage (analytics)',
  'deep link scheme rawadventure://': 'Liens qui rouvrent l’app (deep links)',
  'bundle id ios/android': 'Identifiant technique de l’app (Bundle ID)',
  'passwordinput composant réutilisable': 'Champ mot de passe réutilisable',
  'authcontext complet': 'Système de connexion complet',
  'pendant migration : useeffect différé': 'Sauvegarde différée pendant la création de compte',
  'migration asyncstorage → supabase': 'Transfert des données locales vers le compte en ligne',
  'hub central phase 0 (ia-11)': 'Écran d’accueil quotidien (Phase 0)',
  'request permission ux': 'Demander l’autorisation des notifications au bon moment (J1)',
  'cadre technique (sprint 25)': 'Socle technique des notifications',
  'compte apple developer organization': 'Compte Apple Developer (DUNS à demander)',
  'compte google play console': 'Compte Google Play',
  'description app stores (reader app)': 'Description de l’app pour les stores'
};

// Grille de priorité (récap §10 de l'audit). Mot-clé recherché dans l'élément
// d'origine nettoyé (minuscules) ; première règle qui matche gagne. Ordre =
// bloquants d'abord, puis cas polish spécifiques, puis importants.
const PRIORITY_RULES = [
  ['apple developer', 'bloquant'], ['google play', 'bloquant'],
  ['app icon', 'bloquant'], ['splash', 'bloquant'], ['eas build', 'bloquant'],
  ['paywall', 'bloquant'], ['table supabase subscriptions', 'bloquant'],
  ['subscriptioncontext', 'bloquant'], ['webhook stripe', 'bloquant'],
  ['subscription-success', 'bloquant'], ['gestion abonnement', 'bloquant'],
  ['compte stripe', 'bloquant'], ['avocat', 'bloquant'],
  ['pages wix', 'bloquant'], ['description app store', 'bloquant'],
  ['28 notif', 'bloquant'], ['copy paywall', 'bloquant'],
  // polish spécifiques (placés avant les importants pour éviter les faux positifs)
  ['stripe tax', 'polish'], ['médiat', 'polish'],
  ['ia-20', 'polish'], ['ia-21', 'polish'], ['paliers streak', 'polish'],
  ['storage buckets', 'polish'], ['notifications android', 'polish'],
  ['android device', 'polish'],
  // importants
  ['ia-12', 'important'], ['github', 'important'], ['sentry', 'important'],
  ['analytics', 'important'], ['request permission', 'important'],
  ['rls', 'important'], ['support@', 'important']
];

function auditPriority(elemRaw) {
  const l = elemRaw.toLowerCase();
  for (const [kw, prio] of PRIORITY_RULES) if (l.includes(kw)) return prio;
  return null;
}

// Construit les blocs R1..R10 depuis l'audit. `prev` = map id → {status,updatedAt,sessionId}
// de la génération précédente, pour préserver updatedAt (si statut inchangé) et sessionId.
function buildReleaseBlocks(prev) {
  const abs = path.resolve(PROJECT_PATH, AUDIT_REL);
  if (!fs.existsSync(abs)) return [];
  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  const now = new Date().toISOString();
  const blocks = {};
  let curSec = null;

  for (const line of lines) {
    const h = line.match(/^##\s+(\d+)\.\s+/);
    if (h) { curSec = h[1]; continue; }
    if (line.startsWith('#')) { curSec = null; continue; }       // autre titre → hors section
    if (!curSec || !AUDIT_SECTIONS[curSec]) continue;
    if (!line.trim().startsWith('|')) continue;                   // pas une ligne de tableau

    const cells = line.split('|').map((c) => c.trim());           // ['', Élément, Statut, Notes, '']
    const elem = cells[1] || '';
    const stat = cells[2] || '';
    if (!elem || /^-+$/.test(elem) || /^élément$/i.test(elem)) continue; // en-tête / séparateur

    const sec = AUDIT_SECTIONS[curSec];
    if (!blocks[sec.id]) blocks[sec.id] = { id: sec.id, title: sec.title, brief: AUDIT_REL, tasks: [] };

    const clean = elem.replace(/\*\*/g, '').replace(/`/g, '').trim();
    const task = {
      id: `${sec.id}-${blocks[sec.id].tasks.length + 1}`,
      label: AUDIT_GLOSS[clean.toLowerCase()] || clean,
      status: auditStatus(stat),
      sessionId: null,
      updatedAt: now
    };
    const prio = auditPriority(clean);
    if (prio) task.priority = prio;

    const p = prev[task.id];
    if (p) {
      if (p.status === task.status) task.updatedAt = p.updatedAt; // pas de churn si inchangé
      if (p.sessionId) task.sessionId = p.sessionId;              // garde la session ouverte
    }
    blocks[sec.id].tasks.push(task);
  }

  // Bloc hors-scope V1 (⏸️ §10 — items hors des tableaux, listés à part).
  const horsScope = {
    id: 'R10',
    title: 'Hors-scope V1 (différé, acté)',
    brief: AUDIT_REL,
    tasks: [
      'Synchronisation multi-appareil (D28)',
      'Mentorat séparé (IA-61)',
      'Phase 2 et au-delà (contenu)',
      'Analytics avancés',
      'Multi-langue (architecture prête, contenu FR seulement)'
    ].map((label, i) => {
      const id = `R10-${i + 1}`;
      const p = prev[id];
      return {
        id, label, status: 'blocked', priority: 'hors-scope',
        sessionId: p && p.sessionId ? p.sessionId : null,
        updatedAt: p ? p.updatedAt : now
      };
    })
  };

  const ordered = Object.values(AUDIT_SECTIONS).map((s) => blocks[s.id]).filter(Boolean);
  ordered.push(horsScope);
  return ordered;
}

// POST /sync — met à jour les statuts depuis deux sources :
//   (1) tâches de contenu (blocs A-H) : marqueurs **Statut** des briefs .md ;
//   (2) blocs « Lancement » (R1-R10)  : régénérés depuis l'audit release, qui fait foi.
// Les anciens blocs dev (Z-*) sont retirés (roadmap périmée du 13 mai).
// Préservation côté contenu : un 'blocked' manuel reste 'blocked' sauf détection 'done'.
app.post('/sync', (req, res) => {
  const roadmap = readRoadmap();
  const changes = [];
  const now = new Date().toISOString();

  // Mémorise l'état des blocs générés (R-*) avant de les retirer, pour préserver
  // updatedAt/sessionId et détecter les changements de statut depuis l'audit.
  const prevRelease = {};
  for (const b of roadmap.blocks) {
    if (/^R\d/.test(b.id)) {
      for (const t of b.tasks) prevRelease[t.id] = { status: t.status, updatedAt: t.updatedAt, sessionId: t.sessionId };
    }
  }
  // Retire les blocs générés (R-*) et la roadmap dev périmée (Z-*).
  roadmap.blocks = roadmap.blocks.filter((b) => !/^R\d/.test(b.id) && !/^Z-/.test(b.id));

  // (1) Sync contenu sur les blocs restants (A-H).
  for (const block of roadmap.blocks) {
    for (const task of block.tasks) {
      const briefRel = task.brief || block.brief;
      const abs = path.resolve(PROJECT_PATH, briefRel || '');
      if (!briefRel || !abs.startsWith(PROJECT_PATH + path.sep) || !fs.existsSync(abs)) {
        continue; // brief introuvable, on n'y touche pas
      }
      const text = fs.readFileSync(abs, 'utf8');
      const marker = findMarkerForTask(text, task);
      if (!marker) continue;

      const detected = statusFromMarker(marker);
      if (!detected) continue;

      // Respecte un blocage manuel sauf si le brief dit explicitement "validé".
      if (task.status === 'blocked' && detected !== 'done') continue;

      if (detected !== task.status) {
        changes.push({
          id: task.id,
          from: task.status,
          to: detected,
          marker: marker.trim().slice(0, 160)
        });
        task.status = detected;
        task.updatedAt = now;
      }
    }
  }

  // (2) Régénère les blocs « Lancement » depuis l'audit (source de vérité).
  const releaseBlocks = buildReleaseBlocks(prevRelease);
  for (const b of releaseBlocks) {
    for (const t of b.tasks) {
      const p = prevRelease[t.id];
      if (!p) changes.push({ id: t.id, from: '—', to: t.status, marker: 'nouveau (audit)' });
      else if (p.status !== t.status) changes.push({ id: t.id, from: p.status, to: t.status, marker: 'audit' });
    }
    roadmap.blocks.push(b);
  }

  // On réécrit toujours : les blocs Z-* retirés et R-* régénérés doivent être persistés.
  writeRoadmap(roadmap);
  res.json({ ok: true, changed: changes.length, changes });
});

// --- Démarrage (localhost uniquement) ----------------------------------------

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Kanban Raw Adventure sur http://localhost:${PORT}`);
  console.log(`Projet ciblé : ${PROJECT_PATH}`);
});
