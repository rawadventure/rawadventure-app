/**
 * Tests d'intégration ProgressContext — cœur D38 (position par validation),
 * validation quotidienne (D6 5/7, D26, D27), streak/joker calendaire,
 * paliers (D29/D30), bascule Phase 1, pilier en cours.
 *
 * Le provider est rendu avec renderHook + wrapper, en mode anonyme
 * (AsyncStorage) par défaut. Supabase est mocké (voir supabaseMock.ts),
 * l'horloge est épinglée sur le jeudi 2026-10-15 (semaine ISO 2026-W42,
 * lundi 12 → dimanche 18) pour rendre les tests joker indépendants de la
 * date réelle du run.
 *
 * Réf : Feature Spec V1 Socle minimum §2.3-§2.6, décisions D6, D26, D27,
 * D29, D30, D38. Commentaire D38 en tête de ProgressContext.tsx.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

// ── Mocks (hoistés) ──────────────────────────────────────────────────────────

jest.mock('../../lib/supabase', () => {
  const { createSupabaseMock } = require('../../test-utils/supabaseMock');
  const m = createSupabaseMock();
  return { supabase: m.client, __supabaseMock: m };
});

let mockUser: { id: string } | null = null;
jest.mock('../AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock('../../lib/notice', () => ({ showNotice: jest.fn() }));

import { showNotice } from '../../lib/notice';
import { useProgress } from '../ProgressContext';
import {
  daysAgo,
  entry,
  pinClockTo,
  progressWrapper,
  seedAnonymousStorage,
  today,
  unpinClock,
  validatedRun,
} from '../../test-utils/harness';
import { addDays } from '../../lib/calendar';
import { advanceDevClock } from '../../lib/devClock';

const { __supabaseMock: sb } = jest.requireMock('../../lib/supabase') as {
  __supabaseMock: import('../../test-utils/supabaseMock').SupabaseMock;
};

// Jeudi — semaine ISO 2026-W42 (lundi 2026-10-12 → dimanche 2026-10-18).
const THURSDAY = '2026-10-15';

async function renderProgress() {
  const utils = await renderHook(() => useProgress(), { wrapper: progressWrapper });
  await waitFor(() => expect(utils.result.current.loading).toBe(false));
  return utils;
}

beforeEach(async () => {
  mockUser = null;
  sb.reset();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  pinClockTo(THURSDAY);
});

afterEach(() => {
  unpinClock();
});

// ─── Position D38 ─────────────────────────────────────────────────────────────

describe('position D38 — currentDay = jours validés + 1', () => {
  test('sans compte : currentDay = 0', async () => {
    const { result } = await renderProgress();
    expect(result.current.currentDay).toBe(0);
  });

  test('compte créé aujourd hui, rien validé : currentDay = 1', async () => {
    await seedAnonymousStorage({ history: [] });
    const { result } = await renderProgress();
    expect(result.current.currentDay).toBe(1);
  });

  test('4 jours validés, aujourd hui pas validé : currentDay = 5', async () => {
    await seedAnonymousStorage({ history: validatedRun(4) });
    const { result } = await renderProgress();
    expect(result.current.currentDay).toBe(5);
    expect(result.current.streak).toBe(4);
  });

  test('valider aujourd hui n avance PAS currentDay (max 1 jour de parcours par jour réel)', async () => {
    await seedAnonymousStorage({ history: validatedRun(4) });
    const { result } = await renderProgress();
    expect(result.current.currentDay).toBe(5);
    await act(async () => {
      await result.current.validateDay({ actionsCount: 5, day: 5 });
    });
    // Journée validée → on reste sur le jour 5 (validations=5, alreadyToday).
    expect(result.current.currentDay).toBe(5);
    // Le lendemain, le jour 6 s'ouvre.
    await act(async () => advanceDevClock(1));
    await waitFor(() => expect(result.current.currentDay).toBe(6));
  });

  test('PAUSE en absence : la position ne bouge pas, seuls streak/joker sont touchés', async () => {
    // 3 jours validés (lun 12 → mer 14... en réalité se terminant il y a 3
    // jours : 10, 11, 12 oct), puis 2 jours d'absence (13 et 14 oct).
    await seedAnonymousStorage({ history: validatedRun(3, daysAgo(3)) });
    const { result } = await renderProgress();
    // La cohérence résout les jours manqués : position INCHANGÉE (D38).
    await waitFor(() => {
      expect(
        result.current.streakHistory.some(
          (e) => e.validation_status !== 'valid_above_threshold',
        ),
      ).toBe(true);
    });
    expect(result.current.currentDay).toBe(4); // 3 validés + 1 — pas 6
  });

  test('message de reprise sobre au retour d absence (D38, 8 juillet 2026)', async () => {
    await seedAnonymousStorage({ history: validatedRun(3, daysAgo(3)) });
    await renderProgress();
    await waitFor(() => expect(showNotice).toHaveBeenCalled());
    const [, message] = (showNotice as jest.Mock).mock.calls[0];
    expect(message).toContain('Tu reprends au jour 4');
  });
});

// ─── Validation quotidienne (D6 / D26 / D27) ─────────────────────────────────

describe('validateDay — cas A/B et seuils Phase 0', () => {
  test('cas A : 5/7 → valid_above_threshold, streak +1, pas de joker', async () => {
    await seedAnonymousStorage({ history: validatedRun(2) });
    const { result } = await renderProgress();
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({ actionsCount: 5, day: 3 });
    });
    expect(res.newStreak).toBe(3);
    expect(res.jokerUsed).toBe(false);
    const todayEntry = result.current.streakHistory.find(
      (e) => e.local_date === today(),
    );
    expect(todayEntry?.validation_status).toBe('valid_above_threshold');
  });

  test('cas A : 7/7 → valid_above_threshold', async () => {
    await seedAnonymousStorage({ history: [] });
    const { result } = await renderProgress();
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({ actionsCount: 7, day: 1 });
    });
    expect(res.newStreak).toBe(1);
  });

  test('cas B : 4/7 validé quand même + joker dispo → valid_with_joker, streak conservé, joker consommé', async () => {
    await seedAnonymousStorage({ history: validatedRun(3) });
    const { result } = await renderProgress();
    expect(result.current.jokerAvailable).toBe(true);
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({
        actionsCount: 4,
        day: 4,
        userValidatedManually: true,
      });
    });
    expect(res.jokerUsed).toBe(true);
    expect(res.newStreak).toBe(3); // conservé, PAS +1
    await waitFor(() => expect(result.current.jokerAvailable).toBe(false));
    const todayEntry = result.current.streakHistory.find(
      (e) => e.local_date === today(),
    );
    expect(todayEntry?.validation_status).toBe('valid_with_joker');
  });

  test('cas B compte comme jour de PROGRESSION (D38) : currentDay avance le lendemain', async () => {
    await seedAnonymousStorage({ history: validatedRun(3) });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.validateDay({
        actionsCount: 2,
        day: 4,
        userValidatedManually: true,
      });
    });
    await act(async () => advanceDevClock(1));
    await waitFor(() => expect(result.current.currentDay).toBe(5)); // 4 validés + 1
  });

  test('cas B sans joker (déjà consommé cette semaine) → broken_streak, streak 0', async () => {
    await seedAnonymousStorage({
      history: validatedRun(6),
      jokerConsumptions: [
        // Joker déjà consommé mardi de la même semaine ISO.
        { week_key: '2026-W42', consumed_for_local_date: '2026-10-13' },
      ],
    });
    const { result } = await renderProgress();
    expect(result.current.jokerAvailable).toBe(false);
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({
        actionsCount: 3,
        day: 7,
        userValidatedManually: true,
      });
    });
    expect(res.newStreak).toBe(0);
    expect(res.jokerUsed).toBe(false);
    const todayEntry = result.current.streakHistory.find(
      (e) => e.local_date === today(),
    );
    expect(todayEntry?.validation_status).toBe('broken_streak');
  });

  test('re-validation du même jour : remplace l entrée, pas de doublon (D27)', async () => {
    await seedAnonymousStorage({ history: [] });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.validateDay({ actionsCount: 5, day: 1 });
      await result.current.validateDay({ actionsCount: 6, day: 1 });
    });
    const todayEntries = result.current.streakHistory.filter(
      (e) => e.local_date === today(),
    );
    expect(todayEntries).toHaveLength(1);
  });

  test('seuil Phase 1 : 1 session / 3 suffit', async () => {
    await seedAnonymousStorage({ history: validatedRun(2) });
    const { result } = await renderProgress();
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({
        actionsCount: 1,
        phase: 'phase_1',
      });
    });
    expect(res.newStreak).toBe(3);
    const todayEntry = result.current.streakHistory.find(
      (e) => e.local_date === today(),
    );
    expect(todayEntry?.validation_status).toBe('valid_above_threshold');
    expect(todayEntry?.phase).toBe('phase_1');
  });
});

// ─── Cohérence calendaire — jours manqués (Cas C, audit B1) ──────────────────

describe('cohérence calendaire — résolution des jours manqués', () => {
  test('1 jour manqué, streak > 0, joker dispo → missed_with_joker, streak conservé', async () => {
    await seedAnonymousStorage({ history: validatedRun(3, daysAgo(2)) });
    const { result } = await renderProgress();
    await waitFor(() => {
      const missed = result.current.streakHistory.find(
        (e) => e.local_date === daysAgo(1),
      );
      expect(missed?.validation_status).toBe('missed_with_joker');
    });
    expect(result.current.streak).toBe(3);
    // Jour manqué couvert ≠ progression : position inchangée.
    expect(result.current.currentDay).toBe(4);
    expect(showNotice).toHaveBeenCalledWith(
      'Joker utilisé',
      expect.stringContaining('joker'),
    );
  });

  test('2 jours manqués même semaine, 1 seul joker → 2e jour = cassure', async () => {
    await seedAnonymousStorage({ history: validatedRun(3, daysAgo(3)) });
    const { result } = await renderProgress();
    await waitFor(() => expect(result.current.streak).toBe(0));
    const d1 = result.current.streakHistory.find(
      (e) => e.local_date === daysAgo(2),
    );
    const d2 = result.current.streakHistory.find(
      (e) => e.local_date === daysAgo(1),
    );
    expect(d1?.validation_status).toBe('missed_with_joker');
    expect(d2?.validation_status).toBe('broken_streak');
    expect(showNotice).toHaveBeenCalledWith(
      'Streak remis à zéro',
      expect.anything(),
    );
  });

  test('streak déjà à 0 : le joker n est PAS consommé sur un jour manqué (choix 7 juillet 2026)', async () => {
    await seedAnonymousStorage({
      history: [
        entry(daysAgo(3), 0, { status: 'broken_streak' }),
      ],
    });
    const { result } = await renderProgress();
    await waitFor(() => {
      expect(
        result.current.streakHistory.filter((e) => e.local_date > daysAgo(3)),
      ).toHaveLength(2);
    });
    // Tous les jours manqués sont broken, aucun joker consommé.
    expect(
      result.current.streakHistory
        .filter((e) => e.local_date > daysAgo(3))
        .every((e) => e.validation_status === 'broken_streak'),
    ).toBe(true);
    expect(result.current.jokerAvailable).toBe(true);
  });

  test('aujourd hui n est jamais résolu : journée encore ouverte', async () => {
    await seedAnonymousStorage({ history: validatedRun(3) }); // se termine hier
    const { result } = await renderProgress();
    // Laisse la cohérence tourner puis vérifie qu'aucune entrée today n'existe.
    await act(async () => {});
    expect(
      result.current.streakHistory.find((e) => e.local_date === today()),
    ).toBeUndefined();
    expect(showNotice).not.toHaveBeenCalled();
  });

  test('changement de jour au premier plan (clockEpoch) déclenche la cohérence', async () => {
    await seedAnonymousStorage({ history: validatedRun(3) });
    const { result } = await renderProgress();
    expect(result.current.streak).toBe(3);
    // Avance d'1 jour : le jour sauté devient manqué (hier du nouveau today).
    await act(async () => advanceDevClock(1));
    await waitFor(() => {
      const missed = result.current.streakHistory.find(
        (e) => e.validation_status === 'missed_with_joker',
      );
      expect(missed).toBeDefined();
    });
    expect(result.current.streak).toBe(3); // couvert par joker
  });
});

// ─── Régression : course cohérence (cassure) vs validation (streak périmé) ───
// Bug salve manuelle 2 sept 2026 (test F4). Scénario : 14 jours validés
// (streak 14) → absence de 4 jours réels → la cohérence casse le streak à 0,
// MAIS une validation dont la référence a été capturée AVANT la cassure (handler
// UI lié pendant la fenêtre réseau de la cohérence en mode connecté) recalcule
// newStreak à partir du streak périmé (14+1=15) au lieu du streak à jour (0+1=1).
// L'entrée du jour (date la plus récente) gagne dans currentStreakFromHistory →
// header affiche 15. Réf mémoire anomalie-streak-f4, décisions D6/D38.
describe('régression F4 — validation avec streak périmé après cassure de cohérence', () => {
  test('valider le jour 15 après une cassure (absence 4j) repart de 1, pas de 15', async () => {
    // 14 jours validés se terminant hier → streak 14, position jour 15.
    await seedAnonymousStorage({ history: validatedRun(14) });
    const { result } = await renderProgress();
    expect(result.current.streak).toBe(14);
    expect(result.current.currentDay).toBe(15);

    // Capture une référence de validateDay AVANT l'absence : elle ferme sur
    // streak = 14 (reproduit un handler UI lié avant que la cohérence commit).
    const staleValidate = result.current.validateDay;

    // Absence de 4 jours réels : la cohérence casse le streak (1 couvert joker,
    // le reste casse). Position inchangée (D38).
    await act(async () => advanceDevClock(4));
    await waitFor(() => expect(result.current.streak).toBe(0));
    expect(result.current.currentDay).toBe(15); // position pausée (D38)

    // Validation du jour 15 via la référence périmée.
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await staleValidate({ actionsCount: 5, day: 15 });
    });

    // Le streak doit repartir de 1 (0 cassé + 1), PAS de 15.
    expect(res.newStreak).toBe(1);
    await waitFor(() => expect(result.current.streak).toBe(1));
  });
});

// ─── Paliers streak (D29 / D30) ──────────────────────────────────────────────

describe('paliers streak — D29 premier franchissement vs redéclenchement', () => {
  test('streak 14 → 15 : palier 15 franchi, premier franchissement', async () => {
    await seedAnonymousStorage({ history: validatedRun(14) });
    const { result } = await renderProgress();
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({ actionsCount: 5, day: 15 });
    });
    expect(res.newStreak).toBe(15);
    expect(res.tierReached).toBe(15);
    expect(res.tierIsFirstReach).toBe(true);
    const reach = result.current.tierReaches.find((t) => t.tier_id === 15);
    expect(reach?.reach_count).toBe(1);
  });

  test('re-franchissement après cassure : tierIsFirstReach = false, reach_count incrémenté', async () => {
    await seedAnonymousStorage({
      history: validatedRun(14),
      tierReaches: [
        {
          tier_id: 15,
          first_reached_at: '2026-09-01T10:00:00.000Z',
          last_reached_at: '2026-09-01T10:00:00.000Z',
          reach_count: 1,
        },
      ],
    });
    const { result } = await renderProgress();
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({ actionsCount: 5 });
    });
    expect(res.tierReached).toBe(15);
    expect(res.tierIsFirstReach).toBe(false);
    const reach = result.current.tierReaches.find((t) => t.tier_id === 15);
    expect(reach?.reach_count).toBe(2);
  });

  test('streak 15 → 16 : aucun palier', async () => {
    await seedAnonymousStorage({ history: validatedRun(15) });
    const { result } = await renderProgress();
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({ actionsCount: 5 });
    });
    expect(res.newStreak).toBe(16);
    expect(res.tierReached).toBeNull();
  });

  test('pas de palier 7 jours (retiré 1er juillet 2026 — J7 = charnière, pas récompense)', async () => {
    await seedAnonymousStorage({ history: validatedRun(6) });
    const { result } = await renderProgress();
    let res!: Awaited<ReturnType<typeof result.current.validateDay>>;
    await act(async () => {
      res = await result.current.validateDay({ actionsCount: 5, day: 7 });
    });
    expect(res.newStreak).toBe(7);
    expect(res.tierReached).toBeNull();
  });

  test('D30 — palier différé : setPendingTier / clearPendingTier persistent', async () => {
    await seedAnonymousStorage({ history: [] });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.setPendingTier({
        tierId: 15,
        isFirstReach: true,
        streakValue: 15,
        deferredAt: new Date().toISOString(),
      });
    });
    expect(result.current.pendingTierReach?.tierId).toBe(15);
    const stored = await AsyncStorage.getItem('pending_tier_reach');
    expect(stored).not.toBeNull();
    await act(async () => {
      await result.current.clearPendingTier();
    });
    expect(result.current.pendingTierReach).toBeNull();
    expect(await AsyncStorage.getItem('pending_tier_reach')).toBeNull();
  });
});

// ─── Écrans narratifs (flags §2.3) ───────────────────────────────────────────

describe('narrative flags — un écran narratif ne se joue qu une fois', () => {
  test('markNarrativeSeen pose un timestamp et persiste', async () => {
    await seedAnonymousStorage({ history: [] });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.markNarrativeSeen('j3_charniere');
    });
    expect(result.current.narrativeFlags.j3_charniere).toBeDefined();
    const raw = await AsyncStorage.getItem('narrative_flags');
    expect(JSON.parse(raw!).j3_charniere).toBeDefined();
  });

  test('markNarrativeSeen est idempotent : le timestamp du premier vu est conservé', async () => {
    await seedAnonymousStorage({ history: [] });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.markNarrativeSeen('welcome_video');
    });
    const first = result.current.narrativeFlags.welcome_video;
    await act(async () => {
      await result.current.markNarrativeSeen('welcome_video');
    });
    expect(result.current.narrativeFlags.welcome_video).toBe(first);
  });

  test('les flags seedés sont rechargés au boot', async () => {
    await seedAnonymousStorage({
      history: [],
      narrativeFlags: { welcome_video: '2026-10-01T08:00:00.000Z' },
    });
    const { result } = await renderProgress();
    expect(result.current.narrativeFlags.welcome_video).toBe(
      '2026-10-01T08:00:00.000Z',
    );
  });
});

// ─── Phases et pilier en cours ───────────────────────────────────────────────

describe('currentPhase — Phase 0 (J1-J16 incl. S0) puis Phase 1', () => {
  test('15 jours validés → currentDay 16 (S0.2) → encore phase_0', async () => {
    await seedAnonymousStorage({ history: validatedRun(15) });
    const { result } = await renderProgress();
    expect(result.current.currentDay).toBe(16);
    expect(result.current.currentPhase).toBe('phase_0');
  });

  test('16 jours validés → currentDay 17 → phase_1 (bascule par POSITION, pas calendaire)', async () => {
    await seedAnonymousStorage({ history: validatedRun(16) });
    const { result } = await renderProgress();
    expect(result.current.currentDay).toBe(17);
    expect(result.current.currentPhase).toBe('phase_1');
  });
});

describe('pilier en cours — dayInPillarWeek (même logique D38)', () => {
  test('startPillarWeek pose currentPillarId + dayInPillarWeek = 1', async () => {
    await seedAnonymousStorage({ history: validatedRun(16) });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.startPillarWeek('S1');
    });
    expect(result.current.currentPillarId).toBe('S1');
    expect(result.current.dayInPillarWeek).toBe(1);
  });

  test('valider un jour phase_1 : reste sur le jour ; lendemain : jour suivant', async () => {
    await seedAnonymousStorage({ history: validatedRun(16) });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.startPillarWeek('S1');
      await result.current.validateDay({ actionsCount: 1, phase: 'phase_1' });
    });
    expect(result.current.dayInPillarWeek).toBe(1);
    await act(async () => advanceDevClock(1));
    await waitFor(() => expect(result.current.dayInPillarWeek).toBe(2));
  });

  test('dayInPillarWeek est plafonné à 7', async () => {
    const started = addDays(today(), -10);
    await seedAnonymousStorage({
      history: [
        ...validatedRun(16, addDays(today(), -11)),
        ...validatedRun(9, daysAgo(1), 'phase_1'),
      ],
      currentPillarId: 'S1',
      pillarStartedAt: `${started}T08:00:00.000Z`,
    });
    const { result } = await renderProgress();
    expect(result.current.dayInPillarWeek).toBe(7);
  });
});

// ─── Onboarding ──────────────────────────────────────────────────────────────

describe('completeOnboarding', () => {
  test('pose onboardingDone + accountCreatedAt et persiste en anonyme', async () => {
    const { result } = await renderProgress();
    expect(result.current.onboardingDone).toBe(false);
    await act(async () => {
      await result.current.completeOnboarding({ q1: 'a' }, 'profil-terrain');
    });
    expect(result.current.onboardingDone).toBe(true);
    expect(result.current.profileDynamicId).toBe('profil-terrain');
    expect(result.current.accountCreatedAt).not.toBeNull();
    expect(await AsyncStorage.getItem('onboarding_done')).toBe('true');
  });

  test('ne réécrase pas un accountCreatedAt existant', async () => {
    await seedAnonymousStorage({
      history: [],
      accountCreatedAt: '2026-10-01T09:00:00.000Z',
    });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.completeOnboarding({});
    });
    expect(result.current.accountCreatedAt).toBe('2026-10-01T09:00:00.000Z');
  });
});

// ─── Mode connecté (Supabase) ────────────────────────────────────────────────

describe('mode connecté — écritures Supabase', () => {
  beforeEach(() => {
    mockUser = { id: 'user-1' };
    sb.setTables({
      profiles: {
        id: 'user-1',
        onboarding_done: true,
        onboarding_data: {},
        profile_dynamic_id: null,
        account_created_at: '2026-10-12T08:00:00.000Z',
      },
      streak_history: validatedRun(3),
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [],
    });
  });

  test('hydrate le state depuis les tables distantes', async () => {
    const { result } = await renderProgress();
    expect(result.current.onboardingDone).toBe(true);
    expect(result.current.streak).toBe(3);
    expect(result.current.currentDay).toBe(4);
  });

  test('validateDay upsert dans streak_history avec user_id', async () => {
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.validateDay({ actionsCount: 5, day: 4 });
    });
    const upserts = sb.calls.filter(
      (c) => c.table === 'streak_history' && c.op === 'upsert',
    );
    expect(upserts.length).toBeGreaterThanOrEqual(1);
    const payload = upserts[upserts.length - 1].payload as Record<string, unknown>;
    expect(payload.user_id).toBe('user-1');
    expect(payload.local_date).toBe(today());
    expect(payload.validation_status).toBe('valid_above_threshold');
  });

  test('validateDay Phase 0 avec day → upsert progress (traçabilité serveur)', async () => {
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.validateDay({ actionsCount: 6, day: 4 });
    });
    const progressUpserts = sb.calls.filter(
      (c) => c.table === 'progress' && c.op === 'upsert',
    );
    expect(progressUpserts).toHaveLength(1);
    const payload = progressUpserts[0].payload as Record<string, unknown>;
    expect(payload.day_id).toBe(4);
    expect(payload.is_minimum).toBe(false);
  });

  test('savePillarEvaluation upsert pillar_evaluations', async () => {
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.savePillarEvaluation({
        pillarId: 'S1',
        evaluationType: 'initial',
        responses: Array.from({ length: 12 }, (_, i) => ({
          question_id: i + 1,
          value: 3 as const,
        })),
        rawScore: 36,
        normalizedScore: 50,
        diagnosticLevel: 3,
        engagementLevelRecommended: 'progression',
        engagementLevelChosen: 'progression',
      });
    });
    const upserts = sb.calls.filter((c) => c.table === 'pillar_evaluations');
    expect(upserts).toHaveLength(1);
    const payload = upserts[0].payload as Record<string, unknown>;
    expect(payload.pillar_id).toBe('S1');
    expect(payload.raw_score).toBe(36);
  });

  test('éval finale S8 enregistrée → bascule post_s8 (mode consolidation)', async () => {
    const { result } = await renderProgress();
    expect(result.current.currentPhase).toBe('phase_0');
    await act(async () => {
      await result.current.savePillarEvaluation({
        pillarId: 'S8',
        evaluationType: 'final',
        responses: Array.from({ length: 12 }, (_, i) => ({
          question_id: i + 1,
          value: 4 as const,
        })),
        rawScore: 48,
        normalizedScore: 75,
        diagnosticLevel: 4,
        engagementLevelRecommended: 'progression',
        engagementLevelChosen: 'progression',
      });
    });
    expect(result.current.currentPhase).toBe('post_s8');
  });
});
