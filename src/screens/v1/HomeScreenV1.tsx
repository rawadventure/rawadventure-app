/**
 * HomeScreenV1 — IA-11 Hub d'accueil quotidien (Phase 0).
 *
 * Réf IA V3 §IA-11 + design system V1.1 §10.2 (Pattern B PATCHÉ V1.1) +
 * Feature Spec V1 Socle minimum §2.4. Décisions D6 (seuil 5/7), D26
 * (soft-rappel), D34 (pas de score quotidien stocké).
 *
 * Structure V1.1 (§10.2) :
 *   1. Safe area + status bar adaptée
 *   2. PillarHeader Phase 0 corail + logo filigrane + bulle streak intégrée
 *   3. Corps fond pêche pastel
 *   4. Message du jour Mimi & Jacky (body-large, placeholder Sprint 5)
 *   5. Card forte "Actions du jour" avec checklist 7 actions + compteur X/7
 *   6. Bouton primaire "Valider ma journée" pleine largeur
 *
 * Validation flow :
 *   - User coche N actions sur 7 (state local persisté par localDate)
 *   - Tap "Valider ma journée" → ouvre DailyCheckModal (IA-15)
 *   - Selon N : soit confirmation directe (N >= 5), soit soft-rappel D26 (N < 5)
 *   - Sur confirmation → `validateDay()` écrit progress + streak_history +
 *     joker_consumptions + tier_reaches selon la décision déterminée
 *   - Si palier franchi → TODO IA-50 (Sprint 6+ — pour V5 simple alert)
 *
 * Cette V1 NE GÈRE PAS encore :
 *   - Vidéo de bienvenue IA-12 (premier lancement J1) — Sprint 6+
 *   - Jours-charnière J3/J7/J11/J14 (couches superposées) — Sprint 6+
 *   - Phase 1 (autre Hub d'accueil, Pattern B variante S{N}) — Sprint 7+
 *
 * Référence IA : IA-11 (Phase 0 uniquement). Pattern : B.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Check, CheckCircle2 } from 'lucide-react-native';
import { Button, Card } from '../../components/primitives';
import NotificationPermissionBanner from '../../components/NotificationPermissionBanner';
import { PillarHeader, TierReachedModal } from '../../components/compositions';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  type PermissionStatus,
} from '../../lib/notifications';
import { DailyCheckModal } from '../../components/compositions/DailyCheckModal';
import JourCharniereScreen, { type CharniereDay } from './JourCharniereScreen';
import S01Screen from './S01Screen';
import S02Screen from './S02Screen';
import WelcomeVideoScreen from './WelcomeVideoScreen';
import Phase1HomeScreen from './Phase1HomeScreen';
import ConsolidationHomeScreen from './ConsolidationHomeScreen';
import { TIER_THRESHOLDS, type TierId } from '../../lib/streak';
import type { NarrativeEventId } from '../../hooks/ProgressContext';
import {
  brandColors,
  interTextStyle,
  neutralColors,
  pillarColors,
  radiusV1,
  space,
} from '../../theme';
import { getInterFamily } from '../../theme';
import { useProgress } from '../../hooks/ProgressContext';
import { useSubscription } from '../../hooks/SubscriptionContext';
import { todayLocalDate } from '../../lib/calendar';
import { PHASE_0_ACTIONS, type Phase0ActionId } from '../../data/phase0-actions';
import type { Phase0StackParamList } from '../../navigation/HomeStack';

const PHASE_0_TOTAL = 7;
const PHASE_0_THRESHOLD = 5;

type DailyChecksMap = Record<Phase0ActionId, boolean>;
const EMPTY_CHECKS: DailyChecksMap = {
  activation_matinale: false,
  defi_froid: false,
  mouvement_recuperation: false,
  mineralisation: false,
  fenetre_digestive: false,
  fruits: false,
  soiree_sans_ecrans: false,
};

const STORAGE_KEY = (localDate: string) => `daily_check_actions.${localDate}`;

/**
 * Messages du jour J1-J14 — affichés sur HomeScreenV1 quand la journée n'est
 * pas encore validée. Drafts Mimi validés 3 juin 2026.
 */
