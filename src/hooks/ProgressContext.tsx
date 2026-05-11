import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProgressContextType {
  loading:            boolean;
  onboardingDone:     boolean;
  onboardingData:     Record<string, string>;
  completedDays:      number[];
  minimumDays:        number[];
  streak:             number;
  completeOnboarding: (answers: Record<string, string>) => Promise<void>;
  completeDay:        (day: number, isMinimum?: boolean) => Promise<void>;
  isDayCompleted:     (day: number) => boolean;
  isDayUnlocked:      (day: number) => boolean;
  resetAll:           () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

// Clés AsyncStorage (utilisées en mode non-connecté)
const LOCAL_KEYS = {
  onboardingDone: 'onboarding_done',
  onboardingData: 'onboarding_data',
  completedDays:  'completed_days',
  minimumDays:    'minimum_days',
};

// ─── Provider ────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [loading,        setLoading]        = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Record<string, string>>({});
  const [completedDays,  setCompletedDays]  = useState<number[]>([]);
  const [minimumDays,    setMinimumDays]    = useState<number[]>([]);

  // ── Chargement au démarrage / changement d'utilisateur ───────────────────
  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user) {
        // Chargement depuis Supabase
        const [profileRes, progressRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('progress').select('*').eq('user_id', user.id),
        ]);

        if (profileRes.data) {
          setOnboardingDone(profileRes.data.onboarding_done ?? false);
          setOnboardingData(profileRes.data.onboarding_data ?? {});
        }
        if (progressRes.data) {
          setCompletedDays(progressRes.data.map((r: any) => r.day_id));
          setMinimumDays(progressRes.data.filter((r: any) => r.is_minimum).map((r: any) => r.day_id));
        }
      } else {
        // Fallback local (mode sans compte)
        const [done, data, days, minDays] = await Promise.all([
          AsyncStorage.getItem(LOCAL_KEYS.onboardingDone),
          AsyncStorage.getItem(LOCAL_KEYS.onboardingData),
          AsyncStorage.getItem(LOCAL_KEYS.completedDays),
          AsyncStorage.getItem(LOCAL_KEYS.minimumDays),
        ]);
        if (done)    setOnboardingDone(JSON.parse(done));
        if (data)    setOnboardingData(JSON.parse(data));
        if (days)    setCompletedDays(JSON.parse(days));
        if (minDays) setMinimumDays(JSON.parse(minDays));
      }
    } catch (e) {
      console.error('Erreur chargement progression:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Compléter l'onboarding ────────────────────────────────────────────────
  const completeOnboarding = useCallback(async (answers: Record<string, string>) => {
    setOnboardingData(answers);
    setOnboardingDone(true);

    if (user) {
      await supabase.from('profiles').update({
        onboarding_done: true,
        onboarding_data: answers,
      }).eq('id', user.id);
    } else {
      await AsyncStorage.setItem(LOCAL_KEYS.onboardingData, JSON.stringify(answers));
      await AsyncStorage.setItem(LOCAL_KEYS.onboardingDone, JSON.stringify(true));
    }
  }, [user]);

  // ── Compléter un jour ─────────────────────────────────────────────────────
  const completeDay = useCallback(async (day: number, isMinimum = false) => {
    // Mise à jour immédiate du state local
    setCompletedDays(prev => prev.includes(day) ? prev : [...prev, day]);
    if (isMinimum) setMinimumDays(prev => prev.includes(day) ? prev : [...prev, day]);

    if (user) {
      await supabase.from('progress').upsert(
        { user_id: user.id, day_id: day, is_minimum: isMinimum },
        { onConflict: 'user_id,day_id' },
      );
    } else {
      const updated = completedDays.includes(day) ? completedDays : [...completedDays, day];
      await AsyncStorage.setItem(LOCAL_KEYS.completedDays, JSON.stringify(updated));
      if (isMinimum) {
        const updatedMin = minimumDays.includes(day) ? minimumDays : [...minimumDays, day];
        await AsyncStorage.setItem(LOCAL_KEYS.minimumDays, JSON.stringify(updatedMin));
      }
    }
  }, [user, completedDays, minimumDays]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const isDayCompleted = useCallback((day: number) => completedDays.includes(day), [completedDays]);
  const isDayUnlocked  = useCallback((day: number) => day === 1 || completedDays.includes(day - 1), [completedDays]);

  // ── Reset complet (test) ──────────────────────────────────────────────────
  const resetAll = useCallback(async () => {
    setOnboardingDone(false);
    setOnboardingData({});
    setCompletedDays([]);
    setMinimumDays([]);

    if (user) {
      await Promise.all([
        supabase.from('profiles').update({
          onboarding_done: false,
          onboarding_data: {},
        }).eq('id', user.id),
        supabase.from('progress').delete().eq('user_id', user.id),
      ]);
    } else {
      await AsyncStorage.multiRemove(Object.values(LOCAL_KEYS));
    }
  }, [user]);

  return (
    <ProgressContext.Provider value={{
      loading, onboardingDone, onboardingData,
      completedDays, minimumDays,
      streak: completedDays.length,
      completeOnboarding, completeDay,
      isDayCompleted, isDayUnlocked, resetAll,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé dans un ProgressProvider');
  return ctx;
}
