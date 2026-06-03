# Raw Adventure — Site légal

Site statique Jekyll déployé sur GitHub Pages à l'adresse **https://rawadventure.world**.

Contient les 3 documents légaux :
- `/cgu/` — Conditions Générales d'Utilisation et de Vente
- `/politique-confidentialite/` — Politique de confidentialité RGPD
- `/mentions-legales/` — Mentions légales (LCEN)

## Structure

```
legal-site/
├── _config.yml              # Config Jekyll (titre, URL, permalinks)
├── _layouts/
│   └── default.html         # Layout commun (header, footer, nav)
├── assets/
│   └── style.css            # Styles sobres brand-aligned
├── CNAME                    # Custom domain GitHub Pages
├── index.md                 # Page d'accueil (3 cards)
├── cgu.md
├── politique-confidentialite.md
├── mentions-legales.md
└── README.md                # Ce fichier
```

## Déploiement (instructions)

### Étape 1 — Crée un nouveau repo GitHub public

1. Connecte-toi sur https://github.com (crée un compte si besoin)
2. Bouton "New repository"
3. Repo name : `rawadventure-legal` (ou `raw-adventure-legal`)
4. Description : "Site légal Raw Adventure — CGU, Politique de confidentialité, Mentions légales"
5. Visibilité : **Public** (obligatoire pour GitHub Pages gratuit)
6. Initialise sans README (on a déjà tout)
7. Clic "Create repository"

### Étape 2 — Pousse le contenu

```bash
cd /Users/ASUS/RawAdventureRN/legal-site
git init
git add .
git commit -m "Initial commit — site légal Raw Adventure"
git branch -M main
git remote add origin https://github.com/<TON_USERNAME>/rawadventure-legal.git
git push -u origin main
```

### Étape 3 — Active GitHub Pages

1. Sur le repo GitHub → onglet "Settings"
2. Menu gauche → "Pages"
3. Section "Build and deployment" :
   - Source : **Deploy from a branch**
   - Branch : **main** + dossier `/ (root)`
   - Save
4. GitHub commence le build (~1 min). Une URL temporaire `https://<username>.github.io/rawadventure-legal/` apparaît.

### Étape 4 — Config DNS OVH

1. Login OVH → https://www.ovh.com/manager/
2. Web Cloud → Domaines → `rawadventure.world`
3. Onglet "Zone DNS"
4. **Supprime** les anciens records A ou CNAME conflictuels sur `@` et `www`
5. **Ajoute 4 records A** pour le root `@` :

   | Type | Sous-domaine | Cible | TTL |
   |---|---|---|---|
   | A | (vide) | `185.199.108.153` | défaut |
   | A | (vide) | `185.199.109.153` | défaut |
   | A | (vide) | `185.199.110.153` | défaut |
   | A | (vide) | `185.199.111.153` | défaut |

6. **Ajoute 1 record CNAME** pour `www` :

   | Type | Sous-domaine | Cible | TTL |
   |---|---|---|---|
   | CNAME | `www` | `<TON_USERNAME>.github.io.` (avec point final) | défaut |

7. Valide. Propagation DNS : 1-24h.

### Étape 5 — Vérifie custom domain côté GitHub

1. Settings → Pages → "Custom domain"
2. Saisis `rawadventure.world` → Save
3. GitHub vérifie DNS automatiquement (peut prendre quelques heures)
4. Une fois OK, **coche "Enforce HTTPS"** (Let's Encrypt cert auto)
5. Attends propagation HTTPS (~1h)

### Étape 6 — Test final

Ouvre dans navigateur (en navigation privée pour éviter cache) :
- `https://rawadventure.world/` → landing 3 cards
- `https://rawadventure.world/cgu/`
- `https://rawadventure.world/politique-confidentialite/`
- `https://rawadventure.world/mentions-legales/`

Vérifie HTTPS actif (cadenas vert), pas d'avertissement.

## Mise à jour future

Éditer les fichiers `.md` localement, puis :
```bash
git add .
git commit -m "Update CGU article X"
git push
```
GitHub Pages rebuild auto en 1-2 min.

## Notes

- **Préviser autres records DNS OVH** : si tu ajoutes plus tard MX records Proton pour `support@rawadventure.world`, ils coexistent sans interférer avec A + CNAME GitHub.
- **HTTPS** : Let's Encrypt cert auto-renouvelé par GitHub.
- **Pas de tracking, pas d'analytics** : volontaire pour conformité RGPD/cookies stricts.
