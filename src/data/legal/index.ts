/**
 * Textes légaux embarqués (IA-74 CGU, IA-75 politique de confidentialité,
 * mentions légales).
 *
 * Source de vérité : rawadventure.world. Les fichiers *.generated.ts sont
 * produits par `node scripts/sync-legal.js` — à relancer après toute
 * modification des pages du site, sinon l'app affiche une version périmée.
 */

import { cgu } from './cgu.generated';
import { politiqueConfidentialite } from './politique-confidentialite.generated';
import { mentionsLegales } from './mentions-legales.generated';
import type { LegalDoc, LegalDocId } from './types';

export type { LegalBlock, LegalDoc, LegalDocId, LegalLink, LegalSpan } from './types';

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = {
  cgu,
  'politique-confidentialite': politiqueConfidentialite,
  'mentions-legales': mentionsLegales,
};
