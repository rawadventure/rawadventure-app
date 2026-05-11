// ─── Types ────────────────────────────────────────────────────────────────────

export interface DailyActivity {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  why: string;
  how: string[];
  tip?: string;
}

export interface ChecklistDay {
  type: 'checklist';
  id: number;
  welcomeTitle: string;
  welcomeSubtitle: string;
  activities: DailyActivity[];
}

export interface ProtocolDay {
  type: 'protocol';
  id: number;
  emoji: string;
  shortTitle: string;
  pillarTheme: string;
  videoTitle: string;
  intention: string;
  protocolDescription: string;
  protocolSteps: string[];
  minimumMode: string;
  videoFilename: string;
}

export type DayContent = ChecklistDay | ProtocolDay;

// ─── Activités partagées (Jours 1 & 2) ───────────────────────────────────────

const ACTIVATION: DailyActivity = {
  id: 'activation',
  emoji: '🫁',
  title: 'Activation matinale',
  subtitle: '5 min de respiration nasale',
  why: 'La respiration nasale active ton système nerveux parasympathique. En 5 minutes, tu réduis le cortisol du réveil et tu prépares ton corps à la journée.',
  how: [
    'Assieds-toi ou allonge-toi confortablement',
    'Ferme la bouche — respire uniquement par le nez',
    'Inspire lentement 4 secondes, expire lentement 4 secondes',
    'Continue pendant 5 minutes',
    'Pas besoin de minuteur strict — ressens le calme s\'installer',
  ],
  tip: 'Fais-le avant de regarder ton téléphone. Ce sont les 5 minutes les plus impactantes de ta journée.',
};

const MINERALIZATION: DailyActivity = {
  id: 'mineralization',
  emoji: '🌊',
  title: 'Minéralisation',
  subtitle: '250ml eau de mer OU 500ml jus de légumes',
  why: 'La plupart des gens sont carencés en minéraux. Ton corps en a besoin pour produire de l\'énergie, réguler le système nerveux et récupérer.',
  how: [
    'Option A : 250ml d\'eau de mer (Quinton, Biopaïa ou similaire)',
    'Option B : 500ml de jus de légumes frais (céleri, concombre, épinards...)',
    'À prendre le matin, avant ou pendant ton premier repas',
    'Commence par l\'Option B si l\'eau de mer te semble étrange',
  ],
  tip: 'L\'eau de mer Quinton se trouve en pharmacie ou en magasin bio.',
};

const DIGESTIVE_WINDOW: DailyActivity = {
  id: 'digestive_window',
  emoji: '🕙',
  title: 'Fenêtre digestive',
  subtitle: 'Ne pas manger avant 10h30–11h',
  why: 'Laisser ton système digestif au repos le matin permet à ton corps de finir son nettoyage nocturne. Résultat : plus d\'énergie, meilleure digestion, meilleure composition corporelle.',
  how: [
    'Ne mange rien solide avant 10h30–11h',
    'Tu peux boire de l\'eau, des tisanes ou du café sans sucre',
    'Si la faim est intense, attends encore 15–20 min — elle passe',
    'Le corps s\'adapte rapidement, généralement en 3–5 jours',
  ],
  tip: 'La faim du matin est souvent une habitude, pas un besoin réel.',
};

const FIRST_MEAL: DailyActivity = {
  id: 'first_meal',
  emoji: '🍓',
  title: 'Premier repas',
  subtitle: 'Fruits uniquement jusqu\'à satiété',
  why: 'Les fruits sont digérés en 20–30 min, apportent des sucres naturels, des fibres et des antioxydants sans surcharger la digestion. C\'est le repas idéal pour ouvrir ta journée alimentaire.',
  how: [
    'Mange uniquement des fruits pour ce premier repas',
    'Tous les fruits sont autorisés — choisis ce que tu aimes',
    'Mange jusqu\'à vraie satiété, sans te restreindre',
    'Ne mélange pas avec d\'autres aliments (pas de yaourt, pas de céréales)',
    'Attends au moins 30 min avant de manger autre chose',
  ],
  tip: 'Bananes, dattes, mangues — les fruits sucrés rassasient mieux.',
};

const EVENING: DailyActivity = {
  id: 'evening',
  emoji: '📵',
  title: 'Soirée sans écrans',
  subtitle: 'Dîner léger + pas d\'écrans 1h avant de dormir',
  why: 'La lumière bleue des écrans bloque la mélatonine et retarde l\'endormissement. Un dîner léger évite que ton corps dépense son énergie à digérer pendant la nuit.',
  how: [
    'Dîne au moins 2–3h avant de te coucher',
    'Repas léger et facile à digérer (légumes, soupe, poisson...)',
    'Éteins téléphone, ordi, TV 1h avant de dormir',
    'Remplace par : lecture, écriture, musique, discussion, puzzle',
  ],
  tip: 'Mode avion sur le téléphone = moins de tentation.',
};

// ─── Jour 1 ───────────────────────────────────────────────────────────────────

const DAY1: ChecklistDay = {
  type: 'checklist',
  id: 1,
  welcomeTitle: 'Jour 1 — Mise en route',
  welcomeSubtitle: 'Bienvenue. Aujourd\'hui tu découvres le protocole. Pas de perfection — juste commencer.',
  activities: [
    ACTIVATION,
    {
      id: 'cold',
      emoji: '🥶',
      title: 'Défi froid',
      subtitle: '2 secondes d\'eau froide × 3 à 5 fois',
      why: 'Le choc thermique libère de la noradrénaline — un neurotransmetteur qui booste l\'énergie, la concentration et la bonne humeur. 2 secondes suffisent pour activer le mécanisme.',
      how: [
        'Termine ta douche normale normalement',
        'Passe l\'eau en froid',
        'Reste 2 secondes sous l\'eau froide',
        'Coupe l\'eau ou repasse au chaud',
        'Répète 3 à 5 fois',
      ],
      tip: 'La peur du froid disparaît après le 2ème cycle. C\'est neurologique, pas physique.',
    },
    {
      id: 'movement',
      emoji: '🏃',
      title: 'Mouvement',
      subtitle: '20 à 30 min d\'activité physique',
      why: 'Le mouvement quotidien régule le cortisol, améliore l\'humeur via les endorphines et booste l\'énergie sur toute la journée. L\'intensité n\'est pas le facteur clé — la régularité l\'est.',
      how: [
        'Choisis une activité que tu aimes ou que tu peux faire facilement',
        'Marche rapide, course, vélo, natation, musculation — tout compte',
        'Durée : 20 à 30 minutes minimum',
        'L\'intensité n\'est pas importante aujourd\'hui — l\'important c\'est de bouger',
      ],
      tip: 'Une marche de 25 min dehors est parfaite pour commencer.',
    },
    MINERALIZATION,
    DIGESTIVE_WINDOW,
    FIRST_MEAL,
    EVENING,
  ],
};

