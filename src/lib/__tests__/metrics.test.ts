/**
 * Tests metrics.ts — calcul scores évaluation 12 questions.
 *
 * Tests prioritaires : inversion sémantique Q6/Q7/Q8 (Feature Spec S1 §2.2),
 * normalisation 12-60 → 0-100, diagnostic 5 niveaux par quintiles, mapping
 * D40 diagnostic → engagement plafonné Progression.
 */

import {
  aggregateEvaluation,
  computeRawScore,
  diagnosticLevel,
  engagementFromDiagnostic,
  normalizeScore,
  type RawResponse,
} from '../metrics';

function makeResponses(values: number[]): RawResponse[] {
  return values.map((v, idx) => ({
    questionId: idx + 1,
    value: v as 1 | 2 | 3 | 4 | 5,
    reversed: false,
  }));
}

describe('metrics.computeRawScore', () => {
  test('12 réponses à 1 → 12', () => {
    expect(computeRawScore(makeResponses(Array(12).fill(1)))).toBe(12);
  });
  test('12 réponses à 5 → 60', () => {
    expect(computeRawScore(makeResponses(Array(12).fill(5)))).toBe(60);
  });
  test('12 réponses à 3 → 36', () => {
    expect(computeRawScore(makeResponses(Array(12).fill(3)))).toBe(36);
  });
  test('inversion sémantique : réponse 4 sur question reversed → 2', () => {
    const r: RawResponse[] = [
      ...makeResponses(Array(11).fill(3)), // 33
      { questionId: 12, value: 4, reversed: true }, // utilisé = 6-4 = 2
    ];
    expect(computeRawScore(r)).toBe(35);
  });
  test('Q6/Q7/Q8 inversées toutes à 1 (réel) → utilisées = 5 chacune', () => {
    const r: RawResponse[] = makeResponses(Array(12).fill(3));
    r[5].reversed = true; // Q6
    r[5].value = 1;
    r[6].reversed = true; // Q7
    r[6].value = 1;
    r[7].reversed = true; // Q8
    r[7].value = 1;
    // 9 questions à 3 = 27 + 3 questions utilisées à 5 = 15 → 42
    expect(computeRawScore(r)).toBe(42);
  });
  test('throw si pas 12 réponses', () => {
    expect(() => computeRawScore(makeResponses([1, 2, 3]))).toThrow();
  });
});

describe('metrics.normalizeScore', () => {
  test('brut 12 → 0', () => {
    expect(normalizeScore(12)).toBe(0);
  });
  test('brut 60 → 100', () => {
    expect(normalizeScore(60)).toBe(100);
  });
  test('brut 36 → 50 (milieu)', () => {
    expect(normalizeScore(36)).toBe(50);
  });
  test('brut 30 → ≈ 37.5', () => {
    expect(normalizeScore(30)).toBeCloseTo(37.5, 1);
  });
  test('throw si hors plage', () => {
    expect(() => normalizeScore(11)).toThrow();
    expect(() => normalizeScore(61)).toThrow();
  });
});

describe('metrics.diagnosticLevel — seuils symétriques quintiles', () => {
  test('12-21 → niveau 1', () => {
    expect(diagnosticLevel(12)).toBe(1);
    expect(diagnosticLevel(21)).toBe(1);
  });
  test('22-30 → niveau 2', () => {
    expect(diagnosticLevel(22)).toBe(2);
    expect(diagnosticLevel(30)).toBe(2);
  });
  test('31-40 → niveau 3', () => {
    expect(diagnosticLevel(31)).toBe(3);
    expect(diagnosticLevel(40)).toBe(3);
  });
  test('41-50 → niveau 4', () => {
    expect(diagnosticLevel(41)).toBe(4);
    expect(diagnosticLevel(50)).toBe(4);
  });
  test('51-60 → niveau 5', () => {
    expect(diagnosticLevel(51)).toBe(5);
    expect(diagnosticLevel(60)).toBe(5);
  });
  test('throw hors plage', () => {
    expect(() => diagnosticLevel(11)).toThrow();
    expect(() => diagnosticLevel(61)).toThrow();
  });
});

describe('metrics.engagementFromDiagnostic — D40 plafond Progression', () => {
  test('niveau 1 (Coûteuse) → Essentiel', () => {
    expect(engagementFromDiagnostic(1)).toBe('essentiel');
  });
  test('niveau 2 (Instable) → Essentiel', () => {
    expect(engagementFromDiagnostic(2)).toBe('essentiel');
  });
  test('niveau 3 (Adaptation) → Essentiel', () => {
    expect(engagementFromDiagnostic(3)).toBe('essentiel');
  });
  test('niveau 4 (Fonctionnelle) → Progression', () => {
    expect(engagementFromDiagnostic(4)).toBe('progression');
  });
  test('niveau 5 (Régulatrice) → Progression (jamais Immersion auto)', () => {
    expect(engagementFromDiagnostic(5)).toBe('progression');
  });
});

describe('metrics.aggregateEvaluation', () => {
  test('12 réponses à 5 → max sur tout', () => {
    const r = aggregateEvaluation(makeResponses(Array(12).fill(5)));
    expect(r.rawScore).toBe(60);
    expect(r.normalizedScore).toBe(100);
    expect(r.diagnostic).toBe(5);
    expect(r.recommendedEngagement).toBe('progression');
  });
  test('12 réponses à 1 → min', () => {
    const r = aggregateEvaluation(makeResponses(Array(12).fill(1)));
    expect(r.rawScore).toBe(12);
    expect(r.normalizedScore).toBe(0);
    expect(r.diagnostic).toBe(1);
    expect(r.recommendedEngagement).toBe('essentiel');
  });
});
