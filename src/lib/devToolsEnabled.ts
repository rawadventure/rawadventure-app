/**
 * devToolsEnabled — flag unique gating DEV tools (snapshots timeline + mock clock).
 *
 * Active en DEV (`__DEV__ === true`) OU si flag env build-time
 * `EXPO_PUBLIC_ENABLE_DEV_PANEL === 'true'` (set côté Vercel pour PWA testeurs).
 *
 * Centraliser ici : si plus tard on veut gater par email user (whitelist),
 * on patche juste cette fonction, tous les call-sites suivent.
 */
export function isDevToolsEnabled(): boolean {
  return __DEV__ || process.env.EXPO_PUBLIC_ENABLE_DEV_PANEL === 'true';
}
