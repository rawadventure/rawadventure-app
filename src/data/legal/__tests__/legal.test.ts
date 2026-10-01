/**
 * Tests des textes légaux embarqués (IA-74 / IA-75 + mentions légales) :
 * conversion HTML du site → blocs (scripts/sync-legal.js) et intégrité des
 * données générées.
 */

import { LEGAL_DOCS, type LegalBlock, type LegalDocId, type LegalSpan } from '../index';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parseLegalHtml, parseInline } = require('../../../../scripts/sync-legal.js');

const page = (main: string) =>
  `<html><body><header>x</header><main class="content">${main}</main><footer><a href="/">x</a></footer></body></html>`;

describe('sync-legal — parseInline', () => {
  test('gras, italique, entités et espaces HTML', () => {
    expect(parseInline('Le <strong>droit\n  français</strong> &amp; <em>co</em>.')).toEqual([
      { text: 'Le ' },
      { text: 'droit français', bold: true },
      { text: ' & ' },
      { text: 'co', italic: true },
      { text: '.' },
    ]);
  });

  test('liens : document interne (ancre ignorée), mailto, externe', () => {
    expect(
      parseInline(
        '<a href="/cgu/#article-6">CGU</a> <a href="mailto:a@b.c">a@b.c</a> <a href="https://www.cnil.fr">CNIL</a>',
      ),
    ).toEqual([
      { text: 'CGU', link: { kind: 'doc', doc: 'cgu' } },
      { text: ' ' },
      { text: 'a@b.c', link: { kind: 'mailto', href: 'mailto:a@b.c' } },
      { text: ' ' },
      { text: 'CNIL', link: { kind: 'external', href: 'https://www.cnil.fr' } },
    ]);
  });

  test('balise inattendue → erreur (jamais de texte perdu en silence)', () => {
    expect(() => parseInline('a <span>b</span>')).toThrow(/inattendue/);
  });
});

describe('sync-legal — parseLegalHtml', () => {
  test('titre, sous-titre et blocs dans l ordre', () => {
    const doc = parseLegalHtml(
      page(`
        <h1>Mentions légales</h1>
        <p class="subtitle">Version V1.0</p>
        <p>Intro.</p>
        <hr />
        <h2 id="a">1. Éditeur</h2>
        <h3 id="b">1.1 Détail</h3>
        <ul><li><strong>Email</strong> : x</li><li>y</li></ul>
        <table><thead><tr><th>Formule</th><th>Prix</th></tr></thead>
        <tbody><tr><td>Mensuel</td><td>49 €</td></tr></tbody></table>
      `),
    );
    expect(doc.title).toBe('Mentions légales');
    expect(doc.subtitle).toBe('Version V1.0');
    expect(doc.blocks).toEqual([
      { type: 'p', spans: [{ text: 'Intro.' }] },
      { type: 'hr' },
      { type: 'h2', text: '1. Éditeur' },
      { type: 'h3', text: '1.1 Détail' },
      {
        type: 'ul',
        items: [[{ text: 'Email', bold: true }, { text: ' : x' }], [{ text: 'y' }]],
      },
      {
        type: 'table',
        headers: ['Formule', 'Prix'],
        rows: [[[{ text: 'Mensuel' }], [{ text: '49 €' }]]],
      },
    ]);
  });

  test('bloc inconnu → erreur', () => {
    expect(() => parseLegalHtml(page('<h1>T</h1><div>x</div>'))).toThrow(/hors bloc/);
  });
});

describe('LEGAL_DOCS — intégrité des données générées', () => {
  const ids = Object.keys(LEGAL_DOCS) as LegalDocId[];

  const spansOf = (b: LegalBlock): LegalSpan[] => {
    if (b.type === 'p') return b.spans;
    if (b.type === 'ul') return b.items.flat();
    if (b.type === 'table') return b.rows.flat(2);
    return [];
  };

  test('les 3 documents existent, avec titre, version et contenu', () => {
    expect(ids.sort()).toEqual(['cgu', 'mentions-legales', 'politique-confidentialite']);
    for (const id of ids) {
      const doc = LEGAL_DOCS[id];
      expect(doc.id).toBe(id);
      expect(doc.title.length).toBeGreaterThan(5);
      expect(doc.subtitle).toMatch(/Version/);
      expect(doc.blocks.length).toBeGreaterThan(30);
      expect(doc.sourceUrl).toBe(`https://rawadventure.world/${id}/`);
    }
  });

  test('aucun reste de HTML dans les textes', () => {
    for (const id of ids) {
      for (const b of LEGAL_DOCS[id].blocks) {
        const texts =
          b.type === 'h2' || b.type === 'h3'
            ? [b.text]
            : b.type === 'table'
              ? [...b.headers, ...spansOf(b).map((s) => s.text)]
              : spansOf(b).map((s) => s.text);
        for (const t of texts) expect(t).not.toMatch(/<\/?[a-z][^>]*>|&[a-z]+;/);
      }
    }
  });

  test('tout lien interne pointe vers un document embarqué', () => {
    for (const id of ids) {
      for (const b of LEGAL_DOCS[id].blocks) {
        for (const s of spansOf(b)) {
          if (s.link?.kind === 'doc') expect(ids).toContain(s.link.doc);
        }
      }
    }
  });
});
