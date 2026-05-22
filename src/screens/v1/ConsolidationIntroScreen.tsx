/**
 * ConsolidationIntroScreen — IA-23 mode consolidation libre.
 *
 * Réf IA V3 §IA-23 + D13 (principes actés : célébrer acquis, mode consolidation
 * libre, proposition active mentorat sans hard-sell, abonnement maintenu).
 *
 * Affiché en couche superposée à la sortie de IA-22 (S8ExitScreen). Présente
 * ce que l'utilisateur peut faire en mode consolidation libre — revisiter
 * chacun des 8 piliers, refaire des sessions, suivre son streak, accéder au
 * contenu bonus. Tap "Continuer" → IA-60 (modale mentorat proposition active).
 *
 * Marque `consolidation_intro_seen` au déclenchement (Feature Spec V1 §2.3).
 *
 * Référence IA : IA-23. Pattern : A (écran narratif plein).
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import { Compass, RotateCcw, Flame, BookOpen } from 'lucide-react-native';
import { brandColors, interTextStyle, pillarColors, radiusV1, space } from '../../theme';

export type ConsolidationIntroScreenProps = {
  visible: boolean;
  onContinue: () => void;
};

type Affordance = {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  body: string;
};

const AFFORDANCES: Affordance[] = [
  {
    icon: Compass,
    title: 'Revisiter chaque pilier',
    body: "Les 8 piliers travaillés restent ouverts. Tu tap dans la Toile pour relire la fiche, refaire une session, ou juste te repérer. [copy à valider]",
  },
  {
    icon: RotateCcw,
    title: 'Refaire des sessions',
    body: "Cohérence cardiaque, fenêtre digestive, mouvement — tu choisis quand et combien. Pas de programme imposé. [copy à valider]",
  },
  {
    icon: Flame,
    title: 'Streak qui continue',
    body: "Une session par jour suffit à entretenir ton streak. Les paliers continuent de se débloquer. [copy à valider]",
  },
  {
    icon: BookOpen,
    title: 'Contenu bonus',
    body: "L'espace bonus reste accessible — vidéos, podcasts, lectures — au rythme de ton abonnement. [copy à valider]",
  },
];

export default function ConsolidationIntroScreen({
  visible,
  onContinue,
}: ConsolidationIntroScreenProps) {
  return (
    <Modal visible={visible} onClose={() => {}} variant="fullscreen" context="neutral" dismissable={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <Text style={styles.marker}>MODE CONSOLIDATION LIBRE</Text>
          <Text style={styles.title}>Voici ce que tu peux{'\n'}faire maintenant.</Text>
          <Text style={styles.subtitle}>
            Le programme guidé est fini. Tout reste à disposition — tu choisis
            ce que tu pratiques et à quel rythme. [copy à valider]
          </Text>
        </View>

        <View style={styles.list}>
          {AFFORDANCES.map(({ icon: Icon, title, body }) => (
            <View key={title} style={styles.card}>
              <View style={styles.iconBubble}>
                <Icon size={22} color={brandColors.deep} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, gap: space[1] }}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardBody}>{body}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Continuer" onPress={onContinue} fullWidth size="large" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: space[6], gap: space[5] },
  head: { gap: space[3] },
  marker: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  title: {
    ...interTextStyle('h1'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  subtitle: {
    ...interTextStyle('bodyLarge'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  list: { gap: space[3] },
  card: {
    flexDirection: 'row',
    gap: space[3],
    backgroundColor: pillarColors.neutral.bg,
    borderRadius: radiusV1.xl,
    padding: space[4],
    borderWidth: 1.5,
    borderColor: brandColors.deep + '22',
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cardTitle: { ...interTextStyle('h3'), color: brandColors.deep },
  cardBody: { ...interTextStyle('body'), color: brandColors.deep },
  footer: { padding: space[6] },
});
