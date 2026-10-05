/**
 * Tests narrativeQueue — file d'écrans narratifs (F-06 audit Lou).
 *
 * Encode UNE fois les règles de priorité narrative, jusqu'ici dupliquées
 * entre l'effet hub_open (14 dépendances) et handleConfirmValidation :
 *  - D19 : charnières J3/J7/J11/J14
 *  - D38 : la charnière se joue à la VALIDATION du jour de position concerné
 *          (jamais à l'ouverture du hub) ; un jour jamais validé ne joue
 *          jamais sa charnière
 *  - D25 : un seul événement narratif par tirage — la fonction rend au plus
 *          UN événement, les suivants s'espacent naturellement (flags posés
 *          au déclenchement, §2.3 Feature Spec)
 *  - D29 : palier premier franchissement vs redéclenchement (isFirstReach
 *          transite tel quel — la distinction est calculée par validateDay)
 *  - D30 : collision narrative — S0.1 (jour 15) / S0.2 (jour 16) priment,
 *          le palier atteint ce jour-là est différé d'un cran et repêché à
 *          la prochaine validation sans collision
 *
 * Cas issus des blocs E et F de docs/tests/salve-tests-pre-ouverture-testeurs.md.
 */

import {
  nextNarrativeEvent,
  type NarrativeQueueInput,
} from '../narrativeQueue';

const NO_FLAGS = {};
// Parcours nominal jusqu'à J14 : vidéo J1 + 4 charnières vues (D44 : une
// charnière non vue d'un jour validé se rattrape à l'ouverture).
const P0_SEEN = {
  welcome_video: 'x',
  j3_charniere: 'x',
  j7_charniere: 'x',
  j11_charniere: 'x',
  j14_charniere: 'x',
};
const ALL_PHASE0_FLAGS = {
  ...P0_SEEN,
  s0_1_screen: 'x',
  s0_2_screen: 'x',
};

function input(partial: Partial<NarrativeQueueInput>): NarrativeQueueInput {
  return {
    trigger: 'hub_open',
    currentDay: 1,
    currentPhase: 'phase_0',
    narrativeFlags: NO_FLAGS,
    pendingTierReach: null,
    ...partial,
  };
}

function validation(
  partial: Partial<NonNullable<NarrativeQueueInput['validationResult']>> = {},
): NonNullable<NarrativeQueueInput['validationResult']> {
  return {
    tierReached: null,
    tierIsFirstReach: false,
    newStreak: 1,
    jokerUsed: false,
    ...partial,
  };
}

describe('hub_open — vidéo J1, S0.1, S0.2 (IA-12/IA-20/IA-21)', () => {
  test('premier lancement Phase 0 sans flag → vidéo de bienvenue', () => {
    expect(nextNarrativeEvent(input({ trigger: 'hub_open' }))).toEqual({
      kind: 'welcome_video',
    });
  });

  test('vidéo déjà vue → rien (un écran narratif ne se joue qu une fois)', () => {
    expect(
      nextNarrativeEvent(
        input({ narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toBeNull();
  });

  test('hors phase_0 (fenêtre transitoire phase_1 sans pilier) → pas de vidéo J1 (audit B2)', () => {
    expect(
      nextNarrativeEvent(
        input({ trigger: 'hub_open', currentPhase: 'phase_1', currentDay: 17 }),
      ),
    ).toBeNull();
  });

  test('F1 : ouverture au jour 15 → S0.1 (se joue à l ouverture, pas à la validation)', () => {
    expect(
      nextNarrativeEvent(
        input({ currentDay: 15, narrativeFlags: P0_SEEN }),
      ),
    ).toEqual({ kind: 's0_1_screen' });
  });

  test('vidéo J1 jamais vue prime sur S0.1 (chaîne de priorité)', () => {
    expect(nextNarrativeEvent(input({ currentDay: 15 }))).toEqual({
      kind: 'welcome_video',
    });
  });

  test('F1 contre-test : S0.1 déjà vu → rien à la réouverture', () => {
    expect(
      nextNarrativeEvent(
        input({
          currentDay: 15,
          narrativeFlags: { ...P0_SEEN, s0_1_screen: 'x' },
        }),
      ),
    ).toBeNull();
  });

  test('F2 : ouverture au jour 16 → S0.2', () => {
    expect(
      nextNarrativeEvent(
        input({
          currentDay: 16,
          narrativeFlags: { ...P0_SEEN, s0_1_screen: 'x' },
        }),
      ),
    ).toEqual({ kind: 's0_2_screen' });
  });

  test('D38 : ouverture au jour 3 → PAS de charnière à l ouverture (elle se joue à la validation)', () => {
    expect(
      nextNarrativeEvent(
        input({ currentDay: 3, narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toBeNull();
  });

  test('hub_open sans validationResult ne rend jamais de palier (repêchage D30 à la validation uniquement)', () => {
    expect(
      nextNarrativeEvent(
        input({
          currentDay: 10,
          narrativeFlags: ALL_PHASE0_FLAGS,
          pendingTierReach: {
            tierId: 15,
            isFirstReach: true,
            streakValue: 15,
          },
        }),
      ),
    ).toBeNull();
  });
});

describe('day_validated — charnières D19/D38 (bloc E)', () => {
  const CASES: Array<[number, string]> = [
    [3, 'j3_charniere'],
    [7, 'j7_charniere'],
    [11, 'j11_charniere'],
    [14, 'j14_charniere'],
  ];

  test.each(CASES)(
    'E — validation du jour %i → charnière %s',
    (day, flag) => {
      expect(
        nextNarrativeEvent(
          input({
            trigger: 'day_validated',
            currentDay: day,
            narrativeFlags: { welcome_video: 'x' },
            validationResult: validation({ newStreak: day }),
          }),
        ),
      ).toEqual({ kind: 'charniere', day, flag });
    },
  );

  test('E1 contre-test : charnière déjà vue → rien', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 3,
          narrativeFlags: { welcome_video: 'x', j3_charniere: 'x' },
          validationResult: validation({ newStreak: 3 }),
        }),
      ),
    ).toBeNull();
  });

  test('jour non-charnière validé sans palier ni joker → rien', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 5,
          narrativeFlags: { welcome_video: 'x' },
          validationResult: validation({ newStreak: 5 }),
        }),
      ),
    ).toBeNull();
  });
});

