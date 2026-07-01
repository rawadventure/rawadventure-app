/**
 * PaliersGalleryScreen — IA-51 galerie des paliers de récompense streak.
 *
 * Réf IA V3 §IA-51 + Feature Spec V1 Socle minimum §2.6 + D29.
 *
 * Affiche les 6 paliers (7j, 15j, 30j, 60j, 100j, 1 an) :
 *  - paliers atteints : badge plein couleur + date d'obtention (first_reached_at)
 *    + compteur `reach_count` si > 1 (cassure puis reconstruction — D29)
 *  - paliers non atteints : silhouette grisée pour entretenir frustration positive
 *
 * Accessible depuis :
 *  - IA-50 TierReachedModal bouton "Voir ma galerie" (variante 1er franchissement)
 *  - ProfilTabScreen (IA-70) section "Ma progression"
 *
 * Sortie : retour stack via goBack (selon écran d'origine).
 *
 * Référence IA : IA-51. Pattern : F (galerie).
 */

import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { useProgress } from '../../hooks/ProgressContext';
import { TierReachedModal } from '../../components/compositions';
import { TIER_THRESHOLDS, type TierId } from '../../lib/streak';
import {
  brandColors,
  interTextStyle,
  neutralColors,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';

const TIER_COLOR: Record<TierId, string> = {
  15: brandColors.alive,
  30: pillarColors.s1.headerBg,
  60: pillarColors.s5.headerBg,
  100: pillarColors.s6.headerBg,
  365: brandColors.deep,
};

const TIER_LABEL: Record<TierId, string> = {
  15: '15 jours',
  30: '30 jours',
  60: '60 jours',
  100: '100 jours',
  365: '1 an',
};

const TIER_TAGLINE: Record<TierId, string> = {
  15: 'Cap des deux semaines.',
  30: 'Un mois de pratique.',
  60: 'Deux mois de continuité.',
  100: 'Cap des trois chiffres.',
  365: 'Une année complète.',
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function PaliersGalleryScreen() {
  const navigation = useNavigation();
  const { tierReaches, streak } = useProgress();

  // Palier sélectionné → rouvre la modale palier (avec vidéo) pour relecture.
  const [selectedTier, setSelectedTier] = useState<TierId | null>(null);

  const byId = useMemo(() => {
    const map = new Map<TierId, { first_reached_at: string; reach_count: number }>();
    for (const t of tierReaches) {
      map.set(t.tier_id, {
        first_reached_at: t.first_reached_at,
        reach_count: t.reach_count,
      });
    }
    return map;
  }, [tierReaches]);

  const reachedCount = byId.size;
  const totalCount = TIER_THRESHOLDS.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            // Galerie déclarée uniquement dans ProfilStack (Fix B) → atteinte
            // via push depuis ProfilMain, donc canGoBack vrai. Garde défensive
            // par sécurité (jamais d'erreur GO_BACK).
            if (navigation.canGoBack()) navigation.goBack();
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <ChevronLeft size={26} color={brandColors.deep} />
        </Pressable>
        <Text style={styles.marker}>STREAK · PALIERS</Text>
        <Text style={styles.title}>Tes paliers</Text>
        <Text style={styles.subtitle}>
          {`${reachedCount} sur ${totalCount} atteint${reachedCount > 1 ? 's' : ''} · streak en cours : ${streak} jour${streak > 1 ? 's' : ''}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {TIER_THRESHOLDS.map((tier) => {
            const reach = byId.get(tier);
            const isReached = !!reach;
            const color = TIER_COLOR[tier];
            const value = tier === 365 ? '1' : String(tier);
            const unit = tier === 365 ? 'AN' : 'JOURS';

            return (
              <Pressable
                key={tier}
                disabled={!isReached}
                onPress={() => setSelectedTier(tier)}
                accessibilityRole={isReached ? 'button' : undefined}
                accessibilityLabel={isReached ? `Revoir le palier ${TIER_LABEL[tier]}` : undefined}
                style={({ pressed }) => [
                  styles.card,
                  !isReached && styles.cardLocked,
                  pressed && isReached && { opacity: 0.85 },
                ]}
              >
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isReached ? color : neutralColors.borderSubtle,
                    },
                  ]}
                >
                  {isReached ? (
                    <>
                      <Text style={styles.badgeNumber}>{value}</Text>
                      <Text style={styles.badgeLabel}>{unit}</Text>
                    </>
                  ) : (
                    <Lock size={28} color={neutralColors.textSecondary} strokeWidth={2} />
                  )}
                </View>
                <Text style={[styles.cardTitle, !isReached && styles.cardTextLocked]}>
                  {TIER_LABEL[tier]}
                </Text>
                <Text style={[styles.cardTagline, !isReached && styles.cardTextLocked]}>
                  {TIER_TAGLINE[tier]}
                </Text>
                {isReached && reach && (
                  <>
                    <Text style={styles.cardDate}>
                      Atteint le {formatDate(reach.first_reached_at)}
                    </Text>
                    {reach.reach_count > 1 && (
                      <Text style={styles.cardRepeat}>
                        Repassé {reach.reach_count} fois
                      </Text>
                    )}
                  </>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.footnote}>
          Les paliers déjà atteints restent acquis même si le streak repart à
          zéro — ce qui est posé est posé. [copy à valider]
        </Text>
      </ScrollView>

      {/* Relecture : taper une carte de palier atteint rouvre la modale palier
          (vidéo + message). Pas de `onViewGallery` — on est déjà dans la galerie. */}
      <TierReachedModal
        visible={selectedTier != null}
        tierId={selectedTier}
        isFirstReach
        streakValue={streak}
        onClose={() => setSelectedTier(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brandColors.cream },
  header: {
    paddingHorizontal: space[5],
    paddingTop: space[2],
    paddingBottom: space[4],
    gap: space[1],
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: space[1],
  },
  marker: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.7,
  },
  title: {
    ...interTextStyle('h1'),
    color: brandColors.deep,
  },
  subtitle: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    opacity: 0.75,
    marginTop: space[1],
  },
  scroll: {
    paddingHorizontal: space[5],
    paddingBottom: space[8],
    gap: space[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[3],
  },
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: radiusV1.xl,
    padding: space[4],
    gap: space[2],
    borderWidth: 1.5,
    borderColor: brandColors.deep + '22',
    alignItems: 'center',
  },
  cardLocked: {
    backgroundColor: neutralColors.surfaceElevated,
    borderColor: neutralColors.borderSubtle,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[1],
  },
  badgeNumber: {
    fontFamily: getInterFamily('800'),
    fontSize: 24,
    lineHeight: 26,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  badgeLabel: {
    fontFamily: getInterFamily('700'),
    fontSize: 9,
    letterSpacing: 1,
    color: '#FFFFFF',
    marginTop: 2,
  },
  cardTitle: {
    ...interTextStyle('h3'),
    color: brandColors.deep,
    textAlign: 'center',
  },
  cardTagline: {
    ...interTextStyle('bodySmall'),
    color: brandColors.deep,
    textAlign: 'center',
    opacity: 0.75,
  },
  cardDate: {
    ...interTextStyle('caption'),
    color: brandColors.alive,
    textAlign: 'center',
    marginTop: space[1],
  },
  cardRepeat: {
    ...interTextStyle('caption'),
    color: brandColors.deep,
    opacity: 0.6,
    textAlign: 'center',
  },
  cardTextLocked: {
    opacity: 0.55,
  },
  footnote: {
    ...interTextStyle('bodySmall'),
    color: brandColors.deep,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: space[4],
  },
});
