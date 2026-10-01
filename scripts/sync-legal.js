#!/usr/bin/env node
/* global __dirname */
/**
 * sync-legal.js — recopie les textes légaux du site dans l'app.
 *
 * Source de vérité : https://rawadventure.world/{cgu,politique-confidentialite,
 * mentions-legales}/. L'app affiche ces textes dans LegalScreen (IA-74 /
 * IA-75) pour que la PWA ne sorte plus de l'app (retours testeurs 30 sept
 * 2026). À relancer après toute modification des pages du site :
 *
 *   node scripts/sync-legal.js
 *
 * Génère src/data/legal/<doc>.generated.ts. Le HTML du site est produit
 * depuis du Markdown (structure régulière : h2, h3, p, ul, table, hr) — toute
 * balise inattendue fait échouer le script plutôt que de perdre du texte.
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://rawadventure.world';
const DOCS = {
  cgu: '/cgu/',
  'politique-confidentialite': '/politique-confidentialite/',
  'mentions-legales': '/mentions-legales/',
};

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, code) => {
    if (code[0] === '#') {
      const n = code[1] === 'x' || code[1] === 'X'
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);
      return String.fromCodePoint(n);
    }
    if (code in ENTITIES) return ENTITIES[code];
    throw new Error(`Entité HTML inconnue : ${whole}`);
  });
}

/** href du site → lien typé (document interne, mailto, externe). */
function parseLink(href) {
  if (href.startsWith('mailto:')) return { kind: 'mailto', href };
  for (const [doc, docPath] of Object.entries(DOCS)) {
    if (href === docPath || href.startsWith(`${docPath}#`)) return { kind: 'doc', doc };
  }
  if (/^https?:\/\//.test(href)) return { kind: 'external', href };
  throw new Error(`Lien non géré : ${href}`);
}

/** Contenu inline (texte + strong/em/a/br) → liste de segments. */
function parseInline(html) {
  const spans = [];
  let bold = false;
  let italic = false;
  let link = null;
  const push = (raw) => {
    const text = decodeEntities(raw.replace(/\s+/g, ' '));
    if (text === '') return;
    const span = { text };
    if (bold) span.bold = true;
    if (italic) span.italic = true;
    if (link) span.link = link;
    spans.push(span);
  };
  const re = /<(\/?)([a-z0-9]+)\b([^>]*)>/g;
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    push(html.slice(last, m.index));
    last = re.lastIndex;
    const [, closing, tag, attrs] = m;
    if (tag === 'strong') bold = !closing;
    else if (tag === 'em') italic = !closing;
    else if (tag === 'br') spans.push({ text: '\n' });
    else if (tag === 'a') {
      if (closing) link = null;
      else {
        const href = /href="([^"]*)"/.exec(attrs);
        if (!href) throw new Error(`<a> sans href : ${m[0]}`);
        link = parseLink(decodeEntities(href[1]));
      }
    } else throw new Error(`Balise inline inattendue : ${m[0]}`);
  }
  push(html.slice(last));
  if (spans.length > 0) {
    spans[0].text = spans[0].text.replace(/^ +/, '');
    const end = spans[spans.length - 1];
    end.text = end.text.replace(/ +$/, '');
  }
  return spans.filter((s) => s.text !== '');
}

const plain = (html) => parseInline(html).map((s) => s.text).join('');

function cells(rowHtml, tag) {
  const out = [];
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'g');
  let m;
  while ((m = re.exec(rowHtml))) out.push(m[1]);
  return out;
}

/** HTML d'une page légale du site → { title, subtitle, blocks }. */
function parseLegalHtml(html) {
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(html);
  if (!main) throw new Error('<main> introuvable');
  let body = main[1];

  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(body);
  if (!h1) throw new Error('<h1> introuvable');
  const subtitleMatch = /<p class="subtitle">([\s\S]*?)<\/p>/.exec(body);
  body = body.replace(h1[0], '');
  if (subtitleMatch) body = body.replace(subtitleMatch[0], '');

  const blocks = [];
  const re = /<hr\s*\/?>|<(h2|h3|p|ul|table)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let last = 0;
  let m;
  while ((m = re.exec(body))) {
    const between = body.slice(last, m.index);
    if (between.trim() !== '') {
      throw new Error(`Contenu hors bloc connu : ${between.trim().slice(0, 80)}`);
    }
    last = re.lastIndex;
    const [whole, tag, inner] = m;
    if (whole.startsWith('<hr')) blocks.push({ type: 'hr' });
    else if (tag === 'h2' || tag === 'h3') blocks.push({ type: tag, text: plain(inner) });
    else if (tag === 'p') blocks.push({ type: 'p', spans: parseInline(inner) });
    else if (tag === 'ul') {
      if (/<ul\b/.test(inner)) throw new Error('Liste imbriquée non gérée');
      blocks.push({ type: 'ul', items: cells(inner, 'li').map(parseInline) });
    } else if (tag === 'table') {
      const rows = cells(inner, 'tr');
      const headers = cells(rows[0], 'th').map(plain);
      if (headers.length === 0) throw new Error('Tableau sans en-têtes');
      blocks.push({
        type: 'table',
        headers,
        rows: rows.slice(1).map((r) => cells(r, 'td').map(parseInline)),
      });
    }
  }
  if (body.slice(last).trim() !== '') {
    throw new Error(`Contenu hors bloc connu : ${body.slice(last).trim().slice(0, 80)}`);
  }

  return {
    title: plain(h1[1]),
    subtitle: subtitleMatch ? plain(subtitleMatch[1]) : null,
    blocks,
  };
}

function renderModule(docId, sourceUrl, doc) {
  const constName = docId.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return `/**
 * FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Source : ${sourceUrl}
 * Régénérer après toute modification du site : node scripts/sync-legal.js
 */

import type { LegalDoc } from './types';

export const ${constName}: LegalDoc = ${JSON.stringify(
    { id: docId, sourceUrl, ...doc },
    null,
    2,
  )};
`;
}

async function main() {
  const outDir = path.join(__dirname, '..', 'src', 'data', 'legal');
  fs.mkdirSync(outDir, { recursive: true });
  for (const [docId, docPath] of Object.entries(DOCS)) {
    const url = `${SITE}${docPath}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    const doc = parseLegalHtml(await res.text());
    const file = path.join(outDir, `${docId}.generated.ts`);
    fs.writeFileSync(file, renderModule(docId, url, doc));
    console.log(`${docId} : ${doc.blocks.length} blocs → ${path.relative(process.cwd(), file)}`);
  }
}

module.exports = { parseLegalHtml, parseInline, parseLink };

if (require.main === module) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
