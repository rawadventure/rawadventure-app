# Phase 0 — Audit Release Readiness

**Date initiale** : 3 juin 2026
**Dernière mise à jour** : 10 juin 2026 (DUNS HK approuvé + PWA Vercel LIVE)
**Cible** : TestFlight beta puis App Store / Play Store launch
**Périmètre** : 14 premiers jours de l'expérience utilisateur (onboarding + Phase 0) + paywall fin Phase 0

> Ce fichier est la **source de vérité** du kanban (blocs R1–R10). Le bouton « Mettre à jour »
> régénère les blocs depuis les tableaux ci-dessous. Colonne `Prio` = priorité explicite
> (bloquant / important / polish), lue directement par le parser ; vide = tâche déjà faite ou neutre.

---

## Légende statuts

- ✅ Fait + testé
- 🟡 Fait, à valider / polish
- 🔶 Partiel, manque éléments
- ❌ Pas démarré
- ⏸️ Différé V2 (acté)

---

## 1. CODE — Flow utilisateur

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| Onboarding 10 slides (IA-01 à IA-10) | ✅ |  | Copy Mimi validé Sprint 29 |
| Slide création de compte IA-10 | ✅ |  | Toggle register/signin/forgot |
| Email confirmation Supabase ON | ✅ |  | EmailPendingScreen + deep link |
| Reset password flow | ✅ |  | Sprint A + deep link |
| Polish auth (eye, regex, session expirée) | ✅ |  | Sprint C |
| D24 démarrage différé (IA-10b/IA-10c) | ✅ |  | StartChoiceScreen + WaitingScreen |
| Migration AsyncStorage → Supabase | ✅ |  | Post-confirmation email |
| Pendant migration : useEffect différé | ✅ |  | Sprint B |
| Hub central Phase 0 (IA-11) | ✅ |  | HomeScreenV1 |
| 7 actions Phase 0 + détails | ✅ |  | Phase0ActionDetailScreen, copy Mimi |
| Validation 5/7 D6 | ✅ |  | validateDay logic |
| Soft-rappel D26 sous seuil | ✅ |  | Modal IA-15 |
| 4 jours-charnière (J3/J7/J11/J14) | ✅ |  | JourCharniereScreen, copy Mimi |
| Streak + joker hebdomadaire | ✅ |  | streak.ts + tests |
| 6 paliers (TierReachedModal) | ✅ |  | IA-50 + IA-51 galerie |
| D29 cassure palier (1er vs suivants) | ✅ |  | tier{N}ReachedCount |
| D30 collision palier vs charnière | ✅ |  | Cascade pendingTierReach |
| Reset complet DEV | ✅ |  | resetAll étendu |

---

## 2. CODE — Auth & Subscription

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| AuthContext complet | ✅ |  | Sprints A+B+C |
| Deep link scheme `rawadventure://` | ✅ |  | app.json + linking config |
| PasswordInput composant réutilisable | ✅ |  | Toggle eye |
| Validation email regex | ✅ |  | lib/validation.ts |
| Bundle ID iOS/Android | ✅ |  | world.rawadventure.app |
| Paywall fin Phase 0 (J14) | ✅ |  | PaywallScreen.tsx + WebBrowser flow |
| Table Supabase `subscriptions` | ✅ |  | Créée + RLS + trigger handle_new_user + backfill |
| Mémoire de l'abonnement dans l'app (SubscriptionContext + Realtime) | ✅ |  | Supabase source of truth + AsyncStorage fallback + Realtime postgres_changes |
| Brancher Stripe : confirmer les paiements (webhook) | ✅ |  | Edge Function `stripe-webhook` déployée, 5 handlers, idempotency |
| Retour dans l'app après paiement (deep link + JS fallback) | ✅ |  | checkout-success + account-returned. Fix propre = Universal Link post-TestFlight |
| Écran « gérer mon abonnement » (Stripe Customer Portal, IA-71) | ✅ |  | stripe-portal câblé + bouton ProfilTabScreen + E2E cancel validé (TEST) |
| Logout depuis Profil | ✅ |  | Présent ProfilTabScreen |
| E2E paywall testé iOS simu | ✅ |  | 6 juin : Checkout → webhook → Supabase update → realtime → Phase 1 affiché |
| Stripe LIVE setup (product + prices + pricing table + webhook + portal) | ❌ | bloquant | Dupliquer depuis TEST en mode live. Accès Mimi requis |
| Fix Stripe Customer Portal URL Privacy | 🔶 | important | Champ disabled en TEST tant que LIVE/identité pas validée |
| Durcir le webhook (retry, logs, alertes) | 🔶 | important | Idempotency OK, durcir avant LIVE |

