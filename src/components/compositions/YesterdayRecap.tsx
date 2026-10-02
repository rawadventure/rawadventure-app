/**
 * YesterdayRecap — récapitulatif de la veille sur l'accueil Phase 0 (IA-11).
 *
 * D45 (2 octobre 2026, retour testeuse « peut-on revoir les cases cochées de
 * la veille ? ») : une ligne discrète « Hier : Mes actions » qui ouvre le
 * détail des 7 actions, en lecture seule (D27 — une journée passée ne se
 * modifie pas). Un seul jour en arrière, données lues sur l'appareil
 * (src/lib/dailyChecks) ; rien n'est agrégé ni synchronisé (D34).
 *
 * Sans coche la veille, le composant ne rend rien.
 */

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { brandColors, interTextStyle, neutralColors, radiusV1, space } from '../../theme';
import { addDays, type LocalDate } from '../../lib/calendar';
import { countChecked, loadDailyChecks, type DailyChecksMap } from '../../lib/dailyChecks';
import { PHASE_0_ACTIONS } from '../../data/phase0-actions';
import { yesterdayRecapCopy } from '../../data/global-copy';

export type YesterdayRecapProps = {
  /** Date locale du jour — la veille en est déduite. */
  today: LocalDate;
  /** `true` si la veille figure dans l'historique comme journée validée. */
  yesterdayValidated: boolean;
};

export function YesterdayRecap({ today, yesterdayValidated }: YesterdayRecapProps) {
  const [checks, setChecks] = useState<DailyChecksMap | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setChecks(null);
    loadDailyChecks(addDays(today, -1))
      .then((map) => {
        if (!cancelled) setChecks(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [today]);

  const count = checks ? countChecked(checks) : 0;
  if (!checks || count === 0) return null;
  const copy = yesterdayRecapCopy(count);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        style={styles.lineHit}
      >
        <Text style={styles.line}>{copy.line}</Text>
      </Pressable>

      <Modal visible={open} onClose={() => setOpen(false)} variant="standard">
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.summary}>{copy.summary}</Text>
        {yesterdayValidated && <Text style={styles.validated}>{copy.validated}</Text>}

        <View style={styles.list}>
          {PHASE_0_ACTIONS.map((action) => {
            const done = Boolean(checks[action.id]);
            return (
              <View
                key={action.id}
                style={styles.row}
                accessible
                accessibilityLabel={`${action.title} : ${done ? copy.done : copy.notDone}`}
              >
                <View style={[styles.box, done && styles.boxDone]}>
                  {done && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </View>
                <Text style={[styles.rowText, !done && styles.rowTextMuted]}>
                  {action.title}
                </Text>
              </View>
            );
          })}
        </View>

        <Button label={copy.close} onPress={() => setOpen(false)} fullWidth />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  lineHit: { alignSelf: 'center', paddingVertical: space[2], paddingHorizontal: space[3] },
  line: {
    ...interTextStyle('body'),
    color: neutralColors.textSecondary,
    textDecorationLine: 'underline',
  },
  title: { ...interTextStyle('h2'), color: brandColors.deep },
  summary: {
    ...interTextStyle('bodyLarge'),
    color: neutralColors.textSecondary,
    marginTop: space[1],
  },
  validated: {
    ...interTextStyle('body'),
    color: brandColors.deep,
    marginTop: space[2],
  },
  list: { gap: space[3], marginVertical: space[5] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  box: {
    width: 22,
    height: 22,
    borderRadius: radiusV1.sm,
    borderWidth: 1.5,
    borderColor: neutralColors.borderVisible,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: { backgroundColor: brandColors.alive, borderColor: brandColors.alive },
  rowText: { ...interTextStyle('body'), color: brandColors.deep, flex: 1 },
  rowTextMuted: { color: neutralColors.textMuted },
});
