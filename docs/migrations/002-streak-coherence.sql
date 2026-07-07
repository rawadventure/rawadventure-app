-- ============================================================================
-- Raw Adventure App — Migration V1 (002) — Cohérence calendaire du streak
-- ============================================================================
--
-- À exécuter UNE FOIS dans Supabase Dashboard → SQL Editor → Run.
-- Audit mécanique narrative du 6 juillet 2026, chantier B1.
--
-- Contenu :
--   1. Nouveau statut `missed_with_joker` accepté par streak_history.
--      Jour manqué couvert par le joker hebdomadaire (Cas C variante 1,
--      Feature Spec §2.5) : streak conservé, mais la journée ne compte PAS
--      comme jour de progression (contrairement à valid_with_joker, qui
--      correspond à une validation manuelle sous le seuil — Cas B).
--   2. Phase `post_s8` acceptée par streak_history. Le mode consolidation
--      libre (SessionScreen isLibreMode) écrit déjà phase='post_s8' — la
--      contrainte actuelle rejetterait ces validations.
--
-- Les deux contraintes ont été créées en colonne dans 001-v1-tables.sql,
-- donc nommées automatiquement par PostgreSQL.
-- ============================================================================

ALTER TABLE streak_history
  DROP CONSTRAINT IF EXISTS streak_history_validation_status_check;

ALTER TABLE streak_history
  ADD CONSTRAINT streak_history_validation_status_check
  CHECK (validation_status IN (
    'valid_above_threshold',
    'valid_with_joker',
    'missed_with_joker',
    'broken_streak',
    'not_yet_processed'
  ));

ALTER TABLE streak_history
  DROP CONSTRAINT IF EXISTS streak_history_phase_check;

ALTER TABLE streak_history
  ADD CONSTRAINT streak_history_phase_check
  CHECK (phase IN ('phase_0', 'phase_1', 'post_s8'));