// ─── Jour 2 ───────────────────────────────────────────────────────────────────

const DAY2: ChecklistDay = {
  type: 'checklist',
  id: 2,
  welcomeTitle: 'Jour 2 — Tu continues',
  welcomeSubtitle: 'La régularité compte plus que la perfection. Tu es déjà en avance sur 95% des gens.',
  activities: [
    ACTIVATION,
    {
      id: 'cold',
      emoji: '🥶',
      title: 'Défi froid',
      subtitle: '2 à 3 secondes — progresse d\'une seconde',
      why: 'Ton système nerveux s\'adapte rapidement au froid. Chaque jour de plus renforce ta tolérance au stress et ta capacité à sortir de ta zone de confort.',
      how: [
        'Même protocole qu\'hier',
        'Essaie de tenir 3 secondes au lieu de 2',
        'Répète 3 à 5 fois',
        'Si hier était difficile, reste à 2 secondes — c\'est normal',
      ],
      tip: '+1 seconde par jour, c\'est +30 secondes en un mois. La progression est réelle.',
    },
    {
      id: 'movement',
      emoji: '🧘',
      title: 'Récupération active',
      subtitle: 'Stretching, mobilité ou yoga — 20 à 30 min',
      why: 'Le corps a besoin d\'alterner entre activation et récupération. La récupération active améliore la circulation, réduit les courbatures et prépare le corps pour les jours suivants.',
      how: [
        'Pas d\'entraînement intense aujourd\'hui',
        'Choisis : stretching, yoga, mobilité articulaire',
        'Tu peux utiliser une app de yoga ou simplement t\'étirer',
        '20 à 30 minutes à ton rythme',
      ],
      tip: 'La récupération n\'est pas de la paresse — c\'est une partie du protocole.',
    },
    MINERALIZATION,
    DIGESTIVE_WINDOW,
    FIRST_MEAL,
    {
      ...EVENING,
      subtitle: 'Soirée légère — économise ton énergie',
      how: [
        'Dîner encore plus léger qu\'hier si possible',
        'Limite les interactions sociales énergivores ce soir',
        'Écrans éteints 1h avant de dormir',
        'Couche-toi 15–30 min plus tôt que d\'habitude',
      ],
      tip: 'Le sommeil est le levier numéro 1 de ta récupération. Ce soir, priorise-le.',
    },
  ],
};

// ─── Jour 3 — Phase 1 ────────────────────────────────────────────────────────

const DAY3: ChecklistDay = {
  type: 'checklist',
  id: 3,
  welcomeTitle: 'Jour 3 — Le cap critique',
  welcomeSubtitle: 'C\'est ici que la plupart des gens lâchent. Si tu passes ce cap, tout devient plus facile. Dans 4 jours, tu vas commencer à sentir une vraie différence d\'énergie.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: '5 min — tu connais déjà',
      why: 'Ton système nerveux commence à associer ce rituel à l\'état d\'éveil. Plus tu répètes, plus l\'effet s\'installe rapidement.',
      how: ['Assieds-toi ou debout dehors', '5 minutes de respiration nasale complète', 'Lumière du jour si possible', 'Pieds au sol si possible'],
      tip: 'C\'est la 3ème fois. Tu n\'as plus besoin d\'y réfléchir. Fais-le, c\'est tout.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Même protocole — reste présent',
      why: 'À chaque contact avec le froid, ton système nerveux apprend à déactiver la réponse de stress. C\'est un entraînement de la volonté autant que du corps.',
      how: ['Douche chaude', '2 à 3 secondes de froid', 'Retour chaud', 'Répéter 3 à 5 fois', 'Reste présent — ne fuis pas mentalement'],
      tip: 'Ce n\'est pas censé être facile tous les jours. C\'est justement pour ça que ça fonctionne.',
    },
    {
      id: 'movement', emoji: '🏃', title: 'Mouvement',
      subtitle: '20 à 30 min — avant de manger',
      why: 'Le mouvement avant le repas amplifie la dépense énergétique et stabilise la glycémie. Ton corps brûle différemment.',
      how: ['Choisis ton activité : marche engagée, footing, vélo, rameur…', '20 à 30 minutes', 'Tu dois respirer plus fort et te réchauffer', 'Option : 3 accélérations de 30s au milieu de ta séance'],
      tip: 'Si tu te sens lourd au départ, continue. Les 5 premières minutes mentent toujours.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: '250 ml eau de mer ou 500 ml jus de légumes',
      why: 'Tes cellules ont besoin de minéraux pour fonctionner. L\'eau de mer apporte un spectre minéral complet que ton alimentation ne couvre souvent pas.',
      how: ['Choisis ce que tu préfères aujourd\'hui', '250 ml d\'eau de mer isotonique, ou 500 ml de jus de légumes frais', 'Tu peux varier chaque jour'],
      tip: 'Le meilleur moment : dans la matinée, avant ton premier repas.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: 'Premier repas : viser 10h30–11h',
      why: 'Laisser ton corps sans digestion le matin libère de l\'énergie pour la régénération cellulaire. Tu vas sentir la différence dans ta clarté mentale.',
      how: ['Pas de nourriture avant 10h30', 'Tu peux boire de l\'eau, du thé, de l\'eau de mer', 'Observe comment tu te sens', 'Pas de grignotage'],
      tip: 'C\'est normal si ce n\'est pas confortable. Ça l\'a été pour tout le monde au début.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Jusqu\'à satiété, ce que tu aimes',
      why: 'Les fruits sont le carburant le plus digestible qui soit. Ils donnent de l\'énergie sans fatiguer ton système digestif.',
      how: ['Fruits uniquement pour ce repas', 'Jusqu\'à vraie satiété', 'Choisis ce que tu aimes vraiment', 'Un seul fruit ou plusieurs, tu décides'],
      tip: 'Pas de frustration = réussite. Le meilleur fruit est celui que tu manges avec plaisir.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '30 min avant de dormir — zéro écran',
      why: 'La lumière bleue bloque la mélatonine et retarde l\'endormissement. Même 30 minutes sans écran changent profondément la qualité du sommeil.',
      how: ['Dîner léger, 2 à 3h avant de dormir', '30 minutes avant de dormir : plus d\'écrans', 'Remplace par : lecture, musique, écriture, discussion', 'Lumière plus basse dans la pièce'],
      tip: 'C\'est là que beaucoup sabotent tout. Garde ce pilier.',
    },
  ],
};

