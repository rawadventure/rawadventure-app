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

  test('re-validation du même jour : refusée, une seule entrée (D27 — garde ajoutée 1er oct 2026)', async () => {
    await seedAnonymousStorage({ history: [] });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.validateDay({ actionsCount: 5, day: 1 });
    });
    await expect(
      result.current.validateDay({ actionsCount: 6, day: 1 }),
    ).rejects.toThrow(/déjà validée/);
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
      'Série remise à zéro',
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

  // F-08 (audit Lou) : une écriture Supabase échouée (résolue { error },
  // jamais de throw) laissait le state React partir en avance sur la base —
  // au prochain lancement, la journée validée et le streak « revertaient »
  // en silence. validateDay doit persister d'abord et ne toucher au state
  // qu'en cas de succès : échec → streak inchangé, promesse rejetée.
  test('F-08 : validateDay avec upsert streak_history en erreur → streak inchangé, rejet', async () => {
    const { result } = await renderProgress();
    expect(result.current.streak).toBe(3);

    sb.failNext('streak_history', 'upsert', { message: 'réseau (simulé)' });
    await act(async () => {
      await expect(
        result.current.validateDay({ actionsCount: 5, day: 4 }),
      ).rejects.toThrow();
    });

    expect(result.current.streak).toBe(3);
    expect(
      result.current.streakHistory.some((e) => e.local_date === today()),
    ).toBe(false);
  });

  test('F-08 : resetAll avec delete en erreur → rejet (pas de reset silencieusement partiel)', async () => {
    const { result } = await renderProgress();
    sb.failNext('streak_history', 'delete', { message: 'réseau (simulé)' });
    await act(async () => {
      await expect(result.current.resetAll()).rejects.toThrow();
    });
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

// ─── Migration locale → distante (Feature Spec §2.10, Sprint B) ──────────────

describe('F-05.1 (audit Lou) — value du Provider mémoïsé', () => {
  // Avant le fix, le value était un objet littéral recréé à CHAQUE render du
  // Provider : tout changement d'état re-rendait tous les consommateurs et
  // refaisait tourner leurs effets — un des moteurs du cycle de bugs.
  test('re-render du Provider sans changement d état → même référence de contexte', async () => {
    const utils = await renderProgress();
    const first = utils.result.current;
    await act(async () => {
      utils.rerender({});
    });
    expect(utils.result.current).toBe(first);
  });
});

describe('F-04 (audit Lou) — état utilisateur connecté répliqué dans profiles', () => {
  const PROFILE_BASE = {
    id: 'user-1',
    onboarding_done: true,
    onboarding_data: {},
    profile_dynamic_id: null,
    account_created_at: '2026-10-01T08:00:00.000Z',
  };

  beforeEach(() => {
    mockUser = { id: 'user-1' };
    sb.setTables({
      profiles: PROFILE_BASE,
      streak_history: [],
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [],
    });
  });

  test('AsyncStorage vide + flags distants posés → vidéo J1 non rejouée (flags restaurés du remote)', async () => {
    sb.setTables({
      profiles: {
        ...PROFILE_BASE,
        narrative_flags: { welcome_video: '2026-10-01T09:00:00.000Z' },
      },
      streak_history: [],
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [],
    });
    const { result } = await renderProgress();
    expect(result.current.narrativeFlags.welcome_video).toBeDefined();
  });

  test('pilier en cours restauré depuis profiles (changement de téléphone, storage effacé)', async () => {
    sb.setTables({
      profiles: {
        ...PROFILE_BASE,
        current_pillar_id: 'S3',
        pillar_started_at: '2026-10-10T08:00:00.000Z',
        pending_tier_reach: {
          tierId: 15,
          isFirstReach: true,
          streakValue: 15,
          deferredAt: '2026-10-10T08:00:00.000Z',
        },
      },
      streak_history: [],
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [],
    });
    const { result } = await renderProgress();
    expect(result.current.currentPillarId).toBe('S3');
    expect(result.current.pendingTierReach).toMatchObject({ tierId: 15 });
  });

  test('merge union : flag local + flag distant → les deux présents', async () => {
    await AsyncStorage.setItem(
      'narrative_flags',
      JSON.stringify({ j3_charniere: 'local' }),
    );
    sb.setTables({
      profiles: {
        ...PROFILE_BASE,
        narrative_flags: { welcome_video: 'remote' },
      },
      streak_history: [],
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [],
    });
    const { result } = await renderProgress();
    expect(result.current.narrativeFlags.welcome_video).toBeDefined();
    expect(result.current.narrativeFlags.j3_charniere).toBeDefined();
  });

  test('fallback : Phase 1 sans current_pillar_id → pilier dérivé de la dernière pillar_evaluations (pas S1)', async () => {
    sb.setTables({
      profiles: PROFILE_BASE,
      // 17 jours validés → currentDay 18, phase_1.
      streak_history: validatedRun(17).map((e) => ({ user_id: 'user-1', ...e })),
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [
        {
          user_id: 'user-1',
          pillar_id: 'S1',
          evaluation_type: 'initial',
          completed_at: '2026-10-01T08:00:00.000Z',
        },
        {
          user_id: 'user-1',
          pillar_id: 'S2',
          evaluation_type: 'initial',
          completed_at: '2026-10-09T08:00:00.000Z',
        },
      ],
    });
    const { result } = await renderProgress();
    expect(result.current.currentPillarId).toBe('S2');
  });

  test('markNarrativeSeen connecté → write-through profiles.narrative_flags', async () => {
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.markNarrativeSeen('j3_charniere');
    });
    const updates = sb.calls.filter(
      (c) => c.table === 'profiles' && c.op === 'update',
    );
    const withFlags = updates.filter(
      (u) => (u.payload as Record<string, unknown>).narrative_flags != null,
    );
    expect(withFlags.length).toBeGreaterThanOrEqual(1);
    expect(
      (withFlags[withFlags.length - 1].payload as {
        narrative_flags: Record<string, string>;
      }).narrative_flags.j3_charniere,
    ).toBeDefined();
  });

  test('startPillarWeek connecté → write-through current_pillar_id + pillar_started_at', async () => {
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.startPillarWeek('S2');
    });
    const updates = sb.calls.filter(
      (c) =>
        c.table === 'profiles' &&
        c.op === 'update' &&
        (c.payload as Record<string, unknown>).current_pillar_id === 'S2',
    );
    expect(updates).toHaveLength(1);
    expect(
      (updates[0].payload as Record<string, unknown>).pillar_started_at,
    ).toBeTruthy();
  });

  test('setPendingTier / clearPendingTier connecté → write-through pending_tier_reach', async () => {
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.setPendingTier({
        tierId: 15,
        isFirstReach: true,
        streakValue: 15,
        deferredAt: '2026-10-15T08:00:00.000Z',
      });
    });
    let updates = sb.calls.filter(
      (c) =>
        c.table === 'profiles' &&
        c.op === 'update' &&
        (c.payload as Record<string, unknown>).pending_tier_reach != null,
    );
    expect(updates).toHaveLength(1);

    await act(async () => {
      await result.current.clearPendingTier();
    });
    updates = sb.calls.filter(
      (c) =>
        c.table === 'profiles' &&
        c.op === 'update' &&
        'pending_tier_reach' in (c.payload as Record<string, unknown>) &&
        (c.payload as Record<string, unknown>).pending_tier_reach === null,
    );
    expect(updates).toHaveLength(1);
  });
});

