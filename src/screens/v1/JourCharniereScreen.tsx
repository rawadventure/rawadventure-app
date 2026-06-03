/**
 * JourCharniereScreen — IA-14 (J3 / J7 / J11 / J14).
 *
 * Réf IA V3 §IA-14 + Feature Spec V1 Socle minimum §2.3 (file d'attente
 * narrative) + D19 (4 écrans jour-charnière en Phase 0) + D25 (un par
 * lancement) + D37 (effet miroir qualitatif V1).
 *
 * Couche superposée à l'accueil au premier lancement du jour concerné. Une
 * variante par jour (3, 7, 11, 14). Marquée vue au déclenchement via
 * `markNarrativeSeen(id)` du ProgressContext (§2.3 — flag posé à
 * l'affichage, pas à la fermeture, pour éviter rejouer si l'utilisateur
 * ferme l'app pendant l'écran).
 *
 * Copy : placeholders Sprint 6 marqués `[copy à valider]`. Le copy
 * définitif viendra du Brief contenu V1 produit par Mimi & Jacky avec
 * effet miroir qualitatif (D37 — 8 à 12 phrases qualitatives à intégrer
 * dans IA-14).
 *
 * Référence IA : IA-14. Pattern : A (écran narratif plein).
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Sparkle } from 'lucide-react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import {
  brandColors,
  interTextStyle,
  pillarColors,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import { LogoRawAdventure } from '../../components/illustrations';

export type CharniereDay = 3 | 7 | 11 | 14;

export type JourCharniereScreenProps = {
  visible: boolean;
  day: CharniereDay | null;
  /** Streak courant — affiché dans le pied de l'écran. */
  streak: number;
  onClose: () => void;
};

type CharniereCopy = { marker: string; title: string; body: string; cta: string };

/**
 * Copy placeholder par jour-charnière. À remplacer par le Brief contenu V1
 * qui produira 8 à 12 phrases d'effet miroir qualitatives (D37) à intégrer
 * dans les jours J3/J4/J7/J11. La structure ici (marker / title / body / cta)
 * est conservée pour rester plug-and-play.
 */
const COPY: Record<CharniereDay, CharniereCopy> = {
  3: {
    marker: 'Jour 3 · cap symbolique',
    title: 'Le corps commence\nà répondre.',
    body: "Trois jours, c'est court — mais ton corps a déjà reçu les premiers signaux. Une digestion qui change, un sommeil un peu différent, une énergie légèrement autre. Tu commences à sentir. Continue — c'est exactement là que ça commence.",
    cta: 'Je continue',
  },
  7: {
    marker: 'Jour 7 · une semaine',
    title: 'Sept jours.',
    body: "Une semaine de signaux quotidiens, c'est ce qu'il faut pour que le corps commence à recalibrer son fonctionnement de base. Sommeil un peu plus dense, énergie plus stable au réveil, moins de pics de faim — ce sont des indices, pas des illusions. Tu n'es plus en train d'essayer. Tu pratiques. Et le corps suit.",
    cta: 'Je continue',
  },
  11: {
    marker: 'Jour 11 · ligne droite finale',
    title: 'Le plus dur est\nderrière toi.',
    body: "Onze jours. Tu es dans la dernière ligne droite. Ce que tu ressens maintenant — cette légèreté, cette clarté qui s'installe — c'est ton corps qui a intégré les signaux. Trois jours pour terminer ce que tu as commencé. Tu ne lâches pas maintenant.",
    cta: 'Je continue',
  },
  14: {
    marker: 'Jour 14 · fin de Phase 0',
    title: 'Tu as tenu.\n14 jours.',
    body: "Quatorze jours. Tu as fait ce que peu font — pas par intensité, par choix. Ton corps n'est plus le même qu'au Jour 1. Champion de ta vie. C'est toi.",
    cta: 'Voir la suite',
  },
};

export default function JourCharniereScreen({
  visible,
  day,
  streak,
  onClose,
}: JourCharniereScreenProps) {
  if (!day) return null;
  const copy = COPY[day];

  return (
    <Modal visible={visible} onClose={onClose} variant="fullscreen" context="phase0" dismissable={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <View style={styles.markerRow}>
            <Sparkle size={16} color={pillarColors.phase0.text} fill={pillarColors.phase0.text} />
            <Text style={styles.marker}>{copy.marker}</Text>
          </View>
          <Text style={styles.title}>{copy.title}</Text>
        </View>

        <View style={styles.illustrationWrap}>
          <LogoRawAdventure
            variant="filigrane"
            size={180}
            opacity={0.25}
            color={pillarColors.phase0.text}
          />
        </View>

        <Text style={styles.body}>{copy.body}</Text>

        <View style={styles.streakBlock}>
          <Text style={styles.streakLabel}>Streak</Text>
          <Text style={styles.streakValue}>
            {streak} jour{streak > 1 ? 's' : ''}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label={copy.cta} onPress={onClose} fullWidth size="large" context="phase0" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: space[6],
    gap: space[4],
    // Centre verticalement le contenu — équilibre visuel quand body court.
    justifyContent: 'center',
  },
  head: { gap: space[3] },
  markerRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  marker: {
    ...interTextStyle('caption'),
    color: pillarColors.phase0.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...interTextStyle('display'),
    color: pillarColors.phase0.text,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginVertical: space[2],
  },
  body: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
    fontSize: 19,
    lineHeight: 28,
  },
  streakBlock: {
    marginTop: space[4],
    paddingTop: space[4],
    borderTopWidth: 1,
    borderTopColor: pillarColors.phase0.text + '22',
    gap: space[1],
  },
  streakLabel: {
    ...interTextStyle('caption'),
    color: pillarColors.phase0.text,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  streakValue: {
    fontFamily: getInterFamily('700'),
    fontSize: 22,
    color: pillarColors.phase0.text,
  },
  footer: {
    padding: space[6],
  },
});

// brandColors référencé pour conservation d'import — utilisé via theme tokens.
void brandColors;