// ─── Jour 4 — Phase 1 ────────────────────────────────────────────────────────

const DAY4: ChecklistDay = {
  type: 'checklist',
  id: 4,
  welcomeTitle: 'Jour 4 — L\'identité',
  welcomeSubtitle: 'Jour 4. Tu es en train de devenir quelqu\'un de discipliné. Pendant ces 14 jours, tu fais partie des personnes qui prennent soin de leur énergie, respectent leur corps, et passent à l\'action.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: '5 min — ton rituel s\'installe',
      why: 'Quatre jours de suite. Ce n\'est plus un effort — c\'est le début d\'une identité.',
      how: ['Même protocole qu\'hier', '5 minutes de respiration nasale complète', 'Dehors si possible', 'Pieds au sol si possible'],
      tip: 'La répétition crée le résultat. Tu n\'as plus besoin d\'y réfléchir.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Tu maîtrises déjà le protocole',
      why: 'Ton corps s\'adapte vite. Dès le 4ème jour, la réponse au stress du froid diminue — tu le remarqueras.',
      how: ['Douche chaude', '2 à 3 secondes de froid', 'Retour chaud', 'Répéter 3 à 5 fois', 'Note si c\'est plus facile qu\'au Jour 1'],
      tip: 'Si tu te sens à l\'aise, reste une seconde de plus sous le froid.',
    },
    {
      id: 'movement', emoji: '🧘', title: 'Récupération',
      subtitle: 'Aujourd\'hui, tu ne forces pas',
      why: 'Progresser = savoir récupérer. Le repos actif permet à ton corps d\'assimiler le travail des jours précédents.',
      how: ['Étirements doux', 'Mobilité articulaire', 'Yoga ou relaxation', 'ou simplement rien — consciemment', 'Option bonus : soleil, nature, sauna'],
      tip: 'Un jour de récupération bien fait vaut mieux qu\'une séance forcée.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Ton apport quotidien',
      why: 'La constance est la clé. Un apport minéral régulier soutient toutes tes fonctions physiologiques.',
      how: ['250 ml d\'eau de mer, ou 500 ml de jus de légumes', 'Ton choix selon l\'envie', 'Idem chaque jour'],
      tip: 'Le meilleur choix est celui que tu fais réellement.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: 'Premier repas : 10h30–11h',
      why: 'Ton corps a appris à fonctionner sans digestion le matin. Aujourd\'hui, tu consolides cette habitude.',
      how: ['Pas de nourriture avant 10h30', 'Eau, thé, eau de mer autorisés', 'Observe ta faim — elle fluctue d\'un jour à l\'autre', 'Pas de grignotage'],
      tip: 'Chaque jour sans frustration est une victoire.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Premier repas en plaisir',
      why: 'Quatre jours de fruits en premier repas. Ton système digestif commence à apprécier cette légèreté matinale.',
      how: ['Fruits jusqu\'à satiété', 'Prends ce dont tu as envie', 'Pas de règle rigide sur le type de fruit', 'Un repas simple = un repas réussi'],
      tip: 'Pas de frustration = réussite.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '30 min sans écrans — encore',
      why: 'Chaque soir sans écran recalibre ton rythme circadien. Après quelques jours, ton corps commence à produire la mélatonine plus tôt et plus régulièrement.',
      how: ['Dîner léger', '30 min sans écrans avant de dormir', 'Activité de remplacement calme', 'Coucher vers 22h si possible'],
      tip: 'Tu construis quelque chose de durable. Chaque soir compte.',
    },
  ],
};

// ─── Jour 5 — Phase 2 ────────────────────────────────────────────────────────

