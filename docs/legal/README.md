# Documents légaux — Raw Adventure

Ce dossier contient les **drafts** des documents légaux à publier avant launch.

## Documents

| Fichier | Statut | Validation requise |
|---|---|---|
| `cgu-cgv-v1-draft.md` | Draft Claude V1.0 | Relecture Mimi + adaptation Stéphane + avocat recommandé |
| `politique-confidentialite-rgpd-v1-draft.md` | Draft Claude V1.0 | Relecture Mimi + adaptation Stéphane + avocat / DPO recommandé |
| `mentions-legales-v1-draft.md` | À produire | — |

## Méthode de production

Drafts générés par Claude à partir :
- Décisions produit Stéphane + Mimi (Feature Spec abonnement V1, brand voice, périmètre V1)
- Stack technique (Supabase, Stripe Payment Link, Apple/Google stores, Proton Mail)
- Cadre RGPD européen
- Société HK + paiements EUR

## Infos société renseignées (2 juin 2026)

- Raison sociale : **Raw Adventure Limited**
- Forme : Hong Kong Limited Company
- CR Number : **80310100**
- Adresse : Unit 1603, 16th Floor, The L. Plaza, 367-375 Queen's Road Central, Sheung Wan, Hong Kong

## Décisions actées (2 juin 2026)

- **Droit applicable** : droit français
- **Juridiction B2C** : tribunaux français
- **Juridiction B2B** : tribunaux de Hong Kong (siège Éditeur)
- **Éditeur déclaré** : Raw Adventure Limited (HK) — société reste HK
- **Médiation** : médiateur conso FR agréé + plateforme RLL UE
- TVA : Stripe Tax à activer post-premiers clients (cf. Feature Spec abonnement §12bis)

## Champs restants à compléter

- Directeur de la publication (nom)
- URLs hébergées des documents finaux (rawadventure.world/cgu, /privacy)
- Médiateur conso FR agréé (choix parmi liste economie.gouv.fr)

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
