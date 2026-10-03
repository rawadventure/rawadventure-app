/**
 * global-copy — slots de copy transverses, hors écran spécifique (D23).
 *
 * F-13 (audit Lou, 22 sept 2026) : les notices de cohérence calendaire
 * vivaient en chaînes dures dans useStreakDomain (ex-ProgressContext).
 * D23 impose que tout texte affiché passe par un slot de copy identifié —
 * ce module est le point unique où Mimi & Jacky remplaceront les
 * placeholders (marqués [copy à valider]) par le copy définitif, sans
 * toucher à la logique.
 *
 * Ton : règles CLAUDE.md § 4 — sobre, non-culpabilisant (D26), pas de
 * pression par la perte, pas d'exclamation, pas d'emoji.
 */

import type { Phase } from '../lib/streak';

/**
 * Slot `copy.global.streak-reprise` (D38) : phrase de reprise de position.
 * En Phase 0 on cite le jour global (« Tu reprends au jour X ») ; en
 * Phase 1 l'UI parle en jour de pilier, pas en jour global — formulation
 * neutre hors Phase 0.
 */
export function repriseText(phase: Phase, day: number): string {
  return phase === 'phase_0'
    ? `Tu reprends au jour ${day}, là où tu t'étais arrêté.`
    : "Tu reprends là où tu t'étais arrêté.";
}

/**
 * Slot `copy.global.streak-remis-a-zero` (D26) : streak cassé après
 * absence. Affiché par la résolution de cohérence calendaire.
 */
export function streakBrokenNotice(
  phase: Phase,
  day: number,
): { title: string; body: string } {
  return {
    title: 'Série remise à zéro',
    body:
      `Des journées sont passées sans validation. Ta série repart de zéro — ` +
      `la prochaine validation la relance. ${repriseText(phase, day)} [copy à valider]`,
  };
}

/**
 * Slot `copy.global.message-joker-consomme` (D26/D6) : le joker
 * hebdomadaire a couvert une journée sans validation. En Phase 0, rappel
 * de la règle « on coche le jour même » (retour testeur beta, 3 oct 2026 :
 * elle n'était écrite nulle part). Pas de rappel en Phase 1 — on n'y coche
 * pas des actions.
 */
export function jokerUsedNotice(
  phase: Phase,
  day: number,
): { title: string; body: string } {
  const rule =
    phase === 'phase_0' ? 'Une journée se coche le jour même, avant minuit. ' : '';
  return {
    title: 'Joker utilisé',
    body:
      `Ton joker de la semaine a couvert une journée sans validation. ` +
      `Série conservée. ${rule}${repriseText(phase, day)} [copy à valider]`,
  };
}

/**
 * Slot `copy.global.notif-preprompt` (R3-5, 29 sept 2026) : couche
 * d'explication affichée à la fermeture de la vidéo J1, AVANT le prompt
 * système de permission notifications (une seule chance de prompt natif
 * sur iOS — on la contextualise). D32 : plage silence citée.
 */
export function notifPrePromptCopy(): {
  title: string;
  body: string;
  ctaAccept: string;
  ctaLater: string;
} {
  return {
    title: 'Un rappel par jour',
    body:
      `On t'envoie un rappel pour ton check quotidien. Jamais entre 22h et 7h. ` +
      `Tu peux le couper à tout moment depuis ton profil. [copy à valider]`,
    ctaAccept: 'Activer les rappels',
    ctaLater: 'Pas maintenant',
  };
}

/**
 * Slot `copy.global.journee-auto-validee` (D44, 1er octobre 2026) : une ou
 * plusieurs journées Phase 0 passées, cochées à ≥ 5/7 sans tap « Valider »,
 * ont été validées automatiquement à l'ouverture suivante.
 */
export function autoValidatedNotice(
  days: Array<{ local_date: string; actionsCount: number }>,
): { title: string; body: string } {
  if (days.length === 1) {
    return {
      title: 'Journée validée',
      body:
        `Hier, tu avais coché ${days[0].actionsCount} actions sur 7 : ` +
        `ta journée est validée. [copy à valider]`,
    };
  }
  return {
    title: 'Journées validées',
    body:
      `${days.length} journées cochées à 5 actions ou plus ont été validées. ` +
      `[copy à valider]`,
  };
}

/**
 * Slot `copy.IA-11.recap-hier` (D45, 2 octobre 2026) : récapitulatif de la
 * veille sur l'accueil Phase 0 — ligne discrète « Hier : Mes actions »
 * (libellé fixé par Stéphane, 2 oct) + détail en lecture seule. Le nombre
 * d'actions n'apparaît que dans le détail, sans jugement (pas de pression
 * par la perte).
 */
export function yesterdayRecapCopy(count: number): {
  line: string;
  title: string;
  summary: string;
  validated: string;
  done: string;
  notDone: string;
  close: string;
} {
  const summary = `${count} action${count > 1 ? 's' : ''} sur 7`;
  return {
    line: 'Hier : Mes actions',
    title: 'Hier',
    summary,
    validated: 'Journée validée.',
    done: 'fait',
    notDone: 'non fait',
    close: 'Fermer',
  };
}

/**
 * Slot `copy.IA-11.regle-validation` (retour testeur beta, 3 octobre 2026) :
 * règle du jeu affichée sous le bouton « Valider ma journée » de l'accueil
 * Phase 0 — le seuil (D6), puis l'échéance (D20/D27 : une journée se coche
 * le jour même). Texte fixé par Stéphane le 3 oct. Espace insécable avant
 * les deux-points : sans elle, « : » passe seul à la ligne sur mobile.
 */
export function validationRuleHint(): string {
  return '5 actions sur 7 suffisent pour valider. Coche le jour même\u00a0: à minuit, la journée se ferme.';
}