describe('day_validated — paliers et collision D30 (bloc F)', () => {
  test('F1 : palier 15 atteint à la validation du jour 15 → DIFFÉRÉ (S0.1 prime, D30)', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 15,
          narrativeFlags: ALL_PHASE0_FLAGS,
          validationResult: validation({
            tierReached: 15,
            tierIsFirstReach: true,
            newStreak: 15,
          }),
        }),
      ),
    ).toEqual({
      kind: 'defer_tier',
      tierId: 15,
      isFirstReach: true,
      streakValue: 15,
    });
  });

  test('palier atteint au jour 16 (S0.2) → différé aussi (D30 généralisé)', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 16,
          narrativeFlags: ALL_PHASE0_FLAGS,
          validationResult: validation({
            tierReached: 15,
            tierIsFirstReach: true,
            newStreak: 15,
          }),
        }),
      ),
    ).toEqual({
      kind: 'defer_tier',
      tierId: 15,
      isFirstReach: true,
      streakValue: 15,
    });
  });

  test('F2 : validation du jour 16 avec palier différé en attente → repêché (différé d un cran, pas perdu)', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 16,
          narrativeFlags: ALL_PHASE0_FLAGS,
          pendingTierReach: {
            tierId: 15,
            isFirstReach: true,
            streakValue: 15,
          },
          validationResult: validation({ newStreak: 16 }),
        }),
      ),
    ).toEqual({
      kind: 'show_tier',
      tierId: 15,
      isFirstReach: true,
      streakValue: 15,
      fromDeferred: true,
    });
  });

  test('palier atteint hors S0 (ex. 30j en Phase 1) → affiché immédiatement, D29 premier franchissement', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 31,
          currentPhase: 'phase_1',
          narrativeFlags: ALL_PHASE0_FLAGS,
          validationResult: validation({
            tierReached: 30,
            tierIsFirstReach: true,
            newStreak: 30,
          }),
        }),
      ),
    ).toEqual({
      kind: 'show_tier',
      tierId: 30,
      isFirstReach: true,
      streakValue: 30,
      fromDeferred: false,
    });
  });

  test('D29 redéclenchement : isFirstReach=false transite tel quel (modale simplifiée)', () => {
    const evt = nextNarrativeEvent(
      input({
        trigger: 'day_validated',
        currentDay: 40,
        currentPhase: 'phase_1',
        narrativeFlags: ALL_PHASE0_FLAGS,
        validationResult: validation({
          tierReached: 15,
          tierIsFirstReach: false,
          newStreak: 15,
        }),
      }),
    );
    expect(evt).toMatchObject({ kind: 'show_tier', isFirstReach: false });
  });

  test('priorité : palier neuf prime sur palier différé en attente', () => {
    const evt = nextNarrativeEvent(
      input({
        trigger: 'day_validated',
        currentDay: 31,
        currentPhase: 'phase_1',
        narrativeFlags: ALL_PHASE0_FLAGS,
        pendingTierReach: { tierId: 15, isFirstReach: true, streakValue: 15 },
        validationResult: validation({
          tierReached: 30,
          tierIsFirstReach: true,
          newStreak: 30,
        }),
      }),
    );
    expect(evt).toMatchObject({ kind: 'show_tier', tierId: 30 });
  });
});