---

## 3. CODE — Notifications

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| Cadre technique (Sprint 25) | ✅ |  | notifications.ts + tests |
| Plage silence 22h-7h (D32) | ✅ |  | shiftOutOfSilence |
| 28 notifs Phase 0 schedulées | ✅ |  | Matin 7h + soir 20h conditionnel |
| Annulation reminder soir au coche | ✅ |  | cancelTodayReminder |
| Demander l'autorisation des notifications au bon moment (J1) | 🔶 | important | Via DEV button, ajouter prompt natif J1 launch |
| Test device permission denied | ❌ |  | À tester |

---

## 4. CONTENU — Validations Mimi/Jacky

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| Onboarding 10 slides | ✅ |  | Validé Mimi Sprint 29 |
| Phase 0 actions (7 actions × why + tip) | ✅ |  | Validé Mimi |
| Jours-charnière J3/J7/J11/J14 | ✅ |  | Validé Mimi Sprint 30 |
| Paliers TierReachedModal | ✅ |  | J7 fusionné Sprint 31 |
| HomeScreenV1 messageDuJour | ✅ |  | Validé Mimi |
| WelcomeVideoScreen titre + sous-titre | ✅ |  | Validé Mimi |
| 28 notifications Phase 0 | ✅ |  | Validé Mimi 3 juin 2026 |
| Copy paywall final | 🟡 | bloquant | Présent PaywallScreen, à faire valider par Mimi |
| Description App Store (Reader App) FR + EN | 🔶 | bloquant | Drafts docs/release/, à finaliser |
| Copy bandeaux lapse / past_due | ❌ | important | À drafter + valider Mimi |
| Email templates Supabase (reset + signup confirm) | 🟡 | important | Draftés, à coller dans Dashboard Supabase |
| Métriques V1 mapping 112 cases diagnostic × pilier | 🔶 | important | Structure documentée, contenu à remplir avec Jacky (Phase 1) |

---

## 5. CONTENU — Vidéos

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| 6 vidéos paliers streak (Session 1) | ✅ |  | ffmpeg + upload Supabase Storage + UX preview/fullscreen |
| 4 vidéos intros piliers Phase 1 (S2/S3/S6/S8) | ✅ |  | uploadées |
| Brief Session 1 + 2 + 3 + 4 | ✅ |  | Docs Project complets |
| Vidéo IA-12 bienvenue J1 (Session 4) | ❌ | important | Script validé, à tourner Mimi/Jacky |
| 2 vidéos S0 (S0.1 célébration + S0.2 roadmap) (Session 2) | ❌ | important | À tourner |
| 4 vidéos piliers manquantes (S1/S4/S5/S7) (Session 3) | ❌ | important | À tourner |
| Vidéo IA-22 Sortie S8 (Session 4) | ❌ | important | À tourner |

---

