/**
 * LogoRawAdventure — motif identitaire de marque.
 *
 * Réf design system V1.1 §8.3 + Patch 4 du 14 mai 2026.
 *
 * Utilisations (4 contextes) :
 *  - `variant="filigrane"` : top-right des Header pilier illustrés, opacité
 *    héritée du contexte via `usePillarTheme().filigraneOpacity` (14% S1-S8,
 *    16% Phase 0, 8% neutre Toile/Profil). Asset blanc sur fond coloré.
 *  - `variant="hero"` : grand format coloré centré sur slide onboarding 1.
 *    Cercle plein `brand.deep` violet profond, rayons et pétales en blanc.
 *  - `variant="splash"` : centré sur splash screen, 160x160px.
 *  - `variant="profile"` : header du profil utilisateur (IA-70), discret.
 *
 * Note technique V1 : implémentation actuelle utilise `<Image>` + asset PNG
 * (`logo-raw-adventure-white.png`). Migration vers `react-native-svg-transformer`
 * + version SVG (`logo-raw-adventure-white.svg` déjà déposée dans assets) prévue
 * en Sprint 1 quand la dépendance est ajoutée — l'API du composant reste stable.
 *
 * Pour la variante `hero` (violet plein), un second asset coloré sera fourni
 * par Stéphane (Canva export). En attendant : placeholder utilisant `tintColor`
 * sur l'asset blanc — rendu approximatif, à patcher en Sprint 1.
 */

import React from 'react';
import { Image, ImageStyle, StyleProp, View, ViewStyle } from 'react-native';
import { brandColors } from '../../theme';

const LOGO_WHITE = require('../../../assets/images/logo-raw-adventure-white.png');

export type LogoVariant = 'filigrane' | 'hero' | 'splash' | 'profile';

export type LogoRawAdventureProps = {
  variant?: LogoVariant;
  /** Taille en px (largeur = hauteur). Par défaut selon variant. */
  size?: number;
  /** Opacité 0-1. Par défaut selon variant. */
  opacity?: number;
  /** Couleur de teinte (applique tintColor). Par défaut : blanc pour filigrane/splash/profile, violet profond pour hero. */
  color?: string;
  /** Style additionnel (positionnement absolu pour filigrane par ex.). */
  style?: StyleProp<ViewStyle>;
  /** Marqueur accessibilité. Par défaut décoratif (caché lecteur). */
  accessibilityLabel?: string;
};

const VARIANT_DEFAULTS: Record<LogoVariant, { size: number; opacity: number; color: string }> = {
  filigrane: { size: 280, opacity: 0.14, color: '#FFFFFF' },
  hero: { size: 220, opacity: 1, color: brandColors.deep },
  splash: { size: 160, opacity: 1, color: brandColors.deep },
  profile: { size: 32, opacity: 1, color: brandColors.deep },
};

export function LogoRawAdventure({
  variant = 'filigrane',
  size,
  opacity,
  color,
  style,
  accessibilityLabel,
}: LogoRawAdventureProps) {
  const defaults = VARIANT_DEFAULTS[variant];
  const resolvedSize = size ?? defaults.size;
  const resolvedOpacity = opacity ?? defaults.opacity;
  const resolvedColor = color ?? defaults.color;

  const imageStyle: StyleProp<ImageStyle> = {
    width: resolvedSize,
    height: resolvedSize,
    opacity: resolvedOpacity,
    tintColor: resolvedColor,
  };

  const isDecorative = !accessibilityLabel;

  return (
    <View
      style={style}
      pointerEvents="none"
      accessibilityElementsHidden={isDecorative}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'auto'}
    >
      <Image
        source={LOGO_WHITE}
        style={imageStyle}
        resizeMode="contain"
        accessibilityLabel={accessibilityLabel}
        accessible={!isDecorative}
      />
    </View>
  );
}
