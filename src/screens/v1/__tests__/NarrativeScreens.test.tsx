/**
 * Tests des écrans narratifs — IA-14 (jours-charnière J3/J7/J11/J14),
 * IA-20 (S0.1 célébration + toile révélée), IA-21 (S0.2 roadmap D39).
 *
 * Composants contrôlés (visible + callbacks) — le déclenchement (file
 * narrative D25, position D38) est testé côté HomeScreenV1/ProgressContext.
 * Ici : contenu par variante, CTA, grille copy §4 (pas d'exclamation ni
 * d'emoji dans le copy produit), ordre canonique D39 de la roadmap.
 */

import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';

// Vidéo hors périmètre — stub léger.
jest.mock('../../../components/compositions/VideoPreview', () => {
  const { Text } = require('react-native');
  return { VideoPreview: () => <Text>STUB:VideoPreview</Text> };
});

import JourCharniereScreen, {
  type CharniereDay,
} from '../JourCharniereScreen';
import S01Screen from '../S01Screen';
import S02Screen from '../S02Screen';
import { PILLAR_ORDER_CANONICAL, getPillarMeta } from '../../../data/pillar-registry';

/** Concatène tous les nœuds texte du rendu courant. */
function allRenderedText(): string {
  const texts: string[] = [];
  const collect = (node: unknown): void => {
    if (typeof node === 'string') texts.push(node);
    else if (Array.isArray(node)) node.forEach(collect);
    else if (node && typeof node === 'object')
      collect((node as { children?: unknown }).children);
  };
  collect(screen.toJSON());
  return texts.join(' ');
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('IA-14 — jours-charnière (D19)', () => {
  test('J3 (text-only) : marker, titre, CTA « Je continue » → onClose', async () => {
    const onClose = jest.fn();
    await render(
      <JourCharniereScreen visible day={3} streak={3} onClose={onClose} />,
    );
    expect(screen.getByText('Jour 3 · cap symbolique')).toBeTruthy();
    expect(screen.getByText(/Le corps commence/)).toBeTruthy();
    // Pas de vidéo sur les charnières text-only.
    expect(screen.queryByText('STUB:VideoPreview')).toBeNull();
    const user = userEvent.setup();
    await user.press(screen.getByText('Je continue'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('J7 (riche) : vidéo marqueur de progression + badge 7 JOURS', async () => {
    await render(
      <JourCharniereScreen visible day={7} streak={7} onClose={jest.fn()} />,
    );
    expect(screen.getByText('Jour 7 · une semaine')).toBeTruthy();
    expect(screen.getByText('STUB:VideoPreview')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('JOURS')).toBeTruthy();
  });

  test('J14 : CTA « Voir la suite » (ouverture vers S0/conversion, D3)', async () => {
    await render(
      <JourCharniereScreen visible day={14} streak={14} onClose={jest.fn()} />,
    );
    expect(screen.getByText('Jour 14 · fin de Phase 0')).toBeTruthy();
    expect(screen.getByText('Voir la suite')).toBeTruthy();
  });

  test('day null → rien n est rendu', async () => {
    await render(
      <JourCharniereScreen visible day={null} streak={0} onClose={jest.fn()} />,
    );
    expect(screen.toJSON()).toBeNull();
  });

  test.each([3, 7, 11, 14] as CharniereDay[])(
    'grille copy §4 — J%s : pas d exclamation ni d emoji dans le copy rendu',
    async (day) => {
      await render(
        <JourCharniereScreen visible day={day} streak={day} onClose={jest.fn()} />,
      );
      const text = allRenderedText();
      expect(text).not.toMatch(/!/);
      expect(text).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
    },
  );
});

describe('IA-20 — S0.1 célébration et toile révélée (D5)', () => {
  test('célébration 14 jours + section toile + streak + Continuer → onContinue', async () => {
    const onContinue = jest.fn();
    await render(<S01Screen visible streak={14} onContinue={onContinue} />);
    expect(screen.getByText('S0.1 · Transition')).toBeTruthy();
    expect(screen.getByText(/Quatorze jours/)).toBeTruthy();
    // La toile est révélée ici pour la première fois (D5).
    expect(screen.getByText('Ta toile de vitalité')).toBeTruthy();
    expect(screen.getByText(/Huit branches, une par pilier/)).toBeTruthy();
    expect(screen.getByText('14 jours consécutifs')).toBeTruthy();
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  test('streak 0 (parcours cabossé) : pas de bloc streak, la célébration reste', async () => {
    await render(<S01Screen visible streak={0} onContinue={jest.fn()} />);
    expect(screen.getByText(/Quatorze jours/)).toBeTruthy();
    expect(screen.queryByText(/consécutif/)).toBeNull();
  });
});

describe('IA-21 — S0.2 roadmap Phase 1 (D39)', () => {
  test('les 8 piliers sont présentés avec les noms du registre, dans l ordre canonique D39', async () => {
    await render(
      <S02Screen visible onStartEvaluation={jest.fn()} />,
    );
    expect(screen.getByText(/Huit semaines\./)).toBeTruthy();
    const rendered = allRenderedText();
    let lastIndex = -1;
    for (const id of PILLAR_ORDER_CANONICAL) {
      const name = getPillarMeta(id)!.name;
      const idx = rendered.indexOf(name);
      expect(idx).toBeGreaterThan(-1);
      expect(idx).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });

  test('Continuer → onStartEvaluation ; pas de bouton abonnement sans callback', async () => {
    const onStart = jest.fn();
    await render(<S02Screen visible onStartEvaluation={onStart} />);
    expect(screen.queryByText("Découvrir l'abonnement")).toBeNull();
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  test('avec onDiscoverSubscription (Phase D2, non abonné) : bouton « Découvrir l abonnement »', async () => {
    const onDiscover = jest.fn();
    await render(
      <S02Screen
        visible
        onStartEvaluation={jest.fn()}
        onDiscoverSubscription={onDiscover}
      />,
    );
    const user = userEvent.setup();
    await user.press(screen.getByText("Découvrir l'abonnement"));
    expect(onDiscover).toHaveBeenCalledTimes(1);
  });
});