## 6. INFRA — Comptes, build & mise en vente

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| Repo GitHub privé (D22) | ✅ |  | `rawadventure/rawadventure-app`, main + 9 branches Sprint |
| Env vars Supabase prod vs dev | 🔶 |  | .env existe mais pas de séparation prod/dev |
| EAS Build config + projet créé | ✅ |  | eas.json 3 profils + projectId, sanity build cloud iOS OK |
| Dev build iOS fonctionnel | ✅ |  | `npx expo run:ios` OK |
| App icon + splash screen | ✅ |  | Portraits Mimi+Jacky cartoonisés |
| Compte Stripe + Pricing Table TEST | ✅ |  | 1 product + 3 prices (49€/239€/399€) + Pricing Table |
| Webhook Stripe → Supabase | ✅ |  | Endpoint + signing secret + Edge Function + idempotency |
| Edge Function stripe-portal | ✅ |  | Customer Portal session par user JWT |
| Domaine rawadventure.world | ✅ |  | OVH + DNS + CNAME GitHub Pages |
| Compte démo Supabase + screenshots store | ✅ |  | demo@rawadventure.world + 10 captures iPhone 6.9", leak email perso éliminé |
| JS fallback bouton « Retourner dans l'app » | ✅ |  | checkout-success + account-returned, contourne SFSafariViewController |
| Sentry crash reporting installé | ✅ |  | @sentry/react-native + plugin + init guard DSN + Sentry.wrap |
| DUNS HK approuvé | ✅ |  | **10 juin 2026 : identity verification approved by D&B HK** (submitted 8 juin). DUNS Number à recevoir incessamment, débloque Apple Dev + Google Play |
| Débloquer Apple ID anti-fraud (admin@) | 🔶 | bloquant | admin@rawadventure.world bloqué anti-fraud, attente 24-48h |
| Compte Apple Developer Organization | ❌ | bloquant | Inscription possible dès réception DUNS Number (suite à approbation) |
| Compte Google Play Console | ❌ | bloquant | Idem, inscription possible dès réception DUNS Number |
| Build prod iOS + submit TestFlight | ❌ | bloquant | Post-Apple Dev. Team ID + ASC App ID requis |
| Build prod Android + submit Play Console | ❌ | bloquant | Post-Play. Service Account Google Play requis |
| Apple Team ID + remplir AASA file | ❌ | bloquant | Active Universal Links iOS, post-Apple Dev |
| SHA256 Android + remplir assetlinks.json | ❌ | bloquant | Active App Links Android, post-Play Console |
| Email support@rawadventure.world | ❌ | bloquant | Créer via Proton ou OVH (~30min), requis Apple review |
| Universal Links iOS / App Links Android (prep) | 🔶 | important | Config app + AASA/assetlinks placeholders prêts, à remplir post-comptes |
| Sentry compte + DSN + premier crash test prod | 🔶 | important | DSN ajouté .env, validation au premier build prod |
| Sentry user context (setUser dans AuthContext) | ❌ | important | Grouper crashes par user, ~30min |
| Sentry sourcemaps upload EAS hook | ❌ | important | Avant submit App Store, stack traces lisibles |
| Analytics (Mixpanel / PostHog) | ❌ | important | Pas intégré |
| Stripe Tax activation | ❌ | polish | Post-LIVE |
| Migration Apple Dev Individual → Organization | ❌ | polish | Si départ Individual d'abord pour gagner temps |
| **PWA app.rawadventure.world LIVE** | ✅ |  | **10 juin** : Vercel Hobby tier + domaine custom OVH CNAME + HTTPS Let's Encrypt + redirect 308 vercel.app → app.rawadventure.world. PWA install Safari iPhone OK avec icône Mimi+Jacky portraits. EXPO_PUBLIC_ENABLE_DEV_PANEL=true pour démo Mimi/Jacky |

---

## 7. LÉGAL

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| Drafts CGU/CGV V1 | ✅ |  | docs/legal/ + publié rawadventure.world/cgu |
| Drafts Politique confidentialité RGPD | ✅ |  | publié /politique-confidentialite |
| Drafts Mentions légales | ✅ |  | publié /mentions-legales |
| Droit applicable acté | ✅ |  | Français (B2C) + HK (B2B) |
| Site légal rawadventure.world LIVE | ✅ |  | GitHub Pages : /cgu /politique-confidentialite /mentions-legales /abonnement /checkout-success /account-returned |
| Câblage liens légaux in-app | ✅ |  | Register + Paywall + Card Légal ProfilTabScreen (App Store §5.1.1) |
| Médiation Option B (amiable) | ✅ |  | Sans adhésion V1 |
| Directeur publication + capital social | ✅ |  | Renseignés dans mentions légales (PDFs HK officiels) |
| Validation avocat docs légaux | ❌ | bloquant | Recommandé avant launch (ou risque assumé) |
| Adhésion médiateur conso FR (Option A) | ❌ | polish | Quand volume justifie |

---

