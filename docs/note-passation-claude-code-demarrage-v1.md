# Note de passation — Démarrage code V1 avec Claude Code

**Date :** 13 mai 2026
**Auteur :** Stéphane avec assistance Claude.ai (chat Feature Spec S1)
**Destinataire :** Claude Code (en CLI sur la machine de Stéphane)
**Objectif :** Briefer la première session Claude Code post-stabilisation du socle produit, pour démarrer l'implémentation de la V1 (Phase 0 + S0 + Phase 1 limitée à S1 Respiration en première vague).

---

## 1 — Où on en est

Le **socle produit V1 est stable** au 13 mai 2026. 8 documents de cadrage sont figés en versions stables et co-cohérents les uns avec les autres. La production de la **Feature Spec S1 Respiration V1.0** a été livrée, elle sert de pilier-pattern Type A pour les 7 autres piliers à venir (S2 à S8).

Les patches groupés en sortie de production S1 ont tous été propagés. Aucune incohérence connue entre les docs de cadrage à ce stade. Le Project Claude.ai a été nettoyé (passations consommées supprimées, matières source conservées).

**État du code aujourd'hui.** Le repo Git existe localement avec un proto V0 codé en Expo + React Native. Le V0 contient une Phase 0 partiellement fonctionnelle (`OnboardingScreen`, `ChecklistScreen`, `DayScreen`, `ConversionScreen`, `ProtocolScreen`, `SettingsScreen`, `AuthScreen`) et une intégration Supabase de base (auth + tables `profiles` et `progress`). Le V0 a été audité contre les docs fondateurs le 7 mai 2026 — l'audit a identifié 14 mécaniques M1 à M14 dont une bonne moitié nécessite une refonte significative pour la V1.

**Ce qui n'est pas encore prêt côté Claude Code.** Le Design système V1 est en cours de finalisation dans un chat Claude.ai dédié (validation Stéphane non actée au moment de cette passation). Conséquence : Claude Code peut démarrer sur l'infrastructure et la couche données sans attendre, mais les écrans visuels qui dépendent du Design système (notamment Phase 0 et S1 Phase 1) devront attendre que le Design système soit figé. Sans ça, les choix visuels seront approximatifs et probablement à refaire.

---

## 2 — Documents de référence pour Claude Code

Tous les documents listés ci-dessous doivent être présents dans le dossier `docs/` du repo et accessibles à Claude Code. Ils sont la source de vérité pour toutes les décisions d'implémentation. En cas de conflit entre deux docs, la hiérarchie de priorité est : Synthèse V8.1 > Métriques V1.5 > Information Architecture V1 > Feature Spec V1 Socle minimum V1.2 > Feature Spec S1 V1.0 > Schéma de données V1.1 > Customer Journey V1.3 > Brand Core > Product Vision v2.2.

**Sources de vérité actives.**

- `CLAUDE.md` à la racine du repo (V1.3, 13 mai 2026) — point d'entrée Claude Code, lu en premier
- `docs/cadrage/product-vision-v2-2.md` — vision, périmètre V1, principes directeurs non-négociables
- `docs/cadrage/brand-core.md` — positionnement, voix Mimi & Jacky, vocabulaire à utiliser/éviter
- `docs/cadrage/charte-graphique.md` — palette, typographies, univers visuel (sera remplacée/complétée par Design système V1 une fois figé)
- `docs/cadrage/customer-journey-v1-3.md` — parcours utilisateur 10 semaines, moments-charnières
- `docs/cadrage/information-architecture-v1.md` — spec des 45 écrans V1 (V3, 7 mai 2026)
- `docs/cadrage/decisions-v8-1.md` — registre des 41 décisions produit (Synthèse V8.1)
- `docs/cadrage/user-personas-v1.md` — Isabelle (segment A) et Caroline (segment C), cibles V1

**Specs techniques.**

- `docs/specs/feature-spec-v1-socle-minimum-v1-2.md` — mécaniques transverses (états du parcours, streak, joker hebdomadaire en Phase 0 et Phase 1, paliers, soft-rappel, niveau adaptatif, notifications, plage de silence)
- `docs/specs/feature-spec-pilier-s1-respiration.md` (V1.0 stable) — pilier-pattern Type A, à implémenter pour la première semaine de Phase 1
- `docs/specs/metriques-v1-5.md` — calcul du score de vitalité, évaluations 12 questions, mapping diagnostic 5 niveaux, règle D40 (diagnostic → engagement), typologie D41 (Type A / Type B), matrice 8×8 archétypes × piliers
- `docs/specs/schema-donnees-v1-1.md` — tables Supabase à créer ou patcher (9 tables V1 + 1 réservée V2)

