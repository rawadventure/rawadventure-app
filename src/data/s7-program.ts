/**
 * s7-program.ts — programme 7 jours S7 Mindset (Type B).
 *
 * Réf brief-pilier-s7-mindset-v1.md + matière Jacky V0
 * (V0_PILIER 7 — MINDSET.docx).
 *
 * Spécificité Jacky V0 : programme **progressif sur 3 phases** :
 * - J1-J2 : Observer (compter pensées négatives)
 * - J3-J4 : Transformer (changer l'angle)
 * - J5-J6-J7 : Impact (ressentir l'effet)
 *
 * Logique de transformation Jacky : Voir → Agir → Ressentir.
 *
 * Type B (D41) : pas de durations modulées par niveau. SessionType acte_libre
 * — validation manuelle des observations/transformations comptées.
 */

import type { S1Day } from './s1-program';

export const S7_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Voir',
    objective: 'Observer toute la journée les moments où tu stresses, juges, te plains ou anticipes négatif.',
    pedagogy:
      "Premier jour. Aujourd'hui tu n'interviens pas, tu observes. Chaque fois qu'une pensée négative passe — stress, jugement, plainte, anticipation — tu la notes. Pas pour la juger. Pour la voir. Tu commences à voir ce que tu ne voyais pas.",
    copySlot: 'copy.IA-43.s7.j1-explication',
  },
  {
    id: 2,
    title: 'Continuer à voir',
    objective: 'Compter les observations. Voir le pattern.',
    pedagogy:
      "Deuxième jour d'observation. Tu commences à reconnaître les patterns — les contextes qui déclenchent, les moments de la journée où ton mental s'emballe. Plus tu observes, plus tu vois clairement ton fonctionnement.",
    copySlot: 'copy.IA-43.s7.j2-explication',
  },
  {
    id: 3,
    title: 'Transformer',
    objective: 'Pour chaque pensée négative observée, trouver immédiatement un angle différent : positif, opportunité, apprentissage.',
    pedagogy:
      "Aujourd'hui tu passes de voir à agir. Quand tu observes une pensée négative, tu cherches immédiatement : un côté positif, une opportunité, ou un apprentissage. Tu interviens dans ton fonctionnement.",
    copySlot: 'copy.IA-43.s7.j3-explication',
  },
  {
    id: 4,
    title: 'Pratiquer la transformation',
    objective: 'Continuer observation + transformation. Compter les deux.',
    pedagogy:
      "Deuxième jour de transformation. Tu observes, puis tu transformes. Pas à chaque fois — c'est normal. Mais à chaque transformation, tu sens qu'une mécanique change. Tu interviens dans ton fonctionnement.",
    copySlot: 'copy.IA-43.s7.j4-explication',
  },
  {
    id: 5,
    title: 'Ressentir l\'impact',
    objective: 'Après chaque transformation, observer ton état, ton émotion, ton énergie.',
    pedagogy:
      "Aujourd'hui tu ajoutes l'observation de l'impact. Après chaque transformation, tu prends 10 secondes pour observer ce qui change — ton état, ton émotion, ton énergie. Aucun impact, modéré, fort. Tu influences ton état.",
    copySlot: 'copy.IA-43.s7.j5-explication',
  },
  {
    id: 6,
    title: 'Intégrer l\'impact',
    objective: 'Continuer les 3 étapes : observer, transformer, ressentir.',
    pedagogy:
      "Sixième jour. La séquence devient plus fluide. Tu vois plus, tu agis plus, tu ressens plus. Ce n'était pas la réalité qui te fatiguait — c'était ton interprétation.",
    copySlot: 'copy.IA-43.s7.j6-explication',
  },
  {
    id: 7,
    title: 'Consolider',
    objective: 'Reproduire la séquence sans suivre de consigne.',
    pedagogy:
      "Dernier jour. Tu connais maintenant la séquence : voir, agir, ressentir. Aujourd'hui tu la fais sans suivre de consigne — c'est devenu un outil que tu peux mobiliser quand tu veux. Tu n'as pas changé les situations. Tu as changé leur impact.",
    copySlot: 'copy.IA-43.s7.j7-explication',
  },
] as const;
