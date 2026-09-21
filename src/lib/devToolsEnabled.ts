/**
 * devToolsEnabled — flag unique gating DEV tools (panneau DEV, snapshots
 * timeline, mock clock, mock abonnement).
 *
 * F-07/K1 (audit Lou + décision Stéphane 18 sept 2026, actée D43) :
 * actif en développement (`__DEV__`) OU pour un compte flaggé côté base
 * (`profiles.dev_tools_enabled`, posé par le chargement du profil via
 * setDevToolsAccountFlag). L'ancien flag env build-time
 * EXPO_PUBLIC_ENABLE_DEV_PANEL (Vercel testeurs) est retiré : il exposait
 * reset complet + mock abonnement + horloge à tout le déploiement (R4/K1
 * de la vérif Stripe). La colonne est en lecture seule côté client
 * (privilèges Postgres, migration 20260922) — seul le SQL editor flagge.
 *
 * Centralisé ici : tous les call-sites (écrans, devClock, devTimeline,
 * SubscriptionContext) suivent.
 */

let accountFlag = false;

/** Posé au chargement du profil (useProgressLoad) : true si la colonne
 *  profiles.dev_tools_enabled du compte connecté est vraie. Repasse à
 *  false au chargement anonyme / changement de compte. */
export function setDevToolsAccountFlag(enabled: boolean): void {
  accountFlag = enabled;
}

export function isDevToolsEnabled(): boolean {
  return __DEV__ || accountFlag;
}
