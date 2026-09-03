/**
 * Tests PillarEvaluationScreen — IA-40 évaluation 12 questions (initiale et
 * finale), rendu avec le VRAI ProgressProvider (mode anonyme, Supabase mocké).
 *
 * Couvre : progression question par question, reprise après interruption
 * (cache AsyncStorage), agrégation de bout en bout (inversion Q6/Q7/Q8 S1
 * appliquée au calcul, pas à l'affichage), démarrage de la semaine pilier
 * en éval initiale uniquement, navigation vers le récap, tab bar masquée.
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';

jest.mock('../../../lib/supabase', () => {
  const { createSupabaseMock } = require('../../../test-utils/supabaseMock');
  const m = createSupabaseMock();
  return { supabase: m.client, __supabaseMock: m };
});

let mockUser: { id: string } | null = null;
jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock('../../../lib/notice', () => ({ showNotice: jest.fn() }));

const mockReplace = jest.fn();
let mockRouteParams: Record<string, unknown> = {
  pillarId: 'S1',
  evaluationType: 'initial',
};
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    replace: mockReplace,
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: mockRouteParams }),
}));

import PillarEvaluationScreen from '../PillarEvaluationScreen';
import { ProgressProvider, useProgress } from '../../../hooks/ProgressContext';
import {
  pinClockTo,
  seedAnonymousStorage,
  unpinClock,
  validatedRun,
} from '../../../test-utils/harness';
import { getPillarMeta } from '../../../data/pillar-registry';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

const THURSDAY = '2026-10-15';
const S1_QUESTIONS = getPillarMeta('S1')!.questions;

/** Sonde qui expose l'état du context à côté de l'écran (tab bar, pilier). */
function Probe() {
  const { tabBarHidden, currentPillarId } = useProgress();
  return (
    <>
      <Text>{`probe:tabBarHidden:${tabBarHidden}`}</Text>
      <Text>{`probe:pillar:${currentPillarId ?? 'none'}`}</Text>
    </>
  );
}

function Gated({ children }: { children: React.ReactNode }) {
  const { loading } = useProgress();
  if (loading) return null;
  return <>{children}</>;
}

async function renderEval() {
  const utils = await render(
    <ProgressProvider>
      <Gated>
        <PillarEvaluationScreen />
        <Probe />
      </Gated>
    </ProgressProvider>,
  );
  await waitFor(() => expect(screen.queryByText(/Question 1|Question \d+/)).toBeTruthy());
  return utils;
}

/** Répond `value` à la question courante puis presse le CTA. */
async function answerCurrent(
  user: ReturnType<typeof userEvent.setup>,
  value: 1 | 2 | 3 | 4 | 5,
) {
  await user.press(screen.getByLabelText(`Note ${value} sur 5`));
  await user.press(screen.getByText(/Question suivante|Voir mon récap/));
}

beforeEach(async () => {
  // Utilisateur CONNECTÉ : savePillarEvaluation ne persiste qu'en mode
  // connecté (flow nominal — IA-40 arrive toujours après IA-10 register).
  mockUser = { id: 'user-1' };
  sb.reset();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  pinClockTo(THURSDAY);
  mockRouteParams = { pillarId: 'S1', evaluationType: 'initial' };
  // Parcours Phase 0 terminé (position au-delà de J14) — sert au mode
  // anonyme résiduel et n'interfère pas avec le mode connecté.
  await seedAnonymousStorage({ history: validatedRun(16) });
});

afterEach(() => {
  unpinClock();
});

