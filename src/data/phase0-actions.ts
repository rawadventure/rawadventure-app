/**
 * phase0-actions.ts — données des 7 actions quotidiennes de Phase 0.
 *
 * Réf Feature Spec V1 Socle minimum §2.4 + IA V3 §IA-11 / §IA-13.
 *
 * 7 actions à pratiquer en parallèle pendant les 14 jours de Phase 0.
 * Seuil de validation : 5 sur 7 minimum (D6 modifié 7 mai 2026).
 *
 * Le copy détaillé (why / how / tip pour chaque action) viendra du Brief
 * contenu V1 produit par Mimi & Jacky. En attendant, placeholders concis
 * marqués `[copy à valider]` quand on déborde du titre + sous-titre courts.
 *
 * Iconographie : Lucide icons selon design system V1.1 §7.4 (mapping
 * Actions Phase 0 : Sun, Snowflake, Activity, Droplet, Clock, Apple, Moon).
 */

import { Activity, Apple, Clock, Droplet, Moon, Snowflake, Sun } from 'lucide-react-native';
import type React from 'react';

export type Phase0ActionId =
  | 'activation_matinale'
  | 'defi_froid'
  | 'mouvement_recuperation'
  | 'mineralisation'
  | 'fenetre_digestive'
  | 'fruits'
  | 'soiree_sans_ecrans';

export type Phase0Action = {
  id: Phase0ActionId;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  /**
   * Détail riche (lu par IA-13). En V1.0 placeholders ; à compléter via Brief
   * contenu V1 par Mimi & Jacky. Les slots de copy `copy.IA-13.{action_id}.*`
   * sont identifiés ici pour préparer l'i18n (D23).
   */
  why: string;
  how: string[];
  tip?: string;
};

export const PHASE_0_ACTIONS: Phase0Action[] = [
  {
    id: 'activation_matinale',
    title: 'Activation matinale',
    subtitle: '5 min de respiration nasale au réveil',
    Icon: Sun,
    why: "La respiration nasale active le système nerveux parasympathique. En quelques minutes, le cortisol du réveil baisse et le corps se prépare à la journée.",
    how: [
      'Assieds-toi ou allonge-toi confortablement.',
      'Ferme la bouche — respire uniquement par le nez.',
      'Inspire lentement 4 secondes, expire lentement 4 secondes.',
      'Continue pendant 5 minutes.',
    ],
    tip: 'Fais-le avant de regarder ton téléphone.',
  },
  {
    id: 'defi_froid',
    title: 'Défi froid',
    subtitle: '30 secondes d\'eau froide (douche, poignets ou visage)',
    Icon: Snowflake,
    why: "Une exposition courte au froid stimule le nerf vague, renforce la régulation thermique et envoie un signal d'adaptation au corps. [copy à valider]",
    how: [
      'Fin de douche : 30 secondes en eau froide.',
      'Alternative douce : poignets sous l\'eau froide pendant 1 minute.',
      'Alternative très douce : visage rincé à l\'eau froide.',
    ],
    tip: 'Respire calmement par le nez pendant l\'exposition.',
  },
  {
    id: 'mouvement_recuperation',
    title: 'Mouvement ou récupération',
    subtitle: 'Selon ton ressenti du jour',
    Icon: Activity,
    why: "Alterner mouvement et récupération apprend au corps à lire ses besoins. Pas de programme rigide en Phase 0 — l'observation prime sur l'effort. [copy à valider]",
    how: [
      'Jour avec énergie : 20-30 min de marche, vélo, mobilité.',
      'Jour fatigué : étirements doux, automassage, mobilité articulaire.',
      'Choisis selon ce que ton corps signale, pas selon un planning.',
    ],
  },
  {
    id: 'mineralisation',
    title: 'Minéralisation',
    subtitle: '250 ml d\'eau de mer ou 500 ml de jus de légumes',
    Icon: Droplet,
    why: "Les carences en minéraux limitent la production d'énergie, la régulation nerveuse et la récupération. La minéralisation matinale corrige le terrain.",
    how: [
      'Option A : 250 ml d\'eau de mer (Quinton, Biopaïa).',
      'Option B : 500 ml de jus de légumes frais (céleri, concombre, épinards).',
      'À prendre le matin, avant ou pendant le premier repas.',
    ],
    tip: 'L\'eau de mer Quinton se trouve en pharmacie ou magasin bio.',
  },
  {
    id: 'fenetre_digestive',
    title: 'Fenêtre digestive',
    subtitle: 'Pas d\'aliment solide avant 10h30–11h',
    Icon: Clock,
    why: "Laisser le système digestif au repos le matin permet au corps de finir son nettoyage nocturne. Résultat : énergie plus stable, digestion plus efficace.",
    how: [
      'Pas de solide avant 10h30–11h.',
      'Eau, tisanes, café sans sucre autorisés.',
      'Si la faim est intense, attends 15-20 min — elle passe.',
    ],
    tip: 'Le corps s\'adapte en 3 à 5 jours.',
  },
  {
    id: 'fruits',
    title: 'Fruits dans la journée',
    subtitle: '2 à 3 fruits frais',
    Icon: Apple,
    why: "Les fruits apportent micronutriments, fibres et hydratation. Mangés seuls ou en début de repas, ils digèrent vite et soutiennent la vitalité. [copy à valider]",
    how: [
      '2 à 3 fruits frais dans la journée.',
      'Privilégie de saison, mûrs.',
      'En début de repas si possible (digestion plus rapide).',
    ],
  },
  {
    id: 'soiree_sans_ecrans',
    title: 'Soirée sans écrans',
    subtitle: '1h avant le coucher, écrans coupés',
    Icon: Moon,
    why: "La lumière bleue des écrans bloque la production de mélatonine et retarde l'endormissement. Couper les écrans une heure avant le coucher améliore la qualité du sommeil.",
    how: [
      '1h avant ton coucher habituel, éteins téléphone, tablette, TV.',
      'Si besoin de lecture : livre papier ou liseuse e-ink.',
      'Lumière tamisée plutôt que plafonnier.',
    ],
    tip: 'Mets le téléphone hors de la chambre, pas juste en silencieux.',
  },
];

export function getPhase0Action(id: Phase0ActionId): Phase0Action | undefined {
  return PHASE_0_ACTIONS.find((a) => a.id === id);
}
