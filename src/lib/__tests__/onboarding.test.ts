/**
 * Tests onboarding.ts — calcul profil dynamique P0-P8 depuis réponses.
 *
 * Ordre des conditions important (premier match gagne) — calqué V0.
 */

import { computeProfileDynamicId, parseOnboardingAnswers } from '../onboarding';

describe('onboarding.computeProfileDynamicId', () => {
  test('énergie ≤ 3 + corps Lourd + mental Agité → P1', () => {
    expect(
      computeProfileDynamicId({ energy: 2, body: 'Lourd', mental: 'Agité' }),
    ).toBe('P1');
  });
  test('énergie ≤ 3 seule → P2', () => {
    expect(
      computeProfileDynamicId({ energy: 3, body: 'Neutre', mental: 'Calme' }),
    ).toBe('P2');
  });
  test('corps Lourd + mental Agité (sans énergie basse) → P3', () => {
    expect(
      computeProfileDynamicId({ energy: 5, body: 'Lourd', mental: 'Agité' }),
    ).toBe('P3');
  });
  test('énergie ≥ 7 + motivation À fond → P4', () => {
    expect(
      computeProfileDynamicId({
        energy: 8,
        body: 'Léger',
        mental: 'Calme',
        motivation: 'À fond',
      }),
    ).toBe('P4');
  });
  test('énergie ≥ 7 sans motivation À fond → P5', () => {
    expect(
      computeProfileDynamicId({ energy: 8, body: 'Neutre', mental: 'Stable' }),
    ).toBe('P5');
  });
  test('corps Lourd seul → P6', () => {
    expect(
      computeProfileDynamicId({ energy: 5, body: 'Lourd', mental: 'Calme' }),
    ).toBe('P6');
  });
  test('mental Agité seul → P7', () => {
    expect(
      computeProfileDynamicId({ energy: 5, body: 'Léger', mental: 'Agité' }),
    ).toBe('P7');
  });
  test('motivation Un peu → P8', () => {
    expect(
      computeProfileDynamicId({
        energy: 5,
        body: 'Neutre',
        mental: 'Stable',
        motivation: 'Un peu',
      }),
    ).toBe('P8');
  });
  test('équilibré (rien ne match) → P0', () => {
    expect(
      computeProfileDynamicId({
        energy: 5,
        body: 'Neutre',
        mental: 'Stable',
        motivation: 'Sérieusement',
      }),
    ).toBe('P0');
  });
  test('answers vide → P0 (defaults)', () => {
    expect(computeProfileDynamicId({})).toBe('P0');
  });
});

describe('onboarding.parseOnboardingAnswers', () => {
  test('parse energy string → number', () => {
    expect(parseOnboardingAnswers({ energy: '5' }).energy).toBe(5);
  });
  test('parse energy number → number', () => {
    expect(parseOnboardingAnswers({ energy: 7 }).energy).toBe(7);
  });
  test('valeurs absentes → undefined', () => {
    const r = parseOnboardingAnswers({});
    expect(r.energy).toBeUndefined();
    expect(r.body).toBeUndefined();
  });
});
