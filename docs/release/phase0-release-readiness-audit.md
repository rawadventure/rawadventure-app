# Phase 0 — Audit Release Readiness

**Date initiale** : 3 juin 2026
**Dernière mise à jour** : 8 juin 2026
**Cible** : TestFlight beta puis App Store / Play Store launch
**Périmètre** : 14 premiers jours de l'expérience utilisateur (onboarding + Phase 0) + paywall fin Phase 0

---

## Légende statuts

- ✅ Fait + testé
- 🟡 Fait, à valider / polish
- 🔶 Partiel, manque éléments
- ❌ Pas démarré
- ⏸️ Différé V2 (acté)

---

## 1. CODE — Flow utilisateur

| Élément | Statut | Notes |
|---|---|---|
| Onboarding 10 slides (IA-01 à IA-10) | ✅ | Copy Mimi validé Sprint 29 |
| Slide création de compte IA-10 | ✅ | Toggle register/signin/forgot |
| Email confirmation Supabase ON | ✅ | EmailPendingScreen + deep link |
| Reset password flow | ✅ | Sprint A + deep link |
| Polish auth (eye, regex, session expirée) | ✅ | Sprint C |
| D24 démarrage différé (IA-10b/IA-10c) | ✅ | StartChoiceScreen + WaitingScreen |
| Migration AsyncStorage → Supabase | ✅ | Post-confirmation email |
| Pendant migration : useEffect différé | ✅ | Sprint B |
| Hub central Phase 0 (IA-11) | ✅ | HomeScreenV1 |
| 7 actions Phase 0 + détails | ✅ | Phase0ActionDetailScreen, copy Mimi |
| Validation 5/7 D6 | ✅ | validateDay logic |
| Soft-rappel D26 sous seuil | ✅ | Modal IA-15 |
| 4 jours-charnière (J3/J7/J11/J14) | ✅ | JourCharniereScreen, copy Mimi |
| Vidéo bienvenue J1 (IA-12) | 🔶 | Placeholder, attend tournage Session 4 |
| Streak + joker hebdomadaire | ✅ | streak.ts + tests |
| 6 paliers (TierReachedModal) | ✅ | IA-50 + IA-51 galerie |
| D29 cassure palier (1er vs suivants) | ✅ | tier{N}ReachedCount |
| D30 collision palier vs charnière | ✅ | Cascade pendingTierReach |
| Reset complet DEV | ✅ | resetAll étendu |

---

## 2. CODE — Auth & Subscription

| Élément | Statut | Notes |
|---|---|---|
| AuthContext complet | ✅ | Sprints A+B+C |
| Deep link scheme `rawadventure://` | ✅ | app.json + linking config |
| PasswordInput composant réutilisable | ✅ | Toggle eye |
| Validation email regex | ✅ | lib/validation.ts |
| Bundle ID iOS/Android | ✅ | world.rawadventure.app |
| **Paywall fin Phase 0 (J14)** | ✅ | PaywallScreen.tsx + WebBrowser flow |
| **Table Supabase `subscriptions`** | ✅ | Créée + RLS + trigger handle_new_user + backfill |
| **SubscriptionContext** | ✅ | Supabase source of truth + AsyncStorage fallback + Realtime postgres_changes |
| **Webhook Stripe Edge Function** | ✅ | Déployée `stripe-webhook` (no-verify-jwt), 5 handlers, lookup_key → plan, findUserId priority client_reference_id > customer_id > email |
| **Deep link `subscription-success`** | 🔶 | Scheme OK, mais SFSafariViewController iOS bloque custom scheme via `<a href>`. Workaround actuel : close manuel browser → PaywallScreen détecte cancel → reload Supabase → state update auto. Fix propre = Universal Link + apple-app-site-association (post-TestFlight) |
| **Écran gestion abonnement Profil** | 🔶 | Section présente, Stripe Customer Portal pas câblé. À ajouter `billing_portal.sessions.create` côté Edge Function |
| Logout depuis Profil | ✅ | Présent ProfilTabScreen |
| **E2E paywall testé iOS simu** | ✅ | 6 juin 2026 — Stripe Checkout → webhook → Supabase row update (status=active, plan=monthly, stripe_customer_id, stripe_subscription_id) → realtime push → PaywallScreen disparaît → TabNavigator Phase 1 affiché |

---

## 3. CODE — Notifications

