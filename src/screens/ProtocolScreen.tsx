import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors, spacing, radius } from '../theme';
import { ProtocolDay } from '../data/days';
import { useProgress } from '../hooks/ProgressContext';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Day'>;
  route: RouteProp<RootStackParamList, 'Day'>;
  day: ProtocolDay;
};

export default function ProtocolScreen({ navigation, day }: Props) {
  const { completeDay, isDayCompleted } = useProgress();
  const [showMinMode,  setShowMinMode]  = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const alreadyDone = isDayCompleted(day.id);

  const handleComplete = async (isMinimum = false) => {
    await completeDay(day.id, isMinimum);
    setShowMinMode(false);
    setShowComplete(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoIcon}>▶</Text>
          <Text style={styles.videoPlaceholderText}>Vidéo bientôt disponible</Text>
          <Text style={styles.videoTitle}>{day.videoTitle}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.tags}>
            <View style={styles.tag}><Text style={styles.tagText}>Jour {day.id}</Text></View>
            <View style={styles.tagOutline}><Text style={styles.tagOutlineText}>{day.emoji} {day.shortTitle}</Text></View>
          </View>

          <Text style={styles.h1}>{day.videoTitle}</Text>

          <View style={styles.intentionCard}>
            <Text style={styles.intentionLabel}>💡 Intention du jour</Text>
            <Text style={styles.intentionText}>{day.intention}</Text>
          </View>

          <Text style={styles.sectionTitle}>Protocole du jour</Text>
          <Text style={styles.protocolDesc}>{day.protocolDescription}</Text>
          <View style={styles.stepsList}>
            {day.protocolSteps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{i + 1}</Text></View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {alreadyDone ? (
            <View style={styles.doneRow}><Text style={styles.doneText}>✓ Jour complété</Text></View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => handleComplete(false)}>
                <Text style={styles.primaryBtnText}>Protocole terminé — Valider le jour</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowMinMode(true)}>
                <Text style={styles.secondaryBtnText}>Mode Minimum ⚡️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showMinMode} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalEmoji}>⚡️</Text>
            <Text style={styles.modalTitle}>Mode Minimum</Text>
            <Text style={styles.modalSubtitle}>Aujourd'hui, une seule action suffit :</Text>
            <View style={styles.minModeBox}><Text style={styles.minModeText}>{day.minimumMode}</Text></View>
            <Text style={styles.minModeHint}>Pas de pression. L'important c'est de ne pas décrocher.</Text>
            <TouchableOpacity style={[styles.primaryBtn, { marginTop: spacing.lg }]} onPress={() => handleComplete(true)}>
              <Text style={styles.primaryBtnText}>C'est fait ✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, { marginTop: spacing.sm }]} onPress={() => setShowMinMode(false)}>
              <Text style={styles.secondaryBtnText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showComplete} transparent animationType="fade">
        <View style={styles.completionOverlay}>
          <View style={styles.completionCard}>
            <Text style={styles.completionEmoji}>🎉</Text>
            <Text style={styles.completionTitle}>Jour {day.id} complété !</Text>
            <Text style={styles.completionSub}>
              {day.id < 14 ? `Le Jour ${day.id + 1} est maintenant débloqué.` : 'Tu as terminé les 14 jours. 🏆'}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => { setShowComplete(false); navigation.goBack(); }}>
              <Text style={styles.primaryBtnText}>Continuer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  navBar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  backBtn: { padding: spacing.sm },
  backText: { fontSize: 17, color: colors.white, fontWeight: '500' },
  videoPlaceholder: { height: 240, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  videoIcon: { fontSize: 52, color: colors.green + '99' },
  videoPlaceholderText: { fontSize: 15, color: colors.gray },
  videoTitle: { fontSize: 13, color: colors.gray + '99', textAlign: 'center', paddingHorizontal: spacing.xl },
  content: { padding: spacing.lg, gap: spacing.lg },
  tags: { flexDirection: 'row', gap: spacing.sm },
  tag: { backgroundColor: colors.green + '22', borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.green + '55' },
  tagText: { fontSize: 12, fontWeight: '700', color: colors.green },
  tagOutline: { backgroundColor: colors.surface, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.border },
  tagOutlineText: { fontSize: 12, color: colors.gray },
  h1: { fontSize: 26, fontWeight: '700', color: colors.white, lineHeight: 34 },
  intentionCard: { backgroundColor: colors.greenDark + '22', borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.green + '44', gap: spacing.sm },
  intentionLabel: { fontSize: 13, fontWeight: '700', color: colors.green },
  intentionText: { fontSize: 15, color: colors.grayLight, lineHeight: 22 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  protocolDesc: { fontSize: 15, color: colors.grayLight, lineHeight: 22, marginTop: -spacing.sm },
  stepsList: { gap: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.green + '22', borderWidth: 1, borderColor: colors.green + '55', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 13, fontWeight: '700', color: colors.green },
  stepText: { flex: 1, fontSize: 15, color: colors.grayLight, lineHeight: 22, paddingTop: 4 },
  divider: { height: 1, backgroundColor: colors.border },
  actions: { gap: spacing.sm },
  primaryBtn: { backgroundColor: colors.green, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { fontSize: 17, fontWeight: '700', color: colors.white },
  secondaryBtn: { backgroundColor: colors.green + '18', borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.green + '55' },
  secondaryBtnText: { fontSize: 17, fontWeight: '600', color: colors.green },
  doneRow: { backgroundColor: colors.green + '18', borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.green + '44' },
  doneText: { fontSize: 17, fontWeight: '600', color: colors.green },
  modalOverlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md, alignItems: 'center' },
  modalEmoji: { fontSize: 52 },
  modalTitle: { fontSize: 26, fontWeight: '700', color: colors.white },
  modalSubtitle: { fontSize: 16, color: colors.gray },
  minModeBox: { backgroundColor: colors.greenDark + '33', borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.green + '55', alignSelf: 'stretch' },
  minModeText: { fontSize: 19, fontWeight: '600', color: colors.white, textAlign: 'center', lineHeight: 28 },
  minModeHint: { fontSize: 14, color: colors.gray, textAlign: 'center' },
  completionOverlay: { flex: 1, backgroundColor: '#000000DD', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  completionCard: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', gap: spacing.md, alignSelf: 'stretch' },
  completionEmoji: { fontSize: 64 },
  completionTitle: { fontSize: 28, fontWeight: '700', color: colors.white },
  completionSub: { fontSize: 17, color: colors.gray, textAlign: 'center' },
});
