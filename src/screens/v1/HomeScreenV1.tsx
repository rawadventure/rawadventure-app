/**
 * HomeScreenV1 — IA-11 routeur du hub d'accueil.
 *
 * F-01 (audit Lou, sept 2026) : ce composant ne fait plus que router entre
 * les trois hubs selon la phase du parcours. Tous les hooks du hub Phase 0
 * vivent désormais dans Phase0HomeScreen — plus aucun hook déclaré après un
 * return conditionnel, la transition de phase avec composant monté (J16 → J17
 * à minuit, resetAll, snapshot DEV) est sûre.
 *
 * Référence IA : IA-11.
 */

import React, { useEffect } from 'react';
import Phase0HomeScreen from './Phase0HomeScreen';
import Phase1HomeScreen from './Phase1HomeScreen';
import ConsolidationHomeScreen from './ConsolidationHomeScreen';
import { useProgress } from '../../hooks/ProgressContext';

export default function HomeScreenV1() {
  const { currentPhase, currentPillarId, startPillarWeek } = useProgress();

  // J17 auto-start S1 — bascule Phase 1 automatique. À J17+ (currentPhase
  // 'phase_1') sans pilier en cours, on démarre S1. Cas absence longue D25
  // traité pareil (J17+ direct).
  // Audit B2 (2026-07-06) : ne PAS conditionner au flag s0_2_screen — il est
  // local-only (AsyncStorage) et ne peut se poser qu'à currentDay === 16.
  // S'il est perdu après J16 (réinstall, données Safari effacées, bascule
  // Safari ↔ PWA installée), l'exiger bloquait l'utilisateur à vie sur
  // « En attente de pilier ». À currentPhase 'phase_1', S0 est forcément
  // derrière nous — le flag n'apporte rien.
  // Limite connue (suivi audit) : si le storage saute en cours de Phase 1,
  // currentPillarId (local-only aussi) est perdu → on redémarre à S1 au lieu
  // du pilier réel. Récupération depuis pillar_evaluations (remote) = chantier
  // séparé (F-04).
  useEffect(() => {
    if (currentPhase === 'phase_1' && !currentPillarId) {
      void startPillarWeek('S1');
    }
  }, [currentPhase, currentPillarId, startPillarWeek]);

  // Branche post-S8 (mode consolidation libre, IA-23 + D13). Prime sur Phase 1.
  if (currentPhase === 'post_s8') {
    return <ConsolidationHomeScreen />;
  }

  // Branche Phase 1 (pilier démarré). Sprint 9 : S1 uniquement.
  // À Sprint 10+ : router selon currentPillarId vers Phase1HomeScreen<S1..S8>.
  if (currentPhase === 'phase_1' && currentPillarId) {
    return <Phase1HomeScreen />;
  }

  // Phase 0 + S0 (J1-J16), et fenêtre transitoire phase_1 sans pilier
  // (avant que l'auto-start ci-dessus pose currentPillarId).
  return <Phase0HomeScreen />;
}