| Élément | Statut | Notes |
|---|---|---|
| Cadre technique (Sprint 25) | ✅ | notifications.ts + tests |
| Plage silence 22h-7h (D32) | ✅ | shiftOutOfSilence (mise à jour 22h-7h) |
| 28 notifs Phase 0 schedulées | ✅ | Matin 7h + soir 20h conditionnel |
| Annulation reminder soir au coche | ✅ | cancelTodayReminder |
| Request permission UX | 🟡 | Pas de prompt natif au bon moment — actuellement via DEV button. À ajouter prompt au J1 launch |
| Copy 28 notifs | ✅ | Validé Mimi 3 juin 2026 |
| Test device permission denied | ❌ | À tester |

---

## 4. CONTENU — Validations Mimi/Jacky

| Élément | Statut | Notes |
|---|---|---|
| Onboarding 10 slides | ✅ | Validé Mimi Sprint 29 |
| Phase 0 actions (7 actions × why + tip) | ✅ | Validé Mimi |
| Jours-charnière J3/J7/J11/J14 | ✅ | Validé Mimi Sprint 30 |
| Paliers TierReachedModal | ✅ | J7 fusionné Sprint 31 |
| HomeScreenV1 messageDuJour | ✅ | Validé Mimi |
| WelcomeVideoScreen titre + sous-titre | ✅ | Validé Mimi |
| Reset password email template | 🟡 | Drafté, à coller dans Supabase dashboard |
| Email signup confirmation template | 🟡 | Drafté, à coller dans Supabase dashboard |
| Copy paywall fin Phase 0 | 🟡 | Présent PaywallScreen, à faire valider par Mimi finalement |
| Copy bandeaux lapse / past_due | ❌ | À drafter + valider Mimi |
| **28 notifications Phase 0** | ✅ | Validé Mimi 3 juin 2026 |
| Description app stores (Reader App) | 🟡 | Drafts FR/EN existent docs/release/, à finaliser |

---

## 5. CONTENU — Vidéos

| Élément | Statut | Notes |
|---|---|---|
| **Vidéo IA-12 bienvenue J1** | ❌ | Placeholder, tournage Session 4 |
| **Vidéo IA-20 S0.1 célébration** | ❌ | Tournage Session 2 |
| **Vidéo IA-21 S0.2 roadmap** | ❌ | Tournage Session 2 |
| 6 vidéos paliers streak | ❌ | Tournage Session 1 |
| Brief Session 1 + 2 + 3 + 4 | ✅ | Docs Project complets |

---

## 6. INFRA — Release

| Élément | Statut | Notes |
|---|---|---|
| Repo GitHub privé (D22) | ✅ | **8 juin** : repo `rawadventure/rawadventure-app` privé, main + 9 branches Sprint pushed |
| Env vars Supabase prod vs dev | 🔶 | .env existe mais pas de séparation prod/dev |
| EAS Build config | ✅ | **8 juin** : eas.json 3 profils + .easignore + projectId `ef8346db-6892-4218-a129-b3e9d22ec711` (projet `@rawadventure/RawAdventureRN`). Premier build pending Apple Dev / sanity check dispo |
| Dev build iOS fonctionnel | ✅ | `npx expo run:ios` OK + expo-web-browser + Sentry native module linkés |
| App icon | ✅ | Portraits Mimi+Jacky cartoonisés (ChatGPT) intégrés |
| Splash screen | ✅ | Idem |
| Compte Apple Developer Organization | 🔶 | DUNS HK demandé via D&B HK (8 juin Standard application submitted), attente ~14 jours. Apple ID admin@rawadventure.world bloqué anti-fraud, deferred 24-48h |
| Compte Google Play Console | 🔶 | DUNS également requis (politique Google nov 2025), même délai |
| Compte Stripe | ✅ | Compte créé. TEST mode : 1 product Raw Adventure Abonnement + 3 prices (ra_monthly 49€ / ra_semestrial 239€ / ra_annual 399€) + Pricing Table prctbl_1TfB5qQssbHmxKdShf85wu23. **Customer Portal configuré** (Mimi 8 juin) : update payment, cancel period end, switch plans 3 prices, URLs CGU+Privacy. LIVE mode : prctbl_1TevYeQssbHmxKdSQJy3KjUE (idem produits, à activer pour launch) |
| Webhook Stripe → Supabase | ✅ | Endpoint configuré + signing secret + Edge Function déployée + 5 events écoutés. **8 juin** : idempotency via table stripe_webhook_events (dedup retries) + handler hardened (timestamps safe + cancel detect robuste cancel_at/canceled_at) |
| Edge Function stripe-portal | ✅ | **8 juin** : déployée. Génère Customer Portal session par user JWT, return URL `rawadventure.world/account-returned/` |
| Domaine rawadventure.world | ✅ | OVH + DNS A records + CNAME → GitHub Pages |
| Email support@rawadventure.world | ❌ | À créer (Proton ou OVH) |
| **Site légal rawadventure.world** | ✅ | GitHub Pages déployé : /cgu, /politique-confidentialite, /mentions-legales, /abonnement (Stripe Pricing Table), /checkout-success, /account-returned |
| Universal Links iOS / App Links Android | 🔶 | **8 juin** : config prête côté app (associatedDomains + intentFilters + linking.prefixes) + AASA/assetlinks dans legal-site/.well-known/. Placeholders TEAMID + SHA256 à remplir post-Apple Dev / Play Console |
| JS fallback bouton "Retourner dans l'app" | ✅ | **8 juin** : checkout-success + account-returned JS window.location + visibilitychange detect + hint fallback 1.5s. Contourne blocage SFSafariViewController sur custom scheme. Activable Universal Link post-TEAMID |
| Crash reporting (Sentry) | 🟡 | **8 juin** : @sentry/react-native installé + plugin app.json + init guard DSN + Sentry.wrap(App). Filtre Network errors + DEV skip. Compte créé + DSN obtenu, ajouté .env. À valider sur premier build prod (DEV skip enabled=!__DEV__) |
| Analytics (Mixpanel / PostHog) | ❌ | Pas intégré |
| Screenshots App Store iPhone 6.9" | ✅ | 10 captures 1320x2868 dans assets/store-screenshots/iphone-6.9/. 08-profil refait avec compte démo (plus de leak email perso) |

