/**
 * phase0-notifications.ts — drafts copy notifications Phase 0 J1-J14.
 *
 * Réf D12 (reporté V1 — calibrage produit fréquence + copy précis), CLAUDE.md
 * §2 (1-2 notifications/jour Phase 0), §4 (brand voice Mimi & Jacky : tutoiement,
 * dense, pas de marketing creux, pas d'exclamations, pas d'emojis), D32 (plage
 * silence 22h-8h locales gérée par scheduler).
 *
 * Périmètre V1 simplifié : 1 notification/jour à 9h00 locales J1-J14. La
 * notification J1 sert d'accueil, J3/J7/J11/J14 servent de teaser pour les
 * jours-charnière, les autres servent de rappel doux et observation.
 *
 * Status drafts : [copy à valider Mimi]. Pas de validation Mimi à ce stade.
 * Les libellés sont alignés brand voice mais à reformuler par Mimi avant launch.
 */

export type Phase0NotificationDraft = {
  /** Jour cible (1-14) */
  day: number;
  /** Heure cible (24h format local) — défaut 9h */
  hour: number;
  /** Slot copy (multilingue futur) */
  slot: string;
  /** Titre court */
  title: string;
  /** Corps du message */
  body: string;
  /** Type de notification — pour analytics futur */
  family: 'accueil' | 'rappel' | 'observation' | 'charniere' | 'encouragement';
};

/**
 * 14 notifications Phase 0 — drafts Claude alignés brand voice (à valider Mimi).
 *
 * Heure : 9h00 locales par défaut (avant routine matin). Volontairement pas
 * d'horaires "miracle" type 6h. Cohérent avec D32 plage silence 22h-8h
 * (8h ≤ 9h donc dans la fenêtre autorisée).
 */
export const PHASE_0_NOTIFICATIONS: readonly Phase0NotificationDraft[] = [
  {
    day: 1,
    hour: 9,
    slot: 'copy.notif.phase0.j1',
    family: 'accueil',
    title: 'Premier jour',
    body: 'On commence aujourd\'hui. 7 actions simples à essayer. Tu en coches au moins 5 et la journée est validée. Ouvre l\'app quand tu veux.',
  },
  {
    day: 2,
    hour: 9,
    slot: 'copy.notif.phase0.j2',
    family: 'rappel',
    title: 'Jour 2',
    body: 'Hier tu as posé un premier signal. Aujourd\'hui on continue, sans en rajouter. Même rythme, même actions.',
  },
  {
    day: 3,
    hour: 9,
    slot: 'copy.notif.phase0.j3',
    family: 'charniere',
    title: 'Jour 3 — Premier palier',
    body: 'Trois jours, c\'est le moment où le corps commence à recevoir le signal. On fait le point ensemble dans l\'app.',
  },
  {
    day: 4,
    hour: 9,
    slot: 'copy.notif.phase0.j4',
    family: 'observation',
    title: 'Jour 4',
    body: 'Observe ce qui bouge. Ventre, sommeil, énergie. Pas besoin d\'analyser — juste remarquer.',
  },
  {
    day: 5,
    hour: 9,
    slot: 'copy.notif.phase0.j5',
    family: 'rappel',
    title: 'Jour 5',
    body: 'Une semaine bientôt. Le rythme s\'installe. Continue sans forcer.',
  },
  {
    day: 6,
    hour: 9,
    slot: 'copy.notif.phase0.j6',
    family: 'encouragement',
    title: 'Jour 6',
    body: 'Tu n\'as pas tout coché tous les jours. Ce n\'est pas le but. Le but, c\'est la régularité du geste, pas la perfection.',
  },
  {
    day: 7,
    hour: 9,
    slot: 'copy.notif.phase0.j7',
    family: 'charniere',
    title: 'Jour 7 — Une semaine',
    body: 'Une semaine de signal. Ton corps a déjà commencé à réagir. On fait un point ensemble dans l\'app.',
  },
  {
    day: 8,
    hour: 9,
    slot: 'copy.notif.phase0.j8',
    family: 'rappel',
    title: 'Jour 8',
    body: 'Deuxième semaine. Pareil qu\'avant. Pas de saut, pas d\'intensité supplémentaire — la régularité.',
  },
  {
    day: 9,
    hour: 9,
    slot: 'copy.notif.phase0.j9',
    family: 'observation',
    title: 'Jour 9',
    body: 'À ce stade, beaucoup remarquent que la matinée démarre plus claire. Si tu le ressens, c\'est une vraie information du corps.',
  },
  {
    day: 10,
    hour: 9,
    slot: 'copy.notif.phase0.j10',
    family: 'rappel',
    title: 'Jour 10',
    body: 'Dix jours. Tu es plus près de la fin que du début. Continue.',
  },
  {
    day: 11,
    hour: 9,
    slot: 'copy.notif.phase0.j11',
    family: 'charniere',
    title: 'Jour 11',
    body: 'On approche du dernier palier. Aujourd\'hui dans l\'app, on regarde ensemble ce qui change.',
  },
  {
    day: 12,
    hour: 9,
    slot: 'copy.notif.phase0.j12',
    family: 'rappel',
    title: 'Jour 12',
    body: 'Plus que trois jours. Garde la même cadence. Pas d\'effort supplémentaire — la régularité fait le travail.',
  },
  {
    day: 13,
    hour: 9,
    slot: 'copy.notif.phase0.j13',
    family: 'encouragement',
    title: 'Jour 13',
    body: 'Avant-dernier jour. Ce que tu as fait est une vraie matière. Ton corps a appris quelque chose.',
  },
  {
    day: 14,
    hour: 9,
    slot: 'copy.notif.phase0.j14',
    family: 'charniere',
    title: 'Jour 14 — Bilan',
    body: 'Quatorze jours. Aujourd\'hui dans l\'app, tu vois ce que tu as construit. C\'est une vraie première étape.',
  },
] as const;
