/**
 * welcomeReplay — quand proposer « Revoir la vidéo de bienvenue » (IA-12).
 *
 * Retours testeurs beta (3 octobre 2026) : la vidéo J1 est souvent passée
 * sans être regardée, et ne se rejoue jamais. Décision Stéphane : lien
 * discret sur l'accueil aux jours de position 1 à 3 (D38 — la position
 * avance par validation, pas au calendrier), plus une entrée Profil pendant
 * les 14 jours de Phase 0. Rien au-delà : le texte de l'écran (« 14 jours.
 * 7 actions par jour ») ne vaut que pour la Phase 0.
 *
 * La relecture ne touche à aucun état (flags narratifs, position, série).
 */

import type { Phase } from './streak';

const HOME_LAST_DAY = 3;

/** Accueil IA-11 : J1 à J3, une fois la vidéo jouée une première fois. */
export function canReplayWelcomeOnHome(input: {
  currentPhase: Phase;
  currentDay: number;
  welcomeSeen: boolean;
}): boolean {
  const { currentPhase, currentDay, welcomeSeen } = input;
  return (
    currentPhase === 'phase_0' &&
    welcomeSeen &&
    currentDay >= 1 &&
    currentDay <= HOME_LAST_DAY
  );
}
