# Politique de confidentialité — Raw Adventure

**Version V1.0 — Draft Claude du 2 juin 2026**
**Statut** : Brouillon adapté pour relecture / validation Mimi + adaptation finale Stéphane. **Pas validé juridiquement.** Pour conformité stricte RGPD, consulter avocat ou DPO spécialisé.

**Champs à compléter manuellement avant publication** (marqués `[À COMPLÉTER]`).

---

## 1. Qui sommes-nous ?

L'Application **Raw Adventure** est éditée par `[À COMPLÉTER : raison sociale]`, société `[forme juridique]` enregistrée à Hong Kong sous le numéro `[immatriculation]`, dont le siège social est `[adresse]`. (« l'Éditeur », « nous »).

L'Éditeur est responsable de traitement au sens du Règlement (UE) 2016/679 du 27 avril 2016 (« RGPD »).

**Contact pour toute question relative à tes données** :
- Email : **support@rawadventure.world**
- Délégué à la protection des données (DPO) : `[À COMPLÉTER si désigné, sinon mentionner que non désigné]`

---

## 2. Quelles données collectons-nous ?

Nous collectons strictement les données nécessaires au fonctionnement de l'Application.

### 2.1 Données d'inscription
- **Email** (obligatoire) — identifie le compte, sert aux communications transactionnelles
- **Mot de passe** — chiffré (hash bcrypt) par notre prestataire Supabase, nous n'y avons pas accès en clair

### 2.2 Données d'onboarding
Réponses aux questionnaires d'évaluation initiale, notamment :
- Estimation de ton niveau d'énergie
- Estimation de ton ressenti corporel
- Estimation de ton ressenti mental
- Niveau de motivation
- Réponses qualitatives sur ton terrain

Ces données déterminent ton **profil dynamique** (P0 à P8) et calibrent ton parcours.

### 2.3 Données de progression
- Date de création du compte (`accountCreatedAt`)
- Jours validés (check quotidien Phase 0)
- Streak (jours consécutifs)
- Jokers consommés (1 par semaine calendaire)
- Paliers atteints
- Sessions de pratique réalisées (Phase 1)
- Scores des évaluations initiale et finale de chaque pilier (12 questions × 5 niveaux)
- Choix de niveau adaptatif (« moins / pareil / plus »)

### 2.4 Données techniques
- Identifiant unique de l'appareil (pour notifications push)
- Système d'exploitation et version
- Version de l'Application
- Adresse IP (lors des appels API Supabase) — utilisée uniquement pour la sécurité, non stockée à des fins analytiques

### 2.5 Données de paiement
**Nous ne stockons aucune donnée bancaire.** Le paiement est traité par notre prestataire Stripe Inc. Voir leur politique : https://stripe.com/privacy.

Nous conservons uniquement :
- Identifiant Stripe Customer (`stripe_customer_id`)
- Identifiant de l'abonnement (`stripe_subscription_id`)
- Statut d'abonnement (`active`, `cancelled`, `expired`, etc.)
- Plan choisi (mensuel / 6m / 12m)
- Dates de début et renouvellement

### 2.6 Données de communication
- Préférences de notifications (activées/désactivées, plage de silence)
- Historique des emails transactionnels envoyés (confirmation, reset password)

---

## 3. Pourquoi collectons-nous ces données ?