---

## 7. LÉGAL

| Élément | Statut | Notes |
|---|---|---|
| Drafts CGU/CGV V1 | ✅ | docs/legal/cgu-cgv-v1-draft.md + publié rawadventure.world/cgu |
| Drafts Politique confidentialité RGPD | ✅ | docs/legal/politique-confidentialite-rgpd-v1-draft.md + publié /politique-confidentialite |
| Drafts Mentions légales | ✅ | docs/legal/mentions-legales-v1-draft.md + publié /mentions-legales |
| Droit applicable acté | ✅ | Français (B2C) + HK (B2B) |
| Médiation Option B (amiable) | ✅ | Sans adhésion V1 |
| Directeur publication | ✅ | Stéphane Tossens — stephane@rawadventure.world |
| Capital social Raw Adventure Limited | ✅ | Renseigné dans mentions légales |
| URLs hébergement finales | ✅ | rawadventure.world/{cgu,politique-confidentialite,mentions-legales} |
| Validation avocat | ❌ | Recommandé avant launch |
| Case CGU acceptation in-app | ✅ | **8 juin** : Linking.openURL câblé dans RegisterScreen (fine print) + PaywallScreen (fine print) + ProfilTabScreen (Card Légal avec 3 boutons CGU/Privacy/Mentions). App Store §5.1.1 + §3.1.2(a) compliance |

---

## 8. SUPABASE — Config dashboard

| Élément | Statut | Notes |
|---|---|---|
| Projet créé | ✅ | aknvitrtfxqjdwiyxryt |
| Tables V1 (profiles, progress, subscriptions, etc.) | ✅ | Toutes migrations appliquées dont `subscriptions` |
| RLS policies | 🟡 | subscriptions : SELECT own row OK. Audit complet autres tables encore TODO |
| Email confirmation activée | ✅ | Dashboard configuré |
| Redirect URLs whitelist | ✅ | rawadventure://reset-password + rawadventure://confirm-email + rawadventure://subscription-success |
| Email templates FR (reset + signup confirm) | 🟡 | À coller drafts |
| Storage buckets pour vidéos | ❌ | Pas créés |
| Auth → Settings : password min length 6 | ✅ | Défaut Supabase |
| Auth → Rate limiting | 🟡 | À vérifier defaults OK |
| Edge Function stripe-webhook | ✅ | Déployée + secrets posés (STRIPE_SECRET_KEY test, STRIPE_WEBHOOK_SECRET). 8 juin : handler hardened (timestamps safe via unixToIsoOrNull + cancel detect élargi cancel_at_period_end OR cancel_at OR canceled_at) |
| Edge Function stripe-portal | ✅ | **8 juin** : déployée, lookup customer_id par JWT user, génère billing_portal session |
| Table stripe_webhook_events (idempotency) | ✅ | **8 juin** : table créée, PRIMARY KEY event_id, INSERT ON CONFLICT DO NOTHING dans handler. Dedup retries Stripe validé E2E logs |
| Realtime postgres_changes activé | ✅ | Channel subscriptions:user:{id} testé fonctionnel + 8 juin validé end-to-end avec cancel via portal |
| Trigger handle_new_user | ✅ | Crée row subscriptions status=free à chaque signup |
| Compte démo (`demo@rawadventure.world`) | ✅ | **8 juin** : créé via Dashboard, auto-confirm email. Password `RawDemo2026!`. À transférer en alias email réel post-DUNS pour Apple review |

