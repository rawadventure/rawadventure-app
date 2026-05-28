# Brief contenu — Notifications V1

**Statut** : Drafts Claude + propositions D12 — à valider Mimi/Jacky + Stéphane (D12).
**Cible code** : `src/lib/notifications.ts` (cadre tech prêt) + futur module scheduling
**Cadrage** : Feature Spec V1 §2.9 + D12 (reporté) + D32 (plage silence 22h-8h)

---

## D12 décisions (propositions Claude)

### Q1 — Heure exacte par famille

| Famille | Heure cible | Justification |
|---|---|---|
| Rappel quotidien Phase 0 | **8h00** | Juste sortie plage silence, avant routine matinale |
| Rappel quotidien Phase 1 | **8h00** | Avant session matin cohérence cardiaque |
| Observation effet miroir | **19h00** | Soir, après journée, moment de réflexion |
| Encouragement | **événementiel** | Déclenché sur signal (joker conso, streak menacé, retour) |
| Message fond pédagogique | **Dimanche 11h00** | 1×/semaine, créneau apaisé |
| Palier streak | **immédiat** validation | Sauf plage silence → décale 8h lendemain |

### Q2 — Plafond Phase 1

**Confirmé : 1 notif/jour Phase 1**. Acté Feature Spec §2.9. Phase 0 reste max 1-2/jour.

### Q3 — Plage silence 22h-8h par famille

| Famille | Comportement plage silence |
|---|---|
| Rappel quotidien | Décale 8h lendemain |
| Observation | Décale 8h lendemain |
| Encouragement | Décale 8h lendemain |
| Message fond | Décale prochain dimanche 11h |
| Palier | TierReachedModal in-app immédiat si app ouverte. Push : décale 8h lendemain |

### Q4 — Désactivation granulaire

**Pas in-app V1**. Utilisateur passe par paramètres système iOS/Android (Feature Spec §2.9 contrainte 3).

---

## Copy notifications — 5 familles

Format : `title` + `body` court (~80 caractères body lisible mobile).
**Title commun** par défaut = nom de l'app/famille (cf. ci-dessous).

### Famille 1 — Rappel quotidien

**Slot** : `notification.global.rappel-quotidien.{jour}`
**Title** : `Raw Adventure`

7 variantes par jour de semaine (évite répétition perçue) :

| Jour | Body |
|---|---|
| Lundi | `Tu es là. C'est le moment.` |
| Mardi | `Cinq minutes, à ton rythme.` |
| Mercredi | `Mi-semaine. On observe.` |
| Jeudi | `Le corps suit ce que tu lui donnes.` |
| Vendredi | `Avant le week-end, on coche.` |
| Samedi | `Le rythme ne prend pas de week-end.` |
| Dimanche | `On boucle la semaine.` |

### Famille 2 — Observation effet miroir

**Slot** : `notification.global.observation.j{N}`
**Title** : `Observation Mimi & Jacky`

Déclenchées 19h sur J3 / J4 / J7 / J11 (effet miroir qualitatif D37).

| Jour | Body |
|---|---|
| J3 | `Trois jours. Ton sommeil bouge déjà, même si tu ne le remarques pas encore.` |
| J4 | `Quatre jours. La fenêtre digestive devient plus naturelle.` |
| J7 | `Sept jours. Tu n'es plus dans l'effort de démarrage.` |
| J11 | `Onze jours. Le rythme est installé. Plus que trois.` |

### Famille 3 — Encouragement

**Slot** : `notification.global.encouragement.{cas}`
**Title** : `Raw Adventure`

Déclenchées sur signaux comportementaux (événementiel).

| Cas | Body |
|---|---|
| Joker consommé | `Joker utilisé cette semaine. Le streak tient. Tu reprends demain.` |
| Streak menacé (1j manqué) | `Hier n'a pas été validé. Tu as encore aujourd'hui pour relancer.` |
| Retour après absence | `Bon retour. On reprend là où tu en étais.` |

