/**
 * global-copy — slots de copy transverses (D23 : tout texte affiché passe
 * par un slot identifié, pas de chaîne en dur dans la logique).
 *
 * F-13 (audit Lou) : les notices de cohérence calendaire vivaient en dur
 * dans useStreakDomain (ex-ProgressContext). Elles sont routées ici sous
 * les slots annoncés par le commentaire D26 :
 *   - copy.global.streak-remis-a-zero
 *   - copy.global.message-joker-consomme
 *   - copy.global.streak-reprise
 * Le texte reste un placeholder [copy à valider] jusqu'à validation
 * Mimi & Jacky — ce module fige l'emplacement, pas la formulation.
 */

import {
  repriseText,
  streakBrokenNotice,
  jokerUsedNotice,
  autoValidatedNotice,
} from '../global-copy';

describe('repriseText (copy.global.streak-reprise, D38)', () => {
  it('cite le jour de reprise en Phase 0', () => {
    expect(repriseText('phase_0', 5)).toContain('jour 5');
  });

  it('reste neutre hors Phase 0 (Phase 1 parle en jour de pilier)', () => {
    const text = repriseText('phase_1', 20);
    expect(text).not.toContain('20');
    expect(text.length).toBeGreaterThan(0);
  });
});

describe('streakBrokenNotice (copy.global.streak-remis-a-zero, D26)', () => {
  it('compose titre + corps avec la reprise et le marqueur placeholder', () => {
    const n = streakBrokenNotice('phase_0', 3);
    expect(n.title).toBe('Série remise à zéro');
    expect(n.body).toContain('repart de zéro');
    expect(n.body).toContain('jour 3');
    expect(n.body).toContain('[copy à valider]');
  });

  it('ne culpabilise pas : pas de pression par la perte (règles § 4)', () => {
    const n = streakBrokenNotice('phase_0', 3);
    expect(n.body).not.toMatch(/perds|perdu|dommage/i);
    expect(n.body).not.toContain('!');
  });
});

describe('jokerUsedNotice (copy.global.message-joker-consomme, D26)', () => {
  it('compose titre + corps avec la reprise et le marqueur placeholder', () => {
    const n = jokerUsedNotice('phase_1', 8);
    expect(n.title).toBe('Joker utilisé');
    expect(n.body).toContain('Série conservée');
    expect(n.body).toContain('[copy à valider]');
    expect(n.body).not.toContain('8'); // hors Phase 0 : formulation neutre
  });
});

describe('autoValidatedNotice (copy.global.journee-auto-validee, D44)', () => {
  test('une journée : hier, nombre d actions, marqueur placeholder', () => {
    const n = autoValidatedNotice([{ local_date: '2026-10-14', actionsCount: 5 }]);
    expect(n.title).toBe('Journée validée');
    expect(n.body).toContain('5 actions sur 7');
    expect(n.body).toContain('[copy à valider]');
  });

  test('plusieurs journées : formulation au pluriel', () => {
    const n = autoValidatedNotice([
      { local_date: '2026-10-13', actionsCount: 6 },
      { local_date: '2026-10-14', actionsCount: 5 },
    ]);
    expect(n.title).toBe('Journées validées');
    expect(n.body).toContain('2 journées');
  });

  test('ton : pas d exclamation, pas de pression', () => {
    const n = autoValidatedNotice([{ local_date: '2026-10-14', actionsCount: 5 }]);
    expect(n.body).not.toContain('!');
    expect(n.body).not.toMatch(/perds|perdu|dommage/i);
  });
});
