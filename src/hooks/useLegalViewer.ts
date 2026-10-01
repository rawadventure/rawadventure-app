/**
 * useLegalViewer — ouverture des textes légaux (IA-74 CGU, IA-75 politique
 * de confidentialité, mentions légales) depuis n'importe quel écran.
 *
 *  - Web / PWA : le texte s'affiche DANS l'app (LegalScreen). Un lien vers
 *    rawadventure.world faisait sortir de la PWA sans retour possible
 *    (retours testeurs 30 sept 2026).
 *  - iOS / Android natifs : navigateur intégré sur la page du site (toujours
 *    à jour, bouton de fermeture natif). Les CGU contiennent la grille
 *    tarifaire : on ne l'embarque pas dans le binaire natif (pattern Reader
 *    App — l'app n'affiche aucun prix, D42).
 *
 * Usage : `const legal = useLegalViewer()` → `legal.openLegal('cgu')`, et
 * rendre `<LegalScreen doc={legal.legalDoc} onClose={legal.closeLegal} />`.
 */

import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { LEGAL_DOCS, type LegalDocId } from '../data/legal';
import { openExternal } from '../lib/openExternal';

export function useLegalViewer() {
  const [legalDoc, setLegalDoc] = useState<LegalDocId | null>(null);

  const openLegal = useCallback((id: LegalDocId) => {
    if (Platform.OS === 'web') {
      setLegalDoc(id);
      return;
    }
    openExternal(LEGAL_DOCS[id].sourceUrl).catch(() => {});
  }, []);

  const closeLegal = useCallback(() => setLegalDoc(null), []);

  return { legalDoc, openLegal, closeLegal };
}
