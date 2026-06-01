/**
 * s2-program.ts — programme 7 jours S2 Activité physique.
 *
 * Réf brief-pilier-s2-activite-physique-v1.md + matière Jacky V0
 * (V0_PILIER 2 — ACTIVITÉ PHYSIQUE.docx) — rotation hebdo type :
 * Endurance / Mobilité / Renforcement / Endurance / Relâchement /
 * Renforcement / OFF.
 *
 * Durées modulées par engagement (chrono_libre) :
 * - Essentiel  : 30 min
 * - Progression : 45 min
 * - Immersion  : 60 min
 *
 * Drafts Claude — à valider Jacky.
 */

import type { S1Day } from './s1-program';

export const S2_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Remise en mouvement',
    objective: 'Réveiller le système cardio-vasculaire à effort modéré.',
    pedagogy:
      "Premier jour. Pas besoin de chercher la performance — juste de remettre le corps en mouvement. Marche soutenue ou footing très lent. Respiration nasale dans la mesure du possible.",
    copySlot: 'copy.IA-43.s2.j1-explication',
  },
  {
    id: 2,
    title: 'Libérer les articulations',
    objective: 'Lubrifier ce qui s\'est figé. Pas d\'effort, de l\'attention.',
    pedagogy:
      "Mobilité douce. Cou, épaules, hanches, chevilles — chaque rotation libère ce qui a stagné. C'est l'inverse d'une séance de force : tu observes plus que tu ne pousses.",
    copySlot: 'copy.IA-43.s2.j2-explication',
  },
  {
    id: 3,
    title: 'Construire la structure',
    objective: 'Circuit léger : squats, pompes, fentes, gainage.',
    pedagogy:
      "Premier renforcement. Mouvements fondamentaux humains. Pas de charge. Tu peux faire les pompes contre un mur si besoin. L'enjeu : sentir les muscles s'engager, pas pulvériser ton record.",
    copySlot: 'copy.IA-43.s2.j3-explication',
  },
  {
    id: 4,
    title: 'Tenir le rythme',
    objective: 'Marche ou footing. Respiration nasale. Pouvoir parler.',
    pedagogy:
      "Endurance. La règle de Jacky : pouvoir parler pendant l'effort. Si tu peux parler, tu construis ton énergie de fond. Si tu peux plus, c'est que tu pousses trop.",
    copySlot: 'copy.IA-43.s2.j4-explication',
  },
  {
    id: 5,
    title: 'Laisser le corps redescendre',
    objective: 'Jambes contre le mur. Récupération active.',
    pedagogy:
      "Relâchement. Jambes à l'équerre contre le mur, allongé au sol. C'est tout. La récupération n'est pas une absence de travail — c'est un travail différent. Ton système nerveux le réclame.",
    copySlot: 'copy.IA-43.s2.j5-explication',
  },
  {
    id: 6,
    title: 'Ancrer la structure',
    objective: 'Reprise du circuit J3, un peu plus long.',
    pedagogy:
      "Renforcement reprise. Mêmes mouvements que J3, un cycle de plus. Tu vas sentir que ton corps a déjà retenu quelque chose des sessions précédentes. C'est ça l'adaptation.",
    copySlot: 'copy.IA-43.s2.j6-explication',
  },
  {
    id: 7,
    title: 'Repos complet',
    objective: 'Pas de séance. L\'équilibre crée le progrès.',
    pedagogy:
      "Jour OFF. Pas de mouvement structuré aujourd'hui. C'est dans le repos que le corps consolide ce qu'il a appris. Si tu veux marcher tranquillement, vas-y — mais sans intention de séance.",
    copySlot: 'copy.IA-43.s2.j7-explication',
  },
] as const;

/** Durées paramètre principal S2 par niveau d'engagement (matière Jacky).
 *  Simplification V1 des 9 paliers Jacky (20-30-40 / 40-50-60 / 70-80-90 min). */
export const S2_DURATIONS_MIN: Record<'essentiel' | 'progression' | 'immersion', number> = {
  essentiel: 30,
  progression: 45,
  immersion: 60,
};