describe('progression du questionnaire', () => {
  test('Q1 : compteur, texte de la question S1, pas de bouton Précédente', async () => {
    await renderEval();
    expect(screen.getByText('Question 1 sur 12')).toBeTruthy();
    expect(screen.getByText('PILIER S1 · ÉVALUATION INITIALE')).toBeTruthy();
    expect(screen.getByText(S1_QUESTIONS[0].text)).toBeTruthy();
    expect(screen.queryByText('Précédente')).toBeNull();
  });

  test('répondre fait avancer ; Précédente revient avec la réponse conservée', async () => {
    await renderEval();
    const user = userEvent.setup();
    await answerCurrent(user, 4);
    expect(screen.getByText('Question 2 sur 12')).toBeTruthy();
    expect(screen.getByText(S1_QUESTIONS[1].text)).toBeTruthy();
    await user.press(screen.getByText('Précédente'));
    expect(screen.getByText('Question 1 sur 12')).toBeTruthy();
    // La réponse 4 est toujours sélectionnée (radio selected).
    const note4 = screen.getByLabelText('Note 4 sur 5');
    expect(note4.props.accessibilityState?.selected).toBe(true);
  });

  test('reprise après interruption : le progrès sauvegardé restaure index et réponses', async () => {
    await AsyncStorage.setItem(
      'pillar_eval_progress.S1.initial',
      JSON.stringify({ index: 7, answers: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3 } }),
    );
    await renderEval();
    await waitFor(() =>
      expect(screen.getByText('Question 8 sur 12')).toBeTruthy(),
    );
  });

  test('la tab bar est masquée pendant l évaluation (flag context)', async () => {
    await renderEval();
    await waitFor(() =>
      expect(screen.getByText('probe:tabBarHidden:true')).toBeTruthy(),
    );
  });
});

describe('complétion — agrégation et navigation', () => {
  test('12 réponses à 3 → upsert rawScore 36 / diagnostic 3, cache nettoyé, semaine S1 démarrée, replace PillarRecap', async () => {
    await renderEval();
    const user = userEvent.setup();
    for (let i = 0; i < 12; i++) {
      await answerCurrent(user, 3);
    }
    await waitFor(() => {
      const upserts = sb.calls.filter((c) => c.table === 'pillar_evaluations');
      expect(upserts).toHaveLength(1);
    });
    const payload = sb.calls.find((c) => c.table === 'pillar_evaluations')!
      .payload as Record<string, unknown>;
    expect(payload).toMatchObject({
      pillar_id: 'S1',
      evaluation_type: 'initial',
      raw_score: 36,
      diagnostic_level: 3,
    });
    // Cache de reprise consommé.
    expect(
      await AsyncStorage.getItem('pillar_eval_progress.S1.initial'),
    ).toBeNull();
    // startPillarWeek appelé (éval initiale) — le context porte S1.
    await waitFor(() =>
      expect(screen.getByText('probe:pillar:S1')).toBeTruthy(),
    );
    expect(mockReplace).toHaveBeenCalledWith('PillarRecap', {
      pillarId: 'S1',
      evaluationType: 'initial',
    });
  });

  test('12 réponses à 5 sur S1 → rawScore 48, pas 60 (inversion Q6/Q7/Q8 appliquée au calcul)', async () => {
    await renderEval();
    const user = userEvent.setup();
    for (let i = 0; i < 12; i++) {
      await answerCurrent(user, 5);
    }
    await waitFor(() => {
      const payload = sb.calls.find((c) => c.table === 'pillar_evaluations')
        ?.payload as Record<string, unknown> | undefined;
      expect(payload?.raw_score).toBe(48);
    });
  });

  test('évaluation finale → replace PillarFinalRecap, semaine pilier NON redémarrée', async () => {
    mockRouteParams = { pillarId: 'S1', evaluationType: 'final' };
    await renderEval();
    expect(screen.getByText('PILIER S1 · ÉVALUATION FINALE')).toBeTruthy();
    const user = userEvent.setup();
    for (let i = 0; i < 12; i++) {
      await answerCurrent(user, 4);
    }
    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('PillarFinalRecap', {
        pillarId: 'S1',
      }),
    );
    // Pas de startPillarWeek en éval finale.
    expect(screen.getByText('probe:pillar:none')).toBeTruthy();
  });
});