const DAY5: ChecklistDay = {
  type: 'checklist',
  id: 5,
  welcomeTitle: 'Jour 5 — Le corps répond',
  welcomeSubtitle: 'Quelque chose change. Le corps commence à répondre. On monte légèrement le niveau — et tu vas sentir la différence.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: '5 min — plus instinctif chaque jour',
      why: 'Le rituel matinal s\'automatise. Bientôt tu ne te poseras plus la question — tu le feras.',
      how: ['Même structure qu\'avant', '5 minutes de respiration nasale', 'Lumière naturelle si possible', 'Pieds au sol'],
      tip: 'Tu remarques une différence dans ton énergie de départ ? C\'est normal.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Phase 2 : 5 secondes de froid',
      why: 'Ton système nerveux autonome s\'est adapté. Il est temps d\'aller un cran plus loin pour continuer à progresser.',
      how: ['Douche chaude', '5 secondes de froid — compte vraiment', 'Retour chaud', 'Répéter 4 fois', 'Reste détendu, respire pendant le froid'],
      tip: '3 secondes de plus par rapport au début. Ton corps s\'y attendait.',
    },
    {
      id: 'movement', emoji: '🏃', title: 'Mouvement',
      subtitle: '25 à 35 min — un peu plus long',
      why: 'On augmente progressivement. Ton cœur et tes muscles s\'adaptent mieux avec une progression graduelle qu\'avec des efforts irréguliers.',
      how: ['25 à 35 minutes d\'effort réel', 'Respire plus fort, réchauffe-toi', 'Option : 3 accélérations de 30 secondes au milieu', 'Avant de manger si possible'],
      tip: 'Les accélérations sont optionnelles mais puissantes. Essaie-en une si tu te sens bien.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Constant, simple, efficace',
      why: 'En phase d\'adaptation, tes muscles et ton système nerveux consomment plus de minéraux. L\'apport quotidien devient encore plus important.',
      how: ['250 ml eau de mer ou 500 ml jus de légumes', 'À ton rythme dans la matinée', 'Tu peux changer d\'option chaque jour'],
      tip: 'Simple et régulier bat compliqué et irrégulier.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: 'Viser 11h aujourd\'hui',
      why: 'On glisse légèrement l\'horaire. Ton corps s\'adapte à chaque palier — cette progression douce est ce qui rend le changement durable.',
      how: ['Pas de nourriture avant 11h', 'Eau et boissons sans sucre autorisées', 'Observe comment ton énergie se comporte le matin', 'Si tu as très faim : attends encore 15 minutes'],
      tip: '11h. Un petit pas de plus. Tu le tiens.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Jusqu\'à satiété réelle',
      why: 'À ce stade, ton estomac commence à mieux enregistrer les signaux de satiété après plusieurs jours sans surcharge digestive.',
      how: ['Fruits jusqu\'à vraie satiété', 'Prends le temps de manger', 'Écoute ton corps — quand c\'est suffisant, c\'est suffisant'],
      tip: 'Satiété réelle = tu n\'as plus faim. Pas "assiette vide".',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '45 min sans écrans ce soir',
      why: 'On monte progressivement. 45 minutes sans écran, c\'est 15 de plus — mais les bénéfices sur le sommeil sont disproportionnés.',
      how: ['Dîner plus léger qu\'habitude', '45 min avant de dormir : zéro écran', 'Remplace par une activité calme que tu aimes', 'Lumière basse'],
      tip: 'Ce soir, redécouvre quelque chose que tu avais oublié de faire.',
    },
  ],
};

// ─── Jour 6 — Phase 2 ────────────────────────────────────────────────────────

const DAY6: ChecklistDay = {
  type: 'checklist',
  id: 6,
  welcomeTitle: 'Jour 6 — Tu construis',
  welcomeSubtitle: 'Chaque jour que tu passes, tu construis quelque chose que personne ne peut t\'enlever.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: '5 min — automatique',
      why: 'Six jours de suite. La neuroplasticité fait son travail : ce chemin neuronal se renforce chaque matin.',
      how: ['Respiration nasale 5 minutes', 'Dehors ou à la fenêtre ouverte', 'Pieds au sol si possible'],
      tip: 'Ne négocie plus avec toi-même. Fais-le.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: '5 secondes — tu gères',
      why: 'Ton cerveau cherche à éviter l\'inconfort. Chaque fois que tu passes outre, tu entraînes ta volonté autant que ton corps.',
      how: ['Douche chaude', '5 secondes froid', 'Retour chaud', 'Répéter 4 fois', 'Compte les secondes à voix haute si besoin'],
      tip: 'Ce n\'est pas le froid qui est difficile. C\'est la décision. Et tu la prends déjà.',
    },
    {
      id: 'movement', emoji: '🧘', title: 'Récupération',
      subtitle: 'Ton corps assimile — laisse-le',
      why: 'La récupération est une composante active de la transformation. C\'est pendant le repos que les adaptations se consolident.',
      how: ['Étirements doux 10 à 15 min', 'Mobilité ou yoga', 'Option : sauna, bain chaud, nature', 'ou repos complet conscient'],
      tip: 'Progresser = savoir s\'arrêter. Tu progresses.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Le pilier silencieux',
      why: 'Les minéraux sont les cofacteurs de centaines de réactions enzymatiques. Sans eux, tes cellules ne peuvent pas atteindre leur plein potentiel.',
      how: ['Ton choix quotidien', 'Eau de mer ou jus de légumes', 'Dans la matinée de préférence'],
      tip: 'Le meilleur choix = celui que tu fais.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: '11h — tu tiens le cap',
      why: 'La régularité de l\'horaire entraîne ton système digestif à anticiper. Tu ressentiras moins la faim matinale avec le temps.',
      how: ['Rien avant 11h', 'Eau, thé, eau de mer OK', 'Observe si la faim matinale diminue par rapport au Jour 1'],
      tip: 'Compare avec il y a 6 jours. Quelque chose change ?',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Simple, propre, efficace',
      why: 'La simplicité du premier repas est une stratégie physiologique, pas une restriction. Elle préserve ton énergie digestive pour l\'après-midi.',
      how: ['Fruits que tu aimes', 'Jusqu\'à satiété', 'Prends ton temps'],
      tip: 'Pas de frustration = réussite.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '45 min sans écrans',
      why: 'Ton cerveau a besoin de cette fenêtre de décompression pour transiter vers le sommeil profond.',
      how: ['Dîner léger', '45 min sans écran avant de dormir', 'Activité de remplacement', 'Coucher vers 22h'],
      tip: 'Ces moments sans écran sont en train de devenir un des piliers de ta régénération.',
    },
  ],
};

// ─── Jour 7 — Phase 2 ────────────────────────────────────────────────────────

