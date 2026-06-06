# Phase 0 — Audit Release Readiness

**Date initiale** : 3 juin 2026
**Dernière mise à jour** : 6 juin 2026
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
| Repo GitHub privé (D22) | 🟡 | Repo legal-site public sur rawadventure.world. Repo app principal toujours local — à pousser GitHub privé avant TestFlight |
| Env vars Supabase prod vs dev | 🔶 | .env existe mais pas de séparation prod/dev |
| EAS Build config | ❌ | Pas configuré |
| Dev build iOS fonctionnel | ✅ | `npx expo run:ios` OK + expo-web-browser native module linké |
| App icon | ✅ | Portraits Mimi+Jacky cartoonisés (ChatGPT) intégrés |
| Splash screen | ✅ | Idem |
| Compte Apple Developer Organization | 🔶 | DUNS HK demandé via D&B HK (3 juin), attente ~14 jours. Apple ID admin@rawadventure.world bloqué anti-fraud, deferred 24-48h |
| Compte Google Play Console | 🔶 | DUNS également requis (politique Google nov 2025), même délai |
| Compte Stripe | ✅ | Compte créé. TEST mode : 1 product Raw Adventure Abonnement + 3 prices (ra_monthly 49€ / ra_semestrial 239€ / ra_annual 399€) + Pricing Table prctbl_1TfB5qQssbHmxKdShf85wu23. LIVE mode : prctbl_1TevYeQssbHmxKdSQJy3KjUE (idem produits, à activer pour launch) |
| Webhook Stripe → Supabase | ✅ | Endpoint configuré + signing secret + Edge Function déployée + 5 events écoutés. Webhook idempotency à durcir avant LIVE (cf §10 Polish) |
| Domaine rawadventure.world | ✅ | OVH + DNS A records + CNAME → GitHub Pages |
| Email support@rawadventure.world | ❌ | À créer (Proton ou OVH) |
| **Site légal rawadventure.world** | ✅ | GitHub Pages déployé : /cgu, /confidentialite, /mentions-legales, /abonnement (Stripe Pricing Table), /checkout-success |
| Crash reporting (Sentry / autre) | ❌ | Pas intégré |
| Analytics (Mixpanel / PostHog) | ❌ | Pas intégré |
| Screenshots App Store iPhone 6.9" | ✅ | 10 captures 1320x2868 dans assets/store-screenshots/iphone-6.9/ |

---

## 7. LÉGAL

| Élément | Statut | Notes |
|---|---|---|
| Drafts CGU/CGV V1 | ✅ | docs/legal/cgu-cgv-v1-draft.md + publié rawadventure.world/cgu |
| Drafts Politique confidentialité RGPD | ✅ | docs/legal/politique-confidentialite-rgpd-v1-draft.md + publié /confidentialite |
| Drafts Mentions légales | ✅ | docs/legal/mentions-legales-v1-draft.md + publié /mentions-legales |
| Droit applicable acté | ✅ | Français (B2C) + HK (B2B) |
| Médiation Option B (amiable) | ✅ | Sans adhésion V1 |
| Directeur publication | ✅ | Stéphane Tossens — stephane@rawadventure.world |
| Capital social Raw Adventure Limited | ✅ | Renseigné dans mentions légales |
| URLs hébergement finales | ✅ | rawadventure.world/{cgu,confidentialite,mentions-legales} |
| Validation avocat | ❌ | Recommandé avant launch |
| Case CGU acceptation in-app | 🔶 | Mention présente IA-10 + PaywallScreen, lien actif à câbler (Linking.openURL vers rawadventure.world/cgu) |

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
| Edge Function stripe-webhook | ✅ | Déployée + secrets posés (STRIPE_SECRET_KEY test, STRIPE_WEBHOOK_SECRET) |
| Realtime postgres_changes activé | ✅ | Channel subscriptions:user:{id} testé fonctionnel |
| Trigger handle_new_user | ✅ | Crée row subscriptions status=free à chaque signup |

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
| Test notifications iOS device | ❌ | À faire avec build dev |
| Test notifications Android | ❌ | Build Android non créé encore |
| Test edge cases (joker, charnière, cassure streak) | 🟡 | DEV buttons OK, scenarios full à dérouler |
| Test reset complet | ✅ | Sprint 20 |
| TestFlight beta (5-10 testeurs) | ❌ | Compte Apple Dev requis |

