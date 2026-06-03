# Documents légaux — Raw Adventure

Ce dossier contient les **drafts** des documents légaux à publier avant launch.

## Documents

| Fichier | Statut | Validation requise |
|---|---|---|
| `cgu-cgv-v1-draft.md` | Draft Claude V1.0 | Relecture Mimi + adaptation Stéphane + avocat recommandé |
| `politique-confidentialite-rgpd-v1-draft.md` | Draft Claude V1.0 | Relecture Mimi + adaptation Stéphane + avocat / DPO recommandé |
| `mentions-legales-v1-draft.md` | Draft Claude V1.0 | Relecture Mimi + adaptation Stéphane |

## Méthode de production

Drafts générés par Claude à partir :
- Décisions produit Stéphane + Mimi (Feature Spec abonnement V1, brand voice, périmètre V1)
- Stack technique (Supabase, Stripe Payment Link, Apple/Google stores, Proton Mail)
- Cadre RGPD européen
- Société HK + paiements EUR

## Infos société renseignées (3 juin 2026 — confirmées via PDFs officiels HK)

- Raison sociale : **Raw Adventure Limited**
- Forme : Private Company Limited by Shares (Hong Kong, Companies Ordinance Cap. 622)
- CR Number : **80310100**
- BR Number : **80310100-000-04-26-4** (validité 30/04/2026 → 29/04/2027)
- Date d'incorporation : **30 avril 2026**
- Capital social : **100 HKD** (100 ordinary shares × 1 HKD, fully paid)
- Nature activité : Education (code 085)
- Adresse : Unit 1603, 16/F The L. Plaza, 367-375 Queen's Road Central, Sheung Wan, Hong Kong
- Directeur de la publication (FR/LCEN) : **Stéphane Tossens** — stephane@rawadventure.world
- Company Secretary HK : Osome Limited (BRN 70760066, License TC006825)
- Directors HK : Myriam Guillot, Jacky Boisset
- Shareholders : Myriam Guillot 45 (45%), Jacky Boisset 45 (45%), Stéphane Tossens 10 (10%)
- Registrar of Companies : Ms Kinnie WONG (HKSAR Registrar)

## Décisions actées (2 juin 2026)

- **Droit applicable** : droit français
- **Juridiction B2C** : tribunaux français
- **Juridiction B2B** : tribunaux de Hong Kong (siège Éditeur)
- **Éditeur déclaré** : Raw Adventure Limited (HK) — société reste HK
- **Médiation** : Option B — résolution amiable préalable (60 jours) + référence générique art. L.612-1 + plateforme RLL UE. Pas d'adhésion médiateur nommé V1. Migration vers adhésion FEVAD/CNPM/AME quand seuil ~100 clients actifs ou premier litige.
- TVA : Stripe Tax à activer post-premiers clients (cf. Feature Spec abonnement §12bis)

## Champs restants à compléter

- URLs hébergées des documents finaux (rawadventure.fr/cgu, /politique-confidentialite, /mentions-legales) — Wix pages à créer
- Médiateur conso FR agréé : différé (Option B) — à activer quand volume ou litige justifie

## Workflow recommandé

1. Stéphane complète les champs `[À COMPLÉTER]`
2. Mimi relit le ton et la formulation (cohérence brand voice)
3. **Avocat ou cabinet spécialisé valide la conformité juridique** (RGPD + droit applicable + Apple App Store + obligations consommateurs)
4. Hébergement HTML sur rawadventure.world (pages publiques)
5. Liens dans l'app : Profil → Aide → CGU + Politique confidentialité
6. Lien à l'inscription (case à cocher obligatoire à IA-10)

## Risques identifiés

- **Droit applicable HK vs France** : si majorité utilisateurs FR/UE, droit français + RGPD s'appliquent impérativement aux consommateurs même si CGU choisissent HK
- **Avertissement médical** : doit être visible à plusieurs endroits de l'app (paywall, intro pilier, écran session). Pas seulement enfoui dans CGU
- **Cookies web** : si activation analytics futur (Plausible, Posthog), nécessite mise à jour Politique
- **Stripe Tax** : à activer post-launch (cf. Feature Spec abonnement §12bis), mention dans CGU à mettre à jour

## Référence

- RGPD : https://eur-lex.europa.eu/eli/reg/2016/679/oj
- CNIL guide app mobile : https://www.cnil.fr/fr/applications-mobiles
- Apple App Store Review Guidelines §5.1 : https://developer.apple.com/app-store/review/guidelines/#privacy
