/**
 * Tests PillarRecapScreen — IA-41 récapitulatif évaluation initiale.
 *
 * Couvre : affichage du diagnostic narratif (jamais le score brut), badge
 * niveau recommandé vs choisi, modale D31 (niveau adaptatif MANUEL — le
 * changement effectif passe par le choix utilisateur, jamais automatique),
 * bloc Type B sans niveau (D41), sortie vers le hub, éval introuvable.
 *
 * Hooks mockés ; la ligne d'évaluation est servie par le supabaseMock
 * (filtres eq + single).
 */

import React from 'react';
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

let mockUser: { id: string } | null = { id: 'user-1' };
jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

const mockSavePillarEvaluation = jest.fn(async () => {});
const mockMarkNarrativeSeen = jest.fn(async () => {});
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    savePillarEvaluation: mockSavePillarEvaluation,
    markNarrativeSeen: mockMarkNarrativeSeen,
    currentDay: 17,
  }),
}));

const mockReset = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams: Record<string, unknown> = { pillarId: 'S1' };
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    reset: mockReset,
    goBack: mockGoBack,
    navigate: jest.fn(),
  }),
  useRoute: () => ({ params: mockRouteParams }),
}));

import PillarRecapScreen from '../PillarRecapScreen';
import { getPillarMeta } from '../../../data/pillar-registry';

const { __supabaseMock: sb } = jest.requireMock('../../../lib/supabase') as {
  __supabaseMock: import('../../../test-utils/supabaseMock').SupabaseMock;
};

const S1 = getPillarMeta('S1')!;

/** Ligne d'évaluation type servie par le mock (diagnostic 3, reco essentiel). */
function evalRow(overrides: Record<string, unknown> = {}) {
  return {
    user_id: 'user-1',
    pillar_id: 'S1',
    evaluation_type: 'initial',
    responses: Array.from({ length: 12 }, (_, i) => ({
      question_id: i + 1,
      value: 3,
    })),
    raw_score: 36,
    normalized_score: 50,
    diagnostic_level: 3,
    engagement_level_recommended: 'essentiel',
    engagement_level_chosen: 'essentiel',
    ...overrides,
  };
}

async function renderRecap() {
  const utils = await render(<PillarRecapScreen />);
  await waitFor(() => expect(screen.queryByText('Chargement…')).toBeNull());
  return utils;
}

beforeEach(() => {
  jest.clearAllMocks();
  sb.reset();
  mockUser = { id: 'user-1' };
  mockRouteParams = { pillarId: 'S1' };
});

describe('affichage du diagnostic', () => {
  test('libellé narratif + message du niveau 3 (registre S1), pas de score brut affiché', async () => {
    sb.setTables({ pillar_evaluations: [evalRow()] });
    await renderRecap();
    expect(screen.getByText(S1.diagnostics[3].label)).toBeTruthy();
    expect(screen.getByText(S1.diagnostics[3].message)).toBeTruthy();
    // Le score brut /60 n'apparaît jamais (IA-41 : narratif, pas chiffré).
    expect(screen.queryByText(/36/)).toBeNull();
    expect(screen.queryByText(/\/\s*60/)).toBeNull();
  });

  test('niveau choisi = recommandé → badge Essentiel « — recommandé », paramètre 5 minutes', async () => {
    sb.setTables({ pillar_evaluations: [evalRow()] });
    await renderRecap();
    expect(screen.getByText('Essentiel')).toBeTruthy();
    expect(screen.getByText('— recommandé')).toBeTruthy();
    expect(screen.getByText('5 minutes')).toBeTruthy();
  });

  test('niveau choisi ≠ recommandé → « — choisi »', async () => {
    sb.setTables({
      pillar_evaluations: [evalRow({ engagement_level_chosen: 'progression' })],
    });
    await renderRecap();
    expect(screen.getByText('Progression')).toBeTruthy();
    expect(screen.getByText('— choisi')).toBeTruthy();
    expect(screen.getByText('10 minutes')).toBeTruthy();
  });

  test('D41 — pilier Type B (S5) : pas de bloc niveau, bloc déroulement à la place', async () => {
    mockRouteParams = { pillarId: 'S5' };
    sb.setTables({ pillar_evaluations: [evalRow({ pillar_id: 'S5' })] });
    await renderRecap();
    expect(screen.queryByText('Ton niveau pour la semaine')).toBeNull();
    expect(screen.queryByText('Modifier mon niveau')).toBeNull();
    expect(screen.getByText('Comment se déroule la semaine')).toBeTruthy();
  });

  test('évaluation introuvable → message + Retour (goBack)', async () => {
    // Table vide : single() renvoie null.
    await renderRecap();
    expect(screen.getByText('Évaluation introuvable.')).toBeTruthy();
    const user = userEvent.setup();
    await user.press(screen.getByText('Retour'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});

describe('modale niveau adaptatif (D31 — manuel uniquement)', () => {
  test('Modifier → choisir Plus → Valider : badge Immersion « — choisi » + persistance du nouveau choix', async () => {
    sb.setTables({ pillar_evaluations: [evalRow()] });
    await renderRecap();
    const user = userEvent.setup();
    await user.press(screen.getByText('Modifier mon niveau'));
    expect(screen.getByText("Ton niveau d'engagement")).toBeTruthy();
    await user.press(screen.getByLabelText('Plus'));
    await user.press(screen.getByText('Valider mon niveau'));
    // UI mise à jour.
    await waitFor(() => expect(screen.getByText('Immersion')).toBeTruthy());
    expect(screen.getByText('— choisi')).toBeTruthy();
    expect(screen.getByText('20 minutes')).toBeTruthy();
    // Persistance : le recommandé reste inchangé, seul le choisi bouge (D31).
    expect(mockSavePillarEvaluation).toHaveBeenCalledWith(
      expect.objectContaining({
        pillarId: 'S1',
        engagementLevelRecommended: 'essentiel',
        engagementLevelChosen: 'immersion',
      }),
    );
  });

  test('Annuler → modale fermée, niveau inchangé, pas de persistance', async () => {
    sb.setTables({ pillar_evaluations: [evalRow()] });
    await renderRecap();
    const user = userEvent.setup();
    await user.press(screen.getByText('Modifier mon niveau'));
    await user.press(screen.getByLabelText('Plus'));
    await user.press(screen.getByText('Annuler'));
    expect(screen.getByText('Essentiel')).toBeTruthy();
    expect(mockSavePillarEvaluation).not.toHaveBeenCalled();
  });
});

describe('sortie du récap', () => {
  test('Continuer → marque s0_2_screen vu + reset stack vers le hub', async () => {
    sb.setTables({ pillar_evaluations: [evalRow()] });
    await renderRecap();
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));
    await waitFor(() =>
      expect(mockMarkNarrativeSeen).toHaveBeenCalledWith('s0_2_screen'),
    );
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'HomeV1' }],
    });
  });
});
