/**
 * Tests NarrativeVideosScreen — IA-70 « Revoir les vidéos » (retour
 * testeuse beta 7 octobre 2026). Vérifie que seules les vidéos débloquées
 * par le parcours sont listées, dans l'ordre du parcours, et que l'écran
 * n'écrit rien.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

let mockNarrativeFlags: Record<string, string> = {};
let mockCurrentPhase = 'phase_0';
let mockCurrentPillarId: string | null = null;
const mockMarkNarrativeSeen = jest.fn();
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    narrativeFlags: mockNarrativeFlags,
    currentPhase: mockCurrentPhase,
    currentPillarId: mockCurrentPillarId,
    markNarrativeSeen: mockMarkNarrativeSeen,
  }),
}));

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoBack, canGoBack: () => true }),
}));

import NarrativeVideosScreen from '../NarrativeVideosScreen';

beforeEach(() => {
  jest.clearAllMocks();
  mockNarrativeFlags = {};
  mockCurrentPhase = 'phase_0';
  mockCurrentPillarId = null;
});

test('Phase 0, bienvenue + J7 jouées : deux vidéos, pas J14, pas d intro pilier', async () => {
  mockNarrativeFlags = { welcome_video: 'x', j3_charniere: 'x', j7_charniere: 'x' };
  await render(<NarrativeVideosScreen />);
  expect(screen.getByText('Revoir les vidéos')).toBeTruthy();
  expect(screen.getByText('Bienvenue')).toBeTruthy();
  expect(screen.getByText('Une semaine')).toBeTruthy();
  expect(screen.queryByText('Fin de la Phase 0')).toBeNull();
  expect(screen.queryByText(/^Intro — /)).toBeNull();
  expect(screen.getByLabelText('Lire la vidéo Une semaine')).toBeTruthy();
});

test('Phase 1 en S2 : intros S1 et S2 listées, pas S3', async () => {
  mockNarrativeFlags = { welcome_video: 'x', j7_charniere: 'x', j14_charniere: 'x', s0_1_screen: 'x', s0_2_screen: 'x' };
  mockCurrentPhase = 'phase_1';
  mockCurrentPillarId = 'S2';
  await render(<NarrativeVideosScreen />);
  expect(screen.getByText('Tes 14 jours')).toBeTruthy();
  expect(screen.getByText('La suite du parcours')).toBeTruthy();
  expect(screen.getByText('Intro — Respiration')).toBeTruthy();
  expect(screen.getByText('Intro — Activité physique')).toBeTruthy();
  expect(screen.queryByText('Intro — Alimentation')).toBeNull();
});

test('aucune vidéo débloquée : texte sobre, aucune écriture d état', async () => {
  await render(<NarrativeVideosScreen />);
  expect(screen.getByText('Les vidéos du parcours apparaîtront ici au fur et à mesure.')).toBeTruthy();
  expect(mockMarkNarrativeSeen).not.toHaveBeenCalled();
});