**Matière source pour les phases ultérieures.**

- `docs/matiere-jacky/V0_PILIER_*.docx` (8 fichiers) — matière brute Jacky pour S1 à S8, utile pour produire les Feature Specs S2 à S8 et le Brief contenu V1
- `docs/matiere-jacky/V0_Phase0_*.docx` (6 fichiers) — matière brute Phase 0 (14 jours, gammification, leviers stratégiques)
- `docs/brief-contenu/session-1.md` à `session-3.md` — briefs des vidéos déjà cadrées (paliers streak, vidéos S0, intros de pilier)

---

## 3 — État du code V0 et chantiers de refonte V1

Le V0 a été audité le 7 mai 2026 (document `raw-adventure-audit-v0-vs-docs-fondateurs.md` désormais consommé, ses conclusions sont dans la Synthèse V8.1 et dans le `CLAUDE.md` du repo). Quatre chantiers structurants ont été identifiés.

**Chantier M2 + M3 — Refonte calendaire et streak/joker.** Le V0 utilise `completedDays.length` sans notion calendaire ni joker. La V1 doit suivre le calendrier réel via `currentDay` calculé depuis `accountCreatedAt`, et implémenter la mécanique joker en semaine calendaire fixe (lundi-dimanche fuseau local) avec le seuil 5/7 en Phase 0 (D6 modifié) et la règle 1 session sur 3 en Phase 1 (Feature Spec S1 § 4.5). **Charge estimée : 7 à 11 heures Claude Code.** Documentation : Feature Spec V1 Socle minimum V1.2 § 2.4 et § 2.5.

**Chantier M5 — Refonte conversion.** Le `ConversionScreen` V0 a 3 tiers d'abonnement et était auto-affiché à `streak >= 14`. Le patch V0 minimal du 7 mai 2026 (commit `207e573`) a retiré l'auto-affichage. La refonte V1 doit supprimer le plan trimestriel (ne garder que mensuel + annuel), refondre le copy en accord avec D3 (conversion accessible dès J3, pas concentrée sur J15), intégrer le paiement in-app via Apple Pay / Google Pay / Stripe / RevenueCat. **Charge à chiffrer en Feature Spec abonnement dédiée**, non livrée à ce jour. Documentation : IA V3 § IA-30, IA-31.

**Chantier M7 + A3 — Inversion flow auth/onboarding et migration local→distant.** Le V0 affiche `AuthScreen` **avant** l'onboarding (`App.tsx` ligne 47). La V1 doit inverser : 10 slides d'onboarding accessibles en mode anonyme avec stockage AsyncStorage, création de compte uniquement à IA-10 (slide 10), puis migration automatique des 4 clés AsyncStorage vers les tables Supabase `profiles` et `progress`. **Charge estimée : 4 à 6 heures Claude Code.** Documentation : IA V3 § IA-10 et Feature Spec V1.2 § 2.10.