const DAY7: ChecklistDay = {
  type: 'checklist',
  id: 7,
  welcomeTitle: 'Jour 7 — La moitié',
  welcomeSubtitle: '7 jours. La moitié. Si tu continues comme ça, les 7 prochains jours vont amplifier tout ce que tu ressens déjà.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: 'Jour 7 — tu es là',
      why: 'Une semaine complète d\'activation matinale. Ton système nerveux commence à démarrer sans stimulants extérieurs.',
      how: ['5 minutes de respiration nasale', 'Dehors si possible', 'Prends un moment — c\'est le milieu du challenge'],
      tip: 'Remarque comment tu te sens ce matin par rapport au Jour 1.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: '7ème jour — tu l\'as fait chaque jour',
      why: 'Sept contacts avec le froid. Ton système nerveux sympathique est entraîné à répondre sans panique. C\'est un vrai changement physiologique.',
      how: ['Douche chaude', '5 secondes froid', 'Retour chaud', 'Répéter 4 fois', 'Reste présent'],
      tip: 'Tu n\'es plus le même qu\'au Jour 1 sous cette douche.',
    },
    {
      id: 'movement', emoji: '🏃', title: 'Mouvement',
      subtitle: '25 à 35 min — intensité libre',
      why: 'Au milieu du challenge, ton énergie est au plus haut de la Phase 2. Profite de cette énergie.',
      how: ['25 à 35 minutes', 'Choisis l\'activité qui te fait envie aujourd\'hui', 'Option : 3 accélérations de 30s', 'Avant de manger si possible'],
      tip: 'Si tu te sens bien, pousse un peu plus que d\'habitude.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'La constance qui paie',
      why: '7 jours d\'apport minéral régulier. Ton terrain physiologique est en train de changer en profondeur.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée', 'Même quantité qu\'avant'],
      tip: 'Ce pilier silencieux travaille pour toi tous les jours.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: '11h — mi-parcours',
      why: 'À mi-parcours, la fenêtre digestive est devenue une habitude pour beaucoup. Si c\'est encore difficile, les 7 prochains jours l\'ancrent.',
      how: ['Pas de nourriture avant 11h', 'Eau, thé, eau de mer OK'],
      tip: 'Les 7 prochains jours vont transformer cette habitude en réflexe.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Mi-parcours — tu connais',
      why: '7 premiers repas légers. Ton système digestif est moins sollicité le matin que depuis longtemps.',
      how: ['Fruits jusqu\'à satiété', 'Ce que tu aimes', 'Fluide, simple, propre'],
      tip: '7 jours. La différence se fera sur les 7 suivants.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '45 min sans écrans — demain c\'est la Phase 3',
      why: 'La qualité de ton sommeil est en train de s\'améliorer. Ce pilier y contribue directement.',
      how: ['Dîner léger', '45 min sans écran', 'Activité calme de remplacement', 'Coucher vers 22h'],
      tip: 'Demain, tu entres en Phase 3. Ce soir, repose-toi bien.',
    },
  ],
};

// ─── Jour 8 — Phase 2 finale ─────────────────────────────────────────────────

const DAY8: ChecklistDay = {
  type: 'checklist',
  id: 8,
  welcomeTitle: 'Jour 8 — Tu n\'es pas seul',
  welcomeSubtitle: 'La majorité des personnes qui arrivent au Jour 8 finissent le challenge. Tu y es. Et tu n\'es pas seul dans cette démarche.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: '8 jours d\'affilée',
      why: 'Huit matins consécutifs. Ton cortisol matinal — l\'hormone de l\'éveil — commence à se réguler naturellement.',
      how: ['5 minutes de respiration nasale', 'Dehors ou lumière naturelle', 'Pieds au sol'],
      tip: 'Ce matin, fais-le encore plus consciemment qu\'hier.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: '8ème contact avec le froid',
      why: 'Huit jours de contraste thermique. Ton système vasculaire s\'adapte — la vasoconstriction et la vasodilatation deviennent plus efficaces.',
      how: ['Douche chaude', '5 secondes froid', 'Retour chaud', 'Répéter 4 fois'],
      tip: 'Demain, le protocole change. Profite d\'encore une nuit de récupération avant.',
    },
    {
      id: 'movement', emoji: '🧘', title: 'Récupération',
      subtitle: 'Dernier jour de récup avant la Phase 3',
      why: 'Demain tu entres en Phase 3. Aujourd\'hui, ton corps assimile et se prépare. La récupération active est stratégique.',
      how: ['Étirements ou mobilité', 'Yoga ou relaxation', 'Option : nature, soleil, bain chaud', 'Repos complet si besoin'],
      tip: 'Ton corps sait ce dont il a besoin. Écoute-le.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Régulier, constant, efficace',
      why: 'La minéralisation régulière est l\'un des piliers les moins spectaculaires — mais les plus importants pour la régénération cellulaire.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée'],
      tip: 'Un des piliers les plus sous-estimés du programme.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: '11h — Phase 2 se termine',
      why: 'Demain en Phase 3, on poussera jusqu\'à 11h30. Aujourd\'hui, consolide 11h.',
      how: ['Rien avant 11h', 'Eau et boissons sans sucre OK'],
      tip: 'La préparation de demain commence ce soir.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Fluide et naturel',
      why: '8 jours de premier repas léger. Ton énergie après le repas est différente — plus stable, sans coup de pompe.',
      how: ['Fruits jusqu\'à satiété', 'Ce que tu aimes', 'Prends ton temps'],
      tip: 'La suite amplifie ce que tu as commencé.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '45 min — dernier soir Phase 2',
      why: 'Demain la Phase 3 commence. Ce soir, prépare-toi mentalement. Une soirée calme est le meilleur point de départ.',
      how: ['Dîner léger', '45 min sans écran', 'Couche-toi à l\'heure', 'Pense à demain'],
      tip: 'Demain, tu vas sentir quelque chose de différent.',
    },
  ],
};

// ─── Jour 9 — Phase 3 ────────────────────────────────────────────────────────

