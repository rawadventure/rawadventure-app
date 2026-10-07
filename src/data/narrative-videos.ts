/**
 * narrative-videos.ts — registre des vidéos narratives Mimi & Jacky.
 *
 * Source unique des URLs vidéo (D23 : média référencé par asset stable,
 * jamais par chemin codé en dur dans un écran). Les écrans IA-12, IA-14,
 * IA-20, IA-21 et IA-42 importent leurs URLs ici.
 *
 * Le même registre alimente la relecture depuis le Profil (IA-70, écran
 * `NarrativeVideosScreen`, retour testeuse beta 7 octobre 2026) : une vidéo
 * n'y apparaît qu'une fois débloquée par le parcours (`unlock`), jamais
 * avant. Ordre du tableau = ordre chronologique du parcours.
 *
 * Bucket Supabase Storage public `phase0-videos`. Posters résolus par nom
 * de fichier dans `src/lib/video-posters.ts`.
 */

import type { NarrativeEventId } from '../hooks/progress/types';
import type { PillarId } from './pillar-registry';

const VIDEO_BASE =
  'https://aknvitrtfxqjdwiyxryt.supabase.co/storage/v1/object/public/phase0-videos';

export type NarrativeVideoId =
  | 'welcome'
  | 'j7'
  | 'j14'
  | 's0_1'
  | 's0_2'
  | `pillar_${PillarId}`;

export type NarrativeVideoUnlock =
  /** Débloquée quand l'écran narratif s'est déclenché (flag posé au déclenchement). */
  | { kind: 'narrative'; eventId: NarrativeEventId }
  /** Intro de pilier — débloquée quand le pilier est atteint en Phase 1. */
  | { kind: 'pillar'; pillarId: PillarId };

export type NarrativeVideo = {
  id: NarrativeVideoId;
  url: string;
  unlock: NarrativeVideoUnlock;
};

/** IA-12 — bienvenue J1 : vision, qui on est, mission, démarche. */
export const WELCOME_VIDEO_URL = `${VIDEO_BASE}/welcome-j1-bienvenue.mp4`;

/** IA-14 — charnières riches J7 (« une semaine ») et J14 (« fin de Phase 0 »). */
export const CHARNIERE_VIDEO_URL: Record<7 | 14, string> = {
  7: `${VIDEO_BASE}/charniere-j7-une-semaine.mp4`,
  14: `${VIDEO_BASE}/charniere-j14-fin-phase-0.mp4`,
};

/** IA-20 — S0.1 célébration des 14 jours (Brief contenu Session 2). */
export const S0_1_VIDEO_URL = `${VIDEO_BASE}/s0-1-celebration.mp4`;

/** IA-21 — S0.2 roadmap Phase 1 (Brief contenu Session 2). */
export const S0_2_VIDEO_URL = `${VIDEO_BASE}/s0-2-roadmap.mp4`;

/**
 * IA-42 — intros de pilier (Brief contenu Session 3, 60-90 s, portrait
 * 1080×1920). Noms de fichiers figés à la livraison des vidéos.
 */
export const PILLAR_INTRO_VIDEO_URL: Record<PillarId, string> = {
  S1: `${VIDEO_BASE}/pilier-s1-respiration.mp4`,
  S2: `${VIDEO_BASE}/pilier-s2-activite-physique.mp4`,
  S3: `${VIDEO_BASE}/pilier-s3-alimentation.mp4`,
  S4: `${VIDEO_BASE}/pilier-s4-connexion-vivant.mp4`,
  S5: `${VIDEO_BASE}/pilier-s5-repos-regeneration.mp4`,
  S6: `${VIDEO_BASE}/pilier-s6-passion.mp4`,
  S7: `${VIDEO_BASE}/pilier-s7-mindset.mp4`,
  S8: `${VIDEO_BASE}/pilier-s8-elimination-detox.mp4`,
};

const PILLAR_IDS: PillarId[] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

/** Ordre chronologique du parcours — ordre d'affichage dans IA-70. */
export const NARRATIVE_VIDEOS: readonly NarrativeVideo[] = [
  { id: 'welcome', url: WELCOME_VIDEO_URL, unlock: { kind: 'narrative', eventId: 'welcome_video' } },
  { id: 'j7', url: CHARNIERE_VIDEO_URL[7], unlock: { kind: 'narrative', eventId: 'j7_charniere' } },
  { id: 'j14', url: CHARNIERE_VIDEO_URL[14], unlock: { kind: 'narrative', eventId: 'j14_charniere' } },
  { id: 's0_1', url: S0_1_VIDEO_URL, unlock: { kind: 'narrative', eventId: 's0_1_screen' } },
  { id: 's0_2', url: S0_2_VIDEO_URL, unlock: { kind: 'narrative', eventId: 's0_2_screen' } },
  ...PILLAR_IDS.map(
    (pillarId): NarrativeVideo => ({
      id: `pillar_${pillarId}`,
      url: PILLAR_INTRO_VIDEO_URL[pillarId],
      unlock: { kind: 'pillar', pillarId },
    }),
  ),
];