**Chantier nouveau — Phase 1 et S1 complet.** Tout le périmètre Phase 1 est à coder (IA-40 évaluation, IA-41 récap, IA-42 vue d'ensemble, IA-43 session, IA-44 modale niveau adaptatif, IA-45 vidéo transition, IA-46 évaluation finale, IA-47 récap). Référence : Feature Spec S1 V1.0. **Charge estimée : 20 à 30 heures Claude Code** pour S1 complet (sans le copy ni les vidéos qui dépendent du Brief contenu V1 et du tournage Mimi & Jacky).

**Code à conserver / supprimer / patcher.**

- À supprimer : `useProgress.ts` (doublon legacy de `ProgressContext`)
- À conserver comme prototype Phase 1 sans intégrer : `ProtocolScreen.tsx` (réserve d'idées pour le calibrage Phase 0 par archétype)
- À patcher pour aligner sur V1 : tous les autres écrans V0 (`OnboardingScreen`, `ChecklistScreen`, `DayScreen`, `ConversionScreen`, `SettingsScreen`, `AuthScreen`) selon les chantiers M2/M3/M5/M7 ci-dessus
- À externaliser : la clé Supabase, déplacement vers `app.config.ts` via `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## 4 — Recommandation de séquence pour démarrer

Vu l'état du projet, la séquence recommandée est la suivante. Cette séquence est conçue pour produire du résultat tangible vite et minimiser les blocages par dépendances externes (Design système, Brief contenu V1, tournage vidéos).

**Étape 1 — Audit du repo et nettoyage technique (1-2 heures).** Avant d'écrire une ligne de feature, faire un état des lieux propre. Vérifier la structure du repo, l'arborescence `src/`, les conventions de nommage, l'état du `.gitignore`, l'externalisation de la clé Supabase, la suppression de `useProgress.ts` legacy. Documenter ce qui existe vs ce qui manque par rapport à l'IA V1.

**Étape 2 — Schéma de données Supabase (2-4 heures).** Créer les 8 nouvelles tables V1 dans Supabase selon Schéma de données V1.1 (`streak_history`, `joker_consumptions`, `tier_reaches`, `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices`, `notifications_sent`, plus la table vide `daily_check_ins` pour réserver le nom V2). Mettre en place les politiques RLS. Patcher la table `progress` existante pour ajouter `actions_count` et `validated_at`. Patcher la table `profiles` pour ajouter `profile_dynamic_id` et `account_created_at`.

**Étape 3 — Refonte de la couche données / store de parcours (3-5 heures).** Refondre `ProgressContext` pour intégrer le calcul calendaire (`currentDay` depuis `accountCreatedAt`), la mécanique de streak et de joker hebdomadaire, le seuil 5/7 en Phase 0, la transition Phase 0 → Phase 1, le compteur `currentPilar` et `pilarStartedAt`. Tests unitaires sur le calcul calendaire et la mécanique joker (cas critiques : changement de semaine, changement de fuseau horaire, jour non validé avec joker dispo / consommé).

**Étape 4 — Refonte du flow auth/onboarding (M7 + A3, 4-6 heures).** Inverser l'ordre : onboarding anonyme avec AsyncStorage en premier, création de compte à IA-10 ensuite, migration automatique vers Supabase à la création de compte. Tests sur le cas où l'utilisateur abandonne en cours d'onboarding et revient plus tard.

**Étape 5 — Refonte des écrans Phase 0 (M2 + M3, 7-11 heures).** Patcher `ChecklistScreen` pour le seuil 5/7, le soft-rappel, l'affichage du joker disponible/consommé. Patcher `DayScreen` pour utiliser le calcul calendaire réel. Créer l'écran IA-15 (modale de validation de journée). Aligner le copy sur l'Audit copy V1 et le Brand Core. À ce stade, on peut commencer à intégrer les éléments du Design système V1 **s'il est figé** — sinon, placeholders visuels en attendant.

**Étape 6 — Écrans S0 de transition (IA-20, IA-21).** Cadrés en Feature Spec V1.2 § 3. Vidéos cadrées en Brief contenu Session 2. Production des vidéos non encore livrée — placeholders en attendant.

**Étape 7 — Phase 1 et S1 Respiration complet.** Tout le périmètre Feature Spec S1 V1.0. Implémentation des écrans IA-40 à IA-47 dans le contexte du pilier S1. Couche données alimentée par les tables `pillar_evaluations`, `pillar_sessions`, `level_adaptive_choices` créées à l'étape 2. Composant `S1_EVALUATION_QUESTIONS` à coder une fois, réutilisé en IA-40 et IA-46. Timer cohérence cardiaque visualisé avec rythme 6 cycles/minute. Copy en placeholders selon les slots définis en Feature Spec S1 § 7.2 — production effective en Brief contenu V1 par Mimi & Jacky.

**Étape 8 — Écrans transverses (toile IA-25/IA-26, paliers IA-50/IA-51, profil IA-70).** Ces écrans peuvent en partie être codés en parallèle des étapes 5 à 7 selon la disponibilité du Design système.

**Volume total estimé pour démarrer V1 jusqu'à S1 complet : 40 à 60 heures Claude Code.** À répartir sur plusieurs sessions de travail selon la disponibilité de Stéphane.

---

## 5 — Pièges connus et points d'attention

**Piège 1 — Ne pas re-implémenter ce que les docs ont déjà tranché.** Le V0 contient des choix qui ne sont plus alignés avec les docs V1 (seuil de validation à 4/6 dans le V0 alors que la V1 acte 5/7, joker glissant dans le V0 alors que la V1 acte semaine calendaire fixe lundi-dimanche, score quotidien dans le V0 alors que D34 acte pas de score quotidien V1, etc.). Claude Code doit **systématiquement consulter le doc de cadrage avant de patcher un comportement existant**, même si le code V0 semble fonctionnel.

**Piège 2 — Ne pas confondre Phase 0 et Phase 1 sur la mécanique de validation.** En Phase 0, validation = "au moins 5 actions cochées sur 7" (D6 modifié). En Phase 1, validation = "au moins 1 session sur 3 du pilier en cours" (Feature Spec S1 § 4.5). Le joker hebdomadaire s'applique aux deux phases sur la même logique (Feature Spec V1.2 § 2.5). Le streak est continu sur tout le parcours, il ne se réinitialise pas à la transition Phase 0 → Phase 1.

**Piège 3 — Inversion sémantique des questions Q6, Q7, Q8 de l'évaluation S1.** Pour le calcul du score brut /60 en IA-40 et IA-46, les questions Q6, Q7, Q8 doivent être inversées : `score_utilisé = 6 - réponse_utilisateur`. Marquer ces 3 questions avec `reversed: true` dans la constante `S1_EVALUATION_QUESTIONS` et appliquer l'inversion explicitement au calcul. Détail : Feature Spec S1 § 2.2.

**Piège 4 — Cohérence cardiaque à 6 cycles/minute invariante.** Quelle que soit la durée de session (5/10/20 min selon niveau Essentiel/Progression/Immersion), le rythme respiratoire reste 6 cycles/minute (5s inspiration / 5s expiration). C'est la durée qui module, pas le rythme. Le timer doit être visible à l'écran avec une indication visuelle ou sonore du rythme — l'utilisateur n'a pas à compter mentalement. Détail : Feature Spec S1 § 3.3.

**Piège 5 — Les vidéos Mimi & Jacky ne sont pas tournées au moment de cette passation.** Les écrans qui contiennent des vidéos (IA-20, IA-21, IA-41 pour chaque pilier, IA-45 entre piliers, IA-50 pour chaque palier de streak) doivent intégrer des **placeholders vidéo** en attendant le tournage. Slot de média identifié par convention `media.IA-XX.nom-de-l-asset` (voir Feature Spec V1.2 § 1.2). Claude Code peut coder le composant lecteur vidéo, l'affichage placeholder ("Vidéo à venir"), et la mécanique de cache vidéo une fois les URLs disponibles.

**Piège 6 — Le Design système V1 n'est pas figé au moment de cette passation.** Voir § 1 de cette note. La Charte graphique actuelle (`docs/cadrage/charte-graphique.md`) reste applicable comme base. Claude Code doit éviter de figer trop tôt des choix visuels qui devront probablement être patchés une fois le Design système V1 stable.

**Piège 7 — Stockage local-only V1 (D28).** L'app ne fait pas de sync multi-appareil en V1. Le store hybride local + Supabase (AsyncStorage pour le mode anonyme, Supabase une fois connecté) est conservé tel quel. Pas de Firebase Auth, pas de second backend. Les seules requêtes réseau sortantes V1 concernent l'auth Supabase, les lectures/écritures Supabase, et le téléchargement des médias vidéo via CDN.

---

## 6 — Workflow Git recommandé

**Branche main protégée.** Aucun commit direct sur main. Tout passe par branches feature.

**Convention de nommage des branches.** `feat/M2-refonte-calendaire`, `feat/M7-inversion-flow-auth`, `feat/S1-evaluation-initiale`, `feat/S1-session-coherence-cardiaque`, etc. Une branche par chantier identifiable.

**Validation avant merge.** Avant chaque merge dans main, Stéphane valide la branche en testant l'app sur son téléphone via Expo Go. Pas de CI/CD automatique en V1.

**Convention des commits.** Messages clairs en français, format `feat: description courte` / `fix: description courte` / `refactor: description courte` / `docs: description courte`. Pas de commits "WIP" sur main.

**Push vers GitHub.** À chaque fin de session de travail, push de la branche feature vers GitHub. Stéphane fait le merge en GUI quand la branche est validée.

---

## 7 — Décisions techniques déjà actées (rappel)

Pour mémoire, les choix techniques déjà figés dans le `CLAUDE.md` V1.3 du repo et à respecter.

- **Stack :** React Native + Expo (managed workflow). Pas d'éjection en V1.
- **Backend :** Supabase (auth + Postgres + Storage si nécessaire pour les médias). Pas de second backend.
- **TypeScript :** Strict mode activé. Pas de `any` sauf cas extrêmes documentés.
- **State management :** Context API React + hooks (`ProgressContext`, `AuthContext`). Pas de Redux, pas de Zustand, pas de MobX en V1.
- **Navigation :** React Navigation. Tab bar à 3 onglets (Accueil, Toile, Profil) sur les écrans principaux post-onboarding.
- **Internationalisation :** Préparée mais pas active en V1 (slots de copy identifiés par clé, pas de chaîne en dur, mais pas de sélecteur de langue). V1 française uniquement (D23).
- **Notifications :** Expo Notifications. Tâche programmée serveur (Supabase Edge Functions ou équivalent) pour calculer les notifications à envoyer chaque jour. Plage de silence 22h-8h en heure locale utilisateur (D32).
- **Stockage local :** AsyncStorage pour le mode anonyme et les données qui ne nécessitent pas Supabase (préférences locales, cache vidéo).
- **Tests :** Tests unitaires Jest sur le calcul calendaire, la mécanique de streak/joker, l'inversion sémantique du score S1, le mapping diagnostic → engagement (D40). Pas de tests E2E en V1.

---

## 8 — Dépendances externes au démarrage du code

Ces dépendances ne bloquent pas le démarrage des chantiers techniques mais sont à connaître.

**Dépendance 1 — Design système V1 figé.** Bloque les chantiers visuels (étapes 5, 6, 7 ci-dessus). À débloquer côté Stéphane dans le chat dédié "Design système et maquettes Raw Adventure App". Recommandation : figer le Design système avant l'étape 5 si possible.

**Dépendance 2 — Brief contenu V1 produit par Mimi & Jacky.** Bloque la livraison de copy définitif. Claude Code peut coder avec des placeholders `copy.IA-XX.nom-du-slot` et intégrer le copy une fois livré. Liste des 45 slots S1 dans Feature Spec S1 § 7.2. Liste des slots Phase 0 dans Feature Spec V1.2.

**Dépendance 3 — Tournage des vidéos Mimi & Jacky.** Une vingtaine de vidéos à tourner pour V1 complète (vidéos S0.1, S0.2, 8 vidéos intro pilier, 7 vidéos transition entre piliers, 6 vidéos paliers de streak). Placeholders en attendant.

**Dépendance 4 — Feature Specs S2 à S8.** Pas bloquant pour S1. Bloquant pour livrer la V1 complète. À produire après stabilisation de S1 codée, en utilisant la Feature Spec S1 V1.0 comme template plug-and-play. Recommandation : produire S2 quand le code S1 est testable, pour bénéficier du retour d'expérience.

---

## 9 — Reporting et points de synchronisation avec Stéphane

**Fréquence recommandée.** Stéphane et Claude Code se retrouvent en fin de chaque session de travail. Claude Code récapitule ce qui a été fait, ce qui reste à faire, les éventuels écarts identifiés vis-à-vis des docs de cadrage.

**Cas de blocage technique.** Si Claude Code rencontre un cas non couvert par les docs de cadrage, **ne pas trancher unilatéralement**. Lever le sujet auprès de Stéphane qui arbitrera (et fera potentiellement un patch d'un doc de cadrage si nécessaire). Trois sources possibles d'ambiguïté : (a) un comportement non spécifié dans les docs, (b) une contradiction entre deux docs, (c) une décision produit qui n'a pas été prise. Dans tous les cas, on documente la question et on attend.

**Cas de désaccord avec une décision produit.** Si Claude Code estime qu'une décision produit actée pose un problème technique (par exemple performance, complexité disproportionnée, dette technique inévitable), le signaler explicitement à Stéphane avec arguments. La décision finale appartient à Stéphane mais Claude Code n'est pas là pour exécuter sans réfléchir — il est là pour challenger quand pertinent.

**Documentation au fil de l'eau.** À chaque session de code significative, Claude Code met à jour le `CLAUDE.md` du repo si nécessaire (par exemple : ajout d'une convention de nommage, choix d'une bibliothèque, structure de dossier nouvelle). Pas de patch d'un doc Project depuis Claude Code — les docs Project restent éditables uniquement depuis Claude.ai (la session principale avec Stéphane et Claude.ai).

---

## 10 — Ce que cette note ne couvre pas

- Le Brief contenu V1 (production par Mimi & Jacky, hors-scope code)
- Le calibrage de la conversion abonnement (Feature Spec abonnement à produire séparément)
- Le détail des Feature Specs S2 à S8 (à produire au rythme du code)
- Le marketing et la stratégie de lancement (hors-scope V1 technique)
- Les choix de CDN pour les médias vidéo (à arbitrer en Technical Spec dédiée)
- L'intégration de la passerelle de paiement (Stripe vs RevenueCat à arbitrer en Feature Spec abonnement)

---

**Bon démarrage. Le socle est solide, les pièges sont identifiés, la séquence est claire. Stéphane reste disponible en chat Claude.ai pour tout arbitrage produit ou question de cadrage. Pour les questions purement techniques, Claude Code tranche en autonomie selon les conventions du `CLAUDE.md` du repo.**

*Fin de la note de passation.*
