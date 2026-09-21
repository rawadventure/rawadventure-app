/**
 * TabBarContext — visibilité de la tab bar (chrome UI).
 *
 * F-05.2 (audit Lou) : extrait de ProgressContext. Cacher la tab bar pendant
 * une évaluation plein écran (IA-40) est un état d'interface, pas de
 * progression — le loger dans le god context re-rendait toute l'app à
 * chaque toggle.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface TabBarContextType {
  tabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
}

const TabBarContext = createContext<TabBarContextType | null>(null);

export function TabBarProvider({ children }: { children: ReactNode }) {
  const [tabBarHidden, setTabBarHidden] = useState(false);
  const value = useMemo(() => ({ tabBarHidden, setTabBarHidden }), [tabBarHidden]);
  return <TabBarContext.Provider value={value}>{children}</TabBarContext.Provider>;
}

export function useTabBar() {
  const ctx = useContext(TabBarContext);
  if (!ctx) throw new Error('useTabBar doit être utilisé dans un TabBarProvider');
  return ctx;
}
