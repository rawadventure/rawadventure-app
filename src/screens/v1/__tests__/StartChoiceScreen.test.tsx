/**
 * Tests StartChoiceScreen — IA-10b choix de démarrage différé (D24).
 *
 * Rendu avec le VRAI ProgressProvider (mode anonyme) : on vérifie que le
 * choix pose réellement `accountCreatedAt` (maintenant vs minuit local
 * suivant) — c'est la mécanique que le routeur lit ensuite pour envoyer
 * vers le hub ou vers IA-10c.
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

jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock('../../../lib/notice', () => ({ showNotice: jest.fn() }));

import StartChoiceScreen from '../StartChoiceScreen';
import { ProgressProvider, useProgress } from '../../../hooks/ProgressContext';
import { pinClockTo, unpinClock } from '../../../test-utils/harness';
import { startOfNextLocalDay } from '../../../lib/calendar';
import { devNow } from '../../../lib/devClock';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

function Probe() {
  const { accountCreatedAt } = useProgress();
  return <Text>{`probe:createdAt:${accountCreatedAt ?? 'null'}`}</Text>;
}

function Gated({ children }: { children: React.ReactNode }) {
  const { loading } = useProgress();
  if (loading) return null;
  return <>{children}</>;
}

async function renderChoice(onChoice: (mode: 'now' | 'tomorrow') => void) {
  const utils = await render(
    <ProgressProvider>
      <Gated>
        <StartChoiceScreen onChoice={onChoice} />
        <Probe />
      </Gated>
    </ProgressProvider>,
  );
  await waitFor(() =>
    expect(screen.queryByText('Je commence demain')).toBeTruthy(),
  );
  return utils;
}

beforeEach(async () => {
  sb.reset();
  jest.clearAllMocks();
  await AsyncStorage.clear();
  // 22h : la fenêtre D24 (<4h avant minuit) est le contexte d'affichage
  // nominal de cet écran.
  pinClockTo('2026-10-14', 22);
});

afterEach(() => {
  unpinClock();
});

describe('IA-10b — choix de démarrage (D24)', () => {
  test('écran : question et deux options explicites', async () => {
    await renderChoice(jest.fn());
    expect(
      screen.getByText(/On démarre maintenant\s*ou demain matin \?/),
    ).toBeTruthy();
    expect(screen.getByText('On démarre maintenant')).toBeTruthy();
    expect(screen.getByText('Je commence demain')).toBeTruthy();
  });

  test('« On démarre maintenant » → accountCreatedAt = maintenant + onChoice(now)', async () => {
    const onChoice = jest.fn();
    await renderChoice(onChoice);
    const user = userEvent.setup();
    await user.press(screen.getByText('On démarre maintenant'));
    await waitFor(() => expect(onChoice).toHaveBeenCalledWith('now'));
    const probeText = screen.getByText(/probe:createdAt:/).children.join('');
    const iso = probeText.replace('probe:createdAt:', '');
    expect(iso).not.toBe('null');
    // Posé "maintenant". NB : l'écran utilise `new Date()` (heure réelle),
    // pas devNow — identique en production, seul le mode DEV avec horloge
    // décalée voit la différence. Caractérisé tel quel.
    expect(Math.abs(new Date(iso).getTime() - Date.now())).toBeLessThan(5_000);
    // Persisté (AsyncStorage, mode anonyme).
    expect(await AsyncStorage.getItem('account_created_at')).not.toBeNull();
  });

  test('« Je commence demain » → accountCreatedAt = minuit local suivant + onChoice(tomorrow)', async () => {
    const onChoice = jest.fn();
    await renderChoice(onChoice);
    const user = userEvent.setup();
    await user.press(screen.getByText('Je commence demain'));
    await waitFor(() => expect(onChoice).toHaveBeenCalledWith('tomorrow'));
    const probeText = screen.getByText(/probe:createdAt:/).children.join('');
    const iso = probeText.replace('probe:createdAt:', '');
    expect(iso).toBe(startOfNextLocalDay());
    // Dans le futur → le routeur enverra vers IA-10c WaitingScreen.
    expect(new Date(iso).getTime()).toBeGreaterThan(devNow());
  });
});
