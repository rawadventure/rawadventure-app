# Feature Spec — Mentorat IA-61 V1

**Statut** : À remplir
**Cible code** : `IA-61` nouvel onglet Mentorat (remplace alert placeholder dans MentoratProposalModal + ConsolidationHomeScreen)
**Cadrage** : IA V3 §IA-60 + §IA-61 + D9 (mentorat proposition active S8 sans hard-sell) + D10 (communauté = Telegram externe)

## 1 — Positionnement V1

Le mentorat 1-to-1 est **vendu hors app**. L'app sert d'**entrée d'information** : présenter, donner envie, fournir un canal de contact. Pas de paiement intégré, pas de calendrier intégré.

## 2 — Décision flow contact

3 options à arbitrer :

### Option A — Lien externe simple

Tap "Découvrir le mentorat" → `Linking.openURL('https://mentorat.raw-adventure.fr')` → site web externe avec formulaire/Calendly.

- ✅ Simple, pas de dev complexe
- ✅ Site web indépendant maintenable
- ⚠️ Sortie de l'app

### Option B — Formulaire intégré in-app

IA-61 = formulaire (nom, email, message, dispo) → email envoyé à `mentorat@raw-adventure.fr` via Supabase Edge Function.

- ✅ Reste in-app
- ⚠️ Email côté admin à gérer manuellement
- ⚠️ Pas de calendrier — délai prise de RDV

### Option C — Lien Calendly inline (WebView)

IA-61 = onglet avec WebView Calendly + description mentorat au-dessus.

- ✅ Réservation directe avec créneaux dispo
- ⚠️ Calendly compte/abo à set up
- ⚠️ WebView UX moins fluide qu'app native

**Décision** : [à compléter]

## 3 — Contenu IA-61 onglet Mentorat

### Présentation mentorat

- **Titre** : [à compléter]
- **Subtitle** : [à compléter — ce que c'est, pour qui]

### Sections explicatives

#### Pour qui ?

- [à compléter]

#### Comment ça se passe ?

- [à compléter — format séances (visio/présentiel?), durée, fréquence]

#### Avec qui ?

- [à compléter — présentation Mimi & Jacky côté coach 1-to-1]

#### Prix indicatif

- [à compléter — ou "Sur devis" / "Nous contacter"]

### CTA contact

Selon option choisie (A/B/C) :
- Option A : `Réserver un échange` → ouvre URL externe
- Option B : Formulaire intégré
- Option C : `Voir mes disponibilités` → WebView Calendly

## 4 — Copy MentoratProposalModal (IA-60)

Modale qui s'ouvre une fois à la sortie S8 (déjà codée Sprint 18 mais placeholder Alert).

- **Titre** : [à compléter — actuel : "Tu as posé les bases."]
- **Body** : [à compléter — actuel : "Si tu veux aller plus loin, accompagné, on en parle. Pas de pression, juste une porte ouverte."]
- **CTA1** : `Découvrir le mentorat` (mène IA-61)
- **CTA2** : `Plus tard` (ferme)

## 5 — Présence "visible passive" S1-S7 (D9)

Le mentorat doit être **visible mais pas pressant** pendant Phase 1 (avant S8 où il passe en proposition active). Implémentation :

- Onglet Profil → section "Mentorat" toujours visible (lien IA-61)
- Pas de notification mentorat avant S8
- Pas de modale propositionnelle avant S8 (sauf si user explore manuellement)

## 6 — Côté code — impact intégration

Quand Feature Spec validée :
1. Créer `MentoratScreen.tsx` (IA-61)
2. Ajouter route dans HomeStack OU dans nouvel onglet bottom tab "Mentorat" ? — à arbitrer
3. Wirer MentoratProposalModal.onDiscover → navigate IA-61 (remplace Alert)
4. Wirer ConsolidationHomeScreen "Découvrir le mentorat" → navigate IA-61
5. Section Profil "Mentorat" lien permanent

Charge estimée : **4-6h Claude Code** une fois spec validée.
