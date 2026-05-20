/**
 * S8ExitScreen — IA-22 sortie de S8 (fin de Phase 1).
 *
 * Réf IA V3 §IA-22 + Product Vision V2.2 §"Sortie de S8" + D13 (principes
 * actés : célébrer acquis, mode consolidation libre, proposition active du
 * mentorat sans hard-sell, abonnement maintenu).
 *
 * Affiché une fois la semaine S8 bouclée (au tap "Continuer" depuis
 * IA-47 final récap S8). Marque `seenS8ExitScreenAt` au déclenchement.
 *
 * Structure V1 :
 *  - célébration "Tu as bouclé les 8 piliers" + streak final
 *  - Toile finale complète (variant comparison : initiale → finale)
 *  - bloc consolidation libre (IA-23 placeholder Sprint 16+)
 *  - bloc mentorat (proposition active sans pression — D9)
 *  - bouton "Continuer" → ferme la couche, retour Accueil mode consolidation
 *
 * Référence IA : IA-22. Pattern : A (écran narratif plein).
 */

import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { Toile, makeMockScores } from '../../components/toile';
import { LogoRawAdventure } from '../../components/illustrations';
import {
  brandColors,
  interTextStyle,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';

export type S8ExitScreenProps = {
  visible: boolean;
  /** Streak final (10 semaines = 70 jours max parcours V1). */
  streak: number;
  /** Tap "Continuer" — ferme couche, marque flag, retour Accueil consolidation. */
  onContinue: () => void;
  /** Tap "En savoir plus sur le mentorat" — Sprint 16+ ouvrira IA-60/IA-61. */
  onMentoratInterest?: () => void;
};

export default function S8ExitScreen({
  visible,
  streak,
  onContinue,
  onMentoratInterest,
}: S8ExitScreenProps) {
  // Toile finale (toutes branches completed) — Sprint 16+ : scores réels lus
  // depuis pillar_evaluations final pour les 8 piliers.
  const finalScores = makeMockScores('full');

  return (
    <Modal visible={visible} onClose={() => {}} variant="fullscreen" context="neutral" dismissable={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <View style={styles.logoMini}>
            <LogoRawAdventure variant="profile" size={48} color={brandColors.deep} />
          </View>
          <Text style={styles.marker}>FIN DE PHASE 1</Text>
          <Text style={styles.title}>Dix semaines.{'\n'}Tu y es.</Text>
          <Text style={styles.subtitle}>
            Phase 0 + 8 piliers travaillés un par un. Le terrain est posé.
            Ta toile reflète ce que tu as construit. [copy à valider]
          </Text>
        </View>

        {/* Toile finale */}
        <View style={styles.toileSection}>
          <Text style={styles.toileTitle}>Ta toile, vue d'ensemble</Text>
          <View style={styles.toileWrap}>
            <Toile scores={finalScores} variant="full" />
          </View>
        </View>

        {/* Streak final */}
        {streak > 0 && (
          <View style={styles.streakBlock}>
            <Text style={styles.streakLabel}>Streak final</Text>
            <Text style={styles.streakValue}>
              {streak} jour{streak > 1 ? 's' : ''} consécutif{streak > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* Bloc consolidation libre — IA-23 placeholder */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Et maintenant ?</Text>
          <Text style={styles.blockBody}>
            Tu entres en mode consolidation libre. Pas de programme imposé —
            tu choisis quels piliers tu veux pratiquer, à ton rythme. Ton
            abonnement reste actif pour conserver l'accès à toute la pratique.
            [copy à valider]
          </Text>
        </View>

        {/* Bloc mentorat — D9 proposition active sans hard-sell */}
        <View style={[styles.block, styles.blockMentorat]}>
          <Text style={styles.blockTitle}>Aller plus loin ?</Text>
          <Text style={styles.blockBody}>
            Si tu veux un accompagnement personnalisé avec Mimi & Jacky pour
            consolider et adapter à ta vie, le mentorat 1-to-1 est ouvert.
            Pas d'urgence — quand tu seras prêt. [copy à valider]
          </Text>
          {onMentoratInterest && (
            <Button
              label="En savoir plus sur le mentorat"
              variant="secondary"
              onPress={onMentoratInterest}
              fullWidth
              style={{ marginTop: space[3] }}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label="Continuer en consolidation libre"
          onPress={onContinue}
          fullWidth
          size="large"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: space[6],
    gap: space[5],
  },
  head: { gap: space[3] },
  logoMini: { alignItems: 'center', marginBottom: space[2] },
  marker: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  title: {
    ...interTextStyle('display'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  subtitle: {
    ...interTextStyle('bodyLarge'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  toileSection: { gap: space[2] },
  toileTitle: {
    ...interTextStyle('h2'),
    color: brandColors.deep,
  },
  toileWrap: { alignItems: 'center', paddingVertical: space[3] },
  streakBlock: {
    alignItems: 'center',
    paddingVertical: space[3],
    borderTopWidth: 1,
    borderTopColor: brandColors.deep + '22',
    borderBottomWidth: 1,
    borderBottomColor: brandColors.deep + '22',
  },
  streakLabel: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  streakValue: {
    ...interTextStyle('h2'),
    color: brandColors.deep,
    marginTop: space[1],
  },
  block: {
    backgroundColor: pillarColors.neutral.bg,
    borderRadius: radiusV1.xl,
    padding: space[5],
    gap: space[2],
    borderWidth: 1.5,
    borderColor: brandColors.deep + '22',
  },
  blockMentorat: {
    backgroundColor: '#FFFFFF',
  },
  blockTitle: {
    ...interTextStyle('h3'),
    color: brandColors.deep,
  },
  blockBody: {
    ...interTextStyle('body'),
    color: brandColors.deep,
  },
  footer: {
    padding: space[6],
  },
});
