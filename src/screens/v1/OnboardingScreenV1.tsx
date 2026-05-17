/**
 * OnboardingScreenV1 — refonte visuelle des 10 slides d'onboarding.
 *
 * Réf IA V3 §IA-01 à §IA-09 + design system V1.1 (Pattern A narratif +
 * Pattern D évaluation) + maquette 4 slide 1 Welcome + palette Phase 0
 * corail (Patch 1 du 14 mai 2026).
 *
 * Architecture : un seul composant racine + state local pour `slideIndex`
 * + `answers`. À la sortie slide 9, appelle `onComplete(answers)` que le
 * RootNavigator route vers IA-10 RegisterScreen (M7+A3 — création de compte
 * uniquement à la slide 10).
 *
 * Reste avant tout VISUEL — la logique de calcul du profil dynamique
 * (computeProfileDynamicId) est appelée côté RootNavigator au reçu des
 * answers, pas ici. Slide 7 affiche le profil via le même mapping pour
 * cohérence affichage / persistance.
 *
 * **Sprint 13 C** : remplace l'OnboardingScreen V0 sombre par cette version
 * V1 corail. Copy = placeholders inspirés de l'Audit copy V1 + voix
 * Brand Core (dense, direct, sans pleasantries, sans emoji). Le copy
 * définitif viendra du Brief contenu V1.
 *
 * Référence IA : IA-01 à IA-09. Pattern : A et D.
 */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Check } from 'lucide-react-native';
