/**
 * s3-program.ts — programme 7 jours S3 Alimentation.
 *
 * Réf brief-pilier-s3-alimentation-v1.md + matière Jacky V0
 * (V0_PILIER 3 — ALIMENTATION.docx) — progression 7 jours :
 * Découvrir / Décaler / Ressentir / Stabiliser / Alléger / Fluidifier / Comprendre.
 *
 * 3 niveaux d'engagement modulent l'intensité (essentiel/progression/immersion) :
 * - Essentiel    : repousser le 1er repas + fruits midi + repas vitalité simple
 * - Progression  : jeûne intermittent partiel + gros repas fruits midi + repas vitalité structuré
 * - Immersion    : jeûne intermittent complet + repas fruits dominant + repas vitalité très simple
 *
 * SessionType acte_libre — pas de timer, validation manuelle moment alimentaire.
 */

import type { S1Day } from './s1-program';

export const S3_PROGRAM: readonly S1Day[] = [
  {
    id: 1,
    title: 'Découvrir',
    objective: 'Tester sans chercher la perfection.',
    pedagogy:
      "Premier jour. Note l'heure du premier repas, fais un repas avec plus de fruits que d'habitude, ajoute un repas vitalité simple le soir. Aujourd'hui, tu ne dois pas réussir parfaitement. Tu dois commencer à observer.",
    copySlot: 'copy.IA-43.s3.j1-explication',
  },
  {
    id: 2,
    title: 'Décaler',
    objective: 'Repousser un peu le premier repas.',
    pedagogy:
      "Essaye de décaler de 30 minutes à 1 heure. Augmente la quantité de fruits. Simplifie ton repas du soir. Tu n'es pas en restriction. Tu donnes juste plus d'espace à ton corps.",
    copySlot: 'copy.IA-43.s3.j2-explication',
  },
  {
    id: 3,
    title: 'Ressentir',
    objective: 'Créer le premier contraste.',
    pedagogy:
      "Vise un vrai temps sans digestion le matin. Fais un vrai gros repas de fruits à midi. Repas végétal simple le soir. Si tu ressens déjà une différence, c'est que ton corps était probablement surchargé.",
    copySlot: 'copy.IA-43.s3.j3-explication',
  },
  {
    id: 4,
    title: 'Stabiliser',
    objective: 'Stabiliser l\'énergie.',
    pedagogy:
      "Continue le décalage matinal. Fruits simples à midi, peu mélangés. Repas léger et peu gras le soir. Ton énergie ne dépend pas seulement de ce que tu manges. Elle dépend aussi de ce que ton corps dépense pour digérer.",
    copySlot: 'copy.IA-43.s3.j4-explication',
  },
  {
    id: 5,
    title: 'Alléger',
    objective: 'Réduire clairement la charge digestive.',
    pedagogy:
      "Vise le plus proche possible du jeûne intermittent. Repas fruits complet à midi. Repas vitalité très simple le soir. Ce n'est pas une restriction. C'est une libération de charge.",
    copySlot: 'copy.IA-43.s3.j5-explication',
  },
  {
    id: 6,
    title: 'Fluidifier',
    objective: 'Rendre l\'expérience plus naturelle.',
    pedagogy:
      "Observe si le jeûne devient plus facile. Fruits en quantité suffisante à midi. Repas végétal léger le soir. Tu ne changes pas seulement ton alimentation. Tu changes ton fonctionnement.",
    copySlot: 'copy.IA-43.s3.j6-explication',
  },
  {
    id: 7,
    title: 'Comprendre',
    objective: 'Faire le lien entre alimentation, digestion et énergie.',
    pedagogy:
      "Note ton heure et ton ressenti. Refais ton meilleur repas fruits de la semaine. Choisis le repas vitalité qui t'a le mieux réussi. Aujourd'hui, tu ne suis plus seulement un protocole. Tu comprends ce que ton corps préfère.",
    copySlot: 'copy.IA-43.s3.j7-explication',
  },
] as const;
