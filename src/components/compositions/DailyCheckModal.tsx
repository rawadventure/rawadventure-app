/**
 * DailyCheckModal — IA-15 modale de validation du check quotidien.
 *
 * Réf IA V3 §IA-15 + Feature Spec V1 Socle minimum §2.4 (check quotidien)
 * + décisions D26 (soft-rappel non-culpabilisant) et D34 (pas de score
 * quotidien V1 — `actionsCount` affiché transitoirement, pas agrégé).
 *
 * Deux variantes selon le contexte :
 *  - **Au-dessus du seuil** (Phase 0 ≥ 5/7 ou Phase 1 ≥ 1/3) : confirmation
 *    directe, un seul bouton "Valider ma journée".
 *  - **Sous le seuil en Phase 0** (D26 soft-rappel) : message bienveillant,
 *    deux boutons : "Cocher d'autres actions" (ferme la modale, revient à
 *    l'accueil) et "Valider quand même" (consomme le joker si dispo, sinon
 *    casse le streak — la décision est gérée côté `validateDay()`).
 *
 * **Pas de soft-rappel en Phase 1** (§2.4). En Phase 1 la mécanique 1/3 est
 * déjà très permissive. Le composant Phase 1 utilise la variante au-dessus
 * du seuil ou laisse le bouton "Valider" désactivé à 0 session.
 *
 * Le composant ne décide PAS du statut de validation lui-même — c'est le
 * caller qui appelle `validateDay()` (depuis ProgressContext) via `onConfirm`.
 * Cela garde la logique métier centralisée dans `src/lib/streak.ts`.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { brandColors, interTextStyle, neutralColors, space } from '../../theme';
import type { Phase } from '../../lib/streak';

export const PHASE_0_THRESHOLD = 5;
export const PHASE_0_TOTAL = 7;
export const PHASE_1_THRESHOLD = 1;
export const PHASE_1_TOTAL = 3;

export type DailyCheckModalProps = {
  visible: boolean;
  /** Fermeture sans valider (tap overlay ou "Cocher d'autres actions"). */
  onClose: () => void;
  /** Validation explicite. `userValidatedManually` = true pour les deux variantes
   *  (au-dessus ou sous le seuil avec "Valider quand même"). */
  onConfirm: () => Promise<void> | void;
  /** DEV uniquement : valide ET avance d'un jour. Si fourni, un bouton
   *  ghost discret "Valider + jour suivant" s'affiche sous le bouton normal.
   *  Caller (HomeScreenV1) injecte la fonction seulement si __DEV__ ou
   *  EXPO_PUBLIC_ENABLE_DEV_PANEL=true. */
  onConfirmAndAdvance?: () => Promise<void> | void;
  /** Nombre d'actions cochées par l'utilisateur au moment d'ouvrir la modale. */
  actionsCount: number;
  /** Phase courante (drive le seuil et l'affichage). */
  phase: Phase;
  /** État de chargement pendant l'écriture validateDay() côté caller. */
  loading?: boolean;
};

export function DailyCheckModal({
  visible,
  onClose,
  onConfirm,
  onConfirmAndAdvance,
  actionsCount,
  phase,
  loading = false,
}: DailyCheckModalProps) {
  const threshold = phase === 'phase_0' ? PHASE_0_THRESHOLD : PHASE_1_THRESHOLD;
  const total = phase === 'phase_0' ? PHASE_0_TOTAL : PHASE_1_TOTAL;
  const aboveThreshold = actionsCount >= threshold;

  const context = phase === 'phase_0' ? 'phase0' : 'neutral';

  // Copy — placeholders Brand Core. Pas d'emojis, ton dense et direct (D34).
  const titleAbove =
    actionsCount === total
      ? 'Journée complète.'
      : phase === 'phase_0'
        ? 'Journée validée.'
        : 'Session validée.';

  const titleBelow = 'Tu peux faire mieux.';

  const bodyAbove =
    phase === 'phase_0'
      ? `${actionsCount} actions sur ${total}. Le corps enregistre.`
      : `${actionsCount} session sur ${total}. La pratique compte.`;

  const bodyBelow = `${actionsCount} action${actionsCount > 1 ? 's' : ''} sur ${total} — sous le seuil minimum. Tu peux encore en cocher d'autres avant de valider, ou valider quand même (un joker hebdomadaire est consommé si dispo, sinon le streak casse).`;

  return (
    <Modal visible={visible} onClose={onClose} variant="standard">
      <Text style={styles.title}>{aboveThreshold ? titleAbove : titleBelow}</Text>
      <Text style={styles.body}>{aboveThreshold ? bodyAbove : bodyBelow}</Text>

      <View style={styles.actions}>
        {aboveThreshold ? (
          <Button
            label="Valider ma journée"
            onPress={onConfirm}
            loading={loading}
            fullWidth
            size="large"
            context={context}
          />
        ) : (
          <>
            <Button
              label="Cocher d'autres actions"
              onPress={onClose}
              disabled={loading}
              variant="secondary"
              fullWidth
              context={context}
            />
            <Button
              label="Valider quand même"
              onPress={onConfirm}
              loading={loading}
              fullWidth
              context={context}
            />
          </>
        )}
        {/* DEV : raccourci "Valider + jour suivant" — visible uniquement si
            le caller injecte onConfirmAndAdvance (gated __DEV__ /
            EXPO_PUBLIC_ENABLE_DEV_PANEL côté HomeScreenV1). Préserve le
            flow naturel : on passe vraiment par validateDay puis on décale
            accountCreatedAt -1j. */}
        {onConfirmAndAdvance && (
          <Button
            label="(DEV) Valider + jour suivant"
            onPress={onConfirmAndAdvance}
            loading={loading}
            variant="ghost"
            fullWidth
            context={context}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    ...interTextStyle('h2'),
    color: brandColors.deep,
    marginBottom: space[3],
  },
  body: {
    ...interTextStyle('bodyLarge'),
    color: neutralColors.textSecondary,
    marginBottom: space[5],
  },
  actions: {
    gap: space[3],
  },
});

