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
import { VideoPreview } from '../../components/compositions/VideoPreview';
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
  /** Optionnel : navigation vers la galerie des paliers (J14 uniquement,
   *  variante riche style palier 7j). */
  onViewGallery?: () => void;
};

/** Vidéo Mimi & Jacky "Fin de Phase 0" pour J14 — à shooter (brief contenu
 *  Session 1 étendu). URL Supabase placeholder en attendant. Le fichier peut
 *  ne pas exister tant que tournage pas fait → fallback gracieux côté Video
 *  component. */
const CHARNIERE_VIDEO_BASE =
  'https://aknvitrtfxqjdwiyxryt.supabase.co/storage/v1/object/public/phase0-videos';

/**
 * Jours-charnière "riches" (badge cercle + vidéo Mimi & Jacky), par opposition
 * aux jours text-only (J3, J11). J7 et J14 sont des moments d'histoire liés à
 * la PROGRESSION (7e / 14e jour du parcours), pas au streak. La vidéo J7
 * (`charniere-j7-une-semaine.mp4`, ex-`palier-7j.mp4`) a été repositionnée en
 * marqueur de progression — décision Stéphane 2026-07-01, conforme D19 :
 * J3/J7/J11/J14 charnières. La récompense de série démarre désormais à
 * 15 jours (streak.ts).
 */
const RICH_CHARNIERE: Partial<
  Record<CharniereDay, { videoUrl: string; badgeNumber: string; badgeLabel: string; badgeColor: string }>
> = {
  7: {
    videoUrl: `${CHARNIERE_VIDEO_BASE}/charniere-j7-une-semaine.mp4`,
    badgeNumber: '7',
    badgeLabel: 'JOURS',
    badgeColor: brandColors.sun,
  },
  14: {
    videoUrl: `${CHARNIERE_VIDEO_BASE}/charniere-j14-fin-phase-0.mp4`,
    badgeNumber: '14',
    badgeLabel: 'JOURS',
    badgeColor: brandColors.sun,
  },
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
    body: "Une semaine. Pense à ça comme à un entraînement, pas à une pilule. Les effets ne sont pas immédiats, et chacun avance à son rythme — c'est normal, ça se construit dans le temps. Ce qui compte, c'est que tu pratiques, jour après jour. Le corps répond dans la durée, pas dans l'instant. [copy à valider]",
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
    title: 'Quatorze jours.\nUn premier ressenti.',
    body: "Tu as expérimenté pendant deux semaines. Pas pour la performance — pour sentir. Ce ressenti, il est à toi : c'est le vrai acquis. Et ce n'est que le début. Si tu veux continuer avec nous, c'est pour construire des bases solides, profondes, sur le long terme. [copy à valider]",
    cta: 'Voir la suite',
  },
};

export default function JourCharniereScreen({
  visible,
  day,
  streak,
  onClose,
  onViewGallery,
}: JourCharniereScreenProps) {
  if (!day) return null;
  const copy = COPY[day];
  const rich = RICH_CHARNIERE[day];

  // Variant riche (badge cercle + vidéo) pour les jours-charnière porteurs
  // d'une vidéo d'histoire : J7 et J14. Ce sont des marqueurs de PROGRESSION
  // (7e / 14e jour du parcours), pas des récompenses de streak. J3/J11 restent
  // text-only.
  if (rich) {
    return (
      <Modal visible={visible} onClose={onClose} variant="fullscreen" context="neutral" dismissable={false}>
        <ScrollView contentContainerStyle={styles.scrollRich}>
          <View>
            <View style={styles.markerRow}>
              <Sparkle size={16} color={brandColors.deep} fill={brandColors.deep} />
              <Text style={styles.markerRich}>{copy.marker}</Text>
            </View>
            <Text style={styles.titleRich}>{copy.title}</Text>
            <Text style={styles.bodyRich}>{copy.body}</Text>
          </View>

          {/* Badge cercle "N JOURS" — marqueur de progression. */}
          <View style={styles.badgeWrap}>
            <View style={[styles.badgeLarge, { backgroundColor: rich.badgeColor }]}>
              <Text style={styles.badgeNumber}>{rich.badgeNumber}</Text>
              <Text style={styles.badgeLabel}>{rich.badgeLabel}</Text>
            </View>
          </View>

          {/* Vidéo Mimi & Jacky — preview 16:9 + lecture. */}
          <VideoPreview uri={rich.videoUrl} accessibilityLabel="Lire la vidéo" />
        </ScrollView>
        <View style={styles.footerRich}>
          {onViewGallery && (
            <Button
              label="Voir mes paliers"
              variant="secondary"
              onPress={onViewGallery}
              fullWidth
            />
          )}
          <Button label={copy.cta} onPress={onClose} fullWidth size="large" />
        </View>
      </Modal>
    );
  }

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
  // ── Variant riche J14 (style palier 7j) ─────────────────────────────────
  scrollRich: {
    flexGrow: 1,
    padding: space[6],
    gap: space[5],
    justifyContent: 'space-between',
  },
  markerRich: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  titleRich: {
    ...interTextStyle('display'),
    color: brandColors.deep,
    marginTop: space[2],
    marginBottom: space[3],
  },
  bodyRich: {
    ...interTextStyle('bodyLarge'),
    color: brandColors.deep,
  },
  badgeWrap: { alignItems: 'center', marginVertical: space[3] },
  badgeLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumber: {
    fontFamily: getInterFamily('800'),
    fontSize: 36,
    color: '#FFFFFF',
    lineHeight: 40,
  },
  badgeLabel: {
    fontFamily: getInterFamily('700'),
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  footerRich: {
    padding: space[6],
    gap: space[2],
  },
});

// brandColors référencé pour conservation d'import — utilisé via theme tokens.
void brandColors;
