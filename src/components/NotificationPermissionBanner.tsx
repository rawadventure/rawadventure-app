/**
 * NotificationPermissionBanner — bandeau invitant à activer les notifs si
 * l'utilisateur les a refusées au prompt initial.
 *
 * Sprint Phase 0 notifs UX — affiché sur HomeScreenV1 quand le statut natif
 * de permission est `denied`. Le tap ouvre les Réglages système (deep link
 * iOS `app-settings:` ou Android equivalent via `Linking.openSettings()`).
 *
 * Côté code Mimi voice : ton calme, factuel, non-culpabilisant. Pas de
 * "tu rates quelque chose !" — juste mentionne le bénéfice.
 */

import React from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BellOff, ChevronRight } from 'lucide-react-native';
import {
  brandColors,
  interTextStyle,
  neutralColors,
  radiusV1,
  space,
} from '../theme';

export default function NotificationPermissionBanner() {
  const handlePress = async () => {
    if (Platform.OS === 'ios') {
      const supported = await Linking.canOpenURL('app-settings:');
      if (supported) {
        await Linking.openURL('app-settings:');
        return;
      }
    }
    await Linking.openSettings();
  };

  return (
    <TouchableOpacity style={styles.wrap} onPress={handlePress} activeOpacity={0.8}>
      <BellOff size={20} color={brandColors.deep} strokeWidth={1.5} />
      <View style={styles.body}>
        <Text style={styles.title}>Notifications désactivées</Text>
        <Text style={styles.subtitle}>
          Active-les dans les réglages pour recevoir les rappels du matin et du soir.
        </Text>
      </View>
      <ChevronRight size={20} color={brandColors.deep} strokeWidth={1.5} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    backgroundColor: neutralColors.surfaceElevated,
    borderRadius: radiusV1.md,
    borderLeftWidth: 3,
    borderLeftColor: brandColors.deep,
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    marginBottom: space[4],
  },
  body: {
    flex: 1,
  },
  title: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    fontWeight: '600',
  },
  subtitle: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    opacity: 0.8,
    marginTop: 2,
  },
});
