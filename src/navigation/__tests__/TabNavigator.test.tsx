/**
 * Tests TabNavigator — 3 onglets custom (D18), onglet Toile gaté (D5),
 * et retour à la racine du stack quand on re-tape l'onglet actif
 * (régression salve G5, 4 sept 2026 : bloqué sur PillarFinalRecap,
 * le tap « Accueil » ne faisait rien).
 */

import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';

let mockCurrentPhase = 'phase_1';
let mockCurrentDay = 20;
jest.mock('../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    currentPhase: mockCurrentPhase,
    currentDay: mockCurrentDay,
    tabBarHidden: false,
  }),
}));

// Stacks stubbés — le stub Accueil porte un état "profond" interne pour
// simuler un écran empilé (PillarFinalRecap…) au-dessus de la racine.
jest.mock('../HomeStack', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function HomeStackStub() {
    const [deep, setDeep] = React.useState(false);
    return deep ? (
      <Text>STUB:homeDeep</Text>
    ) : (
      <Text onPress={() => setDeep(true)}>STUB:homeRoot</Text>
    );
  };
});
jest.mock('../ToileStack', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:toile</Text>;
  };
});
jest.mock('../ProfilStack', () => {
  const { Text } = require('react-native');
  return function Stub() {
    return <Text>STUB:profil</Text>;
  };
});

import TabNavigator from '../TabNavigator';

beforeEach(() => {
  jest.clearAllMocks();
  mockCurrentPhase = 'phase_1';
  mockCurrentDay = 20;
});

describe('onglets (D18)', () => {
  test('bascule Accueil → Toile → Profil → Accueil', async () => {
    await render(<TabNavigator />);
    expect(screen.getByText('STUB:homeRoot')).toBeTruthy();
    const user = userEvent.setup();
    await user.press(screen.getByLabelText('Toile'));
    expect(screen.getByText('STUB:toile')).toBeTruthy();
    await user.press(screen.getByLabelText('Profil'));
    expect(screen.getByText('STUB:profil')).toBeTruthy();
    await user.press(screen.getByLabelText('Accueil'));
    expect(screen.getByText('STUB:homeRoot')).toBeTruthy();
  });

  test('D5 — onglet Toile absent en Phase 0 avant J15, présent après', async () => {
    mockCurrentPhase = 'phase_0';
    mockCurrentDay = 5;
    await render(<TabNavigator />);
    expect(screen.queryByLabelText('Toile')).toBeNull();
    mockCurrentDay = 15;
    await screen.rerender(<TabNavigator />);
    expect(screen.getByLabelText('Toile')).toBeTruthy();
  });
});

describe('re-tap sur l onglet actif → retour à la racine du stack', () => {
  test('régression G5 : profond dans Accueil, tap « Accueil » ramène à la racine', async () => {
    await render(<TabNavigator />);
    const user = userEvent.setup();
    // S'enfoncer dans le stack Accueil (équivalent PillarFinalRecap).
    await user.press(screen.getByText('STUB:homeRoot'));
    expect(screen.getByText('STUB:homeDeep')).toBeTruthy();
    // Re-tap sur l'onglet déjà actif → doit revenir à la racine.
    await user.press(screen.getByLabelText('Accueil'));
    expect(screen.getByText('STUB:homeRoot')).toBeTruthy();
  });

  test('le détour par un autre onglet ramène aussi à la racine (comportement historique conservé)', async () => {
    await render(<TabNavigator />);
    const user = userEvent.setup();
    await user.press(screen.getByText('STUB:homeRoot'));
    await user.press(screen.getByLabelText('Toile'));
    await user.press(screen.getByLabelText('Accueil'));
    expect(screen.getByText('STUB:homeRoot')).toBeTruthy();
  });
});
