/**
 * Setup après framework de test (setupFilesAfterEnv) — config testing-library.
 *
 * `defaultIncludeHiddenElements: true` : nos modales/écrans animent leur
 * opacité via reanimated ; sous Jest l'animation d'entrée ne se joue pas et
 * le contenu resterait « caché » (opacity 0) pour les queries par défaut.
 * On teste la présence et le câblage des éléments, pas l'état d'animation.
 * (RN Modal démonte son contenu quand visible=false — les tests de
 * non-affichage restent valides.)
 */
import { configure } from '@testing-library/react-native';

configure({ defaultIncludeHiddenElements: true });
