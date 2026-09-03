/**
 * Tests ConsolidationHomeScreen — IA-11 variante post_s8 (mode libre, D13)
 * + bandeau mentorat permanent (D9 : proposition active sans hard-sell).
 */

import React from 'react';
import { Alert } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({ streak: 72 }),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

import ConsolidationHomeScreen from '../ConsolidationHomeScreen';
import { PILLAR_ORDER_CANONICAL, getPillarMeta } from '../../../data/pillar-registry';

let alertSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  alertSpy.mockRestore();
});

describe('mode consolidation libre (post_s8)', () => {
  test('grille des 8 piliers avec les noms du registre', async () => {
    await render(<ConsolidationHomeScreen />);
    expect(screen.getByText('Mode libre')).toBeTruthy();
    for (const id of PILLAR_ORDER_CANONICAL) {
      expect(
        screen.getByLabelText(`Ouvrir pilier ${id} ${getPillarMeta(id)!.name}`),
      ).toBeTruthy();
    }
  });

  test('tap un pilier → PillarOverview en mode libre (pillarId paramétré)', async () => {
    await render(<ConsolidationHomeScreen />);
    const user = userEvent.setup();
    await user.press(screen.getByLabelText('Ouvrir pilier S4 Connexion au vivant'));
    expect(mockNavigate).toHaveBeenCalledWith('PillarOverview', {
      pillarId: 'S4',
    });
  });

  test('bandeau mentorat permanent (D9) — présent, ton porte ouverte', async () => {
    await render(<ConsolidationHomeScreen />);
    expect(screen.getByText('Mentorat')).toBeTruthy();
    expect(screen.getByText(/la\s+porte est ouverte/)).toBeTruthy();
    expect(screen.getByText('Découvrir le mentorat')).toBeTruthy();
  });

  test('« Découvrir le mentorat » → Alert espace à venir (V1)', async () => {
    await render(<ConsolidationHomeScreen />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Découvrir le mentorat'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Mentorat',
      expect.stringContaining('prochaine version'),
      expect.any(Array),
    );
  });

  test('D9 sans hard-sell : pas de vocabulaire de pression dans le rendu', async () => {
    await render(<ConsolidationHomeScreen />);
    expect(screen.queryByText(/offre limitée|dernière chance|réserve vite/i)).toBeNull();
  });
});
