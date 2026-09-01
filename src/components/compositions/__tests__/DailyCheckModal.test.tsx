/**
 * Tests DailyCheckModal — IA-15 modale de validation du check quotidien.
 *
 * Réf D6 (seuil 5/7 Phase 0, 1/3 Phase 1), D26 (soft-rappel non-culpabilisant
 * sous le seuil, deux options), D34 (ratio affiché transitoirement).
 */

import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { DailyCheckModal } from '../DailyCheckModal';

const noop = () => {};

// L'animation d'entrée reanimated ne se joue pas sous Jest — la config
// globale defaultIncludeHiddenElements (jest.setup-after-env.ts) rend le
// contenu requêtable malgré l'opacité 0 initiale.
const renderModal = render;

describe('DailyCheckModal — Phase 0 au-dessus du seuil (cas A)', () => {
  test('5/7 : confirmation directe, un seul bouton "Valider ma journée"', async () => {
    await renderModal(
      <DailyCheckModal
        visible
        onClose={noop}
        onConfirm={noop}
        actionsCount={5}
        phase="phase_0"
      />,
    );
    expect(screen.getByText('Journée validée.')).toBeTruthy();
    expect(screen.getByText('5 actions sur 7. Le corps enregistre.')).toBeTruthy();
    expect(screen.getByText('Valider ma journée')).toBeTruthy();
    expect(screen.queryByText('Valider quand même')).toBeNull();
    expect(screen.queryByText("Cocher d'autres actions")).toBeNull();
  });

  test('7/7 : titre "Journée complète."', async () => {
    await renderModal(
      <DailyCheckModal
        visible
        onClose={noop}
        onConfirm={noop}
        actionsCount={7}
        phase="phase_0"
      />,
    );
    expect(screen.getByText('Journée complète.')).toBeTruthy();
  });

  test('bouton valider appelle onConfirm', async () => {
    const onConfirm = jest.fn();
    await renderModal(
      <DailyCheckModal
        visible
        onClose={noop}
        onConfirm={onConfirm}
        actionsCount={6}
        phase="phase_0"
      />,
    );
    await userEvent.setup().press(screen.getByText('Valider ma journée'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

describe('DailyCheckModal — Phase 0 sous le seuil (soft-rappel D26)', () => {
  test('4/7 : deux options, "Cocher d autres actions" et "Valider quand même"', async () => {
    await renderModal(
      <DailyCheckModal
        visible
        onClose={noop}
        onConfirm={noop}
        actionsCount={4}
        phase="phase_0"
      />,
    );
    expect(screen.getByText('Tu peux faire mieux.')).toBeTruthy();
    expect(screen.getByText("Cocher d'autres actions")).toBeTruthy();
    expect(screen.getByText('Valider quand même')).toBeTruthy();
    expect(screen.queryByText('Valider ma journée')).toBeNull();
  });

  test('"Cocher d autres actions" ferme sans valider ; "Valider quand même" confirme', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    await renderModal(
      <DailyCheckModal
        visible
        onClose={onClose}
        onConfirm={onConfirm}
        actionsCount={2}
        phase="phase_0"
      />,
    );
    const user = userEvent.setup();
    await user.press(screen.getByText("Cocher d'autres actions"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    await user.press(screen.getByText('Valider quand même'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('le message mentionne le joker, sans culpabilisation ni pression par la perte', async () => {
    await renderModal(
      <DailyCheckModal
        visible
        onClose={noop}
        onConfirm={noop}
        actionsCount={3}
        phase="phase_0"
      />,
    );
    const body = screen.getByText(/sous le seuil minimum/);
    expect(body.props.children).toContain('joker');
    // Grille copy : pas de "ne perds pas ton streak" (§4 CLAUDE.md).
    expect(String(body.props.children)).not.toMatch(/perds/i);
  });
});

describe('DailyCheckModal — Phase 1 (seuil 1/3, pas de soft-rappel)', () => {
  test('1/3 : au-dessus du seuil, "Session validée."', async () => {
    await renderModal(
      <DailyCheckModal
        visible
        onClose={noop}
        onConfirm={noop}
        actionsCount={1}
        phase="phase_1"
      />,
    );
    expect(screen.getByText('Session validée.')).toBeTruthy();
    expect(screen.getByText('1 session sur 3. La pratique compte.')).toBeTruthy();
  });
});

describe('DailyCheckModal — visibilité', () => {
  test('visible=false : rien n est rendu', async () => {
    await renderModal(
      <DailyCheckModal
        visible={false}
        onClose={noop}
        onConfirm={noop}
        actionsCount={5}
        phase="phase_0"
      />,
    );
    expect(screen.queryByText('Journée validée.')).toBeNull();
  });
});