const DAY9: ChecklistDay = {
  type: 'checklist',
  id: 9,
  welcomeTitle: 'Jour 9 — La vraie transformation',
  welcomeSubtitle: 'Phase 3. Le corps commence à vraiment répondre. Tu vas sentir la différence.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: 'Phase 3 — quelque chose change',
      why: 'En Phase 3, l\'activation matinale n\'est plus une habitude — c\'est un ancrage identitaire. Tu es quelqu\'un qui fait ça chaque matin.',
      how: ['5 minutes de respiration nasale', 'Dehors si possible', 'Pieds au sol', 'Prends conscience que tu es en Phase 3'],
      tip: 'Ce matin est différent des autres. Remarque-le.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Phase 3 : finir par 10 à 15 secondes de froid',
      why: 'En Phase 3, le froid devient une vraie fin en eau froide. L\'effet sur le système nerveux est significativement plus puissant.',
      how: ['Douche chaude', 'Alternance chaud / froid', 'Terminer par 10 à 15 secondes de froid', 'Reste calme, respire profondément'],
      tip: 'La fin en froid change tout. Ton corps sort de la douche activé, pas juste propre.',
    },
    {
      id: 'movement', emoji: '🏃', title: 'Mouvement',
      subtitle: '30 à 40 min + 5 accélérations',
      why: 'Phase 3 : intensité montée. Les accélérations activent le métabolisme et stimulent la production hormonale naturelle.',
      how: ['30 à 40 minutes d\'effort réel', '5 accélérations de 30 secondes au milieu', '1 minute de récupération entre chaque accélération', 'Avant de manger de préférence'],
      tip: 'Les accélérations font la différence entre maintenir et progresser.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Plus important que jamais en Phase 3',
      why: 'L\'intensité monte — tes muscles et ton système nerveux consomment plus d\'électrolytes. L\'apport minéral soutient ta récupération.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée', 'Si tu transpires beaucoup : prends la quantité supérieure'],
      tip: 'Phase 3 = soutien nutritionnel plus important.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: '11h30 aujourd\'hui — un palier de plus',
      why: 'On glisse encore. Chaque palier renforce la clarté mentale de la matinée et l\'énergie de fond.',
      how: ['Rien avant 11h30', 'Eau, thé sans sucre, eau de mer OK', 'Observe ton énergie : plus stable maintenant ?'],
      tip: 'Si la faim arrive tôt, bois un verre d\'eau. Attends encore 15 minutes.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Simplicité + plaisir',
      why: 'La légèreté du premier repas est devenue une habitude physiologique. Ton corps sait maintenant comment y répondre.',
      how: ['Fruits jusqu\'à satiété', 'Prends ce dont tu as envie', 'Fluide et naturel'],
      tip: '9 premiers repas légers. Ton système digestif te dit merci.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '1 heure sans écrans — Phase 3',
      why: 'En Phase 3, la qualité du sommeil est cruciale pour assimiler les gains physiologiques. 1 heure sans écran est le minimum pour une vraie décompression.',
      how: ['Dîner léger', '1 heure avant de dormir : zéro écran', 'Activité calme au choix', 'Coucher vers 22h si possible'],
      tip: '1 heure. C\'est là que les choses changent vraiment pour le sommeil.',
    },
  ],
};

// ─── Jour 10 — Phase 3 ───────────────────────────────────────────────────────

const DAY10: ChecklistDay = {
  type: 'checklist',
  id: 10,
  welcomeTitle: 'Jour 10 — La base',
  welcomeSubtitle: 'Ce que tu fais là est la base. La suite permet d\'aller beaucoup plus loin — mais ça, tu en verras la forme après.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: '10 jours — tu es régulier',
      why: '10 jours de suite. La discipline n\'est pas quelque chose que tu as. C\'est quelque chose que tu deviens.',
      how: ['5 minutes de respiration nasale', 'Même protocole', 'Dehors si possible'],
      tip: '10 jours. Peu de gens arrivent là. Tu y es.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Finir par 10 à 15s de froid',
      why: 'Ton cerveau a appris à ne pas paniquer face au froid. Cette capacité à rester calme sous pression se généralise à d\'autres domaines de ta vie.',
      how: ['Alternance chaud / froid', 'Terminer par 10 à 15 secondes de froid', 'Reste présent et calme', 'Respire pendant le froid'],
      tip: 'Cette capacité à rester calme sous pression — elle ne reste pas sous la douche.',
    },
    {
      id: 'movement', emoji: '🧘', title: 'Récupération',
      subtitle: 'Récupération active — Phase 3',
      why: 'En Phase 3, la récupération est encore plus importante. C\'est pendant le repos que les adaptations physiques se consolident réellement.',
      how: ['Étirements ou mobilité 15 à 20 min', 'Yoga ou relaxation', 'Option : nature, sauna, bain froid', 'Repos complet si nécessaire'],
      tip: 'Un corps qui récupère bien progresse deux fois plus vite.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: '10 jours de constance',
      why: 'La minéralisation régulière sur 10 jours commence à se faire sentir dans la qualité de ton énergie de fond.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée'],
      tip: 'Ce pilier travaille en silence. Mais il travaille.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: '11h30 — tu l\'as',
      why: '10 jours sans manger le matin. Ton métabolisme s\'est recalibré sur un rythme qui favorise la régénération plutôt que la compensation.',
      how: ['Rien avant 11h30', 'Eau OK'],
      tip: 'La base que tu poses maintenant change ce qui est possible ensuite.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Le repas qui ne fatigue pas',
      why: 'Après 10 jours, beaucoup notent qu\'ils ont plus d\'énergie l\'après-midi. Le premier repas léger y contribue directement.',
      how: ['Fruits jusqu\'à satiété', 'Ce que tu aimes', 'Fluide et naturel'],
      tip: 'Simple et constant. C\'est ce qui fonctionne.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '1 heure sans écrans',
      why: '10 nuits de qualité en train de se construire. La qualité de ton sommeil à ce stade devrait être notablement meilleure qu\'au début.',
      how: ['Dîner léger', '1 heure sans écran', 'Activité calme', 'Coucher vers 22h'],
      tip: 'Pense à ce que tu veux faire de cette heure ce soir.',
    },
  ],
};

// ─── Jour 11 — Phase 3 ───────────────────────────────────────────────────────

