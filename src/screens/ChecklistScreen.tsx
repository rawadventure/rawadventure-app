import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors, spacing, radius } from '../theme';
import { ChecklistDay, DailyActivity } from '../data/days';
import { useProgress } from '../hooks/ProgressContext';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Day'>;
  route: RouteProp<RootStackParamList, 'Day'>;
  day: ChecklistDay;
};

type ActivityStatus = 'pending' | 'done' | 'skipped';

export default function ChecklistScreen({ navigation, day }: Props) {
  const { completeDay, isDayCompleted } = useProgress();
  const alreadyDone = isDayCompleted(day.id);

  const [statuses, setStatuses] = useState<Record<string, ActivityStatus>>(
    Object.fromEntries(day.activities.map(a => [a.id, 'pending']))
  );
  const [infoActivity, setInfoActivity] = useState<DailyActivity | null>(null);
  const [showCompletion, setShowCompletion]   = useState(false);

  const doneCount    = Object.values(statuses).filter(s => s === 'done').length;
  const skippedCount = Object.values(statuses).filter(s => s === 'skipped').length;
  const totalCount   = day.activities.length;
  const allAnswered  = doneCount + skippedCount === totalCount;

  const setStatus = (id: string, status: ActivityStatus) => {
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const handleValidate = async () => {
    await completeDay(day.id, false);
    setShowCompletion(true);
  };

  const handleContinue = () => {
    setShowCompletion(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{doneCount}/{totalCount}</Text>
        </View>
      </View>

      {/* Titre du jour */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>{day.welcomeTitle}</Text>
        <Text style={styles.daySubtitle}>{day.welcomeSubtitle}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {day.activities.map((activity) => {
            const status = statuses[activity.id];
            const isDone    = status === 'done';
            const isSkipped = status === 'skipped';

            return (
              <View
                key={activity.id}
                style={[
                  styles.activityRow,
                  isDone    && styles.activityRowDone,
                  isSkipped && styles.activityRowSkipped,
                ]}
              >
                {/* Checkbox */}
                <TouchableOpacity
                  style={[styles.checkbox, isDone && styles.checkboxDone]}
                  onPress={() => setStatus(activity.id, isDone ? 'pending' : 'done')}
                  disabled={alreadyDone}
                >
                  {isDone && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                {/* Contenu */}
                <View style={styles.activityContent}>
                  <Text style={styles.activityEmoji}>{activity.emoji}</Text>
                  <View style={styles.activityText}>
                    <Text style={[styles.activityTitle, isSkipped && styles.textSkipped]}>
                      {activity.title}
                    </Text>
                    <Text style={[styles.activitySubtitle, isSkipped && styles.textSkipped]}>
                      {activity.subtitle}
                    </Text>
                  </View>
                </View>

                {/* Actions droite */}
                <View style={styles.activityActions}>
                  {/* Bouton info */}
                  <TouchableOpacity
                    style={styles.infoBtn}
                    onPress={() => setInfoActivity(activity)}
                  >
                    <Text style={styles.infoBtnText}>ℹ</Text>
                  </TouchableOpacity>

                  {/* Bouton skip — visible si journée non complétée */}
                  {!alreadyDone && (
                    <TouchableOpacity
                      style={[styles.skipBtn, isSkipped && styles.skipBtnActive]}
                      onPress={() => setStatus(activity.id, isSkipped ? 'pending' : 'skipped')}
                    >
                      <Text style={[styles.skipBtnText, isSkipped && styles.skipBtnTextActive]}>
                        {isSkipped ? 'skippé' : 'skip'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Bouton de validation */}
        {!alreadyDone && (
          <View style={styles.validateSection}>
            {allAnswered ? (
              // Toutes les tâches cochées → bouton principal
              <TouchableOpacity style={styles.primaryBtn} onPress={handleValidate}>
                <Text style={styles.primaryBtnText}>
                  Valider ma journée — {doneCount}/{totalCount} ✓
                </Text>
              </TouchableOpacity>
            ) : (
              // Pas tout coché → bouton secondaire + hint
              <>
                <View style={styles.pendingHint}>
                  <Text style={styles.pendingHintText}>
                    Coche ou skippe chaque activité pour valider ta journée
                  </Text>
                </View>
                <TouchableOpacity style={styles.secondaryBtn} onPress={handleValidate}>
                  <Text style={styles.secondaryBtnText}>
                    J'ai fait ma séance aujourd'hui →
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {alreadyDone && (
          <View style={styles.alreadyDoneBox}>
            <Text style={styles.alreadyDoneText}>✓ Journée validée</Text>
          </View>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Modal ℹ️ — Détails de l'activité */}
      <Modal visible={!!infoActivity} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {infoActivity && (
              <>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalEmoji}>{infoActivity.emoji}</Text>
                  <Text style={styles.modalTitle}>{infoActivity.title}</Text>
                </View>

                {/* Pourquoi */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>Pourquoi ?</Text>
                  <Text style={styles.modalSectionText}>{infoActivity.why}</Text>
                </View>

                {/* Comment */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionLabel}>Comment ?</Text>
                  {infoActivity.how.map((step, i) => (
                    <View key={i} style={styles.modalStep}>
                      <Text style={styles.modalStepNum}>{i + 1}</Text>
                      <Text style={styles.modalStepText}>{step}</Text>
                    </View>
                  ))}
                </View>

                {/* Tip */}
                {infoActivity.tip && (
                  <View style={styles.tipBox}>
                    <Text style={styles.tipText}>💡 {infoActivity.tip}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => setInfoActivity(null)}
                >
                  <Text style={styles.primaryBtnText}>J'ai compris</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal félicitations */}
      <Modal visible={showCompletion} transparent animationType="fade">
        <View style={styles.completionOverlay}>
          <View style={styles.completionCard}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>Jour {day.id} validé !</Text>
            <Text style={styles.completionScore}>{doneCount} activité{doneCount > 1 ? 's' : ''} sur {totalCount}</Text>
            <Text style={styles.completionSub}>
              {day.id < 14
                ? `Le Jour ${day.id + 1} est maintenant débloqué.`
                : 'Tu as terminé les 14 jours. 🏆'}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleContinue}>
              <Text style={styles.primaryBtnText}>Continuer →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backBtn:  { padding: spacing.sm },
  backText: { fontSize: 17, color: colors.white, fontWeight: '500' },
  scoreBox: {
    backgroundColor: colors.green + '22',
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.green + '55',
  },
  scoreText: { fontSize: 15, fontWeight: '700', color: colors.green },

  dayHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: 6,
  },
  dayTitle:    { fontSize: 22, fontWeight: '700', color: colors.white },
  daySubtitle: { fontSize: 14, color: colors.gray, lineHeight: 20 },

  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 72,
  },
  activityRowDone: {
    backgroundColor: colors.greenDark + '18',
    borderColor: colors.green + '55',
  },
  activityRowSkipped: {
    opacity: 0.45,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  checkmark: { fontSize: 15, color: colors.white, fontWeight: '700' },

  activityContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  activityEmoji:    { fontSize: 24, width: 32 },
  activityText:     { flex: 1, gap: 2 },
  activityTitle:    { fontSize: 15, fontWeight: '600', color: colors.white },
  activitySubtitle: { fontSize: 13, color: colors.gray, lineHeight: 18 },
  textSkipped:      { textDecorationLine: 'line-through', color: colors.gray },

  activityActions: {
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
  infoBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.green + '22',
    borderWidth: 1,
    borderColor: colors.green + '55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBtnText: { fontSize: 14, color: colors.green, fontWeight: '700' },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.gray + '88',
    backgroundColor: colors.surface,
  },
  skipBtnActive: {
    borderColor: colors.gray,
    backgroundColor: colors.gray + '33',
  },
  skipBtnText:       { fontSize: 12, fontWeight: '600', color: colors.gray },
  skipBtnTextActive: { fontSize: 12, fontWeight: '600', color: colors.grayLight },

  actionBtns: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  actionBtnDone:       { borderColor: colors.green, backgroundColor: 'transparent' },
  actionBtnDoneActive: { backgroundColor: colors.green, borderColor: colors.green },
  actionBtnSkip:       { borderColor: colors.border, backgroundColor: 'transparent' },
  actionBtnSkipActive: { backgroundColor: colors.border, borderColor: colors.border },
  actionBtnText:           { fontSize: 16, fontWeight: '700', color: colors.gray },
  actionBtnTextActive:     { color: colors.white },
  actionBtnSkipTextActive: { color: colors.white },

  validateSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  primaryBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
  pendingHint: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pendingHintText: { fontSize: 14, color: colors.gray, textAlign: 'center', lineHeight: 20 },
  secondaryBtn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green + '66',
    marginTop: spacing.sm,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: colors.green },

  alreadyDoneBox: {
    margin: spacing.lg,
    backgroundColor: colors.green + '18',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green + '44',
  },
  alreadyDoneText: { fontSize: 17, fontWeight: '600', color: colors.green },

  // Modal ℹ️
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: -spacing.sm,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modalEmoji: { fontSize: 32 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: colors.white, flex: 1 },

  modalSection: { gap: spacing.sm },
  modalSectionLabel: { fontSize: 13, fontWeight: '700', color: colors.green, textTransform: 'uppercase', letterSpacing: 1 },
  modalSectionText:  { fontSize: 15, color: colors.grayLight, lineHeight: 22 },
  modalStep: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  modalStepNum: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.green,
    width: 20,
    paddingTop: 2,
  },
  modalStepText: { flex: 1, fontSize: 15, color: colors.grayLight, lineHeight: 22 },

  tipBox: {
    backgroundColor: colors.greenDark + '22',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.green + '44',
  },
  tipText: { fontSize: 14, color: colors.grayLight, lineHeight: 20, fontStyle: 'italic' },

  // Modal félicitations
  completionOverlay: {
    flex: 1,
    backgroundColor: '#000000DD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  completionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    alignSelf: 'stretch',
  },
  completionEmoji: { fontSize: 64 },
  completionTitle: { fontSize: 26, fontWeight: '700', color: colors.white },
  completionScore: { fontSize: 32, fontWeight: '900', color: colors.green },
  completionSub:   { fontSize: 16, color: colors.gray, textAlign: 'center' },
});
