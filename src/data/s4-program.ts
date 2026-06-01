/**
 * s4-program.ts — programme 7 jours S4 Connexion au vivant.
 *
 * Réf brief-pilier-s4-connexion-vivant-v1.md + matière Jacky V0
 * (V0_PILIER 4 — CONNEXION AU VIVANT.docx).
 *
 * Spécificité S4 : Jacky propose 2 sessions/jour (matin/soir) avec
 * structure identique chaque jour (régulation nerveuse = répétition).
 * Adaptation V1 : 7 jours avec progression légère sur les éléments
 * naturels mis en avant (lumière → air → terre → présence intégrée).
 *
 * 3 niveaux d'engagement modulent la durée par session (matin OU soir) :
 * - Essentiel    : 5 min (fourchette Jacky 5-15)
 * - Progression  : 20 min (fourchette Jacky 15-30)
 * - Immersion    : 45 min (fourchette Jacky 30-60)
 *
 * SessionType chrono_libre — timer pour temps passé en contact réel.
 */

import type { S1Day } from './s1-program';

export const S4_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Démarrer le contact',
    objective: 'Sortir 5 minutes minimum, matin et soir. Pas de téléphone.',
    pedagogy:
      "Premier jour. Pas besoin de comprendre — il faut juste sortir. Lumière naturelle, air, sans écran. C'est la base de toute reconnexion. Ton corps va commencer à enregistrer le signal.",
    copySlot: 'copy.IA-43.s4.j1-explication',
  },
  {
    id: 2,
    title: 'Lumière du matin',
    objective: 'Exposition lumière naturelle au réveil (10 min mini).',
    pedagogy:
      "La lumière du matin recalibre l'horloge biologique. Pas de vitres, idéalement dehors. C'est le signal le plus puissant pour ton système nerveux — il dit au corps que la journée commence.",
    copySlot: 'copy.IA-43.s4.j2-explication',
  },
  {
    id: 3,
    title: 'Sentir l\'air',
    objective: 'Respiration naturelle dehors. Observer le vent, la température.',
    pedagogy:
      "L'air est un contact direct. Le sentir sur la peau, dans les narines, dans la cage thoracique. Quand tu deviens attentif à l'air, ton mental ralentit naturellement.",
    copySlot: 'copy.IA-43.s4.j3-explication',
  },
  {
    id: 4,
    title: 'Contact direct',
    objective: 'Toucher la terre : pieds nus, mains sur écorce, sol naturel.',
    pedagogy:
      "Le contact physique avec la terre, ce n'est pas symbolique. C'est un signal électrique qui apaise le système nerveux. Quelques minutes pieds nus sur l'herbe, et tu sens la différence.",
    copySlot: 'copy.IA-43.s4.j4-explication',
  },
  {
    id: 5,
    title: 'Apaisement du soir',
    objective: 'Coucher de soleil ou lumière déclinante dehors.',
    pedagogy:
      "Le soir, la baisse de lumière naturelle prépare le sommeil. Observer un coucher de soleil ou simplement la lumière qui change — ton mélatonine se synchronise dessus.",
    copySlot: 'copy.IA-43.s4.j5-explication',
  },
  {
    id: 6,
    title: 'Présence pleine',
    objective: 'Une vraie observation prolongée d\'un élément naturel.',
    pedagogy:
      "Aujourd'hui, tu choisis un élément (un arbre, l'eau, le ciel) et tu observes longuement. La présence n'est pas une technique — c'est ce qui se passe quand tu arrêtes de regarder ailleurs.",
    copySlot: 'copy.IA-43.s4.j6-explication',
  },
  {
    id: 7,
    title: 'Intégrer le rythme',
    objective: 'Reproduire les 2 moments de la semaine sans réfléchir.',
    pedagogy:
      "Dernier jour. Tu connais maintenant le geste : matin pour activer, soir pour redescendre. Aujourd'hui tu le fais sans suivre de consigne — c'est devenu un rythme.",
    copySlot: 'copy.IA-43.s4.j7-explication',
  },
] as const;

/** Durées paramètre principal S4 par niveau d'engagement (matière Jacky V0).
 *  Centre des fourchettes 5-15 / 15-30 / 30-60 min par session (matin OU soir). */
export const S4_DURATIONS_MIN: Record<'essentiel' | 'progression' | 'immersion', number> = {
  essentiel: 5,
  progression: 20,
  immersion: 45,
};