const DAY11: ChecklistDay = {
  type: 'checklist',
  id: 11,
  welcomeTitle: 'Jour 11 — Plus que 3 jours',
  welcomeSubtitle: 'Plus que 3 jours. Tu n\'as plus le droit d\'arrêter.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: 'Avant-dernier matin de Phase 3',
      why: 'Onze matins de suite. L\'activation matinale est en train de devenir aussi naturelle que te laver les dents.',
      how: ['5 minutes de respiration nasale', 'Dehors si possible', 'Présence totale ces 5 minutes'],
      tip: 'Plus que 3 jours. Ces 5 minutes comptent plus que jamais.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Finir par 10-15 secondes',
      why: 'Demain tu entres en Phase 4. Le froid devient encore plus intense. Prépare ton mental aujourd\'hui.',
      how: ['Alternance chaud / froid', 'Terminer par 10 à 15 secondes de froid', 'Reste calme, compte'],
      tip: 'Demain : Phase 4. On commence en froid et on finit en froid.',
    },
    {
      id: 'movement', emoji: '🏃', title: 'Mouvement',
      subtitle: '30 à 40 min + 5 accélérations',
      why: 'Avant-dernier jour de mouvement Phase 3. Donne tout — la récupération de demain est là pour ça.',
      how: ['30 à 40 min d\'effort réel', '5 accélérations de 30 secondes', '1 min de récupération entre chaque', 'Avant de manger'],
      tip: 'C\'est en poussant maintenant que tu ancres les résultats.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Régulier jusqu\'au bout',
      why: 'Le soutien minéral en fin de programme est aussi important qu\'au début — ton corps est en phase d\'adaptation maximale.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée'],
      tip: 'Pas de relâchement sur les piliers silencieux.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: '11h30 — plus que 3 jours',
      why: 'Tu es à 3 jours de la fin. Cette fenêtre digestive, que tu trouvais peut-être impossible au Jour 1, est maintenant une habitude.',
      how: ['Rien avant 11h30', 'Eau OK'],
      tip: 'Souviens-toi du Jour 1. Compare.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Avant-dernier jour Phase 3',
      why: 'Le premier repas léger est ancré. Ton système digestif a changé sa façon de fonctionner le matin.',
      how: ['Fruits jusqu\'à satiété', 'Choisis ce que tu veux', 'Prends le temps'],
      tip: 'Plus que 3 jours.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '1 heure sans écrans',
      why: 'Demain tu entres en Phase 4. Ce soir, récupère bien. Ton corps a besoin de cette transition calme.',
      how: ['Dîner léger', '1 heure sans écran', 'Dors tôt si tu le sens'],
      tip: 'Demain : Phase 4. La maîtrise commence.',
    },
  ],
};

// ─── Jour 12 — Phase 4 ───────────────────────────────────────────────────────

const DAY12: ChecklistDay = {
  type: 'checklist',
  id: 12,
  welcomeTitle: 'Jour 12 — La maîtrise',
  welcomeSubtitle: 'Phase 4. Sensation de contrôle. Tu vois ce que tu as construit. Fierté.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: 'Phase 4 — maîtrise',
      why: 'Douze jours. Ce n\'est plus une question de discipline — c\'est ton identité. Tu es quelqu\'un qui fait ça.',
      how: ['5 minutes de respiration nasale', 'Dehors si possible', 'Pieds au sol', 'Remarque que tu n\'en as plus besoin qu\'on te le dise'],
      tip: 'La maîtrise, c\'est quand ça devient naturel.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Phase 4 : commencer en froid, finir en froid',
      why: 'Phase 4 change le protocole : on commence maintenant par 5 secondes de froid avant même de passer au chaud. Et on finit par 15-20 secondes. Ton système nerveux est prêt.',
      how: ['Commencer par 5 secondes de froid d\'emblée', 'Puis alternance chaud / froid', 'Finir par 15 à 20 secondes de froid', 'Reste calme, compte, respire'],
      tip: 'Tu commences en froid maintenant. Ça te choque encore ? Ou presque plus ?',
    },
    {
      id: 'movement', emoji: '🧘', title: 'Récupération',
      subtitle: 'Phase 4 — récupération de maîtrise',
      why: 'En Phase 4, la récupération n\'est plus une pause — c\'est une part active de ta transformation. Tu sais maintenant comment ton corps réagit.',
      how: ['Étirements, yoga, mobilité', 'Option : sauna, bain froid, nature', 'ou repos conscient complet', 'Écoute ce dont ton corps a besoin'],
      tip: 'Tu sais maintenant ce dont tu as besoin. Fais-lui confiance.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Constance jusqu\'au bout',
      why: '12 jours de minéralisation régulière. Ce pilier a travaillé en silence tout au long du programme.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée'],
      tip: 'Encore 2 jours. Tu ne lâches pas sur les bases.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: 'Viser midi aujourd\'hui',
      why: 'Phase 4 : on pousse jusqu\'à midi. C\'est le palier final. Ton métabolisme matinal est maintenant optimisé pour fonctionner sans digestion jusqu\'à ce moment.',
      how: ['Rien avant midi', 'Eau, thé sans sucre, eau de mer OK', 'Observe ta clarté mentale ce matin'],
      tip: 'Midi. Le palier final. Tu l\'as.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Fluide, naturel — Phase 4',
      why: '12 premiers repas légers. Ton estomac a appris à fonctionner différemment. Cette légèreté va rester si tu continues après le challenge.',
      how: ['Fruits jusqu\'à satiété', 'Fluide, naturel, sans règle rigide'],
      tip: 'Après le challenge, tu peux continuer ça à ta façon.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '1h à 2h sans écrans — Phase 4',
      why: 'Le dernier palier : 1 à 2 heures sans écran. C\'est ce qui permet une véritable décompression du système nerveux avant le sommeil.',
      how: ['Dîner léger', '1h à 2h avant de dormir : zéro écran', 'Activité calme choisie intentionnellement', 'Coucher vers 22h'],
      tip: 'Ce soir, offre-toi vraiment cette soirée. Tu l\'as méritée.',
    },
  ],
};

// ─── Jour 13 — Phase 4 ───────────────────────────────────────────────────────

