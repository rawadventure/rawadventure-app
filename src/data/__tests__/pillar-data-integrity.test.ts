/**
 * Tests d'intégrité des données piliers S1-S8 — garde-fou anti-régression.
 *
 * Si quelqu'un édite un fichier s*-evaluation.ts ou s*-program.ts (ajout de
 * question, faute de structure, slot de copy manquant), ces tests cassent
 * immédiatement. Vérifie aussi les invariants produit :
 *  - 12 questions par évaluation (score /60, Métriques V1.5 §2.3)
 *  - diagnostics 5 niveaux complets
 *  - programme 7 jours (Feature Spec S1 §4.3, pattern Type A)
 *  - inversion Q6/Q7/Q8 en S1 (Feature Spec S1 §2.2)
 *  - slots de copy identifiés partout (D23 — pas de chaîne orpheline)
 *  - Type B = S5 et S7 (D41), ordre canonique D39
 */

import {
  PILLAR_ORDER_CANONICAL,
  getPillarMeta,
  getNextPillarId,
} from '../pillar-registry';
import { aggregateEvaluation, type RawResponse } from '../../lib/metrics';

const ALL_PILLARS = PILLAR_ORDER_CANONICAL.map((id) => ({
  id,
  meta: getPillarMeta(id)!,
}));

describe('registre des piliers', () => {
  test('ordre canonique D39 : 8 piliers S1 → S8', () => {
    expect(PILLAR_ORDER_CANONICAL).toEqual([
      'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8',
    ]);
  });

  test('chaque pilier de l ordre canonique a une meta enregistrée', () => {
    for (const { id, meta } of ALL_PILLARS) {
      expect(meta).toBeDefined();
      expect(meta.id).toBe(id);
    }
  });

  test('weekIndex suit l ordre canonique (1 à 8)', () => {
    ALL_PILLARS.forEach(({ meta }, idx) => {
      expect(meta.weekIndex).toBe(idx + 1);
    });
  });

  test('getNextPillarId chaîne S1→S2→…→S8→null', () => {
    for (let i = 0; i < 7; i++) {
      expect(getNextPillarId(PILLAR_ORDER_CANONICAL[i])).toBe(
        PILLAR_ORDER_CANONICAL[i + 1],
      );
    }
    expect(getNextPillarId('S8')).toBeNull();
  });

  test('D41 — piliers Type B : S5 et S7 uniquement', () => {
    const typeB = ALL_PILLARS.filter(({ meta }) => meta.type === 'B').map(
      ({ id }) => id,
    );
    expect(typeB.sort()).toEqual(['S5', 'S7']);
  });
});

describe.each(ALL_PILLARS)('intégrité des données $id', ({ meta }) => {
  test('évaluation : exactement 12 questions, ids 1-12 uniques', () => {
    expect(meta.questions).toHaveLength(12);
    expect([...meta.questions].map((q) => q.id).sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  test('chaque question a un texte et un slot de copy (D23)', () => {
    for (const q of meta.questions) {
      expect(q.text.trim().length).toBeGreaterThan(0);
      expect(q.copySlot).toMatch(/^copy\./);
    }
  });

  test('diagnostics : 5 niveaux complets avec label et message', () => {
    for (const level of [1, 2, 3, 4, 5] as const) {
      const d = meta.diagnostics[level];
      expect(d).toBeDefined();
      expect(d.level).toBe(level);
      expect(d.label.trim().length).toBeGreaterThan(0);
      expect(d.message.trim().length).toBeGreaterThan(0);
    }
  });

  test('programme : exactement 7 jours, ids 1-7 dans l ordre', () => {
    expect(meta.program).toHaveLength(7);
    expect([...meta.program].map((d) => d.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('chaque jour du programme a titre, objectif et slot de copy', () => {
    for (const day of meta.program) {
      expect(day.title.trim().length).toBeGreaterThan(0);
      expect(day.objective.trim().length).toBeGreaterThan(0);
      expect(day.copySlot).toMatch(/^copy\./);
    }
  });

  test('durées du paramètre principal : croissantes essentiel < progression < immersion', () => {
    const { essentiel, progression, immersion } = meta.durationsMin;
    expect(essentiel).toBeGreaterThan(0);
    expect(progression).toBeGreaterThanOrEqual(essentiel);
    expect(immersion).toBeGreaterThanOrEqual(progression);
  });

  test('le score /60 se calcule sans erreur depuis les questions du pilier', () => {
    const responses: RawResponse[] = [...meta.questions].map((q) => ({
      questionId: q.id,
      value: 3,
      reversed: q.reversed,
    }));
    const result = aggregateEvaluation(responses);
    // Toutes réponses à 3 : reversed donne 6-3=3 aussi → brut 36, milieu.
    expect(result.rawScore).toBe(36);
    expect(result.normalizedScore).toBe(50);
    expect(result.diagnostic).toBe(3);
  });
});

describe('S1 Respiration — spécificités Feature Spec S1 §2.2', () => {
  const s1 = getPillarMeta('S1')!;

  test('Q6, Q7, Q8 sont les seules questions inversées', () => {
    const reversedIds = [...s1.questions]
      .filter((q) => q.reversed)
      .map((q) => q.id);
    expect(reversedIds).toEqual([6, 7, 8]);
  });

  test('paramètre principal 5/10/20 min (Métriques V1.5, recalibré 13 mai 2026)', () => {
    expect(s1.durationsMin).toEqual({
      essentiel: 5,
      progression: 10,
      immersion: 20,
    });
  });

  test('réponses maximales avec inversion : un 5 sur Q6/Q7/Q8 pénalise le score', () => {
    // Tout à 5 (y compris les inversées) : 9×5 + 3×(6-5) = 48, pas 60.
    const responses: RawResponse[] = [...s1.questions].map((q) => ({
      questionId: q.id,
      value: 5,
      reversed: q.reversed,
    }));
    expect(aggregateEvaluation(responses).rawScore).toBe(48);
  });
});