---

## 10. RÉCAPITULATIF PAR PRIORITÉ

### 🔴 Bloquants release stores

1. **Compte Apple Developer Organization** (DUNS HK en cours ~14j + Apple ID anti-fraud 24-48h)
2. **Compte Google Play Console** (DUNS idem)
3. **Stripe LIVE setup** (dupliquer product + 3 prices + pricing table en mode live + webhook endpoint live)
4. **EAS Build config** (TestFlight nécessite build cloud signé)
5. **Repo GitHub privé app principal** (push code RawAdventureRN)
6. **Email support@rawadventure.world** (mentionné docs légaux, doit fonctionner)
7. **Validation avocat docs légaux** (ou risque assumé)
8. **Câblage Stripe Customer Portal** dans Profil (sinon utilisateur peut pas annuler/changer plan in-app)
9. **Remplacer email perso stephanetossens@gmail.com** par compte démo dans screenshots store (08-profil.png leak)

### 🟡 Importants mais non-bloquants

1. Vidéo IA-12 bienvenue J1 (placeholder OK, à remplacer tournage)
2. Universal Link + apple-app-site-association (bouton "Retourner dans l'app" post-paiement vraiment cliquable)
3. Webhook idempotency (clé sur event.id, prévention double-update sur retry Stripe)
4. Crash reporting (Sentry)
5. Analytics (Mixpanel/PostHog)
6. Prompt permission notifs au J1 (UX)
7. RLS policies audit complet (autres tables que subscriptions)
8. Câblage links CGU/Privacy in-app (Linking.openURL)
9. Validation Mimi copy paywall final + bandeaux lapse/past_due

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

**État au 6 juin 2026** : code app + paywall + Stripe + Supabase + legal site **OK end-to-end**. Reste essentiellement admin (DUNS, Apple Dev, Play Console) + EAS Build + LIVE setup.

| Bloc restant | Effort estimé | Owner |
|---|---|---|
| Attente DUNS HK | ~14 jours | Passif (D&B) |
| Apple ID admin@ création | 24-48h anti-fraud | Stéphane |
| Inscription Apple Developer (post-DUNS) | 2-7j review Apple | Stéphane |
| Inscription Google Play Console (post-DUNS) | 1-3j review Google | Stéphane |
| EAS Build config + premier build iOS dev | 2-3 h | Claude |
| Push repo GitHub privé app | 30 min | Stéphane + Claude |
| Stripe LIVE setup (product + prices + pricing table + webhook) | 1-2 h | Stéphane + Claude |
| Câblage Customer Portal | 1-2 h | Claude |
| Email support@ Proton/OVH | 30 min | Stéphane |
| Webhook idempotency (event.id dedup) | 1 h | Claude |
| Compte démo (remplacer screenshot 08-profil) | 30 min | Claude + nouveau utilisateur Supabase |
| Câblage links CGU/Privacy in-app | 30 min | Claude |
| Audit RLS policies complet | 2 h | Claude |
| **Total dev Claude** | **~8-10 h** | |
| **Total Stéphane** | ~2 h + délais admin | |

**Bloqueur dominant** : DUNS HK (~14j). Tout le dev restant peut tenir en parallèle de l'attente.

---

## 12. JOURNAL DES UPDATES

- **3 juin 2026** : Audit initial créé. 28 notifs draftées, paywall pas codé, legal docs draftés non hébergés, Stripe inexistant.
- **6 juin 2026** : Paywall + table subscriptions + SubscriptionContext + webhook Stripe + Edge Function déployés et **E2E validé en simu iOS**. Legal site rawadventure.world LIVE (GitHub Pages). Stripe TEST mode 1 product 3 prices LIVE. 10 screenshots store iPhone 6.9" capturés. Notifications Phase 0 validées Mimi. App icon + splash intégrés. DUNS HK demandé, Apple ID anti-fraud bloqué.

---

*Fin audit.*
