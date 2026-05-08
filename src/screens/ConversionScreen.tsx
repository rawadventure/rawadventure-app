import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Linking, Alert,
} from 'react-native';
import { useProgress } from '../hooks/ProgressContext';
import { colors, spacing, radius } from '../theme';

// ─── Données ──────────────────────────────────────────────────────────────────

const BILAN = [
  { emoji: '⚡️', label: 'Énergie matinale relancée' },
  { emoji: '🫁', label: 'Respiration et activation intégrées' },
  { emoji: '🧊', label: 'Exposition au froid apprivoisée' },
  { emoji: '🥗', label: 'Fenêtre alimentaire installée' },
  { emoji: '🏃', label: 'Mouvement quotidien ancré' },
  { emoji: '🧘', label: 'Récupération active maîtrisée' },
  { emoji: '🌿', label: 'Rythme circadien reconnecté' },
  { emoji: '😴', label: 'Protocole sommeil activé' },
  { emoji: '🧠', label: 'Clarté mentale retrouvée' },
  { emoji: '🏆', label: '14 jours de constance. Ça, ça change tout.' },
];

const NEXT = [
  { emoji: '📅', title: 'Nouveaux programmes', desc: 'Sommeil, performance mentale, énergie avancée…' },
  { emoji: '📈', title: 'Suivi personnalisé', desc: 'Tes données, tes progrès, tes tendances.' },
  { emoji: '⚙️', title: 'Protocoles avancés', desc: 'Des routines qui s\'adaptent à ton niveau.' },
];

