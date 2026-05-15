/**
 * TabBar — barre de navigation principale post-onboarding.
 *
 * Réf design system V1.1 §5.5.
 * 3 onglets V1 (D18) : Accueil par défaut, Toile, Profil.
 *
 * **Masquage onglet Toile en Phase 0 (D5 + D18).** Pendant la Phase 0 (J1 à J14),
 * la toile d'araignée n'est pas révélée — l'onglet Toile est donc masqué. Il
 * apparaît à partir du S0.1 (J15). Le caller passe `showToileTab` en prop.
 *
 * Hauteur 56px + safe area bottom. Item actif en couleur de texte du contexte
 * courant (généralement `pillar.neutral` violet profond).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Network, User } from 'lucide-react-native';
import {
  brandColors,
  layout,
  neutralColors,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';

export type TabId = 'home' | 'toile' | 'profil';

export type TabBarProps = {
  active: TabId;
  onChange: (next: TabId) => void;
  /** Si false, l'onglet Toile n'apparaît pas (Phase 0, D18). */
  showToileTab: boolean;
  /** Couleur du texte/icône actif. Par défaut violet profond `brand.deep`. */
  activeColor?: string;
};

const TABS: { id: TabId; label: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { id: 'home', label: 'Accueil', Icon: Home },
  { id: 'toile', label: 'Toile', Icon: Network },
  { id: 'profil', label: 'Profil', Icon: User },
];

export function TabBar({ active, onChange, showToileTab, activeColor }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const color = activeColor ?? brandColors.deep;
  const visible = TABS.filter((t) => t.id !== 'toile' || showToileTab);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, height: layout.tabBarHeight + insets.bottom },
      ]}
      accessibilityRole="tablist"
    >
      {visible.map(({ id, label, Icon }) => {
        const isActive = id === active;
        const tint = isActive ? color : neutralColors.textSecondary;
        return (
          <Pressable
            key={id}
            onPress={() => onChange(id)}
            hitSlop={8}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
            style={({ pressed }) => [styles.tab, pressed && { opacity: 0.7 }]}
          >
            <Icon size={24} color={tint} />
            <Text
              style={[
                styles.label,
                { color: tint, fontFamily: getInterFamily(isActive ? '600' : '500') },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: neutralColors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: neutralColors.borderSubtle,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
    paddingTop: space[2],
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
});