import { Button, Scale15 } from '../../components/primitives';
import type { Scale15Value } from '../../components/primitives';
import { LogoRawAdventure } from '../../components/illustrations';
import {
  brandColors,
  interTextStyle,
  layout,
  neutralColors,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import {
  computeProfileDynamicId,
  type OnboardingAnswers,
} from '../../lib/onboarding';

export type OnboardingScreenV1Props = {
  onComplete: (answers: Record<string, string>) => Promise<void> | void;
};

type Answers = OnboardingAnswers;

const TOTAL_SLIDES = 9;

const BODY_OPTIONS = ['Léger', 'Neutre', 'Lourd'];
const MENTAL_OPTIONS = ['Calme', 'Stable', 'Agité'];
const MOTIVATION_OPTIONS = ['Un peu', 'Sérieusement', 'À fond'];

/** Libellés narratifs courts des 9 profils dynamiques (IA-07). */
const PROFILE_COPY: Record<string, { title: string; message: string }> = {
  P1: {
    title: 'Reboot complet.',
    message:
      "Énergie au sol, corps lourd, tête chargée. Tu es exactement là où ce programme fait la plus grande différence. [copy à valider]",
  },
  P2: {
    title: 'Remontée énergétique.',
    message:
      "Ton énergie est en berne — c'est le signal idéal pour commencer. Les premiers jours vont tout changer. [copy à valider]",
  },
  P3: {
    title: 'Décharger corps et mental.',
    message:
      "Quand le corps est lourd et la tête pleine, le cercle vicieux s'installe. On va casser ça dès le J1. [copy à valider]",
  },
  P4: {
    title: 'Lancé.',
    message:
      "Bonne énergie, motivation au top — maintenant on structure ça et on pousse encore plus loin. [copy à valider]",
  },
  P5: {
    title: 'Base solide.',
    message:
      "Tu es dans un bon état. L'objectif ici, c'est de consolider et d'aller chercher encore plus. [copy à valider]",
  },
  P6: {
    title: 'Ton corps veut se relancer.',
    message:
      "14 jours de routine bien choisie, et tu vas sentir la différence. Le corps répond vite quand on lui donne les bons signaux. [copy à valider]",
  },
  P7: {
    title: 'Le mental mène tout.',
    message:
      "Quand la tête est chargée, le corps suit. On commence par remettre du calme là-dedans. [copy à valider]",
  },
  P8: {
    title: 'Petit pas, grand changement.',
    message:
      "Un peu de motivation, c'est tout ce qu'il faut pour démarrer. Le reste vient en faisant. [copy à valider]",
  },
  P0: {
    title: 'Le terrain est posé.',
    message:
      "Tu démarres avec une base équilibrée. La régularité va faire le reste. [copy à valider]",
  },
};

export default function OnboardingScreenV1({ onComplete }: OnboardingScreenV1Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [commitChecked, setCommitChecked] = useState(false);

  const goNext = () => setIndex((i) => Math.min(i + 1, TOTAL_SLIDES - 1));
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

  const handleComplete = async () => {
    // Sérialise les réponses au format Record<string, string> attendu par
    // completeOnboarding (la couche storage stocke des strings).
    const payload: Record<string, string> = {};
    if (answers.energy != null) payload.energy = String(answers.energy);
    if (answers.body) payload.body = answers.body;
    if (answers.mental) payload.mental = answers.mental;
    if (answers.motivation) payload.motivation = answers.motivation;
    await onComplete(payload);
  };

  const profile = computeProfileDynamicId(answers);
  const profileCopy = PROFILE_COPY[profile];

  // Validation slide par slide (le bouton "Continuer" est disabled si la
  // question courante n'a pas de réponse).
  const canAdvance = (() => {
    if (index === 3) return answers.energy != null && !!answers.body;
    if (index === 4) return !!answers.mental && !!answers.motivation;
    if (index === 8) return commitChecked;
    return true;
  })();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Indicateur de progression 10 segments §5.5 (TOTAL_SLIDES + IA-10 final) */}
        <ProgressIndicator current={index + 1} total={TOTAL_SLIDES + 1} />

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {index === 0 && <SlideWelcome />}
          {index === 1 && <SlideText title="Le constat" body="La fatigue moderne est devenue normale. Mais elle n'est pas inévitable. On va remettre les bons signaux. [copy à valider]" />}
          {index === 2 && <SlideText title="La promesse" body="Pas de raccourci. Pas de hack. Une expérience corporelle, guidée, en 10 semaines. Pour sentir la différence dans ton terrain. [copy à valider]" />}
          {index === 3 && (
            <SlideQuestionnaireP1
              answers={answers}
              onChange={(next) => setAnswers((a) => ({ ...a, ...next }))}
            />
          )}
          {index === 4 && (
            <SlideQuestionnaireP2
              answers={answers}
              onChange={(next) => setAnswers((a) => ({ ...a, ...next }))}
            />
          )}
          {index === 5 && (
            <SlideText
              title="La projection"
              body="Dans 14 jours, ton sommeil sera plus dense. Ta digestion plus calme. Ta tête plus claire. Pas magique — physiologique. [copy à valider]"
            />
          )}
          {index === 6 && profileCopy && (
            <SlideText title={profileCopy.title} body={profileCopy.message} />
          )}
          {index === 7 && (
            <SlideText
              title="Comment ça marche"
              body="14 jours gratuits d'amorçage en parallèle. Puis 8 semaines, un pilier de santé par semaine. La toile de vitalité prend forme au fil du parcours. [copy à valider]"
            />
          )}
          {index === 8 && (
            <SlideEngagement
              checked={commitChecked}
              onChange={setCommitChecked}
            />
          )}
        </ScrollView>

        {/* Footer actions */}
        <View style={styles.footer}>
          <Button
            label={index === TOTAL_SLIDES - 1 ? 'Créer mon compte' : 'Continuer'}
            onPress={index === TOTAL_SLIDES - 1 ? handleComplete : goNext}
            disabled={!canAdvance}
            IconRight={ArrowRight}
            fullWidth
            size="large"
            context="phase0"
          />
          {index > 0 && (
            <Button
              label="Précédente"
              variant="ghost"
              onPress={goBack}
              fullWidth
              context="phase0"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Sous-composants slides ────────────────────────────────────────────────────

function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: total }, (_, i) => {
        const reached = i < current;
        const isCurrent = i === current - 1;
        return (
          <View
            key={i}
            style={[
              styles.progressSeg,
              reached && styles.progressSegReached,
              isCurrent && styles.progressSegCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

function SlideWelcome() {
  return (
    <View style={styles.welcomeWrap}>
      <View style={styles.logoHero}>
        <LogoRawAdventure variant="hero" size={300} color={brandColors.deep} />
      </View>
      <Text style={styles.heroTitle}>RAW ADVENTURE</Text>
      <Text style={styles.heroSubtitle}>
        Le diagnostic n'est pas un sujet de motivation. C'est un sujet de
        physiologie. [copy à valider]
      </Text>
    </View>
  );
}

function SlideText({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.slideWrapCenter}>
      <Text style={[styles.slideTitle, styles.center]}>{title}</Text>
      <Text style={[styles.slideBody, styles.center]}>{body}</Text>
    </View>
  );
}

function SlideQuestionnaireP1({
  answers,
  onChange,
}: {
  answers: Answers;
  onChange: (next: Partial<Answers>) => void;
}) {
  return (
    <View style={styles.slideWrapCenter}>
      <Text style={[styles.slideTitle, styles.center]}>Ton énergie au quotidien</Text>
      <View style={{ marginTop: space[5] }}>
        <Scale15
          value={(answers.energy as Scale15Value | undefined) ?? null}
          onChange={(v) => onChange({ energy: v as number })}
          context="phase0"
          leftLabel="Très basse"
          rightLabel="Très haute"
        />
      </View>

      <Text style={[styles.questionLabel, styles.center, { marginTop: space[7] }]}>
        Comment ressens-tu ton corps en ce moment ?
      </Text>
      <View style={[styles.chipRow, styles.centerWrap]}>
        {BODY_OPTIONS.map((opt) => (
          <ChoiceChip
            key={opt}
            label={opt}
            selected={answers.body === opt}
            onPress={() => onChange({ body: opt })}
          />
        ))}
      </View>
    </View>
  );
}

function SlideQuestionnaireP2({
  answers,
  onChange,
}: {
  answers: Answers;
  onChange: (next: Partial<Answers>) => void;
}) {
  return (
    <View style={styles.slideWrapCenter}>
      <Text style={[styles.questionLabel, styles.center]}>Ton mental est plutôt :</Text>
      <View style={[styles.chipRow, styles.centerWrap]}>
        {MENTAL_OPTIONS.map((opt) => (
          <ChoiceChip
            key={opt}
            label={opt}
            selected={answers.mental === opt}
            onPress={() => onChange({ mental: opt })}
          />
        ))}
      </View>

      <Text style={[styles.questionLabel, styles.center, { marginTop: space[7] }]}>
        Tu es prêt à t'engager :
      </Text>
      <View style={[styles.chipRow, styles.centerWrap]}>
        {MOTIVATION_OPTIONS.map((opt) => (
          <ChoiceChip
            key={opt}
            label={opt}
            selected={answers.motivation === opt}
            onPress={() => onChange({ motivation: opt })}
          />
        ))}
      </View>
    </View>
  );
}

function SlideEngagement({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.slideWrap}>
      <Text style={styles.slideTitle}>L'engagement</Text>
      <Text style={styles.slideBody}>
        14 jours d'amorçage gratuit. Pas de carte bancaire. Juste un
        engagement à toi-même : tu joues le jeu pendant 14 jours. [copy à valider]
      </Text>
      <Pressable
        onPress={() => onChange(!checked)}
        style={styles.commitRow}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View
          style={[
            styles.commitBox,
            checked && {
              backgroundColor: brandColors.alive,
              borderColor: brandColors.alive,
            },
          ]}
        >
          {checked && <Check size={20} color="#FFFFFF" strokeWidth={3} />}
        </View>
        <Text style={styles.commitText}>
          Je joue le jeu pendant 14 jours.
        </Text>
      </Pressable>
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.85 },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: pillarColors.phase0.bg },
  flex: { flex: 1 },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: layout.screen.marginHorizontalWide,
    paddingTop: space[3],
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: radiusV1.sm,
    backgroundColor: neutralColors.borderSubtle,
  },
  progressSegReached: {
    backgroundColor: brandColors.alive,
    opacity: 0.55,
  },
  progressSegCurrent: {
    backgroundColor: brandColors.alive,
    opacity: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: layout.screen.marginHorizontalWide,
    paddingTop: space[6],
    paddingBottom: space[5],
  },
  // Slide Welcome (slide 1)
  welcomeWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[4],
    paddingVertical: space[8],
  },
  logoHero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: getInterFamily('800'),
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: 2,
    color: pillarColors.phase0.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
    textAlign: 'center',
  },
  // Slides text / questionnaire
  slideWrap: {
    flex: 1,
    paddingTop: space[3],
    gap: space[3],
  },
  slideWrapCenter: {
    flex: 1,
    paddingTop: space[3],
    gap: space[3],
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  centerWrap: { justifyContent: 'center' },
  slideTitle: {
    ...interTextStyle('display'),
    color: pillarColors.phase0.text,
  },
  slideBody: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
  },
  questionLabel: {
    ...interTextStyle('h3'),
    color: pillarColors.phase0.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    marginTop: space[3],
  },
  chip: {
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderRadius: radiusV1.pill,
    borderWidth: 1.5,
    borderColor: pillarColors.phase0.text,
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: pillarColors.phase0.text,
  },
  chipLabel: {
    fontFamily: getInterFamily('600'),
    fontSize: 15,
    color: pillarColors.phase0.text,
  },
  chipLabelSelected: {
    color: brandColors.cream,
  },
  // Engagement
  commitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginTop: space[5],
    paddingVertical: space[2],
    minHeight: 44,
  },
  commitBox: {
    width: 28,
    height: 28,
    borderRadius: radiusV1.md,
    borderWidth: 2,
    borderColor: pillarColors.phase0.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commitText: {
    ...interTextStyle('bodyLargeEmphasis'),
    color: pillarColors.phase0.text,
    flex: 1,
  },
  footer: {
    padding: layout.screen.marginHorizontalWide,
    gap: space[2],
  },
});
