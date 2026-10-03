/**
 * Tests VideoPreview — poster de la preview vidéo.
 *
 * Régression (3 octobre 2026, capture Stéphane sur expo web) : sur le web,
 * react-native-web donne à une image embarquée sa taille d'origine
 * (width/height de l'asset) tant que le style ne fixe pas de dimensions.
 * `absoluteFill` seul ne suffit pas : le poster s'affichait à sa taille
 * native au lieu de remplir le conteneur — bande noire sur grand écran,
 * coin haut-gauche zoomé sur téléphone. Le poster doit porter des
 * dimensions explicites à 100 %.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { VideoPreview } from '../VideoPreview';

const WELCOME_URI =
  'https://example.supabase.co/storage/v1/object/public/phase0-videos/welcome-j1-bienvenue.mp4';

describe('VideoPreview — poster', () => {
  test('le poster embarqué remplit le conteneur (dimensions explicites à 100 %)', async () => {
    await render(<VideoPreview uri={WELCOME_URI} accessibilityLabel="Lire la vidéo" />);
    const style = StyleSheet.flatten(screen.getByTestId('video-poster', { includeHiddenElements: true }).props.style);
    expect(style).toMatchObject({ position: 'absolute', width: '100%', height: '100%' });
  });
});