const MESSAGES_DU_JOUR_PHASE_0: Record<number, string> = {
  1: "Premier jour. Pas un défi — un retour à toi-même. Ton corps n'attendait que ça.",
  2: "Jour 2. Hier c'était le début. Aujourd'hui c'est le choix. Nuance.",
  3: "Tu approches du premier seuil. Trois jours de signaux envoyés. Demain, tu vas sentir ce qui a déjà bougé.",
  4: "Quatre jours. Si ton sommeil a changé, même légèrement, ce n'est pas un hasard. Le corps répond à ce qu'on lui donne.",
  5: "Mi-parcours de la première semaine. Continue d'écouter — la fatigue qui baisse, la digestion qui s'allège. Ton corps parle. Tu apprends à l'entendre.",
  6: "Six jours. Le rythme est posé. Pas spectaculaire — physiologique. C'est ce qui dure.",
  7: "Une semaine. Demain, on regarde le chemin parcouru. Aujourd'hui, on coche encore.",
  8: "Deuxième semaine. Le corps a digéré les premiers signaux. Maintenant il intègre.",
  9: "Neuf jours. La régularité fait le travail à ta place. Les actions de base demandent moins d'effort qu'au début.",
  10: "Dix jours. Cap des deux tiers. Ce qui était nouveau il y a une semaine devient automatique.",
  11: "Onze jours. Dernière ligne droite. Dans trois jours, tu auras bouclé ce que beaucoup n'osent même pas commencer.",
  12: "Douze jours. La marge est là — tu peux souffler sans casser le rythme. Le corps a intégré.",
  13: "Treize jours. Demain, dernier jour d'amorçage. Profite de cette journée pour sentir ce qui a changé.",
  14: "Quatorze jours. Tu as bouclé l'amorçage. Ton corps n'est plus le même qu'au Jour 1. La suite commence maintenant.",
};

type NavProp = NativeStackNavigationProp<Phase0StackParamList>;

