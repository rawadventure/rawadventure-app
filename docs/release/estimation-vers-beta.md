# Estimation vers la phase de test (TestFlight beta) — 16 septembre 2026

Chiffrage du travail restant avant de pouvoir mettre l'app entre les mains de vrais testeurs (R9-14, TestFlight beta 5-10 personnes), puis avant la mise en vente publique. Source : `kanban/roadmap.json` (chaque tâche porte désormais `estimateH` + `owner`, miroir sur Trello). Ce document est la photo du 16 septembre — le rapport quotidien par email suit l'évolution jour par jour.

## Vue d'ensemble des 49 tâches restantes

| Qui | Heures estimées |
|---|---|
| Claude (code, tests, builds) | ~52 h |
| Mimi & Jacky (contenu, validations, vidéos) | ~25 h |
| Stéphane (comptes, Stripe, orga) | ~8 h |
| Externe (avocat, Apple, délais) | ~9 h + délais d'attente |

## Chemin critique vers la beta TestFlight

Tout n'est pas bloquant pour la beta. Le sous-ensemble qui l'est :

### Délais externes incompressibles — à lancer immédiatement

| Tâche | Qui | Heures actives | Délai d'attente |
|---|---|---|---|
| R6-14 Débloquer Apple ID anti-fraud | Stéphane | 1 h | quelques jours |
| R6-15 Compte Apple Developer (DUNS) | Stéphane | 2 h | **1 à 2 semaines** |
| Review TestFlight (première soumission) | Apple | — | 1 à 2 jours |

C'est le vrai goulot. Tant que le compte Apple Developer n'existe pas, aucun build ne peut partir sur TestFlight, quel que soit l'état du code.

### Côté code (Claude) — ~35 h

| Bloc | Tâches | Heures |
|---|---|---|
| Abonnement | R2-15 portail, R2-16 webhook | 4 h |
| Notifications | R3-5 permission J1, R3-6 test denied | 3 h |
| Build & infra | R6-2 clés prod, R6-17 build iOS + TestFlight, R6-19 AASA, R6-23/24/25 Sentry | 10,5 h |
| Tests device | R9-7 → R9-12 (E2E onboarding, J1→J14, signup, reset, edge cases, notifs iOS) | 10 h |
| Salve Phase 1 | R9-15 (S1-S8 mécanique + contenu) | 8 h |

À raison de sessions régulières, c'est **2 à 3 semaines de travail en parallèle du délai Apple** — les deux horloges tournent en même temps.

### Contenu minimum pour une beta crédible (Mimi & Jacky) — ~6 h

R4-13 (validation S2, session Jacky), R4-14 (messages diagnostic S1), R4-15 (densifier questions S4/S5/S7/S8). Les vidéos manquantes (R5) peuvent rester en placeholder pour la beta, mais l'expérience testeur sera meilleure avec.

### Orga beta (Stéphane) — ~2 h

R9-14 : recruter 5-10 testeurs, les inviter sur TestFlight, cadrer ce qu'on leur demande d'observer.

## Projection

**Si le dossier Apple (R6-14 + R6-15, DUNS) part cette semaine : beta testeurs réaliste vers la 2e semaine d'octobre 2026 (~3-4 semaines).** Le code sera prêt avant Apple — c'est le compte développeur qui donne le tempo.

## Ce qui ne bloque PAS la beta (mais bloque la mise en vente)

- R2-14 Stripe LIVE (la beta peut tourner sur les clés test)
- R7-9 validation avocat + R7-10 médiateur conso
- R6-16/18/20 Android (la beta démarre sur iOS ; Android suit)
- R6-26 analytics, R6-27 Stripe Tax, R6-28 migration Apple Org
- R4-8/9/10/16/17 copy de finition, R5 vidéos, R8-9 buckets
- R9-13 test Android complet

Soit ~28 h supplémentaires réparties entre Claude, Mimi & Jacky, Stéphane et l'avocat, à mener pendant que la beta tourne. **Mise en vente réaliste : novembre 2026**, si la beta ne révèle pas de chantier lourd.
