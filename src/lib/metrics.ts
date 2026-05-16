/**
 * metrics.ts — calcul pur des scores d'évaluation 12 questions.
 *
 * Réf Métriques V1.5 §2.3 + Feature Spec S1 V1.0 §2.3 + D40.
 *
 * Toutes fonctions pures et déterministes. Pas de side-effects, pas de
 * lecture d'horloge interne. Testables unitairement.
 */

export type RawResponse = {
  /** Identifiant question (1-12). */
  questionId: number;
  /** Réponse brute de l'utilisateur sur l'échelle 1-5. */
  value: 1 | 2 | 3 | 4 | 5;
  /** Question formulée en sens inverse : score utilisé = 6 - value (Feature Spec S1 §2.2). */
  reversed: boolean;
};

export type DiagnosticLevel = 1 | 2 | 3 | 4 | 5;
export type EngagementLevel = 'essentiel' | 'progression' | 'immersion';

// ─── Score brut /60 ───────────────────────────────────────────────────────────

/**
 * Calcule le score brut sur 60 à partir des 12 réponses. Applique l'inversion
 * sémantique pour les questions marquées `reversed: true` (Q6/Q7/Q8 en S1).
 * Score brut résultant : plage 12-60 (12 réponses × min 1, max 5).
 */
export function computeRawScore(responses: RawResponse[]): number {
  if (responses.length !== 12) {
    throw new Error(`computeRawScore: attendu 12 réponses, reçu ${responses.length}`);
  }
  return responses.reduce((sum, r) => {
    const used = r.reversed ? 6 - r.value : r.value;
    return sum + used;
  }, 0);
}

// ─── Score normalisé 0-100 ────────────────────────────────────────────────────

/**
 * Normalise le score brut /60 sur l'échelle 0-100 selon la formule
 * Métriques V1.5 §2.3 : `(brut - 12) × (100 / 48)`.
 *  - brut 12 → 0
 *  - brut 60 → 100
 *  - linéaire entre les deux
 *
 * Renvoie un nombre arrondi à 2 décimales pour cohérence avec
 * `pillar_evaluations.normalized_score numeric(5,2)`.
 */
export function normalizeScore(rawScore: number): number {
  if (rawScore < 12 || rawScore > 60) {
    throw new Error(`normalizeScore: rawScore hors plage [12,60], reçu ${rawScore}`);
  }
  const normalized = (rawScore - 12) * (100 / 48);
  return Math.round(normalized * 100) / 100;
}

// ─── Diagnostic 5 niveaux ─────────────────────────────────────────────────────

/**
 * Mappe le score brut /60 vers un niveau de diagnostic 1-5 selon les seuils
 * symétriques (quintiles équilibrés) — Feature Spec S1 V1.0 §2.3 :
 *
 *   12-21 → niveau 1 (Coûteuse en S1)
 *   22-30 → niveau 2 (Instable en S1)
 *   31-40 → niveau 3 (Adaptation en S1)
 *   41-50 → niveau 4 (Fonctionnelle en S1)
 *   51-60 → niveau 5 (Régulatrice en S1)
 *
 * Convention transverse à priori applicable aux 8 piliers Type A.
 */
export function diagnosticLevel(rawScore: number): DiagnosticLevel {
  if (rawScore < 12 || rawScore > 60) {
    throw new Error(`diagnosticLevel: rawScore hors plage [12,60], reçu ${rawScore}`);
  }
  if (rawScore <= 21) return 1;
  if (rawScore <= 30) return 2;
  if (rawScore <= 40) return 3;
  if (rawScore <= 50) return 4;
  return 5;
}

// ─── Mapping diagnostic → engagement recommandé (D40) ─────────────────────────

/**
 * Règle D40 (Synthèse V8) : mappe le niveau de diagnostic à un niveau
 * d'engagement de départ recommandé. **Plafond Immersion** : personne ne
 * démarre automatiquement en Immersion en Phase 1. Le passage à Immersion
 * est un acte délibéré via IA-41 modale niveau.
 *
 *   1 (Coûteuse) → Essentiel
 *   2 (Instable) → Essentiel
 *   3 (Adaptation) → Essentiel
 *   4 (Fonctionnelle) → Progression
 *   5 (Régulatrice) → Progression
 *
 * **Exception Type B (D41)** : la règle D40 ne s'applique PAS aux piliers
 * Type B (S5 Repos, S7 Mindset). Pour ces piliers, le caller ne doit pas
 * appeler cette fonction — l'évaluation 12 questions alimente la toile et
 * affiche un diagnostic, mais aucun mapping engagement n'a lieu.
 */
export function engagementFromDiagnostic(level: DiagnosticLevel): EngagementLevel {
  if (level <= 3) return 'essentiel';
  return 'progression';
}

// ─── Helper : agrégation complète depuis les réponses ─────────────────────────

export type EvaluationResult = {
  rawScore: number;
  normalizedScore: number;
  diagnostic: DiagnosticLevel;
  recommendedEngagement: EngagementLevel;
};

/**
 * Agrège les 4 calculs (raw, normalized, diagnostic, engagement) en un seul
 * appel — utilisé en sortie de IA-40 avant écriture `pillar_evaluations`.
 *
 * Note Type B : pour S5 et S7 (D41), ignorer `recommendedEngagement` côté
 * caller — la modale IA-41 ne propose pas de niveau d'engagement modulé.
 */
export function aggregateEvaluation(responses: RawResponse[]): EvaluationResult {
  const rawScore = computeRawScore(responses);
  const normalizedScore = normalizeScore(rawScore);
  const diagnostic = diagnosticLevel(rawScore);
  const recommendedEngagement = engagementFromDiagnostic(diagnostic);
  return { rawScore, normalizedScore, diagnostic, recommendedEngagement };
}