export default function HomeScreenV1() {
  const navigation = useNavigation<NavProp>();
  const {
    currentDay,
    currentPhase,
    streak,
    streakHistory,
    validateDay,
    narrativeFlags,
    markNarrativeSeen,
    currentPillarId,
    accountCreatedAt,
    pendingTierReach,
    setPendingTier,
    clearPendingTier,
    tierReaches,
    startPillarWeek,
  } = useProgress();
  const { isActive: subscriptionActive } = useSubscription();

  // J17 auto-start S1 — bascule Phase 1 automatique. Si user a complété
  // l'éval Respiration en J16 (flag s0_2_screen + currentPillarId resté null
  // car handleStart sur J16 ne fait pas startPillarWeek), à J17 currentPhase
  // passe à 'phase_1' et ce useEffect pose currentPillarId + pillarStartedAt
  // → re-render → Phase1HomeScreen affiché. Cas absence longue D25 traité
  // pareil (J17+ direct).
  useEffect(() => {
    if (
      currentPhase === 'phase_1' &&
      !currentPillarId &&
      narrativeFlags.s0_2_screen
    ) {
      void startPillarWeek('S1');
    }
  }, [currentPhase, currentPillarId, narrativeFlags.s0_2_screen, startPillarWeek]);

  // DEV flag — pareil que ProfilTabScreen DEV panel. Permet d'afficher le
  // bouton "(DEV) Valider + jour suivant" dans la modale IA-15.
  const devPanelEnabled =
    __DEV__ || process.env.EXPO_PUBLIC_ENABLE_DEV_PANEL === 'true';

  // Branche post-S8 (mode consolidation libre, IA-23 + D13). Prime sur Phase 1.
  if (currentPhase === 'post_s8') {
    return <ConsolidationHomeScreen />;
  }

  // Branche Phase 1 (pilier démarré). Sprint 9 : S1 uniquement.
  // À Sprint 10+ : router selon currentPillarId vers Phase1HomeScreen<S1..S8>.
  if (currentPhase === 'phase_1' && currentPillarId) {
    return <Phase1HomeScreen />;
  }

  const today = todayLocalDate();
  const [checks, setChecks] = useState<DailyChecksMap>(EMPTY_CHECKS);
  const [validating, setValidating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tierModal, setTierModal] = useState<
    { tierId: TierId; isFirstReach: boolean; streakValue: number } | null
  >(null);
  const [charniereDay, setCharniereDay] = useState<CharniereDay | null>(null);
  // Sprint 30 — option A : si palier ET charnière sur même streak (J7),
  // afficher la charnière APRÈS fermeture de la modale palier.
  const [pendingCharniere, setPendingCharniere] = useState<CharniereDay | null>(null);
  // DEV uniquement : track paliers déjà montrés via le useEffect (flow
  // "Valider + jour suivant" qui skip validateDay → tier_reaches pas
  // updaté). Évite re-trigger au prochain render avec même streak.
  const [devShownTiers, setDevShownTiers] = useState<Set<TierId>>(new Set());

  // Clear devShownTiers quand accountCreatedAt redevient null = resetAll
  // utilisé. Sans ça, le Set persiste entre reset et re-test → palier déjà
  // shown ne re-fire pas en DEV.
  useEffect(() => {
    if (!accountCreatedAt) {
      setDevShownTiers(new Set());
    }
  }, [accountCreatedAt]);
  const [showS01, setShowS01] = useState(false);
  const [showS02, setShowS02] = useState(false);
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);

  // Sprint notif UX — statut natif de permission, met à jour banner dynamique.
  const [notifPermission, setNotifPermission] = useState<PermissionStatus>('undetermined');

  // Détection de journée déjà validée (le user ne peut pas re-valider — D27).
  const alreadyValidatedToday = useMemo(
    () => streakHistory.some((e) => e.local_date === today),
    [streakHistory, today],
  );

  // Map currentDay (validation-based, D38) → IA-14 jour-charnière. Déclenchement
  // à la VALIDATION du jour (après IA-15). currentDay = jour de progression
  // (compte de validations + 1) — découplé du streak calendaire.
  // Sprint 31 — J7 charnière fusionnée dans palier 7j (TierReachedModal).
  // J3 / J11 / J14 restent des charnières indépendantes.
  const CHARNIERE_BY_DAY: Record<number, { day: CharniereDay; flag: NarrativeEventId }> = {
    3: { day: 3, flag: 'j3_charniere' },
    11: { day: 11, flag: 'j11_charniere' },
    14: { day: 14, flag: 'j14_charniere' },
  };

  // S0.1 / S0.2 : couches narratives plein écran déclenchées au premier
  // lancement du J15 / J16 (Feature Spec V1 §3 fiches IA-20 / IA-21).
  // Marquage au déclenchement (§2.3) — si user ferme app pendant, ne se
  // rejoue pas. Reste accessible via IA-25 / IA-21 plus tard (Sprint 8+).
  useEffect(() => {
    // IA-12 vidéo bienvenue — premier lancement Accueil post-onboarding,
    // peu importe currentDay (IA V3 §IA-12 : "tout premier lancement après
    // onboarding"). Pas trigger en phase_1/post_s8 (early return en amont
    // empêche le render de HomeScreenV1).
    if (!narrativeFlags.welcome_video && !showWelcomeVideo) {
      setShowWelcomeVideo(true);
      void markNarrativeSeen('welcome_video');
    } else if (currentDay === 15 && !narrativeFlags.s0_1_screen && !showS01) {
      setShowS01(true);
      void markNarrativeSeen('s0_1_screen');
    } else if (currentDay === 16 && !narrativeFlags.s0_2_screen && !showS02) {
      setShowS02(true);
      void markNarrativeSeen('s0_2_screen');
    } else {
      // Paliers de streak (7, 15, 30, 60, 100, 365) — normalement triggered
      // dans handleConfirmValidation via result.tierReached. En flow DEV
      // seedDevStreak skip validateDay → palier jamais déclenché. Trigger
      // ici basé sur streak courant + tierReaches existants.
      // En flow prod, validateDay insère dans tier_reaches AVANT que ce
      // useEffect run → condition `!alreadyReached` skip. Pas de double
      // trigger.
      // Skip si validation en cours — handleConfirmValidation gère le tier
      // modal après validateDay. Sans ce check, useEffect fire AVANT que
      // validateDay's persistTierReach + setTierReaches async ne complète
      // (Supabase race) → double trigger + iOS Modal stacking → freeze.
      // Le branch ici reste utile pour DEV seedDevStreak (skip validateDay).
      if (validating) {
        return;
      }
      for (const tier of TIER_THRESHOLDS) {
        if (streak >= tier) {
          const alreadyReached = tierReaches.some((r) => r.tier_id === tier);
          const alreadyShownDev = devShownTiers.has(tier);
          if (
            !alreadyReached &&
            !alreadyShownDev &&
            !tierModal &&
            !pendingTierReach
          ) {
            // Coordination D30 : si on est sur J15/J16 (S0.1/S0.2 priorité),
            // ne pas afficher le palier maintenant. Sera repêché plus tard
            // via le flow normal (pendingTierReach).
            if (currentDay === 15 || currentDay === 16) {
              break;
            }
            setTierModal({
              tierId: tier,
              isFirstReach: true,
              streakValue: streak,
            });
            // Track local-only : seedDevStreak reset tier_reaches DB →
            // sans ce Set on re-trigger à chaque render.
            setDevShownTiers((prev) => new Set(prev).add(tier));
            break;
          }
        }
      }
    }
  }, [
    currentDay,
    narrativeFlags,
    markNarrativeSeen,
    showS01,
    showS02,
    showWelcomeVideo,
    charniereDay,
    streak,
    tierReaches,
    tierModal,
    pendingTierReach,
    devShownTiers,
    validating,
  ]);

  // Sprint notif UX — Prompt permission au J1 si pas encore demandée. Marque
  // le flag pour ne pas redemander. Si granted, replanifie les notifs Phase 0
  // (la migration les a peut-être schedulées sans permission au moment-là).
  useEffect(() => {
    if (currentDay !== 1) return;
    if (narrativeFlags.notif_permission_prompted) {
      // Déjà demandée — juste lit le statut courant pour banner.
      void (async () => {
        const status = await getNotificationPermissionStatus();
        setNotifPermission(status);
      })();
      return;
    }
    void (async () => {
      const status = await requestNotificationPermission();
      setNotifPermission(status);
      await markNarrativeSeen('notif_permission_prompted');
      if (status === 'granted' && accountCreatedAt) {
        try {
          const { schedulePhase0Notifications } = await import(
            '../../lib/phase0-scheduler'
          );
          await schedulePhase0Notifications(new Date(accountCreatedAt));
        } catch (e) {
          console.warn('Phase 0 notifs scheduling failed', e);
        }
      }
    })();
  }, [currentDay, narrativeFlags.notif_permission_prompted, markNarrativeSeen, accountCreatedAt]);

  // Re-check statut chaque fois que l'écran reprend le focus (user a pu changer
  // dans les Réglages système entre temps).
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      void (async () => {
        const status = await getNotificationPermissionStatus();
        setNotifPermission(status);
      })();
    });
    return unsubscribe;
  }, [navigation]);

  // Charge l'état du jour depuis AsyncStorage au mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY(today));
        if (cancelled) return;
        if (raw) {
          setChecks({ ...EMPTY_CHECKS, ...JSON.parse(raw) });
        } else {
          setChecks(EMPTY_CHECKS);
        }
      } catch (e) {
        console.warn('[HomeScreenV1] load checks failed', e);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [today]);

  // Persiste à chaque modification.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY(today), JSON.stringify(checks)).catch((e) =>
      console.warn('[HomeScreenV1] save checks failed', e),
    );
  }, [checks, today, loaded]);

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const canValidate = checkedCount > 0 && !alreadyValidatedToday;

  const toggleAction = (id: Phase0ActionId) => {
    if (alreadyValidatedToday) return;
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openActionDetail = (id: Phase0ActionId) => {
    navigation.navigate('Phase0ActionDetail', { actionId: id });
  };

  const handleConfirmValidation = async () => {
    setValidating(true);
    try {
      const result = await validateDay({
        day: currentDay > 0 && currentDay <= 14 ? currentDay : undefined,
        phase: 'phase_0',
        actionsCount: checkedCount,
        userValidatedManually: true,
      });
      setModalVisible(false);

      // Reset local des coches après validation (la journée est figée — D27).
      await AsyncStorage.removeItem(STORAGE_KEY(today));
      setChecks(EMPTY_CHECKS);

      // Cascade narrative post-validation. Priorité tier > IA-14 charnière >
      // joker alert. Un seul écran/modal à la fois.
      //
      // D30 — coordination palier 15j vs S0.1 : si le palier 15j tombe le même
      // jour que le déclenchement S0.1 (currentDay 15), S0.1 prime, palier
      // différé via setPendingTier → ouvert à la prochaine validation sans
      // collision. Logique généralisable aux autres collisions narratives
      // structurantes (S0.2 currentDay 16).
      // D38 — charnière indexée sur currentDay (jour de progression validé).
      const charniere = CHARNIERE_BY_DAY[currentDay];
      // Détection collision : si on est sur J15 ou J16 (jours S0.1/S0.2),
      // tout palier détecté à cette validation est différé. Le flag narratif
      // est posé AU TRIGGER du S0.x (avant validation), donc on ne peut pas
      // s'en servir pour détecter la collision — on se base sur currentDay seul.
      const narrativeCollision =
        result.tierReached != null && (currentDay === 15 || currentDay === 16);



      if (result.tierReached && narrativeCollision) {
        // Différer le palier — narratif structurant prime.
        await setPendingTier({
          tierId: result.tierReached,
          isFirstReach: result.tierIsFirstReach,
          streakValue: result.newStreak,
          deferredAt: new Date().toISOString(),
        });
        // Ne pas ouvrir TierReachedModal — S0.1/S0.2 va se déclencher via useEffect.
      } else if (result.tierReached) {
        setTierModal({
          tierId: result.tierReached,
          isFirstReach: result.tierIsFirstReach,
          streakValue: result.newStreak,
        });
        // Track DEV-side aussi : si user enchaîne sur "(DEV) Passer au jour
        // suivant" après le palier, seedDevStreak vide tier_reaches → sans
        // ce tracking, useEffect re-trigger le même palier.
        setDevShownTiers((prev) => new Set(prev).add(result.tierReached!));
        // Sprint 30 option A : si collision palier × charnière (typique J7),
        // stocke la charnière pour l'ouvrir après fermeture modale palier.
        if (charniere && !narrativeFlags[charniere.flag]) {
          setPendingCharniere(charniere.day);
          await markNarrativeSeen(charniere.flag);
        }
      } else if (charniere && !narrativeFlags[charniere.flag]) {
        // Pas de setTimeout — setCharniereDay synchronous après setModalVisible(false)
        // marche bien (testé). Le timeout introduisait race condition avec useEffect.
        setCharniereDay(charniere.day);
        await markNarrativeSeen(charniere.flag);
      } else if (pendingTierReach) {
        // Pas de palier neuf, pas de collision en cours, palier différé en
        // attente → l'ouvrir maintenant (D30 — différé d'un cran).
        setTierModal({
          tierId: pendingTierReach.tierId,
          isFirstReach: pendingTierReach.isFirstReach,
          streakValue: pendingTierReach.streakValue,
        });
        setDevShownTiers((prev) => new Set(prev).add(pendingTierReach.tierId));
        await clearPendingTier();
      } else if (result.jokerUsed) {
        Alert.alert(
          'Joker consommé',
          `Streak conservé à ${result.newStreak}. Réinitialisation lundi.`,
        );
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Validation échouée');
    } finally {
      setValidating(false);
    }
  };

  // Marqueur dynamique pour le header — placeholder Sprint 5, à enrichir
  // copy V1 quand le brief contenu sera produit.
  // Label adapté selon phase : Phase 0 (J1-J14), S0.1 (J15), S0.2 (J16),
  // au-delà = libellé générique (cas atypique : pas de pilier démarré).
  const dayLabel =
    currentDay <= 0
      ? 'Jour 0'
      : currentDay <= 14
        ? `Jour ${currentDay} sur 14`
        : currentDay === 15
          ? 'S0.1 · Transition'
          : currentDay === 16
            ? 'S0.2 · Roadmap'
            : 'En attente de pilier';
  const messageDuJour = alreadyValidatedToday
    ? 'Journée validée. Tu peux te reposer ou explorer les détails des actions.'
    : MESSAGES_DU_JOUR_PHASE_0[currentDay] ??
      'Coche ce que tu as fait aujourd\'hui. 5 sur 7 suffisent pour valider ta journée. Chaque action compte.';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <PillarHeader
            context="phase0"
            marker="Phase 0 · Amorçage"
            title="Amorçage"
            dayLabel={dayLabel}
            streakDays={streak}
          />

          <View style={styles.body}>
            {alreadyValidatedToday && (
              <View style={styles.validatedBanner}>
                <CheckCircle2 size={28} color={brandColors.alive} strokeWidth={2.5} />
                <View style={styles.validatedBannerText}>
                  <Text style={styles.validatedTitle}>Journée validée</Text>
                  <Text style={styles.validatedSubtitle}>
                    Streak {streak} jour{streak > 1 ? 's' : ''}. À demain.
                  </Text>
                </View>
              </View>
            )}

            {/* DEV (Tranche 2) : raccourci "Passer au jour suivant" →
                avance le clock virtuel +1j. Les useEffects narratifs (S0.x,
                charnières, paliers) re-évaluent naturellement currentDay
                via devTodayLocalDate(). Aucune mutation de streakHistory. */}
            {devPanelEnabled && alreadyValidatedToday && (
              <Button
                label="(DEV) Passer au jour suivant"
                onPress={() => {
                  // eslint-disable-next-line @typescript-eslint/no-require-imports
                  const { advanceDevClock } = require('../../lib/devClock');
                  advanceDevClock(1);
                }}
                variant="ghost"
                fullWidth
                context="phase0"
              />
            )}

            <Text style={styles.message}>{messageDuJour}</Text>

            {notifPermission === 'denied' && <NotificationPermissionBanner />}

            <Card title="Actions du jour" subtitle={`${checkedCount} / ${PHASE_0_TOTAL} cochées`} variant="forte">
              <View style={styles.actionsList}>
                {PHASE_0_ACTIONS.map((action) => {
                  const checked = checks[action.id];
                  return (
                    <View
                      key={action.id}
                      style={[
                        styles.actionRow,
                        alreadyValidatedToday && { opacity: 0.5 },
                      ]}
                    >
                      {/* Tap court sur le carré gauche → toggle */}
                      <TouchableOpacity
                        onPress={() => toggleAction(action.id)}
                        disabled={alreadyValidatedToday}
                        activeOpacity={0.6}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked, disabled: alreadyValidatedToday }}
                        accessibilityLabel={`Cocher ${action.title}`}
                        style={styles.checkboxHit}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            checked && {
                              backgroundColor: brandColors.alive,
                              borderColor: brandColors.alive,
                            },
                          ]}
                          pointerEvents="none"
                        >
                          {checked && <Check size={18} color="#FFFFFF" strokeWidth={3} />}
                        </View>
                      </TouchableOpacity>

                      {/* Tap court sur le reste → IA-13 détail */}
                      <TouchableOpacity
                        onPress={() => openActionDetail(action.id)}
                        activeOpacity={0.6}
                        accessibilityRole="button"
                        accessibilityLabel={`Détail ${action.title}`}
                        accessibilityHint="Ouvre le détail de l'action."
                        style={styles.actionTapZone}
                      >
                        <View style={styles.actionIcon}>
                          <action.Icon size={20} color={pillarColors.phase0.text} />
                        </View>
                        <View style={styles.actionText}>
                          <Text
                            style={[
                              styles.actionTitle,
                              checked && styles.actionTitleChecked,
                            ]}
                            numberOfLines={1}
                          >
                            {action.title}
                          </Text>
                          <Text style={styles.actionSubtitle} numberOfLines={1}>
                            {action.subtitle}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </Card>

            {!alreadyValidatedToday && (
              <Button
                label="Valider ma journée"
                onPress={() => setModalVisible(true)}
                disabled={!canValidate}
                fullWidth
                size="large"
                context="phase0"
                style={styles.validateBtn}
              />
            )}

            {/* Phase A — CTA "Démarrer évaluation Respiration" retiré du hub.
                L'éval initiale S1 est désormais déclenchée automatiquement
                à J17 (Phase 1 J1) via redirect Phase1HomeScreen → IA-40. */}

            {/* Phase D2 — CTA paywall soft sur fin Phase 0 + S0.
                Visible J14/15/16 si pas abonné. Tap → PaywallScreen avec back. */}
            {currentDay >= 14 && currentDay <= 16 && !subscriptionActive && (
              <Button
                label="Découvrir l'abonnement"
                onPress={() => navigation.navigate('Paywall')}
                variant="secondary"
                fullWidth
                size="large"
                context="phase0"
                style={styles.validateBtn}
              />
            )}

            <Text style={styles.hint}>
              {alreadyValidatedToday
                ? 'Tap sur une action pour revoir le détail.'
                : 'Tap court sur le carré pour cocher. Tap court sur l\'action pour voir le détail.'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <DailyCheckModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmValidation}
        actionsCount={checkedCount}
        phase={currentPhase}
        loading={validating}
      />

      <TierReachedModal
        visible={tierModal != null}
        tierId={tierModal?.tierId ?? null}
        isFirstReach={tierModal?.isFirstReach ?? false}
        streakValue={tierModal?.streakValue ?? 0}
        onClose={() => {
          setTierModal(null);
          // Sprint 30 option A : enchaîne charnière différée si applicable.
          if (pendingCharniere) {
            setCharniereDay(pendingCharniere);
            setPendingCharniere(null);
          }
        }}
        onViewGallery={
          tierModal?.isFirstReach
            ? () => {
                setTierModal(null);
                navigation.navigate('PaliersGallery');
              }
            : undefined
        }
      />

      <JourCharniereScreen
        visible={charniereDay != null}
        day={charniereDay}
        streak={streak}
        onClose={() => {
          // J14 charnière "Voir la suite" → ouverture paywall soft (Phase D).
          // Autres charnières J3/J11 → ferme simplement vers hub.
          const wasJ14 = charniereDay === 14;
          setCharniereDay(null);
          if (wasJ14) {
            navigation.navigate('Paywall');
          }
        }}
        onViewGallery={() => {
          setCharniereDay(null);
          navigation.navigate('PaliersGallery');
        }}
      />

      <WelcomeVideoScreen
        visible={showWelcomeVideo}
        onContinue={() => setShowWelcomeVideo(false)}
      />

      <S01Screen
        visible={showS01}
        streak={streak}
        onContinue={() => setShowS01(false)}
      />

      <S02Screen
        visible={showS02}
        // Phase A — "Continuer" ferme simplement la modale. L'éval initiale
        // S1 est déclenchée auto à J17 via Phase1HomeScreen redirect.
        onStartEvaluation={() => setShowS02(false)}
        // Phase D2 — bouton ghost paywall visible si pas abonné.
        // Ouvre PaywallScreen soft (back possible) via navigation.
        onDiscoverSubscription={
          !subscriptionActive
            ? () => {
                setShowS02(false);
                navigation.navigate('Paywall');
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: pillarColors.phase0.bg },
  safeTop: { flex: 1, backgroundColor: pillarColors.phase0.headerBg },
  scroll: {
    backgroundColor: pillarColors.phase0.bg,
    paddingBottom: space[8],
  },
  body: {
    padding: space[5],
    gap: space[5],
  },
  message: {
    ...interTextStyle('bodyLarge'),
    color: pillarColors.phase0.text,
  },
  validatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    backgroundColor: neutralColors.surfaceElevated,
    borderRadius: radiusV1.lg,
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    borderWidth: 1.5,
    borderColor: brandColors.alive,
  },
  validatedBannerText: { flex: 1 },
  validatedTitle: {
    fontFamily: getInterFamily('700'),
    fontSize: 17,
    lineHeight: 22,
    color: brandColors.deep,
  },
  validatedSubtitle: {
    fontFamily: getInterFamily('400'),
    fontSize: 14,
    lineHeight: 20,
    color: neutralColors.textSecondary,
  },
  actionsList: {
    gap: space[2],
    marginTop: space[2],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: neutralColors.borderSubtle,
  },
  checkboxHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTapZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[2],
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radiusV1.md,
    borderWidth: 2,
    borderColor: pillarColors.phase0.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 32,
    alignItems: 'center',
  },
  actionText: { flex: 1 },
  actionTitle: {
    fontFamily: getInterFamily('600'),
    fontSize: 16,
    lineHeight: 22,
    color: pillarColors.phase0.text,
  },
  actionTitleChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  actionSubtitle: {
    fontFamily: getInterFamily('400'),
    fontSize: 13,
    lineHeight: 18,
    color: pillarColors.phase0.text,
    opacity: 0.75,
  },
  validateBtn: {
    marginTop: space[2],
  },
  hint: {
    ...interTextStyle('caption'),
    color: pillarColors.phase0.text,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: space[3],
  },
});
