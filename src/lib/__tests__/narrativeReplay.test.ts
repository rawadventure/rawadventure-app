/**
 * Tests narrativeReplay — quelles vidéos narratives sont rejouables depuis
 * le Profil (IA-70, retour testeuse beta 7 octobre 2026).
 *
 * Règle : une vidéo n'est listée qu'une fois débloquée par le parcours —
 * flag narratif posé (écran déclenché, même fermé en cours de lecture),
 * ou pilier atteint en Phase 1. Jamais d'anticipation. Aucune dépendance
 * à la date.
 */

import { listReplayableVideos } from '../narrativeReplay';

const ids = (videos: { id: string }[]) => videos.map((v) => v.id);

describe('listReplayableVideos — flags narratifs', () => {
  test('aucun flag → liste vide', () => {
    expect(
      listReplayableVideos({ narrativeFlags: {}, currentPhase: 'phase_0', currentPillarId: null }),
    ).toEqual([]);
  });

  test('J1 : seule la bienvenue, une fois son flag posé', () => {
    expect(
      ids(
        listReplayableVideos({
          narrativeFlags: { welcome_video: '2026-10-01T08:00:00.000Z' },
          currentPhase: 'phase_0',
          currentPillarId: null,
        }),
      ),
    ).toEqual(['welcome']);
  });

  test('charnière J7 déclenchée (même fermée pendant la vidéo) → rejouable, J14 pas encore', () => {
    expect(
      ids(
        listReplayableVideos({
          narrativeFlags: { welcome_video: 'x', j3_charniere: 'x', j7_charniere: 'x' },
          currentPhase: 'phase_0',
          currentPillarId: null,
        }),
      ),
    ).toEqual(['welcome', 'j7']);
  });

  test('ordre = ordre du parcours, quel que soit l ordre des flags', () => {
    expect(
      ids(
        listReplayableVideos({
          narrativeFlags: { s0_2_screen: 'x', j14_charniere: 'x', welcome_video: 'x', s0_1_screen: 'x', j7_charniere: 'x' },
          currentPhase: 'phase_0',
          currentPillarId: null,
        }),
      ),
    ).toEqual(['welcome', 'j7', 'j14', 's0_1', 's0_2']);
  });

  test('charnières texte (J3, J11) n ont pas de vidéo → ignorées', () => {
    expect(
      listReplayableVideos({
        narrativeFlags: { j3_charniere: 'x', j11_charniere: 'x' },
        currentPhase: 'phase_0',
        currentPillarId: null,
      }),
    ).toEqual([]);
  });
});

describe('listReplayableVideos — intros de pilier', () => {
  const phase0Flags = {
    welcome_video: 'x',
    j7_charniere: 'x',
    j14_charniere: 'x',
    s0_1_screen: 'x',
    s0_2_screen: 'x',
  };

  test('Phase 1 en S3 : intros S1, S2, S3 — pas S4', () => {
    expect(
      ids(listReplayableVideos({ narrativeFlags: phase0Flags, currentPhase: 'phase_1', currentPillarId: 'S3' })),
    ).toEqual(['welcome', 'j7', 'j14', 's0_1', 's0_2', 'pillar_S1', 'pillar_S2', 'pillar_S3']);
  });

  test('Phase 1 sans pilier démarré (sortie S0.2, avant IA-41) : aucune intro', () => {
    expect(
      ids(listReplayableVideos({ narrativeFlags: phase0Flags, currentPhase: 'phase_1', currentPillarId: null })),
    ).toEqual(['welcome', 'j7', 'j14', 's0_1', 's0_2']);
  });

  test('post_s8 : les 8 intros', () => {
    const result = ids(
      listReplayableVideos({ narrativeFlags: phase0Flags, currentPhase: 'post_s8', currentPillarId: 'S8' }),
    );
    expect(result.filter((id) => id.startsWith('pillar_'))).toEqual([
      'pillar_S1', 'pillar_S2', 'pillar_S3', 'pillar_S4', 'pillar_S5', 'pillar_S6', 'pillar_S7', 'pillar_S8',
    ]);
  });

  test('Phase 0 : aucune intro même si un currentPillarId traîne', () => {
    expect(
      ids(listReplayableVideos({ narrativeFlags: { welcome_video: 'x' }, currentPhase: 'phase_0', currentPillarId: 'S2' })),
    ).toEqual(['welcome']);
  });

  test('currentPillarId inconnu → aucune intro', () => {
    expect(
      ids(listReplayableVideos({ narrativeFlags: phase0Flags, currentPhase: 'phase_1', currentPillarId: 'S9' })),
    ).toEqual(['welcome', 'j7', 'j14', 's0_1', 's0_2']);
  });
});
