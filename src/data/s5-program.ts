/**
 * s5-program.ts — programme 7 jours S5 Repos et régénération (Type B).
 *
 * Réf brief-pilier-s5-repos-regeneration-v1.md + matière Jacky V0
 * (V0_PILIER 5 — REPOS & RÉGÉNÉRATION.docx).
 *
 * Spécificité Jacky V0 : programme **identique chaque jour** pendant 7 jours.
 * La transformation vient de la **régularité**, pas de la progression.
 *
 * Adaptation V1 : 7 jours avec focus différent par jour mais structure
 * identique (matin lumière + soir écrans coupés + nuit obscurité). Permet
 * une narration pédagogique progressive sans trahir le principe Jacky.
 *
 * Type B (D41) : pas de durées modulées par niveau. SessionType acte_libre
 * — validation binaire fait/pas fait des 3 actions quotidiennes.
 */

import type { S1Day } from './s1-program';

export const S5_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Démarrer le rythme',
    objective: 'Trois actions du jour : lumière matin, écrans coupés soir, obscurité nuit.',
    pedagogy:
      "Premier jour. Tu poses les trois conditions : t'exposer à la lumière naturelle au réveil, couper les écrans en soirée, dormir dans l'obscurité. Ce n'est pas optionnel — c'est le minimum pour que le corps reçoive un signal clair.",
    copySlot: 'copy.IA-43.s5.j1-explication',
  },
  {
    id: 2,
    title: 'Lumière du matin',
    objective: 'Exposition lumière naturelle dans les 10 minutes du réveil.',
    pedagogy:
      "Aujourd'hui focus sur le matin. La lumière du matin programme ton énergie pour toute la journée. Sortir 5 minutes dehors suffit. Vitres ne comptent pas — la lumière qui passe par la fenêtre perd l'essentiel.",
    copySlot: 'copy.IA-43.s5.j2-explication',
  },
  {
    id: 3,
    title: 'Écrans du soir',
    objective: 'Arrêter les écrans 1h minimum avant le coucher.',
    pedagogy:
      "Focus sur la soirée. Ce que tu fais le soir détermine ton sommeil. Plus tu coupes tôt, plus la mélatonine se synchronise. Lumière tamisée plutôt que plafonnier.",
    copySlot: 'copy.IA-43.s5.j3-explication',
  },
  {
    id: 4,
    title: 'Obscurité totale',
    objective: 'Pièce dans le noir complet. Téléphone hors chambre.',
    pedagogy:
      "Focus sur la nuit. Ton corps se régénère dans l'obscurité. Toute lumière visible (LED veille, lampadaire) coupe la production de mélatonine. Téléphone : pas en mode avion, hors de la chambre.",
    copySlot: 'copy.IA-43.s5.j4-explication',
  },
  {
    id: 5,
    title: 'Tout ensemble',
    objective: 'Valider les trois actions sans rappel — le rythme s\'installe.',
    pedagogy:
      "Cinq jours derrière toi. Le rythme commence à s'installer. Aujourd'hui tu mets tout ensemble : lumière au réveil, écrans coupés en soirée, obscurité totale la nuit. Tu sens déjà la différence sur l'endormissement.",
    copySlot: 'copy.IA-43.s5.j5-explication',
  },
  {
    id: 6,
    title: 'Affiner',
    objective: 'Vérifier l\'heure exacte du coucher par rapport au coucher de soleil.',
    pedagogy:
      "Aujourd'hui, on affine. Plus tu te couches près du coucher du soleil, plus le sommeil est profond. Pas besoin de viser le crépuscule — viser une heure stable cohérente avec la saison suffit.",
    copySlot: 'copy.IA-43.s5.j6-explication',
  },
  {
    id: 7,
    title: 'Intégrer le rythme',
    objective: 'Reproduire les trois actions sans suivre de consigne.',
    pedagogy:
      "Dernier jour. Tu connais maintenant les trois leviers. Aujourd'hui tu les fais sans suivre de consigne — c'est devenu un cadre. Tu viens de recréer les conditions naturelles de la régénération.",
    copySlot: 'copy.IA-43.s5.j7-explication',
  },
] as const;
