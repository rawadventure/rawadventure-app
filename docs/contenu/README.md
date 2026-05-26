# docs/contenu/ — Briefs contenu Raw Adventure V1

Source de vérité pour le **copy validé** Mimi & Jacky destiné à l'intégration code.

## Workflow

```
[Toi + Mimi/Jacky discutent dans Claude.ai Project]
                ↓
[Tu remplis le brief markdown correspondant]
                ↓
[Tu reviens dans Claude Code → "intègre docs/contenu/brief-X.md"]
                ↓
[Claude lit, intègre dans src/screens/v1/..., commit]
```

## Statut des briefs

| Brief | Statut | Cible code |
|---|---|---|
| brief-onboarding-v1.md | À remplir | OnboardingScreenV1.tsx |
| brief-phase0-v1.md | À remplir | phase0-actions.ts + HomeScreenV1.tsx + JourCharniereScreen.tsx |
| brief-s0-transition-v1.md | À remplir | S01Screen.tsx + S02Screen.tsx |
| brief-paliers-v1.md | À remplir | TierReachedModal.tsx + PaliersGalleryScreen.tsx |
| brief-ia12-bienvenue-v1.md | À remplir | WelcomeVideoScreen.tsx |
| brief-ia22-sortie-s8-v1.md | À remplir | S8ExitScreen.tsx + ConsolidationIntroScreen.tsx + MentoratProposalModal.tsx |
| brief-notifications-v1.md | À remplir | src/lib/notifications.ts + futur scheduling layer |
| brief-pilier-s2-alimentation-v1.md | À remplir | data/s2-evaluation.ts + s2-program.ts |
| brief-pilier-s3-mindset-v1.md | À remplir | data/s3-* |
| brief-pilier-s4-condition-physique-v1.md | À remplir | data/s4-* |
| brief-pilier-s5-repos-regeneration-v1.md | À remplir | data/s5-* |
| brief-pilier-s6-passion-v1.md | À remplir | data/s6-* |
| brief-pilier-s7-connexion-vivant-v1.md | À remplir | data/s7-* |
| brief-pilier-s8-elimination-detox-v1.md | À remplir | data/s8-* |
| feature-spec-abonnement-v1.md | À remplir | refonte IA-30 ConversionScreen |
| feature-spec-mentorat-v1.md | À remplir | IA-61 nouvel onglet + remplace alert placeholder |
| decisions-resolues-v1.md | À remplir | actes D12-D16 pour CLAUDE.md mise à jour |

## Conventions

- **Statut** en haut de chaque brief : `À remplir` / `En cours` / `Validé YYYY-MM-DD`
- **Markers `[à compléter]`** partout où il manque encore du contenu — facilite les diff
- **Pas d'emojis** dans le copy (Brand Core règle stricte CLAUDE.md §4)
- **Pas de jargon coach Insta** (vocabulaire à éviter listé Brand Core)
- **Tutoiement** systématique
- **Voix Mimi & Jacky** : dense, direct, crédible, structuré
- Cf. `docs/cadrage/brand-core.md` + `CLAUDE.md` §4 pour règles voix

## Production audio/vidéo

Pour chaque vidéo référencée dans un brief :
- Format **9:16 vertical (1080x1920)** — natif mobile fullscreen
- Durées indiquées par brief (15-30s IA-12, 30s paliers, 60-90s autres)
- Asset stable nommé (ex: `media.IA-20.video-celebration-14j`) pour i18n future (D23)
- Stockage à arbitrer (CDN Expo, Supabase Storage, etc.) — pas couvert ici
