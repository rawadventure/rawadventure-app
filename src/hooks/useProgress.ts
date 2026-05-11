import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  onboardingDone:  'onboarding_done',
  onboardingData:  'onboarding_data',
  completedDays:   'completed_days',
  minimumDays:     'minimum_days',
};

export function useProgress() {
  const [onboardingDone, setOnboardingDone]   = useState(false);
  const [onboardingData, setOnboardingData]   = useState<Record<string, string>>({});
  const [completedDays,  setCompletedDays]    = useState<number[]>([]);
  const [minimumDays,    setMinimumDays]      = useState<number[]>([]);
  const [loading,        setLoading]          = useState(true);

  // Chargement initial depuis le stockage local
  useEffect(() => {
    (async () => {
      try {
        const [done, data, days, minDays] = await Promise.all([
          AsyncStorage.getItem(KEYS.onboardingDone),
          AsyncStorage.getItem(KEYS.onboardingData),
          AsyncStorage.getItem(KEYS.completedDays),
          AsyncStorage.getItem(KEYS.minimumDays),
        ]);
        if (done)    setOnboardingDone(JSON.parse(done));
        if (data)    setOnboardingData(JSON.parse(data));
        if (days)    setCompletedDays(JSON.parse(days));
        if (minDays) setMinimumDays(JSON.parse(minDays));
      } catch (e) {
        console.error('Erreur chargement progress:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const completeOnboarding = useCallback(async (answers: Record<string, string>) => {
    setOnboardingData(answers);
    setOnboardingDone(true);
    await AsyncStorage.setItem(KEYS.onboardingData, JSON.stringify(answers));
    await AsyncStorage.setItem(KEYS.onboardingDone, JSON.stringify(true));
  }, []);

  const completeDay = useCallback(async (day: number, isMinimum = false) => {
    setCompletedDays(prev => {
      const next = prev.includes(day) ? prev : [...prev, day];
      AsyncStorage.setItem(KEYS.completedDays, JSON.stringify(next));
      return next;
    });
    if (isMinimum) {
      setMinimumDays(prev => {
        const next = prev.includes(day) ? prev : [...prev, day];
        AsyncStorage.setItem(KEYS.minimumDays, JSON.stringify(next));
        return next;
      });
    }
  }, []);

  const isDayCompleted = useCallback((day: number) => completedDays.includes(day), [completedDays]);
  const isDayUnlocked  = useCallback((day: number) => day === 1 || completedDays.includes(day - 1), [completedDays]);

  const resetAll = useCallback(async () => {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    setOnboardingDone(false);
    setOnboardingData({});
    setCompletedDays([]);
    setMinimumDays([]);
  }, []);

  return {
    loading,
    onboardingDone,
    onboardingData,
    completedDays,
    minimumDays,
    streak: completedDays.length,
    completeOnboarding,
    completeDay,
    isDayCompleted,
    isDayUnlocked,
    resetAll,
  };
}
