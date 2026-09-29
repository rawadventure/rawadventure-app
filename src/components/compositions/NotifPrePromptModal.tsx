/**
 * NotifPrePromptModal — pre-prompt de permission notifications (R3-5).
 *
 * Couche d'explication affichée à la fermeture de la vidéo J1 (IA-12),
 * AVANT le prompt système : iOS n'accorde qu'une seule chance de prompt
 * natif, on la contextualise (rappel quotidien, plage silence D32, porte
 * de sortie via le profil). Copy : slot `copy.global.notif-preprompt`.
 *
 * Non-dismissable : l'utilisateur choisit explicitement « Activer les
 * rappels » (→ prompt système) ou « Pas maintenant » (aucun prompt, le
 * réglage Profil reste la porte de rattrapage). Dans les deux cas le flag
 * `notif_permission_prompted` est posé côté caller — la couche ne se
 * rejoue jamais.
 *
 * Natif uniquement — jamais montée sur web (notifications PWA
 * inexistantes, voir chantier web push).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BellRing } from 'lucide-react-native';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { notifPrePromptCopy } from '../../data/global-copy';
import { brandColors, interTextStyle, space } from '../../theme';

export type NotifPrePromptModalProps = {
  visible: boolean;
  /** Tap « Activer les rappels » — le caller déclenche le prompt système. */
  onAccept: () => void;
  /** Tap « Pas maintenant » — le caller pose le flag sans prompt système. */
  onLater: () => void;
};

export function NotifPrePromptModal({
  visible,
  onAccept,
  onLater,
}: NotifPrePromptModalProps) {
  const copy = notifPrePromptCopy();
  return (
    <Modal
      visible={visible}
      onClose={onLater}
      variant="standard"
      context="phase0"
      dismissable={false}
    >
      <View style={styles.body}>
        <BellRing size={32} color={brandColors.deep} />
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.text}>{copy.body}</Text>
        <View style={styles.buttons}>
          <Button
            label={copy.ctaAccept}
            onPress={onAccept}
            fullWidth
            context="phase0"
          />
          <Button
            label={copy.ctaLater}
            onPress={onLater}
            variant="ghost"
            fullWidth
            context="phase0"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    gap: space[4],
    padding: space[5],
  },
  title: {
    ...interTextStyle('h3'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  text: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  buttons: {
    alignSelf: 'stretch',
    gap: space[2],
    marginTop: space[2],
  },
});
