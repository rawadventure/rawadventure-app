import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme';
import { DAYS } from '../data/days';
import { useProgress } from '../hooks/ProgressContext';
import { Alert } from 'react-native';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};



export default function HomeScreen({ navigation }: Props) {
  const { streak, isDayCompleted, isDayUnlocked, resetAll, completeDay } = useProgress();

  const handleResetPress = () => {
    if (__DEV__) {
      Alert.alert(
        'Reset complet',
        'Remettre à zéro toutes les données ? (test uniquement)',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Oui, reset', style: 'destructive', onPress: resetAll },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>RAW ADVENTURE</Text>
            <Text style={styles.title}>Ton programme 14 jours</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onLongPress={handleResetPress} delayLongPress={1500} activeOpacity={1}>
              <Text style={styles.lightning}>⚡️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakRow}>
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>jours complétés</Text>
          </View>
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🎯</Text>
            <Text style={styles.streakNumber}>{14 - streak}</Text>
            <Text style={styles.streakLabel}>jours restants</Text>
          </View>
        </View>

        {/* Liste des 7 jours */}
        <View style={styles.daysList}>
          {DAYS.map(day => {
            const completed  = isDayCompleted(day.id);
            const unlocked   = isDayUnlocked(day.id);
            const isNext     = !completed && unlocked;
            const isProtocol = day.type === 'protocol';

            const emoji      = isProtocol ? day.emoji       : '📋';
            const shortTitle = isProtocol ? day.shortTitle  : day.welcomeTitle.split('—')[1]?.trim() ?? 'Checklist';
            const pillarTheme = isProtocol ? day.pillarTheme : day.welcomeSubtitle;

            return (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayCard,
                  isNext && styles.dayCardNext,
                  completed && styles.dayCardDone,
                ]}
                onPress={() => unlocked && navigation.navigate('Day', { dayId: day.id })}
                onLongPress={() => unlocked && !completed && completeDay(day.id)}
                delayLongPress={800}
                disabled={!unlocked}
                activeOpacity={unlocked ? 0.7 : 1}
              >
                {/* Cercle numéro */}
                <View style={[
                  styles.circle,
                  completed && styles.circleCompleted,
                  isNext && styles.circleNext,
                ]}>
                  {completed
                    ? <Text style={styles.circleCheck}>✓</Text>
                    : unlocked
                      ? <Text style={styles.circleNumber}>{day.id}</Text>
                      : <Text style={styles.circleLock}>🔒</Text>
                  }
                </View>

                {/* Contenu */}
                <View style={styles.dayContent}>
                  <Text style={[styles.dayLabel, !unlocked && styles.textMuted]}>
                    Jour {day.id} {emoji}
                  </Text>
                  <Text style={[styles.dayTitle, !unlocked && styles.textMuted]}>
                    {shortTitle}
                  </Text>
                  <Text style={styles.dayTheme} numberOfLines={1}>
                    {pillarTheme}
                  </Text>
                </View>

                {/* Badge / chevron */}
                {isNext
                  ? <View style={styles.nowBadge}><Text style={styles.nowBadgeText}>Maintenant</Text></View>
                  : <Text style={[styles.chevron, !unlocked && styles.textMuted]}>›</Text>
                }
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  brand: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.green,
    letterSpacing: 3,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  lightning:    { fontSize: 32 },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  settingsBtn:  { padding: 4 },
  settingsIcon: { fontSize: 24 },

  streakRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  streakCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  streakEmoji:  { fontSize: 22 },
  streakNumber: { fontSize: 34, fontWeight: '900', color: colors.white },
  streakLabel:  { fontSize: 13, color: colors.gray },

  daysList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  dayCardNext: {
    backgroundColor: '#1B5E2018',
    borderColor: colors.green + '66',
  },
  dayCardDone: {
    borderColor: colors.border,
  },

  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  circleNext: {
    backgroundColor: colors.greenDark + '66',
    borderColor: colors.green,
  },
  circleCheck:  { fontSize: 20, color: colors.white, fontWeight: '700' },
  circleNumber: { fontSize: 18, color: colors.white, fontWeight: '700' },
  circleLock:   { fontSize: 16 },

  dayContent: { flex: 1, gap: 2 },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.green,
  },
  dayTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
  dayTheme: {
    fontSize: 13,
    color: colors.gray,
  },

  nowBadge: {
    backgroundColor: colors.green,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  nowBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.black,
  },
  chevron:  { fontSize: 22, color: colors.gray },
  textMuted: { color: colors.border },
});
