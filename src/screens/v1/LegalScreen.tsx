/**
 * LegalScreen — IA-74 (Conditions générales), IA-75 (Politique de
 * confidentialité) et Mentions légales.
 *
 * Couche plein écran superposée à l'écran appelant (Profil, création de
 * compte, paywall) : « Fermer » ramène exactement là où l'utilisateur était.
 * Les liens entre documents naviguent à l'intérieur de la couche ; seuls les
 * mailto sortent de l'app. Les liens web externes sont affichés en clair,
 * non cliquables (en PWA, un lien externe fait quitter l'app).
 *
 * Textes : src/data/legal (générés depuis rawadventure.world par
 * scripts/sync-legal.js). Ouverture : hook useLegalViewer.
 */

import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Modal } from '../../components/primitives/Modal';
import { Button } from '../../components/primitives/Button';
import {
  brandColors,
  getInterFamily,
  interTextStyle,
  neutralColors,
  radiusV1,
  space,
} from '../../theme';
import {
  LEGAL_DOCS,
  type LegalBlock,
  type LegalDocId,
  type LegalSpan,
} from '../../data/legal';

type Props = {
  /** Document à afficher ; `null` = couche fermée. */
  doc: LegalDocId | null;
  onClose: () => void;
};

export default function LegalScreen({ doc, onClose }: Props) {
  // Document courant : suit la prop, puis les liens internes entre documents.
  const [current, setCurrent] = useState<LegalDocId | null>(doc);
  useEffect(() => setCurrent(doc), [doc]);

  const shown = doc != null && current != null ? LEGAL_DOCS[current] : null;

  const renderSpans = (spans: LegalSpan[]) =>
    spans.map((span, i) => {
      const style = [span.bold && styles.bold, span.italic && styles.italic];
      const { link } = span;
      if (link?.kind === 'doc') {
        return (
          <Text
            key={i}
            style={[style, styles.link]}
            accessibilityRole="link"
            onPress={() => setCurrent(link.doc)}
          >
            {span.text}
          </Text>
        );
      }
      if (link?.kind === 'mailto') {
        return (
          <Text
            key={i}
            style={[style, styles.link]}
            accessibilityRole="link"
            onPress={() => Linking.openURL(link.href).catch(() => {})}
          >
            {span.text}
          </Text>
        );
      }
      if (link?.kind === 'external') {
        const shownUrl = link.href.replace(/^https?:\/\//, '');
        const alreadyVisible = span.text.includes(shownUrl);
        return (
          <Text key={i} style={style}>
            {alreadyVisible ? span.text : `${span.text} (${shownUrl})`}
          </Text>
        );
      }
      return (
        <Text key={i} style={style}>
          {span.text}
        </Text>
      );
    });

  const renderBlock = (block: LegalBlock, i: number) => {
    switch (block.type) {
      case 'h2':
        return (
          <Text key={i} style={styles.h2} accessibilityRole="header">
            {block.text}
          </Text>
        );
      case 'h3':
        return (
          <Text key={i} style={styles.h3} accessibilityRole="header">
            {block.text}
          </Text>
        );
      case 'p':
        return (
          <Text key={i} style={styles.body}>
            {renderSpans(block.spans)}
          </Text>
        );
      case 'ul':
        return (
          <View key={i} style={styles.list}>
            {block.items.map((item, j) => (
              <View key={j} style={styles.listItem}>
                <Text style={styles.bullet}>·</Text>
                <Text style={[styles.body, styles.listText]}>{renderSpans(item)}</Text>
              </View>
            ))}
          </View>
        );
      case 'table':
        // Écran étroit : chaque ligne du tableau devient une fiche
        // « en-tête : valeur ».
        return (
          <View key={i} style={styles.table}>
            {block.rows.map((row, j) => (
              <View key={j} style={styles.tableRow}>
                {row.map((cell, k) => (
                  <View key={k} style={styles.tableCell}>
                    <Text style={styles.tableHeader}>{block.headers[k]}</Text>
                    <Text style={styles.body}>{renderSpans(cell)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      case 'hr':
        return <View key={i} style={styles.hr} />;
    }
  };

  return (
    <Modal
      visible={shown != null}
      onClose={onClose}
      variant="fullscreen"
      context="neutral"
      dismissable={false}
    >
      {shown && (
        <>
          <ScrollView key={shown.id} contentContainerStyle={styles.scroll}>
            <Text style={styles.title} accessibilityRole="header">
              {shown.title}
            </Text>
            {shown.subtitle && <Text style={styles.subtitle}>{shown.subtitle}</Text>}
            {shown.blocks.map(renderBlock)}
          </ScrollView>
          <View style={styles.footer}>
            <Button label="Fermer" onPress={onClose} fullWidth size="large" />
          </View>
        </>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space[5], gap: space[3] },
  title: { ...interTextStyle('h2'), color: brandColors.deep },
  subtitle: { ...interTextStyle('caption'), color: neutralColors.textSecondary },
  h2: { ...interTextStyle('h3'), color: brandColors.deep, marginTop: space[3] },
  h3: {
    ...interTextStyle('bodyLargeEmphasis'),
    color: brandColors.deep,
    marginTop: space[2],
  },
  body: { ...interTextStyle('body'), color: brandColors.deep },
  // Inter est chargée par poids (une famille par graisse) : fontWeight seul
  // ne suffit pas.
  bold: { fontFamily: getInterFamily('700') },
  italic: { fontStyle: 'italic' },
  link: { textDecorationLine: 'underline' },
  list: { gap: space[2] },
  listItem: { flexDirection: 'row', gap: space[2] },
  bullet: { ...interTextStyle('body'), color: brandColors.deep },
  listText: { flex: 1 },
  table: { gap: space[2] },
  tableRow: {
    borderWidth: 1,
    borderColor: neutralColors.borderVisible,
    borderRadius: radiusV1.md,
    padding: space[3],
    gap: space[2],
  },
  tableCell: { gap: space[1] },
  tableHeader: { ...interTextStyle('caption'), color: neutralColors.textSecondary },
  hr: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: neutralColors.borderVisible,
    marginVertical: space[2],
  },
  footer: { padding: space[5] },
});
