/**
 * phase0-notifications.ts — drafts copy notifications Phase 0 J1-J14.
 *
 * Réf D12 (reporté V1 — calibrage produit fréquence + copy précis), CLAUDE.md
 * §2 (1-2 notifications/jour Phase 0), §4 (brand voice Mimi & Jacky : tutoiement,
 * dense, pas de marketing creux, pas d'exclamations, pas d'emojis), D32 (plage
 * silence 22h-8h locales gérée par scheduler), D26 (soft-rappel non-culpabilisant).
 *
 * Périmètre V1 — 2 notifications/jour :
 *  - Morning 7h00 : rappel principal pour démarrer la journée — calibré pour
 *    attraper les français qui se lèvent 6h-7h avant départ travail.
 *  - Soir 20h00 : rappel doux SI aucune action validée à cette heure-là.
 *    Annulé dynamiquement par `validateDay()` quand l'utilisateur valide au
 *    moins une action (la première coche). D26 — ton bienveillant, jamais
 *    culpabilisant.
 *
 * Status drafts : [copy à valider Mimi]. Les libellés sont alignés brand voice
 * mais à reformuler par Mimi avant launch.
 */

export type Phase0NotificationDraft = {
  /** Jour cible (1-14) */
  day: number;
  /** Heure cible (24h format local) */
  hour: number;
  /** Type de notification — détermine annulation conditionnelle */
  kind: 'morning' | 'reminder';
  /** Slot copy (multilingue futur) */
  slot: string;
  /** Titre court */
  title: string;
  /** Corps du message */
  body: string;
  /** Famille narrative — pour analytics futur */
  family: 'accueil' | 'rappel' | 'observation' | 'charniere' | 'encouragement' | 'rappel_soir';
};

/**
 * 14 notifications matin Phase 0 — 7h00 locales chaque jour.
 *
 * D32 : 7h00 est la borne haute de la plage silence (22h-7h exclu) — donc OK
 * (cf. `isInSilenceWindow`).
 */
export const PHASE_0_MORNING_NOTIFICATIONS: readonly Phase0NotificationDraft[] = [
  {
    day: 1,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j1.morning',
    family: 'accueil',
    title: 'Premier jour',
    body: 'On commence aujourd\'hui. 7 actions simples à essayer. Tu en coches au moins 5 et la journée est validée. Ouvre l\'app quand tu veux.',
  },
  {
    day: 2,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j2.morning',
    family: 'rappel',
    title: 'Jour 2',
    body: 'Hier tu as posé un premier signal. Aujourd\'hui on continue, sans en rajouter. Même rythme, même actions.',
  },
  {
    day: 3,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j3.morning',
    family: 'charniere',
    title: 'Jour 3 — Premier palier',
    body: 'Trois jours, c\'est le moment où le corps commence à recevoir le signal. On fait le point ensemble dans l\'app.',
  },
  {
    day: 4,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j4.morning',
    family: 'observation',
    title: 'Jour 4',
    body: 'Observe ce qui bouge. Ventre, sommeil, énergie. Pas besoin d\'analyser — juste remarquer.',
  },
  {
    day: 5,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j5.morning',
    family: 'rappel',
    title: 'Jour 5',
    body: 'Une semaine bientôt. Le rythme s\'installe. Continue sans forcer.',
  },
  {
    day: 6,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j6.morning',
    family: 'encouragement',
    title: 'Jour 6',
    body: 'Tu n\'as pas tout coché tous les jours. Ce n\'est pas le but. Le but, c\'est la régularité du geste, pas la perfection.',
  },
  {
    day: 7,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j7.morning',
    family: 'charniere',
    title: 'Jour 7 — Une semaine',
    body: 'Une semaine de signal. Ton corps a déjà commencé à réagir. On fait un point ensemble dans l\'app.',
  },
  {
    day: 8,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j8.morning',
    family: 'rappel',
    title: 'Jour 8',
    body: 'Deuxième semaine. Pareil qu\'avant. Pas de saut, pas d\'intensité supplémentaire — la régularité.',
  },
  {
    day: 9,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j9.morning',
    family: 'observation',
    title: 'Jour 9',
    body: 'À ce stade, beaucoup remarquent que la matinée démarre plus claire. Si tu le ressens, c\'est une vraie information du corps.',
  },
  {
    day: 10,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j10.morning',
    family: 'rappel',
    title: 'Jour 10',
    body: 'Dix jours. Tu es plus près de la fin que du début. Continue.',
  },
  {
    day: 11,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j11.morning',
    family: 'charniere',
    title: 'Jour 11',
    body: 'On approche du dernier palier. Aujourd\'hui dans l\'app, on regarde ensemble ce qui change.',
  },
  {
    day: 12,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j12.morning',
    family: 'rappel',
    title: 'Jour 12',
    body: 'Plus que trois jours. Garde la même cadence. Pas d\'effort supplémentaire — la régularité fait le travail.',
  },
  {
    day: 13,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j13.morning',
    family: 'encouragement',
    title: 'Jour 13',
    body: 'Avant-dernier jour. Ce que tu as fait est une vraie matière. Ton corps a appris quelque chose.',
  },
  {
    day: 14,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j14.morning',
    family: 'charniere',
    title: 'Jour 14 — Bilan',
    body: 'Quatorze jours. Aujourd\'hui dans l\'app, tu vois ce que tu as construit. C\'est une vraie première étape.',
  },
] as const;

