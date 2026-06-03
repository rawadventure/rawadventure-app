# Phase 0 — Audit Release Readiness

**Date** : 3 juin 2026
**Cible** : TestFlight beta puis App Store / Play Store launch
**Périmètre** : 14 premiers jours de l'expérience utilisateur (onboarding + Phase 0)

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
| **Paywall fin Phase 0 (J14)** | ❌ | Spec'd mais pas codé |
| **Table Supabase `subscriptions`** | ❌ | Pas créée |
| **SubscriptionContext** | ❌ | Pas créé |
| **Webhook Stripe Edge Function** | ❌ | Pas créé |
| **Deep link `subscription-success`** | ❌ | Schéma OK, handler pas câblé |
| **Écran gestion abonnement Profil** | ❌ | IA-71 pas créé |
| Logout depuis Profil | ✅ | Présent ProfilTabScreen |

---

## 3. CODE — Notifications

| Élément | Statut | Notes |
|---|---|---|
| Cadre technique (Sprint 25) | ✅ | notifications.ts + tests |
| Plage silence 22h-8h (D32) | ✅ | shiftOutOfSilence |
| 28 notifs Phase 0 schedulées | ✅ | Matin 8h + soir 20h conditionnel |
| Annulation reminder soir au coche | ✅ | cancelTodayReminder |
| Request permission UX | 🟡 | Pas de prompt natif au bon moment — actuellement via DEV button. À ajouter prompt au J1 launch |
| Copy 28 notifs | 🟡 | Drafts Claude, à valider Mimi |
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
| Copy paywall fin Phase 0 | ❌ | À drafter + valider Mimi |
| Copy bandeaux lapse / past_due | ❌ | À drafter + valider Mimi |
| **28 notifications Phase 0** | 🟡 | Drafts Claude, à valider Mimi |
| Description app stores (Reader App) | ❌ | À drafter + valider Mimi |

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
| Repo GitHub privé (D22) | ❌ | Local only, risque perte totale |
| Env vars Supabase prod vs dev | 🔶 | .env existe mais pas de séparation prod/dev |
| EAS Build config | ❌ | Pas configuré |
| Dev build iOS fonctionnel | ✅ | `npx expo run:ios` OK |
| App icon | ❌ | Placeholder Expo default |
| Splash screen | ❌ | Placeholder Expo default |
| Compte Apple Developer Organization | 🔶 | DUNS à demander |
| Compte Google Play Console | ❌ | Pas créé |
| Compte Stripe | ❌ | Pas créé |
| Domaine rawadventure.world | ✅ | Possédé |
| Email support@rawadventure.world | ❌ | À créer via Proton |
| Pages Wix CGU/Privacy/Mentions | ❌ | À créer |
| Crash reporting (Sentry / autre) | ❌ | Pas intégré |
| Analytics (Mixpanel / PostHog) | ❌ | Pas intégré |

---

## 7. LÉGAL

| Élément | Statut | Notes |
|---|---|---|
| Drafts CGU/CGV V1 | ✅ | docs/legal/cgu-cgv-v1-draft.md |
| Drafts Politique confidentialité RGPD | ✅ | docs/legal/politique-confidentialite-rgpd-v1-draft.md |
| Drafts Mentions légales | ✅ | docs/legal/mentions-legales-v1-draft.md |
| Droit applicable acté | ✅ | Français (B2C) + HK (B2B) |
| Médiation Option B (amiable) | ✅ | Sans adhésion V1 |
| Directeur publication | ❌ | À renseigner |
| Capital social Raw Adventure Limited | ❌ | À renseigner |
| URLs hébergement finales | ❌ | Wix pages à créer |
| Validation avocat | ❌ | Recommandé avant launch |
| Case CGU acceptation in-app | 🔶 | Mention présente IA-10, lien actif à câbler |

---

## 8. SUPABASE — Config dashboard

| Élément | Statut | Notes |
|---|---|---|
| Projet créé | ✅ | Existant V0 |
| Tables V1 (profiles, progress, etc.) | ✅ | Sprint 4+ migration faite |
| RLS policies | 🟡 | À vérifier exhaustif sur toutes tables V1 |
| Email confirmation activée | 🟡 | À cocher dashboard (Stéphane) |
| Redirect URLs whitelist | 🟡 | À ajouter `rawadventure://reset-password` + `rawadventure://confirm-email` |
| Email templates FR (reset + signup confirm) | 🟡 | À coller drafts |
| Storage buckets pour vidéos | ❌ | Pas créés |
| Auth → Settings : password min length 6 | ✅ | Défaut Supabase |
| Auth → Rate limiting | 🟡 | À vérifier defaults OK |

---

## 9. QA — Tests

| Élément | Statut | Notes |
|---|---|---|
| Tests unitaires Jest | ✅ | 120 verts |
| Test E2E onboarding → J1 device réel | ❌ | À faire |
| Test E2E J1 → J14 + paliers | ❌ | À faire |
| Test signup + email confirm flow | 🔶 | UI OK, deep link non testé device réel (cf. fail Safari) |
| Test reset password flow | 🔶 | Idem deep link |
| Test notifications iOS device | ❌ | À faire avec build dev |
| Test notifications Android | ❌ | Build Android non créé encore |
| Test edge cases (joker, charnière, cassure streak) | 🟡 | DEV buttons OK, scenarios full à dérouler |
| Test reset complet | ✅ | Sprint 20 |
| TestFlight beta (5-10 testeurs) | ❌ | Compte Apple Dev requis |

---

## 10. RÉCAPITULATIF PAR PRIORITÉ

### 🔴 Bloquants release stores

1. Compte Apple Developer Organization (DUNS en cours)
2. Compte Google Play Console
3. App icon + splash screen
4. EAS Build config
5. **Paywall J14 + table subscriptions + webhook Stripe** (sinon utilisateur bloque fin Phase 0)
6. Compte Stripe + 3 produits + Payment Link
7. Validation Mimi des 28 notifications + copy paywall
8. Validation avocat docs légaux (ou risque assumé)
9. Pages Wix CGU/Privacy/Mentions hébergées
10. Description App Store (Reader App pattern)

### 🟡 Importants mais non-bloquants

1. Vidéo IA-12 bienvenue J1 (placeholder OK, à remplacer tournage)
2. Repo GitHub privé (D22 — risque perte)
3. Crash reporting (Sentry)
4. Analytics (Mixpanel/PostHog)
5. Prompt permission notifs au J1 (UX)
6. RLS policies audit complet
7. Email support@rawadventure.world

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

## 11. ESTIMATION CHEMIN CRITIQUE TestFlight beta

**Effort restant pour TestFlight viable** (auth + onboarding + Phase 0 J1-J14 + paywall + abonnement) :

| Bloc | Effort estimé Claude Code |
|---|---|
| Paywall + table subscriptions + SubscriptionContext | 4-6 h |
| Webhook Stripe Edge Function | 2-3 h |
| Écran gestion abonnement Profil | 2 h |
| Prompt permission notif J1 + bandeau | 1 h |
| EAS Build config + app icon placeholder | 2 h |
| Pages Wix (manuel Stéphane) | 2 h Stéphane |
| Compte Apple Dev (manuel Stéphane) | 1-4 semaines DUNS |
| Compte Stripe + produits (manuel Stéphane) | 1 h Stéphane |
| Total dev Claude | **~12 h** |
| Total manuel Stéphane | ~6 h + délais admin |

---

*Fin audit.*
