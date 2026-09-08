/**
 * devTimelinePresets.test.ts — invariants de cohérence des snapshots préset DEV.
 *
 * Verrouille les mêmes règles que le validator runtime de applyTimelineSnapshot
 * (§5 de devTimeline.ts), mais statiquement à la suite Jest : un preset
 * incohérent (currentDay / streak / pilier) est détecté avant d'arriver
 * dans le panneau DEV.
 *
 * Couvre aussi les presets « SN J1 fresh » ajoutés pour la salve de tests
 * Phase 1 S1-S8 (un point d'entrée direct par pilier).
 */

import { TIMELINE_PRESETS } from '../devTimelinePresets';
import type { TimelineSnapshot } from '../devTimeline';

const PILLAR_ORDER = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] as const;

function byId(id: string): TimelineSnapshot {
  const preset = TIMELINE_PRESETS.find((p) => p.id === id);
  if (!preset) throw new Error(`Preset introuvable : ${id}`);
  return preset;
}

describe('devTimelinePresets — invariants globaux', () => {
  it('ids uniques', () => {
    const ids = TIMELINE_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cohérence streak ≤ jours validés (formule du validator runtime)', () => {
    for (const p of TIMELINE_PRESETS) {
      const validatedCount = p.alreadyValidatedToday ? p.currentDay : p.currentDay - 1;
      expect(p.streakValue).toBeLessThanOrEqual(validatedCount);
      expect(p.streakValue).toBeGreaterThanOrEqual(0);
    }
  });

  it('presets phase_1 : pillarId + dayInPillarWeek 1-7 obligatoires', () => {
    for (const p of TIMELINE_PRESETS) {
      if (p.phase !== 'phase_1') continue;
      expect(p.pillarId).toBeDefined();
      expect(p.dayInPillarWeek).toBeGreaterThanOrEqual(1);
      expect(p.dayInPillarWeek).toBeLessThanOrEqual(7);
    }
  });

  it('presets phase_1 : currentDay aligné sur le pilier (17 + idx×7 + jour − 1)', () => {
    for (const p of TIMELINE_PRESETS) {
      if (p.phase !== 'phase_1' || !p.pillarId || !p.dayInPillarWeek) continue;
      const idx = PILLAR_ORDER.indexOf(p.pillarId);
      expect(p.currentDay).toBe(17 + idx * 7 + (p.dayInPillarWeek - 1));
    }
  });

  it('sessionsValidatedToday seulement si alreadyValidatedToday', () => {
    for (const p of TIMELINE_PRESETS) {
      if (p.sessionsValidatedToday && p.sessionsValidatedToday.length > 0) {
        expect(p.alreadyValidatedToday).toBe(true);
      }
    }
  });
});

describe('devTimelinePresets — points d\'entrée salve Phase 1 (un J1 par pilier)', () => {
  // Salve de tests contenu S1-S8 : chaque pilier doit avoir un preset
  // « J1 fresh » pour un saut direct sans rejouer les semaines précédentes.
  it.each([
    ['s1_j1_fresh', 'S1', 17],
    ['s2_j1_fresh', 'S2', 24],
    ['s3_j1_fresh', 'S3', 31],
    ['s4_j1_fresh', 'S4', 38],
    ['s5_j1_fresh', 'S5', 45],
    ['s6_j1_fresh', 'S6', 52],
    ['s7_j1_fresh', 'S7', 59],
    ['s8_j1_fresh', 'S8', 66],
  ])('%s → %s jour %i, J1 vierge', (id, pillarId, currentDay) => {
    const p = byId(id);
    expect(p.phase).toBe('phase_1');
    expect(p.pillarId).toBe(pillarId);
    expect(p.dayInPillarWeek).toBe(1);
    expect(p.currentDay).toBe(currentDay);
    expect(p.alreadyValidatedToday).toBe(false);
    expect(p.hasInitialEvalCurrent).toBe(false);
    expect(p.hasFinalEvalCurrent).toBe(false);
    expect(p.streakValue).toBe(currentDay - 1);
    expect(p.s8FinalCompleted).toBe(false);
  });
});
