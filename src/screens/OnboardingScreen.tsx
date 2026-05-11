import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onComplete: (answers: Record<string, string>) => void;
}

type Answers = {
  energy?:     number;   // 1–10
  body?:       string;   // Léger | Neutre | Lourd
  mental?:     string;   // Calme | Stable | Agité
  motivation?: string;   // Un peu | Sérieusement | À fond
};

// ─── Hints par question ───────────────────────────────────────────────────────

const BODY_HINTS: Record<string, string> = {
  'Léger':  '👌 Tu pars avec un bon capital.',
  'Neutre': 'On a de la marge pour progresser.',
  'Lourd':  "C'est exactement pour ça qu'on est là.",
};

const MENTAL_HINTS: Record<string, string> = {
  'Calme':  '✨ Parfait pour intégrer de nouvelles habitudes.',
  'Stable': 'Bonne base. On construit dessus.',
  'Agité':  "On va t'aider à retrouver le calme.",
};

const MOTIVATION_HINTS: Record<string, string> = {
  'Un peu':       "C'est suffisant pour commencer. Sérieusement.",
  'Sérieusement': "💪 Cette énergie-là, on va bien l'utiliser.",
  'À fond':       '🔥 On va aller chercher le max.',
};

// ─── Profil final enrichi ─────────────────────────────────────────────────────

type Profile = { emoji: string; title: string; message: string; cta: string };

function getProfile(a: Answers): Profile {
  const e          = a.energy ?? 5;
  const isLow      = e <= 3;
  const isHigh     = e >= 7;
  const isHeavy    = a.body       === 'Lourd';
  const isAgitated = a.mental     === 'Agité';
  const isFired    = a.motivation === 'À fond';
  const isHesitant = a.motivation === 'Un peu';

  if (isLow && isHeavy && isAgitated) return {
    emoji:   '🔄',
    title:   'Le reboot complet.',
    message: "Énergie au sol, corps lourd, tête chargée. Tu es exactement là où ce programme fait la plus grande différence.",
    cta:     "Dans 14 jours, tu ne te reconnaîtras plus.",
  };
  if (isLow) return {
    emoji:   '🌅',
    title:   'Il est temps de remettre les compteurs à zéro.',
    message: "Ton énergie est en berne — c'est le signal idéal pour commencer. Les premiers jours vont tout changer.",
    cta:     "La remontée commence dès demain.",
  };
  if (isHeavy && isAgitated) return {
    emoji:   '🧹',
    title:   'Corps et mental à décharger.',
    message: "Quand le corps est lourd et la tête pleine, le cercle vicieux s'installe. On va casser ça dès le Jour 1.",
    cta:     "14 jours pour retrouver la légèreté.",
  };
  if (isHigh && isFired) return {
    emoji:   '🚀',
    title:   'Tu es déjà lancé.',
    message: "Bonne énergie, motivation au top — maintenant on structure ça et on pousse encore plus loin.",
    cta:     "14 jours pour passer au niveau supérieur.",
  };
  if (isHigh) return {
    emoji:   '⚡️',
    title:   'Bonne base à exploiter.',
    message: "Tu es dans un bon état. L'objectif ici, c'est de consolider et d'aller chercher encore plus.",
    cta:     "On maintient. On booste.",
  };
  if (isHeavy) return {
    emoji:   '🪶',
    title:   'Ton corps veut se relancer.',
    message: "14 jours de routine bien choisie, et tu vas sentir la différence. Le corps répond vite quand on lui donne les bons signaux.",
    cta:     "C'est ce qu'on va faire ensemble.",
  };
  if (isAgitated) return {
    emoji:   '🧘',
    title:   'Le mental mène tout.',
    message: "Quand la tête est chargée, le corps suit. On commence par remettre du calme là-dedans.",
    cta:     "14 jours, une habitude à la fois.",
  };
  if (isHesitant) return {
    emoji:   '🌱',
    title:   'Petit pas, grand changement.',
    message: "Un peu de motivation, c'est tout ce qu'il faut pour démarrer. Le reste vient en faisant.",
    cta:     "14 jours simples. Juste essaie.",
  };
  return {
    emoji:   '🎯',
    title:   'Ton corps est prêt.',
    message: "Tu as tout ce qu'il faut pour démarrer. Le programme va te donner la structure pour évoluer.",
    cta:     "Dans 14 jours, tu mesureras la différence.",
  };
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  // step = 0..3 (question actuelle parmi 4)
  return (
    <View style={pb.bar}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[pb.seg, i <= step && pb.segActive]} />
      ))}
    </View>
  );
}