/**
 * 14 rappels soir Phase 0 — 20h00 locales, annulés dynamiquement si une action
 * a été validée dans la journée (premier coche → `cancelReminderForDay`).
 *
 * Ton D26 : bienveillant, non-culpabilisant. Une action seule suffit à annuler.
 */
export const PHASE_0_REMINDER_NOTIFICATIONS: readonly Phase0NotificationDraft[] = [
  {
    day: 1,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j1.reminder',
    family: 'rappel_soir',
    title: 'Encore un peu de temps',
    body: 'Premier jour. Une seule action suffit pour démarrer. Tu peux ouvrir l\'app quand tu veux ce soir.',
  },
  {
    day: 2,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j2.reminder',
    family: 'rappel_soir',
    title: 'Soirée tranquille',
    body: 'Pas de pression. Si tu coches une action ce soir, ta journée compte. Sinon, on se retrouve demain.',
  },
  {
    day: 3,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j3.reminder',
    family: 'rappel_soir',
    title: 'Jour 3 — encore possible',
    body: 'Trois jours, c\'est le moment où le rythme s\'ancre. Une action ce soir et la journée tient.',
  },
  {
    day: 4,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j4.reminder',
    family: 'rappel_soir',
    title: 'Petit signal',
    body: 'Même tard, une action a de la valeur. Le corps prend ce que tu lui donnes.',
  },
  {
    day: 5,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j5.reminder',
    family: 'rappel_soir',
    title: 'Avant de dormir',
    body: 'Cinq jours. Si tu veux marquer la journée, une seule action suffit.',
  },
  {
    day: 6,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j6.reminder',
    family: 'rappel_soir',
    title: 'Sans pression',
    body: 'Tu peux passer une journée plus calme. Reprendre demain est aussi une option valable.',
  },
  {
    day: 7,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j7.reminder',
    family: 'rappel_soir',
    title: 'Premier palier ce soir',
    body: 'Jour 7. Même une action coche la journée. Le palier est à portée si tu valides ce soir.',
  },
  {
    day: 8,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j8.reminder',
    family: 'rappel_soir',
    title: 'Soirée encore ouverte',
    body: 'Deuxième semaine. Une action ce soir maintient le rythme. C\'est suffisant.',
  },
  {
    day: 9,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j9.reminder',
    family: 'rappel_soir',
    title: 'Encore le temps',
    body: 'Jour 9. Tu peux ouvrir l\'app et cocher une action. Pas besoin de plus.',
  },
  {
    day: 10,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j10.reminder',
    family: 'rappel_soir',
    title: 'Dix jours bientôt',
    body: 'Une action ce soir, et tu cumules dix journées. La régularité fait sa part.',
  },
  {
    day: 11,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j11.reminder',
    family: 'rappel_soir',
    title: 'Encore ce soir',
    body: 'Jour 11. Tu peux marquer la journée avec une seule action. Sans forcer.',
  },
  {
    day: 12,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j12.reminder',
    family: 'rappel_soir',
    title: 'Plus que deux jours',
    body: 'Tu approches du bout. Une action ce soir et la journée est posée.',
  },
  {
    day: 13,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j13.reminder',
    family: 'rappel_soir',
    title: 'Avant le dernier jour',
    body: 'Jour 13. Si tu coches ce soir, tu boucles presque la phase. Pas grand-chose à ajouter.',
  },
  {
    day: 14,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j14.reminder',
    family: 'rappel_soir',
    title: 'Dernier jour',
    body: 'Jour 14. Une dernière action ce soir et la phase est bouclée. Tu peux faire le bilan dans l\'app.',
  },
] as const;

/**
 * Union des deux listes — utilisé par le scheduler pour planifier en bloc.
 */
export const PHASE_0_NOTIFICATIONS: readonly Phase0NotificationDraft[] = [
  ...PHASE_0_MORNING_NOTIFICATIONS,
  ...PHASE_0_REMINDER_NOTIFICATIONS,
];
