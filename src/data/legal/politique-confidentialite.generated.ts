/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Source : https://rawadventure.world/politique-confidentialite/
 * Régénérer après toute modification du site : node scripts/sync-legal.js
 */

import type { LegalDoc } from './types';

export const politiqueConfidentialite: LegalDoc = {
  "id": "politique-confidentialite",
  "sourceUrl": "https://rawadventure.world/politique-confidentialite/",
  "title": "Politique de confidentialité",
  "subtitle": "Version V1.0 — En vigueur au 3 juin 2026",
  "blocks": [
    {
      "type": "h2",
      "text": "1. Qui sommes-nous ?"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "L’Application "
        },
        {
          "text": "Raw Adventure",
          "bold": true
        },
        {
          "text": " est éditée par "
        },
        {
          "text": "Raw Adventure Limited",
          "bold": true
        },
        {
          "text": ", Private Company Limited by Shares (Hong Kong, Companies Ordinance Cap. 622) enregistrée sous le numéro "
        },
        {
          "text": "80310100",
          "bold": true
        },
        {
          "text": " (Business Registration Number 80310100-000-04-26-4), incorporée le 30 avril 2026, capital social 100 HKD, dont le siège social est "
        },
        {
          "text": "Unit 1603, 16/F The L. Plaza, 367-375 Queen’s Road Central, Sheung Wan, Hong Kong",
          "bold": true
        },
        {
          "text": " (« l’Éditeur », « nous »)."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Directeur de la publication",
          "bold": true
        },
        {
          "text": " : Stéphane Tossens — "
        },
        {
          "text": "stephane@rawadventure.world",
          "link": {
            "kind": "mailto",
            "href": "mailto:stephane@rawadventure.world"
          }
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "L’Éditeur est responsable de traitement au sens du Règlement (UE) 2016/679 du 27 avril 2016 (« RGPD »)."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Contact pour toute question relative à tes données",
          "bold": true
        },
        {
          "text": " :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Email : "
          },
          {
            "text": "support@rawadventure.world",
            "link": {
              "kind": "mailto",
              "href": "mailto:support@rawadventure.world"
            }
          }
        ],
        [
          {
            "text": "Délégué à la protection des données (DPO) : non désigné — les demandes relatives aux données passent par l’adresse support ci-dessus."
          }
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "2. Quelles données collectons-nous ?"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous collectons strictement les données nécessaires au fonctionnement de l’Application."
        }
      ]
    },
    {
      "type": "h3",
      "text": "2.1 Données d’inscription"
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Email",
            "bold": true
          },
          {
            "text": " (obligatoire) — identifie le compte, sert aux communications transactionnelles"
          }
        ],
        [
          {
            "text": "Mot de passe",
            "bold": true
          },
          {
            "text": " — chiffré (hash bcrypt) par notre prestataire Supabase, nous n’y avons pas accès en clair"
          }
        ]
      ]
    },
    {
      "type": "h3",
      "text": "2.2 Données d’onboarding"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Réponses aux questionnaires d’évaluation initiale, notamment :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Estimation de ton niveau d’énergie"
          }
        ],
        [
          {
            "text": "Estimation de ton ressenti corporel"
          }
        ],
        [
          {
            "text": "Estimation de ton ressenti mental"
          }
        ],
        [
          {
            "text": "Niveau de motivation"
          }
        ],
        [
          {
            "text": "Réponses qualitatives sur ton terrain"
          }
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Ces données déterminent ton "
        },
        {
          "text": "profil dynamique",
          "bold": true
        },
        {
          "text": " (P0 à P8) et calibrent ton parcours."
        }
      ]
    },
    {
      "type": "h3",
      "text": "2.3 Données de progression"
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Date de création du compte"
          }
        ],
        [
          {
            "text": "Jours validés (check quotidien Phase 0)"
          }
        ],
        [
          {
            "text": "Streak (jours consécutifs)"
          }
        ],
        [
          {
            "text": "Jokers consommés (1 par semaine calendaire)"
          }
        ],
        [
          {
            "text": "Paliers atteints"
          }
        ],
        [
          {
            "text": "Sessions de pratique réalisées (Phase 1)"
          }
        ],
        [
          {
            "text": "Scores des évaluations initiale et finale de chaque pilier (12 questions × 5 niveaux)"
          }
        ],
        [
          {
            "text": "Choix de niveau adaptatif (« moins / pareil / plus »)"
          }
        ]
      ]
    },
    {
      "type": "h3",
      "text": "2.4 Données techniques"
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Identifiant unique de l’appareil (pour notifications push)"
          }
        ],
        [
          {
            "text": "Système d’exploitation et version"
          }
        ],
        [
          {
            "text": "Version de l’Application"
          }
        ],
        [
          {
            "text": "Adresse IP (lors des appels API Supabase) — utilisée uniquement pour la sécurité, non stockée à des fins analytiques"
          }
        ]
      ]
    },
    {
      "type": "h3",
      "text": "2.5 Données de paiement"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous ne stockons aucune donnée bancaire.",
          "bold": true
        },
        {
          "text": " Le paiement est traité par notre prestataire Stripe Inc. Voir leur politique : "
        },
        {
          "text": "stripe.com/privacy",
          "link": {
            "kind": "external",
            "href": "https://stripe.com/privacy"
          }
        },
        {
          "text": "."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous conservons uniquement :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Identifiant Stripe Customer"
          }
        ],
        [
          {
            "text": "Identifiant de l’abonnement"
          }
        ],
        [
          {
            "text": "Statut d’abonnement (actif, annulé, expiré, etc.)"
          }
        ],
        [
          {
            "text": "Plan choisi (mensuel / 6 mois / 12 mois)"
          }
        ],
        [
          {
            "text": "Dates de début et renouvellement"
          }
        ]
      ]
    },
    {
      "type": "h3",
      "text": "2.6 Données de communication"
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Préférences de notifications (activées/désactivées, plage de silence)"
          }
        ],
        [
          {
            "text": "Historique des emails transactionnels envoyés (confirmation, reset password)"
          }
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "3. Pourquoi collectons-nous ces données ?"
    },
    {
      "type": "table",
      "headers": [
        "Finalité",
        "Données concernées",
        "Base légale"
      ],
      "rows": [
        [
          [
            {
              "text": "Création et gestion du compte"
            }
          ],
          [
            {
              "text": "Email, mot de passe"
            }
          ],
          [
            {
              "text": "Exécution du contrat"
            }
          ]
        ],
        [
          [
            {
              "text": "Personnalisation du parcours"
            }
          ],
          [
            {
              "text": "Onboarding, profil dynamique"
            }
          ],
          [
            {
              "text": "Exécution du contrat"
            }
          ]
        ],
        [
          [
            {
              "text": "Suivi de la progression"
            }
          ],
          [
            {
              "text": "Streak, paliers, sessions"
            }
          ],
          [
            {
              "text": "Exécution du contrat"
            }
          ]
        ],
        [
          [
            {
              "text": "Calcul du score de vitalité (toile d’araignée)"
            }
          ],
          [
            {
              "text": "Scores des évaluations"
            }
          ],
          [
            {
              "text": "Exécution du contrat"
            }
          ]
        ],
        [
          [
            {
              "text": "Facturation et gestion abonnement"
            }
          ],
          [
            {
              "text": "Identifiants Stripe, statut"
            }
          ],
          [
            {
              "text": "Exécution du contrat + obligation légale comptable"
            }
          ]
        ],
        [
          [
            {
              "text": "Envoi de notifications transactionnelles"
            }
          ],
          [
            {
              "text": "Email"
            }
          ],
          [
            {
              "text": "Exécution du contrat"
            }
          ]
        ],
        [
          [
            {
              "text": "Envoi de notifications push pédagogiques"
            }
          ],
          [
            {
              "text": "Identifiant appareil, préférences"
            }
          ],
          [
            {
              "text": "Consentement"
            }
          ]
        ],
        [
          [
            {
              "text": "Sécurité (anti-fraude, anti-abus)"
            }
          ],
          [
            {
              "text": "IP, identifiants techniques"
            }
          ],
          [
            {
              "text": "Intérêt légitime"
            }
          ]
        ],
        [
          [
            {
              "text": "Amélioration de l’Application (statistiques anonymisées)"
            }
          ],
          [
            {
              "text": "Données techniques agrégées"
            }
          ],
          [
            {
              "text": "Intérêt légitime"
            }
          ]
        ],
        [
          [
            {
              "text": "Obligations légales et comptables"
            }
          ],
          [
            {
              "text": "Historique factures, abonnements"
            }
          ],
          [
            {
              "text": "Obligation légale"
            }
          ]
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous ne vendons pas tes données.",
          "bold": true
        },
        {
          "text": " Nous ne les utilisons pas à des fins publicitaires."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "4. Qui a accès à tes données ?"
    },
    {
      "type": "h3",
      "text": "4.1 Personnel interne"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Seules les personnes autorisées au sein de l’Éditeur (équipe technique, support client) accèdent à tes données, dans la limite du strict nécessaire."
        }
      ]
    },
    {
      "type": "h3",
      "text": "4.2 Sous-traitants"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous faisons appel à des sous-traitants pour assurer le fonctionnement de l’Application :"
        }
      ]
    },
    {
      "type": "table",
      "headers": [
        "Sous-traitant",
        "Service",
        "Localisation des données",
        "Garanties"
      ],
      "rows": [
        [
          [
            {
              "text": "Supabase Inc.",
              "bold": true
            }
          ],
          [
            {
              "text": "Base de données + Auth"
            }
          ],
          [
            {
              "text": "Singapour, US, UE (selon région choisie)"
            }
          ],
          [
            {
              "text": "DPA signé, clauses contractuelles types UE"
            }
          ]
        ],
        [
          [
            {
              "text": "Stripe Inc.",
              "bold": true
            }
          ],
          [
            {
              "text": "Paiement"
            }
          ],
          [
            {
              "text": "UE et US"
            }
          ],
          [
            {
              "text": "DPA, certifié PCI-DSS Level 1"
            }
          ]
        ],
        [
          [
            {
              "text": "Apple Inc.",
              "bold": true
            }
          ],
          [
            {
              "text": "Distribution App Store, notifications APNs"
            }
          ],
          [
            {
              "text": "US"
            }
          ],
          [
            {
              "text": "DPA via accord développeur"
            }
          ]
        ],
        [
          [
            {
              "text": "Google LLC",
              "bold": true
            }
          ],
          [
            {
              "text": "Distribution Play Store, notifications FCM"
            }
          ],
          [
            {
              "text": "US"
            }
          ],
          [
            {
              "text": "DPA via accord développeur"
            }
          ]
        ],
        [
          [
            {
              "text": "Proton Mail AG",
              "bold": true
            }
          ],
          [
            {
              "text": "Emails support"
            }
          ],
          [
            {
              "text": "Suisse"
            }
          ],
          [
            {
              "text": "Conforme RGPD, chiffrement bout-en-bout"
            }
          ]
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tous nos sous-traitants présentent un niveau de protection adéquat. Les transferts hors UE sont encadrés par les clauses contractuelles types adoptées par la Commission européenne."
        }
      ]
    },
    {
      "type": "h3",
      "text": "4.3 Autorités"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tes données peuvent être communiquées aux autorités compétentes en cas d’obligation légale (réquisition judiciaire)."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "5. Combien de temps conservons-nous tes données ?"
    },
    {
      "type": "table",
      "headers": [
        "Type de donnée",
        "Durée de conservation"
      ],
      "rows": [
        [
          [
            {
              "text": "Compte actif"
            }
          ],
          [
            {
              "text": "Pendant toute la durée de la relation contractuelle"
            }
          ]
        ],
        [
          [
            {
              "text": "Compte inactif"
            }
          ],
          [
            {
              "text": "24 mois après dernière connexion, puis suppression après notification"
            }
          ]
        ],
        [
          [
            {
              "text": "Historique de progression (Phase 0 + Phase 1)"
            }
          ],
          [
            {
              "text": "Tant que le compte existe"
            }
          ]
        ],
        [
          [
            {
              "text": "Données de facturation"
            }
          ],
          [
            {
              "text": "10 ans (obligation comptable et fiscale)"
            }
          ]
        ],
        [
          [
            {
              "text": "Logs techniques de sécurité"
            }
          ],
          [
            {
              "text": "12 mois maximum"
            }
          ]
        ],
        [
          [
            {
              "text": "Emails transactionnels"
            }
          ],
          [
            {
              "text": "12 mois"
            }
          ]
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Après suppression de ton compte, les données identifiantes sont effacées dans un délai de 30 jours, à l’exception des données soumises à obligation légale de conservation (factures notamment)."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "6. Tes droits"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Conformément au RGPD, tu disposes des droits suivants :"
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.1 Droit d’accès (article 15 RGPD)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux demander une copie de toutes les données te concernant."
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.2 Droit de rectification (article 16)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux corriger toute donnée inexacte ou incomplète directement depuis ton Profil dans l’Application, ou en nous écrivant."
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.3 Droit à l’effacement / « droit à l’oubli » (article 17)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux demander la suppression de ton compte et de tes données. La suppression est définitive et irréversible."
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.4 Droit à la limitation (article 18)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux demander que le traitement de certaines données soit temporairement suspendu."
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.5 Droit à la portabilité (article 20)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux récupérer tes données dans un format structuré, couramment utilisé et lisible par machine (JSON)."
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.6 Droit d’opposition (article 21)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux t’opposer au traitement de tes données pour des motifs tenant à ta situation particulière (sauf intérêt légitime impérieux)."
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.7 Droit de retirer ton consentement"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Pour les traitements fondés sur le consentement (notifications push pédagogiques), tu peux le retirer à tout moment dans les paramètres de l’Application, sans affecter la licéité des traitements antérieurs."
        }
      ]
    },
    {
      "type": "h3",
      "text": "6.8 Droit de définir des directives post-mortem"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux définir des directives sur le sort de tes données après ton décès (loi française Informatique et Libertés)."
        }
      ]
    },
    {
      "type": "h3",
      "text": "Comment exercer tes droits ?"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Adresse ta demande à : "
        },
        {
          "text": "support@rawadventure.world",
          "link": {
            "kind": "mailto",
            "href": "mailto:support@rawadventure.world"
          }
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Précise dans ta demande :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Le droit que tu souhaites exercer"
          }
        ],
        [
          {
            "text": "L’email associé à ton compte"
          }
        ],
        [
          {
            "text": "Une pièce justifiant ton identité si nécessaire"
          }
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous te répondons dans un délai d’un mois maximum (prolongeable à 2 mois pour les demandes complexes, sur notification motivée)."
        }
      ]
    },
    {
      "type": "h3",
      "text": "Recours auprès d’une autorité de contrôle"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Si tu estimes que tes droits ne sont pas respectés, tu peux introduire une réclamation auprès de l’autorité de contrôle compétente :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "France",
            "bold": true
          },
          {
            "text": " : Commission Nationale Informatique et Libertés (CNIL) — "
          },
          {
            "text": "www.cnil.fr",
            "link": {
              "kind": "external",
              "href": "https://www.cnil.fr"
            }
          }
        ],
        [
          {
            "text": "Autres pays UE",
            "bold": true
          },
          {
            "text": " : autorité de contrôle nationale"
          }
        ]
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "7. Sécurité des données"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger tes données :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Chiffrement des connexions (HTTPS/TLS 1.3 sur toutes les communications)"
          }
        ],
        [
          {
            "text": "Chiffrement des mots de passe (hash bcrypt par Supabase)"
          }
        ],
        [
          {
            "text": "Chiffrement des données sensibles au repos (chiffrement Supabase au niveau infrastructure)"
          }
        ],
        [
          {
            "text": "Accès restreint au personnel autorisé"
          }
        ],
        [
          {
            "text": "Authentification deux facteurs sur les comptes administrateurs internes"
          }
        ],
        [
          {
            "text": "Sauvegarde régulière des bases de données"
          }
        ],
        [
          {
            "text": "Tests réguliers de sécurité"
          }
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Aucune méthode n’est totalement infaillible. En cas de violation de données susceptible d’engendrer un risque pour tes droits et libertés, nous t’informerons dans les 72 heures conformément à l’article 33 RGPD."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "8. Notifications push et cookies"
    },
    {
      "type": "h3",
      "text": "8.1 Notifications push (mobile)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "L’Application peut t’envoyer des notifications push pédagogiques (rappels, encouragements, observations). Ces notifications nécessitent ton "
        },
        {
          "text": "consentement explicite",
          "bold": true
        },
        {
          "text": " lors de la première utilisation."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux retirer ce consentement à tout moment dans les paramètres système de ton appareil ou dans les préférences in-app."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Plage de silence",
          "bold": true
        },
        {
          "text": " : aucune notification n’est envoyée entre 22h et 7h heure locale, quel que soit ton paramètre."
        }
      ]
    },
    {
      "type": "h3",
      "text": "8.2 Cookies (site web rawadventure.world)"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Le site web utilise uniquement des cookies strictement nécessaires au fonctionnement (authentification, session, sécurité). Aucun cookie publicitaire, aucun cookie tiers de tracking."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "L’Application mobile n’utilise pas de cookies au sens technique. Elle utilise un stockage local pour mémoriser ta session et ta progression hors-ligne."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "9. Données sensibles — Précisions"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Certaines données collectées dans le cadre du parcours (ressenti corporel, énergie, sommeil, alimentation, etc.) peuvent être considérées comme des "
        },
        {
          "text": "données de santé",
          "bold": true
        },
        {
          "text": " au sens de l’article 9 RGPD."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous traitons ces données sur la base de "
        },
        {
          "text": "ton consentement explicite",
          "bold": true
        },
        {
          "text": " donné lors de l’inscription et confirmé à chaque évaluation initiale."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nous t’informons que :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Ces données ne sont "
          },
          {
            "text": "jamais transmises à des tiers à des fins commerciales",
            "bold": true
          }
        ],
        [
          {
            "text": "Ces données ne sont "
          },
          {
            "text": "jamais utilisées pour profilage marketing ou publicitaire",
            "bold": true
          }
        ],
        [
          {
            "text": "Ces données sont conservées uniquement pour personnaliser ton parcours et calculer ta progression"
          }
        ],
        [
          {
            "text": "Tu peux retirer ton consentement à tout moment en supprimant ton compte"
          }
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "L’Application ne pose pas de diagnostic médical et ne fournit aucun avis médical.",
          "bold": true
        },
        {
          "text": " Voir "
        },
        {
          "text": "CGU Article 6.2",
          "link": {
            "kind": "doc",
            "doc": "cgu"
          }
        },
        {
          "text": "."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "10. Transferts internationaux de données"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Nos sous-traitants Supabase, Stripe, Apple, Google opèrent des serveurs en dehors de l’Union européenne (notamment aux États-Unis et à Singapour)."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Ces transferts sont encadrés par :"
        }
      ]
    },
    {
      "type": "ul",
      "items": [
        [
          {
            "text": "Les "
          },
          {
            "text": "clauses contractuelles types",
            "bold": true
          },
          {
            "text": " adoptées par la Commission européenne (article 46 RGPD)"
          }
        ],
        [
          {
            "text": "Les certifications de conformité de nos sous-traitants (SOC 2, ISO 27001, PCI-DSS selon le cas)"
          }
        ],
        [
          {
            "text": "Des Data Processing Agreements signés avec chaque sous-traitant"
          }
        ]
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Tu peux nous demander une copie de ces garanties à "
        },
        {
          "text": "support@rawadventure.world",
          "link": {
            "kind": "mailto",
            "href": "mailto:support@rawadventure.world"
          }
        },
        {
          "text": "."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "11. Mineurs"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "L’Application est strictement réservée aux personnes de "
        },
        {
          "text": "18 ans révolus",
          "bold": true
        },
        {
          "text": ". Nous ne collectons pas sciemment de données concernant des mineurs."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Si tu es parent et constates qu’un mineur a créé un compte sans ton autorisation, contacte-nous immédiatement à "
        },
        {
          "text": "support@rawadventure.world",
          "link": {
            "kind": "mailto",
            "href": "mailto:support@rawadventure.world"
          }
        },
        {
          "text": " pour suppression."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "12. Modification de la présente Politique"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "L’Éditeur peut modifier la présente Politique de confidentialité pour refléter des évolutions légales, techniques ou de l’Application."
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Toute modification substantielle est notifiée par email et/ou notification in-app au moins 30 jours avant son entrée en vigueur. La version applicable est celle en vigueur à la date à laquelle tu utilises l’Application."
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "h2",
      "text": "13. Contact"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Pour toute question, demande d’exercice de droits, ou réclamation relative à tes données personnelles :"
        }
      ]
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "support@rawadventure.world",
          "link": {
            "kind": "mailto",
            "href": "mailto:support@rawadventure.world"
          }
        }
      ]
    },
    {
      "type": "hr"
    },
    {
      "type": "p",
      "spans": [
        {
          "text": "Dernière mise à jour : 3 juin 2026. Version : V1.0.",
          "italic": true
        }
      ]
    }
  ]
};