describe('migration locale → distante (§2.10)', () => {
  const ISO = '2026-10-15T08:00:00.000Z';

  test('markPendingMigration expose le state et persiste en AsyncStorage', async () => {
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.markPendingMigration('u1', ISO, 'a@b.c');
    });
    expect(result.current.pendingMigration).toEqual({
      userId: 'u1',
      accountCreatedAt: ISO,
      email: 'a@b.c',
    });
    const raw = await AsyncStorage.getItem('pending_migration');
    expect(JSON.parse(raw!)).toMatchObject({ userId: 'u1' });
  });

  test('pendingMigration est restaurée depuis AsyncStorage au boot (reload PWA)', async () => {
    await AsyncStorage.setItem(
      'pending_migration',
      JSON.stringify({ userId: 'u1', accountCreatedAt: ISO, email: 'a@b.c' }),
    );
    const { result } = await renderProgress();
    expect(result.current.pendingMigration).toMatchObject({ userId: 'u1' });
  });

  test('session arrivée avec userId correspondant → migration déclenchée puis pendingMigration effacée', async () => {
    // Flow réel : parcours anonyme en mémoire, signup, puis la session arrive.
    await seedAnonymousStorage({ history: validatedRun(3) });
    const utils = await renderProgress();
    await act(async () => {
      await utils.result.current.markPendingMigration('u1', ISO, 'a@b.c');
    });
    expect(sb.calls.filter((c) => c.table === 'profiles')).toHaveLength(0);

    mockUser = { id: 'u1' };
    await act(async () => {
      utils.rerender({});
    });

    // Update du profil distant : onboarding + account_created_at.
    await waitFor(() => {
      const updates = sb.calls.filter(
        (c) => c.table === 'profiles' && c.op === 'update',
      );
      expect(updates).toHaveLength(1);
      expect(updates[0].payload).toMatchObject({
        onboarding_done: true,
        account_created_at: ISO,
      });
    });
    // Historique streak migré (3 jours validés en anonyme).
    await waitFor(() => {
      const upserts = sb.calls.filter(
        (c) => c.table === 'streak_history' && c.op === 'upsert',
      );
      expect(upserts).toHaveLength(1);
      expect(upserts[0].payload).toHaveLength(3);
      expect(
        (upserts[0].payload as Array<Record<string, unknown>>)[0].user_id,
      ).toBe('u1');
    });
    // pendingMigration consommée (state + AsyncStorage).
    await waitFor(() =>
      expect(utils.result.current.pendingMigration).toBeNull(),
    );
    expect(await AsyncStorage.getItem('pending_migration')).toBeNull();
  });

  test('session avec userId NON correspondant → aucune migration', async () => {
    const utils = await renderProgress();
    await act(async () => {
      await utils.result.current.markPendingMigration('u1', ISO);
    });
    mockUser = { id: 'autre-user' };
    await act(async () => {
      utils.rerender({});
    });
    // Laisse les effets tourner, puis vérifie qu'il ne s'est rien passé.
    await act(async () => {});
    expect(
      sb.calls.filter((c) => c.table === 'profiles' && c.op === 'update'),
    ).toHaveLength(0);
    expect(utils.result.current.pendingMigration).toMatchObject({
      userId: 'u1',
    });
  });

  // F-03 (audit Lou) : supabase-js ne throw pas — il résout { error }. Avant
  // le fix, migrateLocalToRemote ignorait error sur ses 4 écritures puis
  // effaçait les clés AsyncStorage : une écriture échouée (réseau, RLS,
  // contrainte) = onboarding + progression anonymes perdus définitivement,
  // sans retry (le catch de l'effet pendingMigration ne voyait rien).
  test('F-03 : écriture en erreur non-throw → clés locales conservées, pendingMigration gardée', async () => {
    await seedAnonymousStorage({ history: validatedRun(3) });
    const utils = await renderProgress();
    await act(async () => {
      await utils.result.current.markPendingMigration('u1', ISO, 'a@b.c');
    });

    // L'upsert streak_history résout { error } (pas de throw). Plusieurs
    // échecs en file : l'effet pendingMigration peut retenter dans la même
    // fenêtre (ses deps bougent quand loadData met à jour le state).
    for (let i = 0; i < 5; i++) {
      sb.failNext('streak_history', 'upsert', { message: 'RLS denied (simulé)' });
    }

    mockUser = { id: 'u1' };
    await act(async () => {
      utils.rerender({});
    });
    await act(async () => {});

    // Les données anonymes locales n'ont PAS été effacées.
    expect(await AsyncStorage.getItem('streak_history')).not.toBeNull();
    // pendingMigration conservée — retry au prochain load.
    expect(utils.result.current.pendingMigration).toMatchObject({
      userId: 'u1',
    });
    expect(await AsyncStorage.getItem('pending_migration')).not.toBeNull();
  });

  // F-03 bis : après un échec, loadData (connecté) a remplacé le state
  // in-memory par le remote (vide). Le retry doit migrer les données depuis
  // AsyncStorage — pas depuis les closures React écrasées — sinon il
  // « réussit » en migrant du vide et efface les clés locales quand même.
  test('F-03 : le retry migre les données depuis AsyncStorage, pas le state écrasé', async () => {
    await seedAnonymousStorage({ history: validatedRun(3) });
    const utils = await renderProgress();
    await act(async () => {
      await utils.result.current.markPendingMigration('u1', ISO, 'a@b.c');
    });

    // Premier essai en échec, les suivants passent.
    sb.failNext('streak_history', 'upsert', { message: 'réseau (simulé)' });

    mockUser = { id: 'u1' };
    await act(async () => {
      utils.rerender({});
    });

    // Le retry automatique finit par aboutir…
    await waitFor(() =>
      expect(utils.result.current.pendingMigration).toBeNull(),
    );
    // …et l'upsert gagnant porte bien les 3 jours validés en anonyme.
    const upserts = sb.calls.filter(
      (c) => c.table === 'streak_history' && c.op === 'upsert',
    );
    const last = upserts[upserts.length - 1];
    expect(last.payload).toHaveLength(3);
    expect(
      (last.payload as Array<Record<string, unknown>>)[0].user_id,
    ).toBe('u1');
  });

  test('migration en échec → pendingMigration conservée (retry au prochain load)', async () => {
    const utils = await renderProgress();
    await act(async () => {
      await utils.result.current.markPendingMigration('u1', ISO);
    });

    // Fait échouer le premier write vers `profiles`.
    const origFrom = sb.client.from;
    let attempted = false;
    sb.client.from = (table: string) => {
      if (table === 'profiles') {
        attempted = true;
        throw new Error('réseau indisponible (simulé)');
      }
      return origFrom(table);
    };
    try {
      mockUser = { id: 'u1' };
      await act(async () => {
        utils.rerender({});
      });
      await waitFor(() => expect(attempted).toBe(true));
      await act(async () => {});
      // pendingMigration N'EST PAS effacée — retry possible au prochain load.
      expect(utils.result.current.pendingMigration).toMatchObject({
        userId: 'u1',
      });
      expect(await AsyncStorage.getItem('pending_migration')).not.toBeNull();
    } finally {
      sb.client.from = origFrom;
    }
  });

  // Régression beta (2 oct 2026, compte testeur réel) : `onboarding_data` vide
  // et `profile_dynamic_id` nul en base après une inscription avec confirmation
  // email. À l'arrivée de la session, loadData (connecté) lit le profil créé
  // par le trigger (réponses vides) et écrase le state ; l'effet
  // pendingMigration peut alors rejouer migrateLocalToRemote (ses deps bougent)
  // avec ce state vide, clés locales déjà effacées par le premier passage →
  // les réponses écrites en base étaient remplacées par du vide.
  describe('réponses d onboarding — jamais remplacées par du vide', () => {
    const ANSWERS = {
      energy: '3',
      body: 'Neutre',
      mental: 'Tranquille',
      motivation: 'Sérieusement',
    };

    /** Onboarding anonyme terminé, puis session arrivée sur un profil distant
     *  vierge (tel que posé par le trigger on_auth_user_created) : le state
     *  in-memory est écrasé par le remote avant toute migration. */
    async function renderWithOverwrittenState() {
      const utils = await renderProgress();
      await act(async () => {
        await utils.result.current.completeOnboarding(ANSWERS, 'P2');
      });
      sb.setTables({
        profiles: {
          id: 'u1',
          onboarding_done: false,
          onboarding_data: {},
          profile_dynamic_id: null,
          account_created_at: null,
        },
        streak_history: [],
        joker_consumptions: [],
        tier_reaches: [],
        pillar_evaluations: [],
      });
      mockUser = { id: 'u1' };
      await act(async () => {
        utils.rerender({});
      });
      await waitFor(() =>
        expect(utils.result.current.profileDynamicId).toBeNull(),
      );
      return utils;
    }

    const profileUpdates = () =>
      sb.calls
        .filter((c) => c.table === 'profiles' && c.op === 'update')
        .map((c) => c.payload as Record<string, unknown>);

    test('state écrasé par le remote → la migration lit les réponses dans AsyncStorage', async () => {
      const utils = await renderWithOverwrittenState();
      await act(async () => {
        await utils.result.current.migrateLocalToRemote('u1', ISO);
      });
      const updates = profileUpdates();
      expect(updates).toHaveLength(1);
      expect(updates[0]).toMatchObject({
        onboarding_done: true,
        onboarding_data: ANSWERS,
        profile_dynamic_id: 'P2',
      });
    });

    test('second passage (clés locales déjà effacées) → n écrit ni réponses vides ni profil nul', async () => {
      const utils = await renderWithOverwrittenState();
      await act(async () => {
        await utils.result.current.migrateLocalToRemote('u1', ISO);
      });
      await act(async () => {
        await utils.result.current.migrateLocalToRemote('u1', ISO);
      });
      const updates = profileUpdates();
      expect(updates).toHaveLength(2);
      expect(updates[1]).not.toHaveProperty('onboarding_data');
      expect(updates[1]).not.toHaveProperty('profile_dynamic_id');
      expect(updates[1]).toMatchObject({ onboarding_done: true });
    });

    // Retour testeuse (4 oct 2026) : même famille de bug pour les flags
    // narratifs et le palier différé — la migration ne les remplace jamais
    // par du vide.
    test('flags locaux vides → la migration n écrit ni narrative_flags ni pending_tier_reach', async () => {
      const utils = await renderWithOverwrittenState();
      await act(async () => {
        await utils.result.current.migrateLocalToRemote('u1', ISO);
      });
      await act(async () => {
        await utils.result.current.migrateLocalToRemote('u1', ISO);
      });
      for (const update of profileUpdates()) {
        expect(update).not.toHaveProperty('narrative_flags');
        expect(update).not.toHaveProperty('pending_tier_reach');
      }
    });

    test('flags locaux présents → fusionnés avec les flags distants', async () => {
      const utils = await renderWithOverwrittenState();
      sb.setTables({
        profiles: {
          id: 'u1',
          onboarding_done: true,
          narrative_flags: { j3_charniere: 'distant' },
        },
        streak_history: [],
        joker_consumptions: [],
        tier_reaches: [],
        pillar_evaluations: [],
      });
      await AsyncStorage.setItem(
        'narrative_flags',
        JSON.stringify({ welcome_video: 'local' }),
      );
      await act(async () => {
        await utils.result.current.migrateLocalToRemote('u1', ISO);
      });
      const updates = profileUpdates();
      expect(updates[updates.length - 1].narrative_flags).toEqual({
        welcome_video: 'local',
        j3_charniere: 'distant',
      });
    });
  });
});