## 8. SUPABASE — Config dashboard

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| Projet créé | ✅ |  | aknvitrtfxqjdwiyxryt |
| Tables V1 (profiles, progress, subscriptions, etc.) | ✅ |  | Toutes migrations appliquées dont `subscriptions` |
| Email confirmation activée + redirect URLs | ✅ |  | reset-password + confirm-email + subscription-success whitelistés |
| Auth password min length 6 | ✅ |  | Défaut Supabase |
| Edge Function stripe-webhook + idempotency | ✅ |  | table stripe_webhook_events, dedup retries validé E2E |
| Realtime postgres_changes + trigger handle_new_user | ✅ |  | Channel subscriptions:user:{id} testé end-to-end |
| Email templates FR (reset + signup confirm) | 🟡 | important | À coller drafts dans Dashboard |
| Audit RLS policies complet | 🔶 | important | subscriptions OK, autres tables à auditer (~2h) |
| Storage buckets vidéos additionnelles | ❌ | polish | Si besoin déplacer du bucket actuel |
| Auth → Rate limiting | 🟡 |  | À vérifier defaults OK |

---

## 9. QA — Tests

| Élément | Statut | Prio | Notes |
|---|---|---|---|
| Tests unitaires Jest | ✅ |  | 120 verts |
| Test E2E paywall J14 → Stripe → Phase 1 | ✅ |  | 6 juin simu iOS : flow complet validé |
| Test E2E Stripe Customer Portal + cancel | ✅ |  | 8 juin simu iOS : annulation → webhook → Supabase → app |
| Test idempotency webhook (dedup retries) | ✅ |  | 8 juin : resend event 2x → 2e skipped |
| Test JS fallback bouton « Retourner dans l'app » | ✅ |  | 8 juin : workaround SFSafariViewController OK |
| Test reset complet | ✅ |  | Sprint 20 |
| Test E2E onboarding → J1 device réel | 🔶 |  | Simu OK, device réel pending TestFlight |
| Test E2E J1 → J14 + paliers | 🔶 |  | Simu OK via DEV buttons, device réel pending |
| Test signup + email confirm flow | 🔶 |  | UI OK, deep link device à valider |
| Test reset password flow | 🔶 |  | Idem deep link |
| Test edge cases (joker, charnière, cassure streak) | 🟡 |  | DEV buttons OK, scénarios full à dérouler |
| Test notifications iOS device | ❌ |  | À faire avec build dev |
| Test Android device complet | ❌ | polish | Post-Play Console |
| TestFlight beta (5-10 testeurs) | ❌ | bloquant | Compte Apple Dev requis |

---

## 10. RÉCAPITULATIF PAR PRIORITÉ

### 🔴 Bloquants release stores

1. Stripe LIVE setup (product + prices + pricing table + webhook + portal — accès Mimi)
2. Copy paywall final (validation Mimi)
3. Description App Store (Reader App) FR + EN
4. DUNS HK (soumis 8 juin, ~14j) → débloque Apple Dev + Google Play
5. Débloquer Apple ID anti-fraud (24-48h)
6. Compte Apple Developer Organization + Compte Google Play Console
7. Build prod iOS + submit TestFlight ; Build prod Android + submit Play
8. Apple Team ID + AASA ; SHA256 Android + assetlinks
9. Email support@rawadventure.world
10. Validation avocat docs légaux (ou risque assumé)

### 🟡 Importants non-bloquants

1. Fix Stripe Portal URL Privacy + durcir webhook
2. Prompt permission notifications J1
3. Vidéos à tourner : IA-12, S0.1/S0.2, piliers S1/S4/S5/S7, IA-22
4. Bandeaux lapse / past_due + email templates Supabase
5. Métriques V1 mapping 112 cases (Phase 1)
6. Sentry : DSN prod + user context + sourcemaps
7. Analytics (Mixpanel/PostHog)
8. Audit RLS complet

### 🟢 Polish post-launch

1. Stripe Tax activation
2. Adhésion médiateur conso FR (Option A)
3. Storage buckets vidéos additionnelles
4. Test Android device complet
5. Migration Apple Dev Individual → Organization
6. PWA app.rawadventure.world

### ⏸️ Hors-scope V1 (acté)

- Synchronisation multi-appareil (D28)
- Mentorat IA-61 (séparé)
- Phase 2+ contenu
- Analytics avancés
- Multi-langue (D23 architecture prête, contenu FR only)

---

## 11. CHEMIN CRITIQUE RESTANT TestFlight beta

