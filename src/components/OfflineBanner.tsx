/**
 * OfflineBanner — bandeau « Pas de connexion » sur les hubs (IA-11).
 *
 * R1-21 (retour testeuse 13 oct 2026) : sans réseau au lancement, l'app
 * affichait un compte vide (« jour zéro »). Désormais ProgressContext sert
 * le dernier état chargé et lève `progressStale` ; ce bandeau le dit, sans
 * alarme. Le tap retente un chargement (silencieux). Il disparaît de
 * lui-même quand une lecture distante réussit (retour au premier plan ou
 * tap).
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useProgress } from '../hooks/ProgressContext';
import { offlineBannerCopy } from '../data/global-copy';
import {
  brandColors,
  interTextStyle,
  neutralColors,
  radiusV1,
  space,
} from '../theme';

export default function OfflineBanner() {
  const { progressStale, reloadProgress } = useProgress();
  if (!progressStale) return null;
  const copy = offlineBannerCopy();
  return (
    <TouchableOpacity
      style={styles.wrap}
      onPress={() => void reloadProgress()}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={copy.title}
    >
      <WifiOff size={20} color={brandColors.deep} strokeWidth={1.5} />
      <View style={styles.body}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.body}</Text>
      </View>
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
