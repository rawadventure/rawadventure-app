# Brief testeurs — messages prêts à envoyer

*Rédigé le 5 septembre 2026 (K5 de la salve pré-ouverture), révisé le 28 septembre (ouverture chaleureuse + demande de retours élargie au contenu, décision Stéphane). K1 et K2 sont faits : les messages sont envoyables. Reste à trancher avant envoi : quoi dire sur la page de paiement en mode test (voir note en fin de document).*

---

## Variante WhatsApp (courte)

> Salut ! On prépare quelque chose dont on est vraiment fiers : l'app Raw Adventure. Et on a la joie de te la confier en avant-première.
>
> Pour l'installer : ouvre https://app.rawadventure.world — sur iPhone dans Safari : bouton Partager → « Sur l'écran d'accueil » ; sur Android dans Chrome : menu ⋮ → « Ajouter à l'écran d'accueil ». Ouvre ensuite l'app depuis la nouvelle icône, crée ton compte (un code de confirmation arrive par email) et laisse-toi guider.
>
> Trois choses à savoir. Les 14 premiers jours sont gratuits ; après, l'app te propose un abonnement — et on aimerait que tu ailles au bout du paiement, sans rien payer : utilise la carte de test 4242 4242 4242 4242, n'importe quelle date d'expiration future et n'importe quel code à 3 chiffres. C'est une carte fictive prévue pour ça — aucun débit, nulle part. Certains textes portent la mention [copy à valider] : pas finaux, c'est normal. Et les notifications ne fonctionnent pas encore dans cette version.
>
> Ce qu'on attend de toi, c'est ton regard — sur tout : les bugs et les points de friction, mais aussi le contenu (les textes, les actions, le ton) — ce que tu aimes, ce qui te parle moins, ce que tu verrais différent. Pour un bug : capture + l'heure + ce que tu faisais. Pour le reste : tes mots, même en vrac. Chaque retour compte. Merci !

---

## Variante Telegram

> Salut ! On prépare quelque chose dont on est vraiment fiers : l'app Raw Adventure. Et on a la joie de te la confier en avant-première.
>
> **Installation** (2 minutes) :
> 1. Ouvre https://app.rawadventure.world — sur iPhone : dans Safari ; sur Android : dans Chrome.
> 2. iPhone : bouton Partager → « Sur l'écran d'accueil » → Ajouter. Android : menu ⋮ → « Ajouter à l'écran d'accueil ».
> 3. Ouvre l'app depuis la nouvelle icône Raw Adventure.
> 4. Crée ton compte — un code de confirmation arrive par email (regarde les spams la première fois).
>
> Ensuite, laisse-toi guider : le parcours commence par quelques questions, puis 14 jours d'actions quotidiennes. Utilise l'app comme si c'était la vraie — c'est exactement ça qu'on teste.
>
> **À savoir** :
> — Les 14 premiers jours sont gratuits. Au-delà, l'app propose un abonnement — et on aimerait que tu ailles au bout du paiement, sans rien payer : utilise la carte de test 4242 4242 4242 4242, n'importe quelle date d'expiration future et n'importe quel code à 3 chiffres. C'est une carte fictive prévue pour ça — aucun débit, nulle part.
> — Certains textes portent la mention [copy à valider] : versions provisoires, c'est normal.
> — Les notifications ne fonctionnent pas encore dans cette version — inutile de les chercher.
>
> **Ce qu'on attend de toi : ton regard, sur tout.**
> — Les bugs et les points de friction (un truc qui bloque, qui rame, qui t'oblige à réfléchir).
> — Le contenu : les textes, les actions proposées, le ton — dis-nous ce que tu aimes, ce qui te parle moins, ce que tu verrais différent ou en plus.
> Pour un bug : capture d'écran + l'heure + ce que tu faisais → ici. Pour le reste : tes mots, même en vrac. Un truc qui t'a juste semblé bizarre, ça nous intéresse autant.
>
> Merci — tes retours façonnent directement la V1.

---

## Variante email

**Objet : Raw Adventure — accès testeur en avant-première**

> Bonjour,
>
> On prépare quelque chose dont on est vraiment fiers : l'app Raw Adventure. Et on a la joie de te la confier en avant-première — merci de faire partie des tout premiers regards.
>
> **Installer l'app (2 minutes)**
> 1. Ouvre ce lien : https://app.rawadventure.world — sur iPhone dans Safari, sur Android dans Chrome.
> 2. iPhone : bouton Partager (carré avec flèche vers le haut) → « Sur l'écran d'accueil » → Ajouter. Android : menu ⋮ → « Ajouter à l'écran d'accueil » (ou « Installer l'application »).
> 3. Ouvre l'app depuis la nouvelle icône Raw Adventure sur ton écran d'accueil.
> 4. Crée ton compte : un code de confirmation à 6 chiffres arrive par email (vérifie les spams la première fois).
>
> Ensuite, laisse-toi guider — le parcours commence par quelques questions, puis 14 jours d'actions quotidiennes simples. Utilise l'app naturellement, comme si c'était la version finale : c'est exactement ce qu'on cherche à observer.
>
> **Trois choses à savoir**
> - Les 14 premiers jours sont gratuits. Au bout du parcours gratuit, l'app propose un abonnement — et on aimerait que tu ailles au bout du paiement, sans rien payer : utilise la carte de test 4242 4242 4242 4242, n'importe quelle date d'expiration future et n'importe quel code à 3 chiffres. C'est une carte fictive prévue pour ça — aucun débit, nulle part.
> - Certains textes portent la mention [copy à valider] : ce sont des versions provisoires, en attente de leur écriture finale. Normal.
> - Les notifications ne sont pas actives dans cette version.
>
> **Ce qu'on attend de toi : ton regard, sur tout**
> - Les bugs et les points de friction : un truc qui bloque, qui rame, qui t'oblige à réfléchir. Dans ce cas : une capture d'écran, l'heure, et ce que tu étais en train de faire, en réponse à cet email.
> - Le contenu : les textes, les actions proposées, le ton. Dis-nous ce que tu aimes, ce qui te parle moins, ce que tu verrais différent ou en plus — avec tes mots, même en vrac.
>
> Chaque retour compte, même un détail. Merci pour ton temps et ton regard.
>
> Stéphane

---

## Note — paiement en mode test (tranché le 28 sept)

Décision Stéphane : les testeurs passent eux-mêmes la page de paiement avec la carte de test Stripe `4242 4242 4242 4242` (clés TEST conservées). Le parcours de conversion est ainsi testé de bout en bout : checkout → webhook → abonnement actif → portail « Gérer mon abonnement » (mode test). Instruction intégrée aux trois variantes ci-dessus. À la bascule en clés live, ces abonnements de test disparaîtront côté Stripe — re-débloquer les comptes testeurs à ce moment-là.