const DAY13: ChecklistDay = {
  type: 'checklist',
  id: 13,
  welcomeTitle: 'Jour 13 — Tu y es presque',
  welcomeSubtitle: 'Demain, tu termines. Ce soir, joue le jeu jusqu\'au bout.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: 'Avant-dernier matin',
      why: 'Treize matins. La routine est ancrée. Ce qui était un effort est devenu une évidence.',
      how: ['5 minutes de respiration nasale', 'Dehors si possible', 'Vis ces 5 minutes pleinement — avant-dernier jour'],
      tip: 'Demain, tu termines. Ce matin, sois là.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Commencer en froid — finir en froid',
      why: 'Treize jours de contact quotidien avec le froid. Ton système nerveux a changé sa façon de répondre au stress. Ce changement va bien au-delà de la douche.',
      how: ['Commencer par 5 secondes de froid', 'Alternance chaud / froid', 'Finir par 15 à 20 secondes de froid', 'Compte. Reste calme.'],
      tip: 'Demain : Jour 14. Un dernier contact avec le froid.',
    },
    {
      id: 'movement', emoji: '🏃', title: 'Mouvement',
      subtitle: '30 à 45 min — intensité libre',
      why: 'Dernier jour de mouvement intense. Phase 4 : liberté d\'intensité — fais ce qui te donne de l\'énergie.',
      how: ['30 à 45 minutes', 'Intensité selon ton énergie du jour', 'Option : accélérations si tu les sens', 'C\'est ton dernier entraînement du challenge'],
      tip: 'Comment tu te sens par rapport au Jour 1 ? La différence, c\'est toi qui l\'as créée.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Avant-dernier apport',
      why: 'Un seul apport séparant ton dernier jour. La régularité sur 13 jours a fait son travail.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée'],
      tip: 'Dernier demain. Tiens jusqu\'au bout.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: 'Midi — tu maîtrises',
      why: 'Avant-dernier jour à midi. Ce qui était un challenge au Jour 1 est maintenant une habitude. C\'est ça, la transformation.',
      how: ['Rien avant midi', 'Eau OK'],
      tip: 'Demain, tu termines. Ce matin, tiens le cap.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Avant-dernier premier repas',
      why: '13 premiers repas légers. Ton corps a appris quelque chose de nouveau sur lui-même.',
      how: ['Fruits jusqu\'à satiété', 'Ce que tu veux', 'Prends-en plaisir — c\'est l\'avant-dernier'],
      tip: 'Demain, c\'est le Jour 14.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: '1h à 2h sans écrans',
      why: 'Avant-dernière soirée du challenge. Offre-toi ce temps calme — demain est un jour important.',
      how: ['Dîner léger', '1h à 2h sans écran', 'Activité calme', 'Repose-toi bien'],
      tip: 'Demain, tu termines ce que tu as commencé.',
    },
  ],
};

// ─── Jour 14 — Phase 4 ───────────────────────────────────────────────────────

const DAY14: ChecklistDay = {
  type: 'checklist',
  id: 14,
  welcomeTitle: 'Jour 14 — La fin et le début',
  welcomeSubtitle: 'Regarde ce que tu viens de faire. Tu n\'as pas juste suivi un programme. Tu as repris le contrôle.',
  activities: [
    {
      id: 'activation', emoji: '🫁', title: 'Activation matinale',
      subtitle: 'Jour 14 — le dernier',
      why: 'Quatorze matins de suite. Ce rituel que tu as instauré est maintenant une partie de toi. Il continuera si tu décides qu\'il continue.',
      how: ['5 minutes de respiration nasale', 'Dehors si possible', 'Pieds au sol', 'Ce matin est différent — c\'est le dernier du challenge'],
      tip: 'Ce matin, fais-le comme si tu t\'en souviendrais.',
    },
    {
      id: 'cold', emoji: '🥶', title: 'Défi froid',
      subtitle: 'Le dernier — et le plus fort',
      why: 'Quatorze jours de froid. Ton système nerveux a fondamentalement changé sa réponse au stress. Ce que tu as fait là ne se défait pas.',
      how: ['Commencer par 5 secondes de froid', 'Alternance chaud / froid', 'Finir par 15 à 20 secondes de froid — le plus long jamais fait', 'Reste calme, compte, sois fier'],
      tip: 'Au Jour 1, 2 secondes te semblaient énormes. Aujourd\'hui tu finis sur 20. Laisse ça te parler.',
    },
    {
      id: 'movement', emoji: '🧘', title: 'Récupération',
      subtitle: 'Dernier jour — récupération finale',
      why: 'Le challenge se termine par un jour de récupération — ce n\'est pas un hasard. Ton corps a besoin d\'assimiler 14 jours de transformation.',
      how: ['Étirements, mobilité, yoga', 'Option : sauna, nature, bain froid', 'Repos conscient', 'Prends le temps de sentir où tu en es'],
      tip: 'Ce repos fait partie de la transformation. Il en est la conclusion.',
    },
    {
      id: 'mineralization', emoji: '🌊', title: 'Minéralisation',
      subtitle: 'Le dernier apport — pour l\'instant',
      why: '14 jours d\'apport minéral régulier. Ton terrain physiologique est différent de celui du Jour 1.',
      how: ['Eau de mer ou jus de légumes', 'Dans la matinée', 'Pour la dernière fois du challenge'],
      tip: 'Après le challenge, continue si tu peux. Ça vaut l\'investissement.',
    },
    {
      id: 'digestive_window', emoji: '🕙', title: 'Fenêtre digestive',
      subtitle: 'Midi — pour la dernière fois du challenge',
      why: '14 matins sans digestion. Ton corps a recalibré son rythme métabolique matinal. Cette habitude peut continuer après le programme.',
      how: ['Rien avant midi', 'Eau OK', 'Dernière fois — mais pas forcément la dernière de ta vie'],
      tip: 'Tu peux continuer ça après le challenge. Ton corps a appris.',
    },
    {
      id: 'first_meal', emoji: '🍓', title: 'Premier repas — Fruits',
      subtitle: 'Le dernier premier repas du challenge',
      why: '14 premiers repas légers. Ce que tu as mis en place est réel et mesurable dans ton énergie et ta digestion.',
      how: ['Fruits jusqu\'à satiété', 'Ce que tu veux', 'Le dernier du challenge — mais peut-être pas le dernier tout court'],
      tip: 'Après le challenge, tu décides. Mais ton corps sait maintenant ce que ça fait.',
    },
    {
      id: 'evening', emoji: '📵', title: 'Soirée sans écrans',
      subtitle: 'Dernière soirée du challenge',
      why: 'La dernière soirée. 14 jours de sommeil de meilleure qualité en train de se construire. Ce pilier mérite de continuer après le challenge.',
      how: ['Dîner léger', '1h à 2h sans écran', 'Ce soir, prends le temps de regarder où tu en étais au Jour 1', 'Coucher vers 22h'],
      tip: 'Tu viens de voir ce que 14 jours peuvent faire. La suite, c\'est adapter tout ça à toi.',
    },
  ],
};

// ─── Export principal ─────────────────────────────────────────────────────────

export const DAYS: DayContent[] = [
  DAY1, DAY2, DAY3, DAY4, DAY5, DAY6, DAY7,
  DAY8, DAY9, DAY10, DAY11, DAY12, DAY13, DAY14,
];