// ─── Verrou de chargement par utilisateur (retour testeuse, 4 oct 2026) ──────
// Stockage local resté à « onboarding terminé » (connexion à un compte
// existant dans un contexte où l'onboarding anonyme avait été refait) : à
// l'arrivée de la session, le hub se montait une frame AVANT le chargement
// distant — jour 1, aucun flag — et marquait welcome_video en écrasant les
// flags du compte. `loading` doit rester vrai tant que les données du compte
// connecté ne sont pas appliquées.
describe('verrou de chargement — jamais « connecté » avec des données non chargées', () => {
  const REMOTE = {
    profiles: {
      id: 'u1',
      onboarding_done: true,
      onboarding_data: {},
      profile_dynamic_id: null,
      account_created_at: '2026-10-01T08:00:00.000Z',
      narrative_flags: { welcome_video: 'vu', j3_charniere: 'vu' },
    },
    streak_history: [],
    joker_consumptions: [],
    tier_reaches: [],
    pillar_evaluations: [],
  };

  type Frame = { user: string | null; loading: boolean; j3: boolean };

  function renderLogged(frames: Frame[]) {
    return renderHook(
      () => {
        const p = useProgress();
        frames.push({
          user: mockUser?.id ?? null,
          loading: p.loading,
          j3: !!p.narrativeFlags.j3_charniere,
        });
        return p;
      },
      { wrapper: progressWrapper },
    );
  }

  const unloadedFrames = (frames: Frame[]) =>
    frames.filter((f) => f.user === 'u1' && !f.loading && !f.j3);

  test('session arrivée après le chargement local → aucune frame prête sans les données du compte', async () => {
    await seedAnonymousStorage({});
    const frames: Frame[] = [];
    const utils = await renderLogged(frames);
    await waitFor(() => expect(utils.result.current.loading).toBe(false));

    sb.setTables(REMOTE);
    mockUser = { id: 'u1' };
    await act(async () => {
      utils.rerender({});
    });
    await waitFor(() =>
      expect(utils.result.current.narrativeFlags.j3_charniere).toBeDefined(),
    );
    expect(utils.result.current.loading).toBe(false);
    expect(unloadedFrames(frames)).toEqual([]);
  });

  test('session arrivée pendant le chargement local → idem (deux chargements concurrents)', async () => {
    await seedAnonymousStorage({});
    sb.setTables(REMOTE);
    const frames: Frame[] = [];
    const utils = await renderLogged(frames);
    mockUser = { id: 'u1' };
    await act(async () => {
      utils.rerender({});
    });
    await waitFor(() =>
      expect(utils.result.current.narrativeFlags.j3_charniere).toBeDefined(),
    );
    await waitFor(() => expect(utils.result.current.loading).toBe(false));
    expect(unloadedFrames(frames)).toEqual([]);
  });
});

