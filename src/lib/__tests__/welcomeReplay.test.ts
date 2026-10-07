/**
 * Tests welcomeReplay — règle d'affichage de « Revoir la vidéo de bienvenue »
 * (IA-12, retours testeurs beta, décision Stéphane 3 octobre 2026) :
 * lien discret sur l'accueil aux jours de position 1 à 3 (D38). L'entrée
 * Profil est devenue « Revoir les vidéos » (narrativeReplay.test.ts).
 */

import { canReplayWelcomeOnHome } from '../welcomeReplay';

describe('canReplayWelcomeOnHome — accueil IA-11, position J1 à J3', () => {
  const base = { currentPhase: 'phase_0' as const, welcomeSeen: true };

  test.each([1, 2, 3])('visible au jour %i', (currentDay) => {
    expect(canReplayWelcomeOnHome({ ...base, currentDay })).toBe(true);
  });

  test('absent au jour 0 (attente pré-Phase 0, vidéo pas encore jouée)', () => {
    expect(canReplayWelcomeOnHome({ ...base, currentDay: 0 })).toBe(false);
  });

  test('absent dès le jour 4', () => {
    expect(canReplayWelcomeOnHome({ ...base, currentDay: 4 })).toBe(false);
  });

  test('absent tant que la vidéo n a pas été vue une première fois', () => {
    expect(canReplayWelcomeOnHome({ ...base, currentDay: 1, welcomeSeen: false })).toBe(false);
  });

  test('absent hors Phase 0, même en jour 1 à 3 du pilier', () => {
    expect(
      canReplayWelcomeOnHome({ currentPhase: 'phase_1', currentDay: 2, welcomeSeen: true }),
    ).toBe(false);
  });
});
