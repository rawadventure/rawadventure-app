/**
 * s1-program.ts — programme 7 jours du pilier S1 Respiration.
 *
 * Réf Feature Spec S1 V1.0 §4.3.
 *
 * 7 jours de progression pédagogique invariante (quel que soit le niveau
 * d'engagement, c'est la DURÉE qui module via S1_DURATIONS_MIN, pas le
 * contenu). Rythme respiratoire 6 cycles/minute fixe (5s inspire / 5s expire).
 *
 * Copy explication = placeholder Brief contenu V1 (slot `copy.IA-43.s1.jN-explication`).
 */

export type S1DayId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type S1Day = {
  id: S1DayId;
  title: string;
  objective: string;
  pedagogy: string;
  copySlot: string;
};

export const S1_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Respirer par le nez',
    objective: 'Inspirer et expirer uniquement par le nez.',
    pedagogy:
      "Le nez filtre, humidifie et régule l'air. On commence par retrouver la voie naturelle de la respiration.",
    copySlot: 'copy.IA-43.s1.j1-explication',
  },
  {
    id: 2,
    title: 'Sentir le ventre',
    objective: 'Respirer dans le ventre.',
    pedagogy:
      "Quand le ventre bouge doucement, le diaphragme travaille. C'est une base essentielle pour sortir d'une respiration haute et tendue.",
    copySlot: 'copy.IA-43.s1.j2-explication',
  },
  {
    id: 3,
    title: 'Ouvrir les côtes',
    objective: 'Ventre + ouverture latérale des côtes.',
    pedagogy:
      "Les côtes doivent pouvoir s'ouvrir. Plus l'espace respiratoire est disponible, moins le corps a besoin de forcer.",
    copySlot: 'copy.IA-43.s1.j3-explication',
  },
  {
    id: 4,
    title: 'Respiration complète',
    objective: 'Ventre + côtes + clavicules.',
    pedagogy:
      "Aujourd'hui, exploration de toute la capacité respiratoire : la respiration descend, s'ouvre sur les côtés, puis monte légèrement vers les clavicules.",
    copySlot: 'copy.IA-43.s1.j4-explication',
  },
  {
    id: 5,
    title: 'Respiration douce',
    objective: 'Ralentir, adoucir, rendre la respiration silencieuse.',
    pedagogy:
      "Respirer plus fort n'est pas toujours mieux. Une respiration douce permet souvent au système nerveux de se réguler plus profondément.",
    copySlot: 'copy.IA-43.s1.j5-explication',
  },
  {
    id: 6,
    title: "Sentir le passage de l'air",
    objective: "Sentir le trajet de l'air.",
    pedagogy:
      "Observer le passage de l'air : nez, gorge, cage thoracique, ventre. On ne contrôle pas, on ressent.",
    copySlot: 'copy.IA-43.s1.j6-explication',
  },
  {
    id: 7,
    title: 'Trouver ton optimum',
    objective: 'Trouver la respiration la plus ample possible, tout en restant confortable.',
    pedagogy:
      "La respiration optimale n'est pas la plus grande. C'est celle qui reste ample, fluide, stable et confortable.",
    copySlot: 'copy.IA-43.s1.j7-explication',
  },
] as const;

/** Durées du paramètre principal S1 par niveau d'engagement (Feature Spec S1 §3.3). */
export const S1_DURATIONS_MIN: Record<'essentiel' | 'progression' | 'immersion', number> = {
  essentiel: 5,
  progression: 10,
  immersion: 20,
};

/** Cycle respiratoire fixe — 6 cycles/min (Feature Spec S1 §3.3). */
export const RESPI_CYCLE = {
  cyclesPerMinute: 6,
  inhaleSeconds: 5,
  exhaleSeconds: 5,
  /** Total = 10s par cycle. */
  cycleSeconds: 10,
} as const;

/** Index des 3 sessions du jour (matin/midi/soir). */
export type SessionIndex = 1 | 2 | 3;

export const SESSION_INDEX_LABEL: Record<SessionIndex, string> = {
  1: 'Matin',
  2: 'Midi',
  3: 'Soir',
};

export function getS1Day(dayId: number): S1Day | undefined {
  return S1_PROGRAM.find((d) => d.id === dayId);
}
