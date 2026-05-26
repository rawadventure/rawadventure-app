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
    why: "Au réveil, ton corps est encore en mode survie — le cortisol est à son pic. 5 minutes de respiration nasale suffisent à calmer le système nerveux et préparer ton énergie pour la journée.",
    how: [
      'Assieds-toi ou allonge-toi confortablement.',
      'Ferme la bouche — respire uniquement par le nez.',
      'Inspire lentement 4 secondes, expire lentement 4 secondes.',
      'Continue pendant 5 minutes.',
    ],
    tip: 'Avant le téléphone. Avant tout. C\'est là que ça change tout.',
  },
  {
    id: 'defi_froid',
    title: 'Défi froid',
    subtitle: '30 secondes d\'eau froide (douche, poignets ou visage)',
    Icon: Snowflake,
    why: "Le froid active le nerf vague et déclenche une réponse d'adaptation dans tout le corps. Résultat : meilleure régulation du stress, énergie plus stable, système immunitaire renforcé. 30 secondes suffisent.",
    how: [
      'Fin de douche : 30 secondes en eau froide.',
      'Alternative douce : poignets sous l\'eau froide pendant 1 minute.',
      'Alternative très douce : visage rincé à l\'eau froide.',
    ],
    tip: 'Expire lentement par la bouche dès que l\'eau froide touche ton corps. C\'est ce souffle qui transforme l\'inconfort en signal positif.',
  },
  {
    id: 'mouvement_recuperation',
    title: 'Mouvement ou récupération',
    subtitle: 'Selon ton ressenti du jour',
    Icon: Activity,
    why: "En Phase 0, l'objectif n'est pas de performer — c'est d'écouter. Ton corps envoie des signaux chaque jour. Apprendre à les lire, c'est la base de toute vraie vitalité.",
    how: [
      'Jour avec énergie : 20-30 min de marche, vélo, mobilité.',
      'Jour fatigué : étirements doux, automassage, mobilité articulaire.',
      'Choisis selon ce que ton corps signale, pas selon un planning.',
    ],
    tip: 'Pas de culpabilité si tu choisis récupération. Les champions récupèrent autant qu\'ils s\'entraînent — c\'est ça la vraie performance.',
  },
  {
    id: 'mineralisation',
    title: 'Minéralisation',
    subtitle: '250 ml d\'eau de mer ou 500 ml de jus de légumes',
    Icon: Droplet,
    why: "Sans minéraux, ton corps tourne au ralenti — même si tu dors bien et manges correctement. Une minéralisation matinale recharge les bases : énergie, nerfs, récupération. C'est le fondement du terrain.",
    how: [
      'Option A : 250 ml d\'eau de mer (Quinton, Biopaïa).',
      'Option B : 500 ml de jus de légumes frais (céleri, concombre, épinards).',
      'À prendre le matin, avant ou pendant le premier repas.',
    ],
    tip: 'L\'eau de mer est l\'option la plus puissante et la plus rapide. Si tu n\'en as pas encore, commence par le jus de légumes — l\'essentiel c\'est de démarrer.',
  },
  {
    id: 'fenetre_digestive',
    title: 'Fenêtre digestive',
    subtitle: 'Pas d\'aliment solide avant 10h30–11h',
    Icon: Clock,
    why: "La nuit, ton corps ne dort pas vraiment — il nettoie, répare, régule. Manger trop tôt le matin interrompt ce processus. Laisser cette fenêtre digestive, c'est laisser ton corps finir son travail. Énergie plus stable. Digestion plus légère. Dès les premiers jours.",
    how: [
      'Pas de solide avant 10h30–11h.',
      'Eau, tisanes, café sans sucre autorisés.',
      'Si la faim est intense, attends 15-20 min — elle passe.',
    ],
    tip: 'La faim du matin est souvent une habitude, pas un vrai besoin. Attends 15 minutes — elle disparaît presque toujours. Ton corps s\'adapte en 3 à 5 jours.',
  },
  {
    id: 'fruits',
    title: 'Fruits dans la journée',
    subtitle: '2 à 3 fruits frais',
    Icon: Apple,
    why: "Le fruit frais est l'un des aliments les plus complets qui existe — eau, sucres naturels, minéraux, fibres, enzymes vivantes. Il se digère vite, libère de l'énergie propre et nourrit le terrain en profondeur. Simple. Puissant. Sous-estimé.",
    how: [
      '2 à 3 fruits frais dans la journée.',
      'Privilégie de saison, mûrs.',
      'En début de repas si possible (digestion plus rapide).',
    ],
    tip: 'Mange-les seuls ou avant le repas — jamais après. Le fruit sur un estomac plein fermente et fatigue la digestion. Ce petit détail change tout.',
  },
  {
    id: 'soiree_sans_ecrans',
    title: 'Soirée sans écrans',
    subtitle: '1h avant le coucher, écrans coupés',
    Icon: Moon,
    why: "Chaque soir, ton cerveau attend un signal pour déclencher le sommeil — la baisse de lumière. Les écrans envoient le signal inverse. Résultat : mélatonine bloquée, endormissement retardé, sommeil moins profond. Une heure sans écran, c'est redonner à ton cerveau le signal qu'il attend.",
    how: [
      '1h avant ton coucher habituel, éteins téléphone, tablette, TV.',
      'Si besoin de lecture : livre papier ou liseuse e-ink.',
      'Lumière tamisée plutôt que plafonnier.',
    ],
    tip: 'Mets ton téléphone hors de la chambre — pas en mode avion, hors de la chambre. Tant qu\'il est là, ton cerveau reste en alerte. C\'est physiologique, pas une question de volonté.',
  },
];

export function getPhase0Action(id: Phase0ActionId): Phase0Action | undefined {
  return PHASE_0_ACTIONS.find((a) => a.id === id);
}
