/**
 * s6-program.ts — programme 7 jours S6 Passion et chemin de vie.
 *
 * Réf brief-pilier-s6-passion-v1.md + matière Jacky V0
 * (V0_PILIER 6 — PASSION.docx).
 *
 * Spécificité Jacky V0 : programme identique chaque jour (choisir une passion,
 * y consacrer du temps, observer ressenti). Adaptation V1 : 7 jours avec
 * focus narratif progressif autour de la mécanique passion → temps réel.
 *
 * Type A — durées modulées par niveau d'engagement (centre des fourchettes
 * Jacky 5-15 / 20-40 / 45+ min).
 *
 * SessionType chrono_libre — timer pour temps consacré à la passion choisie.
 */

import type { S1Day } from './s1-program';

export const S6_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Identifier',
    objective: 'Lister 3 à 5 passions réelles. Choisir une passion à pratiquer cette semaine.',
    pedagogy:
      "Premier jour. Tu sais déjà une partie de ce qui t'anime. L'objectif n'est pas de tout analyser, mais de choisir une passion — celle que tu repousses, celle qui te fait vibrer même sans obligation extérieure — et de la remettre en mouvement.",
    copySlot: 'copy.IA-43.s6.j1-explication',
  },
  {
    id: 2,
    title: 'Petite porte d\'entrée',
    objective: 'Pratiquer la passion choisie. Démarrer petit, valider le temps réel.',
    pedagogy:
      "Aujourd'hui, tu pratiques. Même 15 minutes changent la dynamique. Le plus important est de commencer — pas de viser parfait. Ce que tu nourris prend de la place dans ta vie.",
    copySlot: 'copy.IA-43.s6.j2-explication',
  },
  {
    id: 3,
    title: 'Installer',
    objective: 'Reprendre la pratique aujourd\'hui. Observer ce que ça change après.',
    pedagogy:
      "Deuxième fois en deux jours. Tu reprends du temps pour toi. C'est ça qui crée une habitude — pas la motivation, la répétition. Observe ton énergie et ta motivation après la pratique.",
    copySlot: 'copy.IA-43.s6.j3-explication',
  },
  {
    id: 4,
    title: 'Approfondir',
    objective: 'Augmenter légèrement le temps consacré si possible.',
    pedagogy:
      "Aujourd'hui, si tu peux, donne un peu plus. 15 → 30 minutes. 30 → 45. Pas par obligation — par envie de prolonger ce que tu sens. Là, tu crées un vrai espace pour ce qui te nourrit.",
    copySlot: 'copy.IA-43.s6.j4-explication',
  },
  {
    id: 5,
    title: 'Persévérer',
    objective: 'Cinquième jour de pratique. Tu changes ton rythme.',
    pedagogy:
      "Cinq jours derrière toi. Tu changes ton rythme — pas ta vie. C'est plus fort que ça en a l'air. Ce que tu n'as jamais fait, c'est souvent simplement ce à quoi tu ne donnes jamais de temps.",
    copySlot: 'copy.IA-43.s6.j5-explication',
  },
  {
    id: 6,
    title: 'Observer l\'impact',
    objective: 'Pratiquer en étant attentif à ce qui change dans ton état global.',
    pedagogy:
      "Aujourd'hui tu pratiques en observant — pas juste l'activité, mais ce qu'elle fait au reste de ta journée. L'énergie qui dure plus longtemps. La motivation qui se propage. La vitalité ne vient pas seulement du corps. Elle vient aussi de ce que tu nourris.",
    copySlot: 'copy.IA-43.s6.j6-explication',
  },
  {
    id: 7,
    title: 'Intégrer',
    objective: 'Une dernière pratique. Voir le cumul de la semaine.',
    pedagogy:
      "Dernier jour. Tu n'as pas changé toute ta vie en 7 jours. Mais tu as remis une partie de toi en mouvement. Regarde le cumul — le temps que tu as redonné à ce qui t'anime — c'est une donnée réelle, pas une intention.",
    copySlot: 'copy.IA-43.s6.j7-explication',
  },
] as const;

/** Durées paramètre principal S6 par niveau d'engagement (matière Jacky V0).
 *  Centre des fourchettes 5-15 / 20-40 / 45+ min. */
export const S6_DURATIONS_MIN: Record<'essentiel' | 'progression' | 'immersion', number> = {
  essentiel: 15,
  progression: 30,
  immersion: 60,
};