### Famille 4 — Message fond pédagogique

**Slot** : `notification.global.fond.{theme}` ou `notification.s{N}.fond`
**Title** : `Mimi & Jacky`

1×/semaine, dimanche 11h00. 2 messages Phase 0 + 8 messages Phase 1 (1 par pilier).

**Phase 0**
- Semaine 1 : `La régularité bat l'intensité. Cinq actions modestes valent plus qu'une session parfaite.`
- Semaine 2 : `Ton corps mémorise ce qui est répété. Pas ce qui est dramatique.`

**Phase 1 (1 par pilier)**
- S1 Respiration : `Le souffle est le seul réflexe que tu peux régler à la main. Profite-en.`
- S2 Alimentation : `Manger moins souvent libère plus d'énergie que manger mieux. Commence par là.`
- S3 Mindset : `Ce que tu te racontes le matin oriente la journée. Observe.`
- S4 Condition physique : `Le mouvement n'est pas une dette. C'est un signal.`
- S5 Repos : `Le sommeil n'est pas une absence — c'est un travail. Donne-lui ses conditions.`
- S6 Passion : `Ce qui te tire dans l'action te donne plus d'énergie qu'il n'en prend.`
- S7 Connexion vivant : `Vingt minutes dehors par jour suffisent. Sans téléphone.`
- S8 Élimination : `Le corps n'accumule pas par choix — il accumule par manque de signal.`

### Famille 5 — Palier streak

**Slot** : `notification.tier.{N}j`
**Title** : `Palier atteint`

Déclenchées immédiatement à franchissement palier (sauf plage silence — décale).

| Palier | Body |
|---|---|
| 7j | `Sept jours. Le rythme est posé.` |
| 15j | `Quinze jours. Phase 0 traversée.` |
| 30j | `Un mois. Le rythme devient ton normal.` |
| 60j | `Soixante jours. La pratique précède le mental.` |
| 100j | `Cent jours. Quelque chose de solide est construit.` |
| 1 an | `Un an. Plus un défi, une vie.` |

---

## Copy slot global — Permission prompt initial

**Slot** : `copy.global.permission-notifications`

À afficher AVANT le prompt système (rationale screen recommandé Sprint 25+).

- **Titre** : `Les rappels Mimi & Jacky`
- **Body** : `Quelques minutes par jour, pas plus. Tu peux les couper à tout moment depuis les paramètres.`
- **CTA1** : `Activer les rappels`
- **CTA2** : `Plus tard`

---

## Notes voix (rappel)

- Body très court (~80 caractères limite mobile)
- Pas d'emoji (Brand Core stricte)
- Pas de "Bonjour !" "Salut !"
- Pas d'urgence simulée ("Vite, ton streak !")
- Préférer observation que ordre
- Ton calme, posé, factuel

---

## Décompte total V1

- Rappels quotidiens : 7 variantes
- Observation : 4 messages
- Encouragement : 3 messages
- Fond pédagogique : 10 messages (2 Phase 0 + 8 piliers)
- Paliers : 6 notifs
- **Total** : 30 messages courts

Charge production : ~2h relecture/édition Mimi/Jacky + D12 décision côté Stéphane.

## Statut intégration

Cadre technique en place (`src/lib/notifications.ts` Sprint 25) :
- `scheduleLocalNotification` avec gating plage silence
- `cancelAllNotifications` (idempotence)
- `requestNotificationPermission` (idempotente)
- DEV button test notif 5s (Profil)

Layer scheduling production (encore à coder, Sprint futur) :
- Wirer permission prompt copy à un moment narratif post-onboarding (à arbitrer : tap IA-12 Continuer ? IA-15 modale 1ère validation ?)
- Module scheduling 5 familles par phase/pilier
- Écriture table `notifications_sent` Supabase (V1.1 schéma)
