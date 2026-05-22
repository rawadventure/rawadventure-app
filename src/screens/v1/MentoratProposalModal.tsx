/**
 * MentoratProposalModal — IA-60 modale de proposition active du mentorat à S8.
 *
 * Réf IA V3 §IA-60 + D9 (mentorat passe en proposition active à S8 sans
 * hard-sell) + D13.
 *
 * Ouverte automatiquement à la sortie de IA-23 (présentation consolidation
 * libre). Une seule fois — pose `mentorat_proposal_seen` au déclenchement.
 *
 * Deux actions :
 *  - "Découvrir le mentorat" → mènera à IA-61 (onglet Mentorat). En V1 :
 *    placeholder qui ferme modale et bascule onglet profil (le mentorat
 *    complet IA-61 reste à implémenter Sprint 19+).
 *  - "Plus tard" → ferme modale, retour Accueil mode post_s8.
 *
 * Référence IA : IA-60. Pattern : standard.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { Heart } from 'lucide-react-native';
import { brandColors, interTextStyle, space } from '../../theme';

export type MentoratProposalModalProps = {
  visible: boolean;
  /** Tap "Découvrir le mentorat" — IA-61 placeholder en V1. */
  onDiscover: () => void;
  /** Tap "Plus tard" — ferme, retour Accueil post_s8. */
  onLater: () => void;
};

export default function MentoratProposalModal({
  visible,
  onDiscover,
  onLater,
}: MentoratProposalModalProps) {
  return (
    <Modal visible={visible} onClose={onLater} variant="standard" dismissable={false}>
      <View style={styles.container}>
        <View style={styles.iconBubble}>
          <Heart size={26} color={brandColors.deep} strokeWidth={2} />
        </View>
        <Text style={styles.title}>Tu as posé les bases.</Text>
        <Text style={styles.body}>
          Si tu veux aller plus loin, accompagné, on en parle. Pas de pression,
          juste une porte ouverte. [copy à valider]
        </Text>
        <View style={styles.actions}>
          <Button
            label="Découvrir le mentorat"
            onPress={onDiscover}
            fullWidth
            size="large"
          />
          <Button
            label="Plus tard"
            variant="ghost"
            onPress={onLater}
            fullWidth
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { gap: space[3], alignItems: 'stretch' },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brandColors.deep + '11',
    marginBottom: space[2],
  },
  title: {
    ...interTextStyle('h2'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  body: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  actions: { gap: space[2], marginTop: space[3] },
});
