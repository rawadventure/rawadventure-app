/**
 * s8-program.ts — programme 7 jours S8 Élimination et détox.
 *
 * Réf brief-pilier-s8-elimination-detox-v1.md + matière Jacky V0
 * (V0_PILIER 8 — ÉLIMINATION & DÉTOX.docx).
 *
 * Spécificité Jacky V0 : programme **identique chaque jour** pendant 7 jours.
 * "L'élimination a besoin de régularité." Adaptation V1 : 7 jours avec focus
 * narratif progressif autour des 2 actions quotidiennes (jus/isotonique +
 * psyllium).
 *
 * Type A modulé par niveau d'engagement (volumes jus/quantité psyllium) :
 * - Essentiel    : 500 ml-1 L jus + psyllium 1 c.c. matin et soir
 * - Progression  : 1-1,5 L jus + psyllium 1 c.c. matin/midi/soir
 * - Immersion    : 1,5-2 L jus + psyllium 1 c.s. matin et soir
 *
 * SessionType acte_libre — validation manuelle des actions (pas de timer).
 */

import type { S1Day } from './s1-program';

export const S8_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Démarrer simple',
    objective: 'Première prise de jus ou isotonique + premier psyllium.',
    pedagogy:
      "Premier jour. Pas de détox extrême — juste apporter plus d'eau, plus de minéraux. Même 500 ml de jus, c'est déjà un vrai signal pour ton corps. Le psyllium se prend toujours avec beaucoup de liquide.",
    copySlot: 'copy.IA-43.s8.j1-explication',
  },
  {
    id: 2,
    title: 'Maintenir le signal',
    objective: 'Reprendre la même routine. Observer ton transit.',
    pedagogy:
      "Deuxième jour. Tu refais les mêmes actions — c'est la régularité qui fait le travail, pas l'intensité. Observe ton transit, ton ventre. Ton corps a déjà commencé à recevoir le signal d'hier.",
    copySlot: 'copy.IA-43.s8.j2-explication',
  },
  {
    id: 3,
    title: 'Affiner les quantités',
    objective: 'Augmenter légèrement les volumes si tu es confortable.',
    pedagogy:
      "Aujourd'hui, si tu as bien vécu les deux premiers jours, tu peux augmenter — 500 ml → 1 L de jus, ou ajouter une prise de psyllium. Pas par obligation, par envie de soutenir plus ce que tu sens commencer.",
    copySlot: 'copy.IA-43.s8.j3-explication',
  },
  {
    id: 4,
    title: 'Observer le transit',
    objective: 'Noter ce qui change : selles, ventre, énergie, clarté.',
    pedagogy:
      "Quatrième jour. C'est en général le moment où le transit commence à changer — selles plus molles, ventre qui gargouille, plus d'envie d'aller aux toilettes. C'est une réponse normale tant que tu te sens globalement bien.",
    copySlot: 'copy.IA-43.s8.j4-explication',
  },
  {
    id: 5,
    title: 'Approfondir si confort',
    objective: 'Si tu es confortable, viser le niveau supérieur de jus.',
    pedagogy:
      "Cinquième jour. Si tout va bien, tu peux pousser un peu — 1,5 ou 2 L de jus. C'est dans cette fourchette que le signal devient le plus fort. Si tu ressens un inconfort, ralentis sans culpabiliser.",
    copySlot: 'copy.IA-43.s8.j5-explication',
  },
  {
    id: 6,
    title: 'Consolider',
    objective: 'Maintenir le rythme. Observer la fluidité globale.',
    pedagogy:
      "Sixième jour. Le rythme est installé. Ton ventre est plus léger, ton énergie plus stable, ta clarté mentale a souvent déjà bougé. L'élimination dépend de l'hydratation et des minéraux — pas de purges, pas de privations.",
    copySlot: 'copy.IA-43.s8.j6-explication',
  },
  {
    id: 7,
    title: 'Intégrer le rythme',
    objective: 'Faire la routine sans suivre de consigne. Observer le cumul.',
    pedagogy:
      "Dernier jour. Tu connais maintenant la routine. Tu n'as pas forcé ton corps : tu lui as donné les conditions pour mieux évacuer. Ce que tu ressens est une réponse du corps, pas un effet symbolique.",
    copySlot: 'copy.IA-43.s8.j7-explication',
  },
] as const;