describe('day_validated — joker (message sobre)', () => {
  test('joker consommé sans autre événement → joker_notice', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 5,
          narrativeFlags: { welcome_video: 'x' },
          validationResult: validation({ jokerUsed: true, newStreak: 4 }),
        }),
      ),
    ).toEqual({ kind: 'joker_notice', newStreak: 4 });
  });

  test('charnière prime sur joker_notice (un seul événement, D25)', () => {
    expect(
      nextNarrativeEvent(
        input({
          trigger: 'day_validated',
          currentDay: 3,
          narrativeFlags: { welcome_video: 'x' },
          validationResult: validation({ jokerUsed: true, newStreak: 2 }),
        }),
      ),
    ).toMatchObject({ kind: 'charniere', day: 3 });
  });
});

// ─── D44 — rattrapage de charnière après validation automatique ──────────────
// Une journée validée automatiquement (cohérence, pas de tap « Valider ») ne
// passe pas par le trigger day_validated : sa charnière (D19) se joue à
// l'ouverture suivante du hub — uniquement pour le jour de parcours juste
// terminé (D25 : une seule candidate par tirage).

describe('hub_open — rattrapage charnière après validation auto (D44)', () => {
  test('J3 validé automatiquement (position 4, flag absent) → charnière J3 à l ouverture', () => {
    expect(
      nextNarrativeEvent(
        input({ currentDay: 4, narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toEqual({ kind: 'charniere', day: 3, flag: 'j3_charniere' });
  });

  // Régression retour testeuse (4 oct 2026) : flags perdus en base → J3
  // rejouée à la position 6 avec une série de 5 jours. Le rattrapage ne vaut
  // que pour le jour de parcours juste terminé ; plus ancien = jamais rejoué.
  test('charnière plus ancienne que le jour précédent → rien (J3 à la position 6)', () => {
    expect(
      nextNarrativeEvent(
        input({ currentDay: 6, narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toBeNull();
  });

  test('plusieurs charnières non vues → seule celle du jour précédent se rattrape', () => {
    expect(
      nextNarrativeEvent(
        input({ currentDay: 8, narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toEqual({ kind: 'charniere', day: 7, flag: 'j7_charniere' });
    expect(
      nextNarrativeEvent(
        input({ currentDay: 9, narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toBeNull();
  });

  test('charnière du jour de position courant non validé → rien (elle se joue à la validation)', () => {
    expect(
      nextNarrativeEvent(
        input({ currentDay: 3, narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toBeNull();
  });

  test('toutes vues → rien', () => {
    expect(
      nextNarrativeEvent(
        input({
          currentDay: 12,
          narrativeFlags: {
            welcome_video: 'x',
            j3_charniere: 'x',
            j7_charniere: 'x',
            j11_charniere: 'x',
          },
        }),
      ),
    ).toBeNull();
  });

  test('J14 auto-validé (position 15) : charnière J14 avant S0.1', () => {
    const flags = {
      welcome_video: 'x',
      j3_charniere: 'x',
      j7_charniere: 'x',
      j11_charniere: 'x',
    };
    expect(
      nextNarrativeEvent(input({ currentDay: 15, narrativeFlags: flags })),
    ).toEqual({ kind: 'charniere', day: 14, flag: 'j14_charniere' });
    expect(
      nextNarrativeEvent(
        input({ currentDay: 15, narrativeFlags: { ...flags, j14_charniere: 'x' } }),
      ),
    ).toEqual({ kind: 's0_1_screen' });
  });

  test('hors phase_0 : pas de rattrapage (périmètre limité à la Phase 0)', () => {
    expect(
      nextNarrativeEvent(
        input({ currentDay: 20, currentPhase: 'phase_1', narrativeFlags: { welcome_video: 'x' } }),
      ),
    ).toBeNull();
  });
});
