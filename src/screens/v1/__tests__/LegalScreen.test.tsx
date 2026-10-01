/**
 * Tests LegalScreen — IA-74 (CGU), IA-75 (politique de confidentialité) et
 * mentions légales affichées DANS l'app (retours testeurs 30 sept 2026 : en
 * PWA, le lien vers le site faisait sortir de l'app sans retour possible).
 */

import React from 'react';
import { Linking } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

import LegalScreen from '../LegalScreen';
import { LEGAL_DOCS } from '../../../data/legal';

describe('LegalScreen', () => {
  test('doc=null → rien d affiché', async () => {
    await render(<LegalScreen doc={null} onClose={jest.fn()} />);
    expect(screen.queryByText(LEGAL_DOCS.cgu.title)).toBeNull();
  });

  test('affiche titre, version et contenu du document demandé', async () => {
    await render(<LegalScreen doc="mentions-legales" onClose={jest.fn()} />);
    expect(screen.getByText('Mentions légales')).toBeTruthy();
    expect(screen.getByText(LEGAL_DOCS['mentions-legales'].subtitle!)).toBeTruthy();
    expect(screen.getByText('1. Éditeur de l’Application et du Site')).toBeTruthy();
    expect(screen.getByText(/Raw Adventure Limited — Unit 1603/)).toBeTruthy();
  });

  test('« Fermer » appelle onClose (retour à l écran d origine)', async () => {
    const onClose = jest.fn();
    await render(<LegalScreen doc="cgu" onClose={onClose} />);
    await userEvent.setup().press(screen.getByText('Fermer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('lien interne vers un autre document → navigation dans l écran, sans sortir de l app', async () => {
    const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);
    await render(<LegalScreen doc="mentions-legales" onClose={jest.fn()} />);
    const links = screen.getAllByText('Politique de confidentialité');
    await userEvent.setup().press(links[0]);
    expect(screen.getByText(LEGAL_DOCS['politique-confidentialite'].subtitle!)).toBeTruthy();
    expect(screen.queryByText('1. Éditeur de l’Application et du Site')).toBeNull();
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  test('lien mailto → ouvre le client mail', async () => {
    const openSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as never);
    await render(<LegalScreen doc="mentions-legales" onClose={jest.fn()} />);
    await userEvent.setup().press(screen.getAllByText('support@rawadventure.world')[0]);
    expect(openSpy).toHaveBeenCalledWith('mailto:support@rawadventure.world');
    openSpy.mockRestore();
  });

  test('tableau des CGU : en-têtes et valeurs lisibles', async () => {
    await render(<LegalScreen doc="cgu" onClose={jest.fn()} />);
    expect(screen.getAllByText('Formule').length).toBeGreaterThan(0);
    expect(screen.getByText('Mensuel')).toBeTruthy();
  });
});