| Finalité | Données concernées | Base légale |
|---|---|---|
| Création et gestion du compte | Email, mot de passe | Exécution du contrat |
| Personnalisation du parcours | Onboarding, profil dynamique | Exécution du contrat |
| Suivi de la progression | Streak, paliers, sessions | Exécution du contrat |
| Calcul du score de vitalité (toile d'araignée) | Scores des évaluations | Exécution du contrat |
| Facturation et gestion abonnement | Identifiants Stripe, statut | Exécution du contrat + obligation légale comptable |
| Envoi de notifications transactionnelles | Email | Exécution du contrat |
| Envoi de notifications push pédagogiques | Identifiant appareil, préférences | Consentement |
| Sécurité (anti-fraude, anti-abus) | IP, identifiants techniques | Intérêt légitime |
| Amélioration de l'Application (statistiques anonymisées) | Données techniques agrégées | Intérêt légitime |
| Obligations légales et comptables | Historique factures, abonnements | Obligation légale |

**Nous ne vendons pas tes données.** Nous ne les utilisons pas à des fins publicitaires.

---

## 4. Qui a accès à tes données ?

### 4.1 Personnel interne
Seules les personnes autorisées au sein de l'Éditeur (équipe technique, support client) accèdent à tes données, dans la limite du strict nécessaire.

### 4.2 Sous-traitants
Nous faisons appel à des sous-traitants pour assurer le fonctionnement de l'Application :

| Sous-traitant | Service | Localisation des données | Garanties |
|---|---|---|---|
| **Supabase Inc.** | Base de données + Auth | Singapour, US, UE (selon région choisie) | DPA signé, clauses contractuelles types UE |
| **Stripe Inc.** | Paiement | UE et US | DPA, certifié PCI-DSS Level 1 |
| **Apple Inc.** | Distribution App Store, notifications APNs | US | DPA via accord développeur |
| **Google LLC** | Distribution Play Store, notifications FCM | US | DPA via accord développeur |
| **Proton Mail AG** | Emails support | Suisse | Conforme RGPD, chiffrement bout-en-bout |

Tous nos sous-traitants présentent un niveau de protection adéquat. Les transferts hors UE sont encadrés par les clauses contractuelles types adoptées par la Commission européenne.

### 4.3 Autorités
Tes données peuvent être communiquées aux autorités compétentes en cas d'obligation légale (réquisition judiciaire).

---

## 5. Combien de temps conservons-nous tes données ?

| Type de donnée | Durée de conservation |
|---|---|
| Compte actif | Pendant toute la durée de la relation contractuelle |
| Compte inactif | 24 mois après dernière connexion, puis suppression après notification |
| Historique de progression (Phase 0 + Phase 1) | Tant que le compte existe |
| Données de facturation | 10 ans (obligation comptable et fiscale) |
| Logs techniques de sécurité | 12 mois maximum |
| Emails transactionnels | 12 mois |

Après suppression de ton compte, les données identifiantes sont effacées dans un délai de 30 jours, à l'exception des données soumises à obligation légale de conservation (factures notamment).

---

## 6. Tes droits

Conformément au RGPD, tu disposes des droits suivants :

### 6.1 Droit d'accès (article 15 RGPD)
Tu peux demander une copie de toutes les données te concernant.

### 6.2 Droit de rectification (article 16)
Tu peux corriger toute donnée inexacte ou incomplète directement depuis ton Profil dans l'Application, ou en nous écrivant.

### 6.3 Droit à l'effacement / « droit à l'oubli » (article 17)
Tu peux demander la suppression de ton compte et de tes données. La suppression est définitive et irréversible.

### 6.4 Droit à la limitation (article 18)
Tu peux demander que le traitement de certaines données soit temporairement suspendu.

### 6.5 Droit à la portabilité (article 20)
Tu peux récupérer tes données dans un format structuré, couramment utilisé et lisible par machine (JSON).

### 6.6 Droit d'opposition (article 21)
Tu peux t'opposer au traitement de tes données pour des motifs tenant à ta situation particulière (sauf intérêt légitime impérieux).

### 6.7 Droit de retirer ton consentement
Pour les traitements fondés sur le consentement (notifications push pédagogiques), tu peux le retirer à tout moment dans les paramètres de l'Application, sans affecter la licéité des traitements antérieurs.

### 6.8 Droit de définir des directives post-mortem
Tu peux définir des directives sur le sort de tes données après ton décès (loi française Informatique et Libertés).

### Comment exercer tes droits ?

Adresse ta demande à : **support@rawadventure.world**

Précise dans ta demande :
- Le droit que tu souhaites exercer
- L'email associé à ton compte
- Une pièce justifiant ton identité si nécessaire

Nous te répondons dans un délai d'un mois maximum (prolongeable à 2 mois pour les demandes complexes, sur notification motivée).

### Recours auprès d'une autorité de contrôle

Si tu estimes que tes droits ne sont pas respectés, tu peux introduire une réclamation auprès de l'autorité de contrôle compétente :
- **France** : Commission Nationale Informatique et Libertés (CNIL) — www.cnil.fr
- **Autres pays UE** : autorité de contrôle nationale

---

## 7. Sécurité des données

Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger tes données :

- Chiffrement des connexions (HTTPS/TLS 1.3 sur toutes les communications)
- Chiffrement des mots de passe (hash bcrypt par Supabase)
- Chiffrement des données sensibles au repos (chiffrement Supabase au niveau infrastructure)
- Accès restreint au personnel autorisé
- Authentification deux facteurs sur les comptes administrateurs internes
- Sauvegarde régulière des bases de données
- Tests réguliers de sécurité

Aucune méthode n'est totalement infaillible. En cas de violation de données susceptible d'engendrer un risque pour tes droits et libertés, nous t'informerons dans les 72 heures conformément à l'article 33 RGPD.

---

## 8. Notifications push et cookies

### 8.1 Notifications push (mobile)

L'Application peut t'envoyer des notifications push pédagogiques (rappels, encouragements, observations). Ces notifications nécessitent ton **consentement explicite** lors de la première utilisation.

Tu peux retirer ce consentement à tout moment dans les paramètres système de ton appareil ou dans les préférences in-app.

**Plage de silence** : aucune notification n'est envoyée entre 22h et 8h heure locale, quel que soit ton paramètre.

### 8.2 Cookies (site web rawadventure.world)

Le site web utilise uniquement des cookies strictement nécessaires au fonctionnement (authentification, session, sécurité). Aucun cookie publicitaire, aucun cookie tiers de tracking.

L'Application mobile n'utilise pas de cookies au sens technique. Elle utilise un stockage local (AsyncStorage) pour mémoriser ta session et ta progression hors-ligne.

---

## 9. Données sensibles — Précisions

Certaines données collectées dans le cadre du parcours (ressenti corporel, énergie, sommeil, alimentation, etc.) peuvent être considérées comme des **données de santé** au sens de l'article 9 RGPD.

Nous traitons ces données sur la base de **ton consentement explicite** donné lors de l'inscription et confirmé à chaque évaluation initiale.

Nous t'informons que :
- Ces données ne sont **jamais transmises à des tiers à des fins commerciales**
- Ces données ne sont **jamais utilisées pour profilage marketing ou publicitaire**
- Ces données sont conservées uniquement pour personnaliser ton parcours et calculer ta progression
- Tu peux retirer ton consentement à tout moment en supprimant ton compte

**L'Application ne pose pas de diagnostic médical et ne fournit aucun avis médical.** Voir CGU Article 6.2.

---

## 10. Transferts internationaux de données

Nos sous-traitants Supabase, Stripe, Apple, Google opèrent des serveurs en dehors de l'Union européenne (notamment aux États-Unis et à Singapour).

Ces transferts sont encadrés par :
- Les **clauses contractuelles types** adoptées par la Commission européenne (article 46 RGPD)
- Les certifications de conformité de nos sous-traitants (SOC 2, ISO 27001, PCI-DSS selon le cas)
- Des Data Processing Agreements signés avec chaque sous-traitant

Tu peux nous demander une copie de ces garanties à support@rawadventure.world.

---

## 11. Mineurs

L'Application est strictement réservée aux personnes de **18 ans révolus**. Nous ne collectons pas sciemment de données concernant des mineurs.

Si tu es parent et constates qu'un mineur a créé un compte sans ton autorisation, contacte-nous immédiatement à support@rawadventure.world pour suppression.

---

## 12. Modification de la présente Politique

L'Éditeur peut modifier la présente Politique de confidentialité pour refléter des évolutions légales, techniques ou de l'Application.

Toute modification substantielle est notifiée par email et/ou notification in-app au moins 30 jours avant son entrée en vigueur. La version applicable est celle en vigueur à la date à laquelle tu utilises l'Application.

L'historique des versions est consultable à : `[À COMPLÉTER : URL]`.

---

## 13. Contact

Pour toute question, demande d'exercice de droits, ou réclamation relative à tes données personnelles :

**support@rawadventure.world**

---

**Dernière mise à jour** : `[À COMPLÉTER : date publication]`
**Version** : V1.0