---

## 9. QA — Tests

| Élément | Statut | Notes |
|---|---|---|
| Tests unitaires Jest | ✅ | 120 verts |
| Test E2E onboarding → J1 device réel | 🔶 | Onboarding testé simu, device réel pending TestFlight |
| Test E2E J1 → J14 + paliers | 🔶 | Simu OK via DEV buttons, full timeline device réel pending |
| Test signup + email confirm flow | 🔶 | UI OK, deep link non testé device réel |
| Test reset password flow | 🔶 | Idem deep link |
| **Test E2E paywall J14 → Stripe → Phase 1** | ✅ | 6 juin 2026 simu iOS : flow complet validé, webhook firing, Supabase update, realtime push, TabNavigator routing |
| **Test E2E Stripe Customer Portal + cancel** | ✅ | **8 juin** simu iOS : button "Gérer mon abonnement" → portail Stripe → annulation → webhook cancel detect → Supabase row cancelled → Realtime push → app Card status passe à cancelled |
| **Test idempotency webhook (dedup retries)** | ✅ | **8 juin** : Stripe resend même event 2x → 1er traité, 2e skipped via stripe_webhook_events PK conflict. Logs validés |
| **Test JS fallback bouton "Retourner dans l'app"** | ✅ | **8 juin** : SFSafariViewController bloque scheme custom → hint fallback affiché après 1.5s → workaround OK |
| Test notifications iOS device | ❌ | À faire avec build dev |
| Test notifications Android | ❌ | Build Android non créé encore |
| Test edge cases (joker, charnière, cassure streak) | 🟡 | DEV buttons OK, scenarios full à dérouler |
| Test reset complet | ✅ | Sprint 20 |
| TestFlight beta (5-10 testeurs) | ❌ | Compte Apple Dev requis |

---

## 10. RÉCAPITULATIF PAR PRIORITÉ

### 🔴 Bloquants release stores

1. **Compte Apple Developer Organization** (DUNS HK Standard submitted 8 juin, attente ~14j + Apple ID anti-fraud 24-48h)
2. **Compte Google Play Console** (DUNS idem)
3. **Stripe LIVE setup** (dupliquer product + 3 prices + pricing table + webhook endpoint en mode live — Mimi access requis)
4. **EAS production build + TestFlight submit** (post-Apple Dev — config EAS prête)
5. **Email support@rawadventure.world** (mentionné docs légaux, doit fonctionner pour Apple review)
6. **Validation avocat docs légaux** (ou risque assumé)
7. **Apple Team ID + SHA256 Android** → remplacer placeholders dans `legal-site/.well-known/apple-app-site-association` + `assetlinks.json` → activation Universal Links
8. **Fix Stripe Customer Portal URL Privacy** : Mimi a mis `/confidentialite/` (404), à corriger `/politique-confidentialite/`

### 🟡 Importants mais non-bloquants

1. Vidéo IA-12 bienvenue J1 (placeholder OK, à remplacer tournage)
2. Analytics (Mixpanel/PostHog)
3. Prompt permission notifs au J1 (UX)
4. RLS policies audit complet (autres tables que subscriptions)
5. Validation Mimi copy paywall final + bandeaux lapse/past_due
6. Sentry user context (Sentry.setUser dans AuthContext post-login pour grouper crashes par user)
7. Sentry sourcemaps upload (EAS post-build hook) — avant submit App Store

### 🟢 Polish post-launch

1. Validation avocat docs légaux
2. Adhésion médiateur conso FR (Option A) quand volume justifie
3. Stripe Tax activation
4. Vidéos paliers (Session 1)
5. Vidéos S0.1 + S0.2 (Session 2)
6. Storage buckets Supabase vidéos
7. Test Android device complet

### ⏸️ Hors-scope V1 (acté)

- Synchronisation multi-appareil (D28)
- Mentorat IA-61 (séparé)
- Phase 2+ contenu
- Analytics avancés
- Multi-langue (D23 architecture prête, contenu FR only)

---