// ─── D44 (1er octobre 2026) — validation automatique de la veille ≥ 5/7 ──────
// Retour testeurs beta : une journée cochée sans tap « Valider » comptait
// comme manquée. La cohérence calendaire lit les coches locales
// (daily_check_actions.<date>) et valide à sa date toute journée Phase 0
// passée à ≥ 5 coches. Les clés traitées sont supprimées.

describe('D44 — validation automatique de la veille (cohérence calendaire)', () => {
  const checks = (n: number) =>
    JSON.stringify(
      Object.fromEntries(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id, i) => [id, i < n]),
      ),
    );

  test('hier 5 coches non validées → journée validée à sa date, série +1, position +1, clé supprimée, notice', async () => {
    await seedAnonymousStorage({ history: validatedRun(2, daysAgo(2)) });
    await AsyncStorage.setItem(`daily_check_actions.${daysAgo(1)}`, checks(5));
    const { result } = await renderProgress();
    await waitFor(() => {
      const e = result.current.streakHistory.find((x) => x.local_date === daysAgo(1));
      expect(e?.validation_status).toBe('valid_above_threshold');
    });
    expect(result.current.streak).toBe(3);
    expect(result.current.currentDay).toBe(4);
    // D45 : les coches de la veille restent lisibles (récapitulatif « Hier »).
    expect(await AsyncStorage.getItem(`daily_check_actions.${daysAgo(1)}`)).toBe(checks(5));
    expect(showNotice).toHaveBeenCalledWith(
      'Journée validée',
      expect.stringContaining('5 actions sur 7'),
    );
  });

  test('hier 3 coches → jour manqué classique (joker), clé obsolète nettoyée', async () => {
    await seedAnonymousStorage({ history: validatedRun(2, daysAgo(2)) });
    await AsyncStorage.setItem(`daily_check_actions.${daysAgo(1)}`, checks(3));
    const { result } = await renderProgress();
    await waitFor(() => {
      const e = result.current.streakHistory.find((x) => x.local_date === daysAgo(1));
      expect(e?.validation_status).toBe('missed_with_joker');
    });
    expect(result.current.currentDay).toBe(3);
    expect(await AsyncStorage.getItem(`daily_check_actions.${daysAgo(1)}`)).toBe(checks(3));
    expect(showNotice).not.toHaveBeenCalledWith('Journée validée', expect.anything());
  });

  test('D45 : seules les coches de la veille sont conservées — les plus anciennes sont nettoyées', async () => {
    await seedAnonymousStorage({ history: validatedRun(3, daysAgo(1)) });
    await AsyncStorage.multiSet([
      [`daily_check_actions.${daysAgo(1)}`, checks(6)],
      [`daily_check_actions.${daysAgo(2)}`, checks(5)],
      [`daily_check_actions.${daysAgo(5)}`, checks(2)],
    ]);
    await renderProgress();
    await waitFor(async () =>
      expect(await AsyncStorage.getItem(`daily_check_actions.${daysAgo(2)}`)).toBeNull(),
    );
    expect(await AsyncStorage.getItem(`daily_check_actions.${daysAgo(5)}`)).toBeNull();
    expect(await AsyncStorage.getItem(`daily_check_actions.${daysAgo(1)}`)).toBe(checks(6));
  });

  test('D45 : une veille déjà validée à la main n est jamais revalidée par ses coches conservées', async () => {
    await seedAnonymousStorage({ history: validatedRun(3, daysAgo(1)) });
    await AsyncStorage.setItem(`daily_check_actions.${daysAgo(1)}`, checks(7));
    const { result } = await renderProgress();
    await act(async () => {});
    expect(result.current.streak).toBe(3);
    expect(showNotice).not.toHaveBeenCalled();
  });

  test('les coches d aujourd hui restent intactes', async () => {
    await seedAnonymousStorage({ history: validatedRun(2, daysAgo(1)) });
    await AsyncStorage.setItem(`daily_check_actions.${today()}`, checks(5));
    const { result } = await renderProgress();
    await act(async () => {});
    expect(result.current.streakHistory.find((x) => x.local_date === today())).toBeUndefined();
    expect(await AsyncStorage.getItem(`daily_check_actions.${today()}`)).toBe(checks(5));
  });

  test('palier atteint par validation auto (14 → 15) → tier_reaches enregistré + palier différé D30', async () => {
    await seedAnonymousStorage({ history: validatedRun(14, daysAgo(2)) });
    await AsyncStorage.setItem(`daily_check_actions.${daysAgo(1)}`, checks(7));
    const { result } = await renderProgress();
    await waitFor(() => expect(result.current.streak).toBe(15));
    expect(result.current.tierReaches.find((t) => t.tier_id === 15)?.reach_count).toBe(1);
    expect(result.current.pendingTierReach).toMatchObject({ tierId: 15, isFirstReach: true });
  });

  test('connecté : la validation auto écrit streak_history et progress (actions_count) côté Supabase', async () => {
    mockUser = { id: 'user-1' };
    sb.setTables({
      profiles: {
        id: 'user-1',
        onboarding_done: true,
        onboarding_data: {},
        profile_dynamic_id: null,
        account_created_at: daysAgo(3) + 'T08:00:00.000Z',
      },
      streak_history: validatedRun(2, daysAgo(2)),
      joker_consumptions: [],
      tier_reaches: [],
      pillar_evaluations: [],
    });
    await AsyncStorage.setItem(`daily_check_actions.${daysAgo(1)}`, checks(5));
    const { result } = await renderProgress();
    await waitFor(() => expect(result.current.streak).toBe(3));
    const progressUpsert = sb.calls.find(
      (c) => c.table === 'progress' && c.op === 'upsert',
    );
    expect(progressUpsert?.payload).toMatchObject({ day_id: 3, actions_count: 5, is_minimum: false });
  });
});

// ─── Garde D27 — une journée validée ne se revalide pas ──────────────────────

describe('validateDay — garde journée déjà validée (D27, retours testeurs 30 sept)', () => {
  test('second validateDay le même jour → erreur, aucune réécriture ni joker consommé', async () => {
    await seedAnonymousStorage({ history: validatedRun(2) });
    const { result } = await renderProgress();
    await act(async () => {
      await result.current.validateDay({ day: 3, phase: 'phase_0', actionsCount: 5 });
    });
    expect(result.current.streak).toBe(3);
    await expect(
      result.current.validateDay({ day: 3, phase: 'phase_0', actionsCount: 2 }),
    ).rejects.toThrow(/déjà validée/);
    expect(result.current.streak).toBe(3);
    expect(result.current.jokerAvailable).toBe(true);
    expect(result.current.streakHistory.filter((e) => e.local_date === today())).toHaveLength(1);
  });
});
