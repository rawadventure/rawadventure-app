/**
 * phase0-notifications.ts — copy notifications Phase 0 J1-J14 (validé Mimi 3 juin 2026).
 *
 * Réf D12 (validé Mimi), CLAUDE.md §2 (1-2 notifications/jour Phase 0),
 * §4 (brand voice Mimi & Jacky : tutoiement, dense), D32 (plage silence
 * 22h-7h locales gérée par scheduler — ajusté 3 juin 2026), D26 (soft-rappel
 * non-culpabilisant).
 *
 * Périmètre V1 — 2 notifications/jour :
 *  - Morning 7h00 : rappel principal pour démarrer la journée — calibré pour
 *    attraper les français qui se lèvent 6h-7h avant départ travail.
 *  - Soir 20h00 : rappel doux SI aucune action validée à cette heure-là.
 *    Annulé dynamiquement par `validateDay()` quand l'utilisateur valide au
 *    moins une action (la première coche). D26 — ton bienveillant, jamais
 *    culpabilisant.
 *
 * Copy : validé Mimi 3 juin 2026.
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
    body: "Premier jour. Pas un défi — un retour à toi-même. Ton corps n'attendait que ça.",
  },
  {
    day: 2,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j2.morning',
    family: 'rappel',
    title: 'Jour 2',
    body: "Jour 2. Hier c'était le début. Aujourd'hui c'est le choix. Nuance.",
  },
  {
    day: 3,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j3.morning',
    family: 'charniere',
    title: 'Jour 3 — Premier palier',
    body: 'Trois jours déjà. Ton corps a reçu les premiers signaux — et il commence à répondre. Tu vas adorer la suite.',
  },
  {
    day: 4,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j4.morning',
    family: 'observation',
    title: 'Jour 4',
    body: "Observe ce qui bouge aujourd'hui. Ventre, sommeil, énergie. C'est fascinant ce que le corps sait faire quand on lui fait confiance.",
  },
  {
    day: 5,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j5.morning',
    family: 'rappel',
    title: 'Jour 5',
    body: "Jour 5. Tu reprends le contrôle — sans te battre, sans forcer. C'est ça la vraie puissance.",
  },
  {
    day: 6,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j6.morning',
    family: 'encouragement',
    title: 'Jour 6',
    body: "Tu n'as pas tout coché ? Parfait. La perfection est surestimée. La régularité, elle, change tout.",
  },
  {
    day: 7,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j7.morning',
    family: 'charniere',
    title: 'Jour 7 — Une semaine',
    body: "Une semaine. Tu as tenu. Ce que tu ressens ce matin — c'est toi qui reprends la main sur ta vie.",
  },
  {
    day: 8,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j8.morning',
    family: 'rappel',
    title: 'Jour 8',
    body: "Deuxième semaine. Ton corps a mémorisé le rythme. Maintenant il travaille pour toi — même quand tu dors.",
  },
  {
    day: 9,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j9.morning',
    family: 'observation',
    title: 'Jour 9',
    body: "La matinée démarre plus claire ? C'est ton énergie naturelle qui remonte. Elle était là tout le temps.",
  },
  {
    day: 10,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j10.morning',
    family: 'rappel',
    title: 'Jour 10',
    body: "Dix jours. Tu te rappelles ce que ça fait d'être vivant et puissant. Ça fait du bien, non ?",
  },
  {
    day: 11,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j11.morning',
    family: 'charniere',
    title: 'Jour 11',
    body: "Onze jours. Ce n'est plus un effort — c'est qui tu redeviens. On fait le point dans l'app.",
  },
  {
    day: 12,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j12.morning',
    family: 'rappel',
    title: 'Jour 12',
    body: 'Plus que trois jours. La liberté se construit exactement comme ça — un geste simple, chaque jour.',
  },
  {
    day: 13,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j13.morning',
    family: 'encouragement',
    title: 'Jour 13',
    body: "Avant-dernier jour. Ton corps n'est plus le même qu'au Jour 1. Toi non plus — tu le sais.",
  },
  {
    day: 14,
    hour: 7,
    kind: 'morning',
    slot: 'copy.notif.phase0.j14.morning',
    family: 'charniere',
    title: 'Jour 14 — Bilan',
    body: "Quatorze jours. Tu as fait ce que peu font. Pas par intensité — par choix. Champion de ta vie. C'est toi.",
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
    body: 'Premier jour. Une seule action ce soir — et ton corps sait que tu es sérieux. Il enregistre tout.',
  },
  {
    day: 2,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j2.reminder',
    family: 'rappel_soir',
    title: 'Soirée tranquille',
    body: 'Une action ce soir et ta journée compte. Sinon, demain on repart — sans drama, sans culpabilité.',
  },
  {
    day: 3,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j3.reminder',
    family: 'rappel_soir',
    title: 'Jour 3 — encore possible',
    body: "Trois jours. Une action ce soir et tu confirmes que tu es là. Ton corps t'attend.",
  },
  {
    day: 4,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j4.reminder',
    family: 'rappel_soir',
    title: 'Petit signal',
    body: "Même tard, une action a de la valeur. Le corps prend ce qu'on lui donne — et il dit merci à sa façon.",
  },
  {
    day: 5,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j5.reminder',
    family: 'rappel_soir',
    title: 'Avant de dormir',
    body: 'Une seule action ce soir. Pas pour cocher une case — pour te rappeler que tu choisis ta vitalité.',
  },
  {
    day: 6,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j6.reminder',
    family: 'rappel_soir',
    title: 'Sans pression',
    body: "Une journée plus calme, c'est permis. Les champions récupèrent aussi. Reprends demain avec la même flamme.",
  },
  {
    day: 7,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j7.reminder',
    family: 'rappel_soir',
    title: 'Premier palier ce soir',
    body: "Jour 7. Une action ce soir et le premier palier est à toi. Il t'attend — vas-y.",
  },
  {
    day: 8,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j8.reminder',
    family: 'rappel_soir',
    title: 'Soirée encore ouverte',
    body: "Une action ce soir maintient le rythme. Ton corps travaille même quand tu fais peu. C'est la magie du vivant.",
  },
  {
    day: 9,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j9.reminder',
    family: 'rappel_soir',
    title: 'Encore le temps',
    body: 'Jour 9. Une action ce soir. Pour ce sourire que tu auras demain matin en te levant.',
  },
  {
    day: 10,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j10.reminder',
    family: 'rappel_soir',
    title: 'Dix jours bientôt',
    body: 'Une action ce soir et tu cumules dix journées. Dix jours de retour vers toi-même. Tu mesures ?',
  },
  {
    day: 11,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j11.reminder',
    family: 'rappel_soir',
    title: 'Encore ce soir',
    body: 'Jour 11. Un geste ce soir. Tu es en train de redevenir libre — et ça se sent, non ?',
  },
  {
    day: 12,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j12.reminder',
    family: 'rappel_soir',
    title: 'Plus que deux jours',
    body: 'Tu approches du bout. Une action ce soir — et tu confirmes que tu vas jusqu\'au bout. Toujours.',
  },
  {
    day: 13,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j13.reminder',
    family: 'rappel_soir',
    title: 'Avant le dernier jour',
    body: 'Jour 13. Une action ce soir et demain tu boucles quelque chose de rare. Tu y es presque — ne lâche pas maintenant.',
  },
  {
    day: 14,
    hour: 20,
    kind: 'reminder',
    slot: 'copy.notif.phase0.j14.reminder',
    family: 'rappel_soir',
    title: 'Dernier jour',
    body: 'Jour 14. Une dernière action ce soir. Et demain tu te réveilles différent. Champion de ta vie — pour de vrai.',
  },
] as const;

/**
 * Union des deux listes — utilisé par le scheduler pour planifier en bloc.
 */
export const PHASE_0_NOTIFICATIONS: readonly Phase0NotificationDraft[] = [
  ...PHASE_0_MORNING_NOTIFICATIONS,
  ...PHASE_0_REMINDER_NOTIFICATIONS,
];