## 11. CHEMIN CRITIQUE RESTANT TestFlight beta

**État au 8 juin 2026** : code app + paywall + Stripe + Supabase + legal site + Customer Portal + idempotency webhook + Sentry + Universal Links prep + links légal câblés **OK end-to-end et validé E2E simu iOS**. Reste essentiellement admin (DUNS, Apple Dev, Play Console) + EAS production build + Stripe LIVE setup.

| Bloc restant | Effort estimé | Owner |
|---|---|---|
| Attente DUNS HK | ~14 jours (Standard submitted 8 juin) | Passif (D&B) |
| Apple ID admin@ création | 24-48h anti-fraud | Stéphane |
| Inscription Apple Developer (post-DUNS) | 2-7j review Apple | Stéphane |
| Inscription Google Play Console (post-DUNS) | 1-3j review Google | Stéphane |
| Récup Apple Team ID → remplir AASA + eas.json | 5 min | Claude (post-DUNS) |
| Premier EAS build dev sanity check (optionnel maintenant) | 20 min cloud | Claude |
| EAS build production iOS + submit TestFlight | 30 min + processing Apple | Claude |
| EAS build production Android + submit Play Console | 30 min + processing Google | Claude |
| Stripe LIVE setup (product + prices + pricing table + webhook + portal) | 1-2 h | Mimi + Claude |
| Email support@ Proton/OVH | 30 min | Stéphane |
| Audit RLS policies complet | 2 h | Claude |
| Sentry user context (AuthContext) + sourcemaps EAS hook | 1 h | Claude |
| **Total dev Claude restant** | **~4 h** | |
| **Total Stéphane** | ~1 h + délais admin | |

**Bloqueur dominant** : DUNS HK (~14j). Tout le dev restant peut tenir en parallèle. Pratiquement tout le code est prêt — reste les credentials Apple/Google pour signer + submit.

---

## 12. JOURNAL DES UPDATES

- **3 juin 2026** : Audit initial créé. 28 notifs draftées, paywall pas codé, legal docs draftés non hébergés, Stripe inexistant.
- **6 juin 2026** : Paywall + table subscriptions + SubscriptionContext + webhook Stripe + Edge Function déployés et **E2E validé en simu iOS**. Legal site rawadventure.world LIVE (GitHub Pages). Stripe TEST mode 1 product 3 prices LIVE. 10 screenshots store iPhone 6.9" capturés. Notifications Phase 0 validées Mimi. App icon + splash intégrés. DUNS HK demandé, Apple ID anti-fraud bloqué.
- **8 juin 2026** (grosse session) :
  - **M** repo `rawadventure/rawadventure-app` pushé GitHub privé (main + 9 branches Sprint)
  - **R** rebuild iOS + retest paywall E2E avec JS fallback bouton "Retourner dans l'app"
  - **I** compte démo `demo@rawadventure.world` créé + screenshot 08-profil refait (élimine leak email perso)
  - **H** Stripe Customer Portal câblé : Edge Function stripe-portal + UI bouton ProfilTabScreen + page account-returned + Stripe Dashboard config (Mimi). E2E validé avec cancel → status passé à cancelled via webhook
  - **L** EAS Build init : eas-cli installé + projet `@rawadventure/RawAdventureRN` créé + projectId ef8346db... + runtimeVersion + .easignore + doc setup
  - **F** Webhook idempotency : table stripe_webhook_events + INSERT ON CONFLICT DO NOTHING + UPDATE processed_at. Dedup retries Stripe validé E2E logs
  - **G** Sentry installé : @sentry/react-native + plugin app.json + init guard DSN + .env DSN ajouté + Sentry.wrap(App). Activation skip DEV par design
  - **J** Câblage links légal : Linking.openURL CGU + Privacy dans RegisterScreen + PaywallScreen + nouveau Card "Légal" dans ProfilTabScreen (App Store §5.1.1 compliance)
  - **Bug fix critique** webhook handler : RangeError sur `new Date(undefined).toISOString()` car Stripe API 2024-12+ déplace `current_period_end` au niveau item. Fix : unixToIsoOrNull() + getCurrentPeriodEnd() helpers
  - **Bug fix** détection cancel : élargi de cancel_at_period_end seul à cancel_at OR canceled_at (couvre variantes Stripe API)
  - **Bug fix** URL Politique confidentialité : `/confidentialite/` (404) → `/politique-confidentialite/` (200)
  - DUNS HK : application Standard submitted via D&B HK Self-Service Portal (queue ~14j)

---

*Fin audit.*