const pb = StyleSheet.create({
  bar:       { flexDirection: 'row', gap: 6, paddingTop: spacing.md, paddingBottom: spacing.xl },
  seg:       { flex: 1, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  segActive: { backgroundColor: colors.green },
});

interface TapQuestionProps {
  label:    string;
  question: string;
  options:  string[];
  emojis?:  string[];
  hints?:   Record<string, string>;
  selected: string | null;
  onSelect: (v: string) => void;
  onNext:   () => void;
  qStep:    number;
}

function TapQuestion({ label, question, options, emojis, hints, selected, onSelect, onNext, qStep }: TapQuestionProps) {
  const hint = selected && hints ? hints[selected] : null;
  return (
    <>
      <ProgressBar step={qStep} />
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>{label}</Text>
        <Text style={styles.h1}>{question}</Text>
        <View style={styles.options}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={opt}
              style={[styles.option, selected === opt && styles.optionSelected]}
              onPress={() => onSelect(opt)}
            >
              <Text style={styles.optionEmoji}>{emojis ? emojis[i] : ''}</Text>
              <Text style={[styles.optionText, selected === opt && styles.optionTextSelected]}>
                {opt}
              </Text>
              {selected === opt && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        {hint && (
          <View style={styles.inlineHint}>
            <Text style={styles.inlineHintText}>{hint}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
        onPress={onNext}
        disabled={!selected}
      >
        <Text style={styles.primaryBtnText}>Suivant 👉</Text>
      </TouchableOpacity>
    </>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function OnboardingScreen({ onComplete }: Props) {
  const [step,     setStep]     = useState(0);
  const [answers,  setAnswers]  = useState<Answers>({});
  const [engaged,  setEngaged]  = useState(false);

  const next = () => setStep(s => s + 1);

  const finish = () => {
    onComplete({
      energy:     String(answers.energy ?? ''),
      body:       answers.body       ?? '',
      mental:     answers.mental     ?? '',
      motivation: answers.motivation ?? '',
    });
  };

  // ── Slide 0 — Accroche ──────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>⚡️</Text>
          <Text style={styles.brand}>RAW ADVENTURE</Text>
          <Text style={styles.h1}>14 jours pour relancer ton énergie</Text>
          <Text style={styles.tagline}>Simple. Concret. Efficace.</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={next}>
          <Text style={styles.primaryBtnText}>Commencer 👉</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Slide 1 — Promesse ──────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.sectionTag}>En 14 jours :</Text>
          <View style={styles.promiseList}>
            {[
              { emoji: '⚡️', text: 'plus d\'énergie' },
              { emoji: '🪶', text: 'corps plus léger' },
              { emoji: '🧠', text: 'esprit plus clair' },
            ].map((p, i) => (
              <View key={i} style={styles.promiseRow}>
                <Text style={styles.promiseEmoji}>{p.emoji}</Text>
                <Text style={styles.promiseText}>{p.text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.tagline}>Tu testes. Tu ressens.</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={next}>
          <Text style={styles.primaryBtnText}>Continuer 👉</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Slide 2 — Positionnement ────────────────────────────────────────────────
  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>🎯</Text>
          <Text style={styles.h1}>Pas de théorie inutile.</Text>
          <Text style={styles.tagline}>Juste du concret à faire chaque jour.</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={next}>
          <Text style={styles.primaryBtnText}>Continuer 👉</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Slide 3 — Énergie (grille 1-10) ────────────────────────────────────────
  if (step === 3) {
    const sel = answers.energy;
    const hint = sel === undefined ? '' : sel <= 3 ? '😴 Pas top...' : sel <= 6 ? '😐 Ça peut mieux faire' : '💪 Déjà bien !';
    return (
      <SafeAreaView style={styles.container}>
        <ProgressBar step={0} />
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>Énergie actuelle</Text>
          <Text style={styles.h1}>Aujourd'hui, ton niveau d'énergie :</Text>
          <View style={styles.energyGrid}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.energyBtn, sel === n && styles.energyBtnSelected]}
                onPress={() => setAnswers(a => ({ ...a, energy: n }))}
              >
                <Text style={[styles.energyBtnText, sel === n && styles.energyBtnTextSelected]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {sel !== undefined && <Text style={styles.energyHint}>{hint}</Text>}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, sel === undefined && styles.primaryBtnDisabled]}
          onPress={next}
          disabled={sel === undefined}
        >
          <Text style={styles.primaryBtnText}>Suivant 👉</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Slide 4 — Corps ─────────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <TapQuestion
          qStep={1}
          label="Corps"
          question="Ton corps se sent :"
          options={['Léger', 'Neutre', 'Lourd']}
          emojis={['🪶', '😐', '🏋️']}
          hints={BODY_HINTS}
          selected={answers.body ?? null}
          onSelect={v => setAnswers(a => ({ ...a, body: v }))}
          onNext={next}
        />
      </SafeAreaView>
    );
  }

  // ── Slide 5 — Mental ────────────────────────────────────────────────────────
  if (step === 5) {
    return (
      <SafeAreaView style={styles.container}>
        <TapQuestion
          qStep={2}
          label="Mental"
          question="Ton mental est plutôt :"
          options={['Calme', 'Stable', 'Agité']}
          emojis={['🧘', '😌', '🌀']}
          hints={MENTAL_HINTS}
          selected={answers.mental ?? null}
          onSelect={v => setAnswers(a => ({ ...a, mental: v }))}
          onNext={next}
        />
      </SafeAreaView>
    );
  }

  // ── Slide 6 — Motivation ────────────────────────────────────────────────────
  if (step === 6) {
    return (
      <SafeAreaView style={styles.container}>
        <TapQuestion
          qStep={3}
          label="Motivation"
          question="Tu es prêt à t'engager :"
          options={['Un peu', 'Sérieusement', 'À fond']}
          emojis={['🌱', '💪', '🔥']}
          hints={MOTIVATION_HINTS}
          selected={answers.motivation ?? null}
          onSelect={v => setAnswers(a => ({ ...a, motivation: v }))}
          onNext={next}
        />
      </SafeAreaView>
    );
  }

  // ── Slide 7 — Profil dynamique ───────────────────────────────────────────────
  if (step === 7) {
    const profile = getProfile(answers);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>{profile.emoji}</Text>
          <Text style={styles.feedbackLabel}>{profile.title}</Text>
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackText}>{profile.message}</Text>
          </View>
          <View style={styles.savingRow}>
            <Text style={styles.savingIcon}>📍</Text>
            <Text style={styles.savingText}>
              {profile.cta}{'\n'}Ton point de départ est enregistré.
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={next}>
          <Text style={styles.primaryBtnText}>Continuer 👉</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Slide 8 — Engagement ────────────────────────────────────────────────────
  if (step === 8) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>🤝</Text>
          <Text style={styles.h1}>Un seul engagement.</Text>
          <TouchableOpacity
            style={[styles.engageBox, engaged && styles.engageBoxActive]}
            onPress={() => setEngaged(e => !e)}
            activeOpacity={0.8}
          >
            <View style={[styles.engageCheck, engaged && styles.engageCheckDone]}>
              {engaged && <Text style={styles.engageCheckMark}>✓</Text>}
            </View>
            <Text style={[styles.engageText, engaged && styles.engageTextActive]}>
              Je joue le jeu pendant 14 jours
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, !engaged && styles.primaryBtnDisabled]}
          onPress={next}
          disabled={!engaged}
        >
          <Text style={styles.primaryBtnText}>Je m'engage 💪</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Slide 9 — Lancement ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={[styles.bigEmoji, { fontSize: 80 }]}>🚀</Text>
        <Text style={styles.brand}>C'est parti.</Text>
        <Text style={styles.h1}>Jour 1 commence maintenant.</Text>
        <Text style={styles.tagline}>14 jours. Une habitude à la fois.</Text>
      </View>
      <TouchableOpacity style={styles.primaryBtn} onPress={finish}>
        <Text style={styles.primaryBtnText}>Démarrer le Jour 1 →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },

  bigEmoji: { fontSize: 72 },
  brand: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 4,
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 34,
  },
  tagline: {
    fontSize: 17,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: spacing.sm,
  },
  sectionTag: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.green,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },

  // Promesses
  promiseList: { alignSelf: 'stretch', gap: spacing.sm },
  promiseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promiseEmoji: { fontSize: 24 },
  promiseText:  { fontSize: 17, color: colors.white, fontWeight: '600', flex: 1 },

  // Questions
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.green,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 18,
    paddingHorizontal: spacing.md,
  },
  optionSelected: {
    backgroundColor: colors.greenDark + '30',
    borderColor: colors.green,
  },
  optionEmoji:         { fontSize: 22, width: 30 },
  optionText:          { fontSize: 17, color: colors.grayLight, flex: 1 },
  optionTextSelected:  { color: colors.white, fontWeight: '600' },
  checkmark:           { fontSize: 18, color: colors.green, fontWeight: '700' },

  // Énergie grille
  energyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  energyBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  energyBtnSelected: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  energyBtnText:         { fontSize: 18, fontWeight: '700', color: colors.gray },
  energyBtnTextSelected: { color: colors.white },
  energyHint: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.grayLight,
    marginTop: spacing.sm,
  },
  inlineHint: {
    backgroundColor: colors.greenDark + '22',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.green + '44',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  inlineHintText: {
    fontSize: 15,
    color: colors.grayLight,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Feedback
  feedbackLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  feedbackCard: {
    backgroundColor: colors.greenDark + '22',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.green + '55',
    alignSelf: 'stretch',
  },
  feedbackText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
  savingIcon: { fontSize: 20 },
  savingText: { fontSize: 15, color: colors.grayLight, flex: 1, lineHeight: 22 },

  // Engagement
  engageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
  engageBoxActive: {
    backgroundColor: colors.greenDark + '30',
    borderColor: colors.green,
  },
  engageCheck: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  engageCheckDone: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  engageCheckMark: { fontSize: 16, color: colors.white, fontWeight: '700' },
  engageText: {
    fontSize: 17,
    color: colors.grayLight,
    flex: 1,
    lineHeight: 24,
  },
  engageTextActive: { color: colors.white, fontWeight: '600' },

  // Boutons
  primaryBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.35 },
  primaryBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
});
