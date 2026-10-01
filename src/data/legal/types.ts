/**
 * Types des textes légaux affichés dans l'app (IA-74 / IA-75 + mentions
 * légales). Les données sont générées depuis le site par
 * scripts/sync-legal.js — voir src/data/legal/index.ts.
 */

export type LegalDocId = 'cgu' | 'politique-confidentialite' | 'mentions-legales';

export type LegalLink =
  | { kind: 'doc'; doc: LegalDocId }
  | { kind: 'mailto'; href: string }
  | { kind: 'external'; href: string };

export type LegalSpan = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  link?: LegalLink;
};

export type LegalBlock =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; spans: LegalSpan[] }
  | { type: 'ul'; items: LegalSpan[][] }
  | { type: 'table'; headers: string[]; rows: LegalSpan[][][] }
  | { type: 'hr' };

export type LegalDoc = {
  id: LegalDocId;
  sourceUrl: string;
  title: string;
  subtitle: string | null;
  blocks: LegalBlock[];
};
