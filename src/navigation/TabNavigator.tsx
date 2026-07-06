/**
 * TabNavigator — navigation principale post-onboarding (3 onglets V1).
 *
 * Réf IA V3 + design system V1.1 §5.5 + D18.
 *
 * Pas de dépendance @react-navigation/bottom-tabs en V1 : on contrôle nous-même
 * l'onglet actif via state local et on rend l'écran correspondant. Permet de
 * masquer l'onglet Toile en Phase 0 (D5 + D18) sans config router supplémentaire,
 * et reste cohérent avec la structure légère "1 écran à la fois" du V1.
 *
 * Les 3 destinations :
 *  - 'home' → HomeScreen V0 (sera remplacé par IA-11 refondu en Sprint 5+)
 *  - 'toile' → ToileTabScreen (placeholder Sprint 4, IA-25 complet Sprint 5+)
 *  - 'profil' → ProfilTabScreen (placeholder Sprint 4, IA-70 complet Sprint 5+)
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar, type TabId } from '../components/compositions';
import HomeStack from './HomeStack';
import ToileStack from './ToileStack';
import ProfilStack from './ProfilStack';
import { useProgress } from '../hooks/ProgressContext';

export default function TabNavigator() {
  const { currentPhase, currentDay, tabBarHidden } = useProgress();
  const [active, setActive] = useState<TabId>('home');

  // Onglet Toile masqué en Phase 0 (D5 + D18) — apparaît au S0.1 (J15).
  // Audit M2 (2026-07-06) : currentPhase reste 'phase_0' pendant S0 (J15-J16),
  // donc le test de phase seul masquait l'onglet alors que D18 dit « apparaît
  // au S0.1 » — la toile venait d'être révélée en vidéo sans être consultable.
  const showToileTab = currentPhase !== 'phase_0' || currentDay >= 15;

  // Si l'utilisateur est sur 'toile' au moment où la phase repasse en phase_0
  // (cas limite : reset, voyage en TZ, etc.), rebascule sur 'home'.
  React.useEffect(() => {
    if (!showToileTab && active === 'toile') setActive('home');
  }, [showToileTab, active]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {active === 'home' && <HomeStack />}
        {active === 'toile' && showToileTab && <ToileStack />}
        {active === 'profil' && <ProfilStack />}
      </View>
      {!tabBarHidden && (
        <TabBar active={active} onChange={setActive} showToileTab={showToileTab} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