const PLANS = [
  {
    id:        'monthly',
    title:     'Mensuel',
    price:     '19 €',
    period:    '/mois',
    detail:    'Résiliable à tout moment',
    highlight: false,
  },
  {
    id:        'quarterly',
    title:     'Trimestriel',
    price:     '49 €',
    period:    '/3 mois',
    detail:    '16 €/mois · économise 16% 👍',
    highlight: true,
  },
  {
    id:        'yearly',
    title:     'Annuel',
    price:     '149 €',
    period:    '/an',
    detail:    '12 €/mois · économise 37% 🔥',
    highlight: false,
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────

export default function ConversionScreen() {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const { resetAll } = useProgress();

  const handleSubscribe = () => {
    Linking.openURL('https://rawadventure.world/subscribe');
  };

  const handleResetPress = () => {
    if (__DEV__) {
      Alert.alert(
        'Reset complet',
        'Remettre à zéro toutes les données ? (test uniquement)',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Oui, reset', style: 'destructive', onPress: resetAll },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onLongPress={handleResetPress} delayLongPress={1500} activeOpacity={1}>
            <Text style={styles.trophy}>🏆</Text>
          </TouchableOpacity>
          <Text style={styles.tag}>14 JOURS COMPLÉTÉS</Text>
          <Text style={styles.h1}>Tu es dans les 3% qui vont au bout.</Text>
          <Text style={styles.subtitle}>
            La fondation est posée. Maintenant, on construit dessus.
          </Text>
        </View>

        {/* ── Bilan ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ce que tu as installé</Text>
          <View style={styles.bilanList}>
            {BILAN.map((item, i) => (
              <View key={i} style={[styles.bilanRow, i === BILAN.length - 1 && styles.bilanRowLast]}>
                <Text style={styles.bilanEmoji}>{item.emoji}</Text>
                <Text style={[styles.bilanLabel, i === BILAN.length - 1 && styles.bilanLabelLast]}>
                  {item.label}
                </Text>
                {i < BILAN.length - 1 && <Text style={styles.bilanCheck}>✓</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* ── Transition ── */}
        <View style={styles.transitionCard}>
          <Text style={styles.transitionEmoji}>🚀</Text>
          <Text style={styles.transitionTitle}>La suite t'attend.</Text>
          <Text style={styles.transitionText}>
            Les 14 premiers jours, c'était la mise en route.{'\n'}
            Le vrai travail — et les vrais résultats — commencent maintenant.
          </Text>
        </View>

        {/* ── Ce qui t'attend ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avec l'abonnement Raw Adventure</Text>
          <View style={styles.nextList}>
            {NEXT.map((item, i) => (
              <View key={i} style={styles.nextCard}>
                <Text style={styles.nextEmoji}>{item.emoji}</Text>
                <View style={styles.nextContent}>
                  <Text style={styles.nextTitle}>{item.title}</Text>
                  <Text style={styles.nextDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Plans ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisis ton rythme</Text>
          <View style={styles.plansList}>
            {PLANS.map((plan, i) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, selectedPlan === i && styles.planCardSelected]}
                onPress={() => setSelectedPlan(i)}
                activeOpacity={0.8}
              >
                {plan.highlight && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MEILLEURE OFFRE</Text>
                  </View>
                )}
                <View style={styles.planLeft}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <Text style={styles.planDetail}>{plan.detail}</Text>
                </View>
                <View style={styles.planPriceBlock}>
                  <Text style={[styles.planPrice, selectedPlan === i && styles.planPriceSelected]}>
                    {plan.price}
                  </Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Garantie ── */}
        <View style={styles.guarantee}>
          <Text style={styles.guaranteeEmoji}>🛡️</Text>
          <View style={styles.guaranteeText}>
            <Text style={styles.guaranteeTitle}>Satisfait ou remboursé — 14 jours</Text>
            <Text style={styles.guaranteeDesc}>
              Tu testes. Si ça ne te convient pas, on rembourse sans question.
            </Text>
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={styles.cta}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSubscribe}>
            <Text style={styles.primaryBtnText}>
              Continuer avec le plan {PLANS[selectedPlan].title} →
            </Text>
          </TouchableOpacity>
          <Text style={styles.ctaSub}>
            Paiement sécurisé sur rawadventure.world
          </Text>
        </View>

        {/* ── Citation finale ── */}
        <View style={styles.quoteBlock}>
          <Text style={styles.quoteMark}>"</Text>
          <Text style={styles.quoteText}>
            14 jours pour ressentir.{'\n'}
            3 mois pour transformer.{'\n'}
            1 an pour ne plus revenir en arrière.
          </Text>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },

  // Header
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  trophy:   { fontSize: 72, marginBottom: spacing.sm },
  tag: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.green,
    letterSpacing: 3,
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.sm,
  },

  // Section
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.white },

  // Bilan
  bilanList: { gap: spacing.sm },
  bilanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bilanRowLast: {
    backgroundColor: colors.greenDark + '22',
    borderColor: colors.green + '66',
  },
  bilanEmoji:    { fontSize: 20, width: 28 },
  bilanLabel:    { flex: 1, fontSize: 15, color: colors.grayLight },
  bilanLabelLast: { color: colors.white, fontWeight: '600' },
  bilanCheck:    { fontSize: 16, color: colors.green, fontWeight: '700' },

  // Transition
  transitionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.greenDark + '22',
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.green + '44',
    alignItems: 'center',
    gap: spacing.sm,
  },
  transitionEmoji: { fontSize: 36 },
  transitionTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  transitionText: {
    fontSize: 15,
    color: colors.grayLight,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Ce qui t'attend
  nextList: { gap: spacing.sm },
  nextCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextEmoji:   { fontSize: 24, width: 32 },
  nextContent: { flex: 1, gap: 4 },
  nextTitle:   { fontSize: 16, fontWeight: '600', color: colors.white },
  nextDesc:    { fontSize: 13, color: colors.gray, lineHeight: 18 },

  // Plans
  plansList: { gap: spacing.sm },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  planCardSelected: {
    backgroundColor: colors.greenDark + '22',
    borderColor: colors.green,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.green,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: radius.sm,
  },
  popularText:    { fontSize: 9, fontWeight: '800', color: colors.white, letterSpacing: 1 },
  planLeft:       { flex: 1, gap: 4 },
  planTitle:      { fontSize: 17, fontWeight: '600', color: colors.white },
  planDetail:     { fontSize: 12, color: colors.gray },
  planPriceBlock: { alignItems: 'flex-end' },
  planPrice:      { fontSize: 22, fontWeight: '800', color: colors.white },
  planPriceSelected: { color: colors.green },
  planPeriod:     { fontSize: 12, color: colors.gray },

  // Garantie
  guarantee: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guaranteeEmoji: { fontSize: 28 },
  guaranteeText:  { flex: 1, gap: 4 },
  guaranteeTitle: { fontSize: 15, fontWeight: '600', color: colors.white },
  guaranteeDesc:  { fontSize: 13, color: colors.gray, lineHeight: 18 },

  // CTA
  cta: { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  primaryBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  primaryBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
  ctaSub: { fontSize: 12, color: colors.gray },

  // Citation
  quoteBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  quoteMark:  { fontSize: 48, color: colors.green, lineHeight: 48, fontWeight: '900' },
  quoteText:  {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
});
