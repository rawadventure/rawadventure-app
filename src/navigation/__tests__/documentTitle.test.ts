/**
 * Régression (retours testeurs 1er oct 2026) : sur web, React Navigation
 * remplaçait le <title> par « undefined » dès qu'un écran sans `title`
 * prenait le focus. Or iOS propose le titre de la page comme nom de l'app à
 * l'installation PWA. Le titre doit rester « Raw Adventure » sur tout écran.
 */

import { APP_DOCUMENT_TITLE } from '../documentTitle';

describe('APP_DOCUMENT_TITLE', () => {
  test('titre fixe quel que soit l écran (options / route absentes ou sans title)', () => {
    expect(APP_DOCUMENT_TITLE.formatter(undefined, undefined)).toBe('Raw Adventure');
    expect(APP_DOCUMENT_TITLE.formatter({}, { name: 'Phase0Home' })).toBe('Raw Adventure');
    expect(APP_DOCUMENT_TITLE.formatter({ title: 'Autre' }, { name: 'X' })).toBe('Raw Adventure');
  });
});
