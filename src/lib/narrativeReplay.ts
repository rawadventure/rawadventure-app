/**
 * narrativeReplay — quelles vidéos narratives sont rejouables depuis le
 * Profil (IA-70, écran `NarrativeVideosScreen`).
 *
 * Retour testeuse beta (7 octobre 2026) : interrompue pendant la vidéo de
 * la charnière J7, elle n'a jamais pu en réécouter la fin — l'écran
 * charnière ne se joue qu'une fois. Décision Stéphane : toutes les vidéos
 * narratives déjà vues sont rejouables depuis le Profil, en liste simple,
 * sans rejouer l'écran narratif complet.
 *
 * Règle de déblocage, calquée sur la galerie des paliers (IA-51) : une
 * vidéo n'apparaît qu'une fois débloquée par le parcours, jamais avant.
 *  - vidéo d'écran narratif : flag posé. Le flag est posé au déclenchement,
 *    pas à la fermeture (§2.3) — une vidéo fermée en cours de lecture est
 *    donc bien rejouable, c'est exactement le cas de la testeuse.
 *  - intro de pilier : pilier atteint (Phase 1, index ≤ pilier en cours) ou
 *    parcours terminé (post_s8).
 *
 * Fonction pure, sans date. La relecture ne touche à aucun état.
 */

import { NARRATIVE_VIDEOS, type NarrativeVideo } from '../data/narrative-videos';
import { PILLAR_ORDER_CANONICAL, type PillarId } from '../data/pillar-registry';
import type { NarrativeEventId } from '../hooks/progress/types';
import type { Phase } from './streak';

export function listReplayableVideos(input: {
  narrativeFlags: Partial<Record<NarrativeEventId, string>>;
  currentPhase: Phase;
  currentPillarId: string | null;
}): NarrativeVideo[] {
  const { narrativeFlags, currentPhase, currentPillarId } = input;

  const currentPillarIndex =
    currentPillarId == null
      ? -1
      : PILLAR_ORDER_CANONICAL.indexOf(currentPillarId as PillarId);

  const isPillarUnlocked = (pillarId: PillarId): boolean => {
    if (currentPhase === 'post_s8') return true;
    if (currentPhase !== 'phase_1' || currentPillarIndex === -1) return false;
    return PILLAR_ORDER_CANONICAL.indexOf(pillarId) <= currentPillarIndex;
  };

  return NARRATIVE_VIDEOS.filter((video) =>
    video.unlock.kind === 'narrative'
      ? narrativeFlags[video.unlock.eventId] != null
      : isPillarUnlocked(video.unlock.pillarId),
  );
}