**État au 9 juin 2026** : code app + paywall + Stripe + Supabase + legal site + Customer Portal + idempotency webhook + Sentry + Universal Links prep + links légal câblés **OK end-to-end et validé E2E simu iOS**. Reste essentiellement admin (DUNS, Apple Dev, Play Console) + EAS production build + Stripe LIVE setup.

| Bloc restant | Effort estimé | Owner |
|---|---|---|
| Attente DUNS HK | ~14 jours (Standard submitted 8 juin) | Passif (D&B) |
| Apple ID admin@ déblocage | 24-48h anti-fraud | Stéphane |
| Inscription Apple Developer (post-DUNS) | 2-7j review Apple | Stéphane |
| Inscription Google Play Console (post-DUNS) | 1-3j review Google | Stéphane |
| Récup Apple Team ID → remplir AASA + eas.json | 5 min | Claude (post-DUNS) |
| EAS build production iOS + submit TestFlight | 30 min + processing Apple | Claude |
| EAS build production Android + submit Play Console | 30 min + processing Google | Claude |
| Stripe LIVE setup | 1-2 h | Mimi + Claude |
| Email support@ Proton/OVH | 30 min | Stéphane |
| Audit RLS policies complet | 2 h | Claude |
| Sentry user context + sourcemaps EAS | 1 h | Claude |
| **Total dev Claude restant** | **~4 h** | |
| **Total Stéphane** | ~1 h + délais admin | |

**Bloqueur dominant débloqué** : DUNS HK identity verification **approuvé 10 juin 2026** par D&B HK. DUNS Number à recevoir incessamment. Une fois reçu → inscription Apple Developer Organization + Google Play Console possibles immédiatement.

---

## 12. JOURNAL DES UPDATES

- **3 juin 2026** : Audit initial créé. 28 notifs draftées, paywall pas codé, legal docs draftés non hébergés, Stripe inexistant.
- **6 juin 2026** : Paywall + table subscriptions + SubscriptionContext + webhook Stripe + Edge Function déployés et **E2E validé en simu iOS**. Legal site rawadventure.world LIVE. Stripe TEST mode 1 product 3 prices. 10 screenshots store. Notifications validées Mimi. App icon + splash intégrés. DUNS HK demandé, Apple ID anti-fraud bloqué.
- **8 juin 2026** (grosse session) : repo GitHub privé pushé ; rebuild iOS + retest paywall E2E ; compte démo + screenshot profil ; Stripe Customer Portal câblé (stripe-portal + UI + page account-returned) ; EAS Build init (projet + projectId + .easignore) ; webhook idempotency (table stripe_webhook_events) ; Sentry installé ; câblage links légal in-app ; bug fixes webhook (timestamps, cancel detect, URL privacy) ; DUNS HK Standard submitted.
- **9 juin 2026** : refonte de l'audit en source de vérité kanban — ajout colonne `Prio` explicite, promotion en lignes distinctes des cartes Stripe LIVE / builds prod / Team ID+AASA / SHA256+assetlinks / Sentry user context+sourcemaps / Stripe Tax / migration Apple Dev / PWA, correction statuts vidéos (paliers + intros piliers = faits).
- **10 juin 2026** (grosse session PWA + DUNS débloqué) :
  - **DUNS HK** : identity verification **approuvée par D&B HK** (email reçu) — débloque inscription Apple Dev Organization + Google Play Console
  - **PWA Vercel LIVE** : projet Vercel Hobby créé, repo connecté GitHub, env vars Supabase + Sentry + DEV panel, deploy auto sur push main
  - **PWA fixes web compat** : helper `openExternal.ts` (web → window.location vs native WebBrowser), patch checkout-success + account-returned (détection mobile/desktop), DEV panel feature flag (`EXPO_PUBLIC_ENABLE_DEV_PANEL`)
  - **Domaine custom** : `app.rawadventure.world` via OVH CNAME → Vercel, HTTPS Let's Encrypt auto, redirect 308 vercel.app → app.rawadventure.world
  - **PWA manifest + icônes** : web.name + shortName + themeColor + display standalone + apple-touch-icon 180×180 + icon-192/512 (portraits Mimi+Jacky), public/ folder copié vers dist via vercel.json
  - Distribution Mimi/Jacky possible immédiatement : Safari iPhone → app.rawadventure.world → "Sur l'écran d'accueil" → icône native

---

*Fin audit.*
