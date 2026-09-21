/**
 * useDevSnapshot — application d'un snapshot timeline DEV (F-05.5/F-07,
 * audit Lou — extrait de ProgressContext ; outillage dev isolé du code
 * produit). Moteur : src/lib/devTimeline.
 */

import { useCallback, type MutableRefObject } from 'react';
import type { ProgressData } from '../../lib/progressData';
import type { JokerConsumption, StreakEntry } from '../../lib/streak';
import type { NarrativeEventId, TierReach } from './types';

type DevSnapshotDeps = {
  user: { id: string } | null;
  dataRef: MutableRefObject<ProgressData>;
  commitData: (next: ProgressData) => void;
  setAccountCreatedAtState: (v: string | null) => void;
  setNarrativeFlagsSynced: (f: Partial<Record<NarrativeEventId, string>>) => void;
  setCurrentPillarId: (v: string | null) => void;
  setPillarStartedAt: (v: string | null) => void;
  setS8FinalCompleted: (v: boolean) => void;
};

export function useDevSnapshot({
  user,
  dataRef,
  commitData,
  setAccountCreatedAtState,
  setNarrativeFlagsSynced,
  setCurrentPillarId,
  setPillarStartedAt,
  setS8FinalCompleted,
}: DevSnapshotDeps) {
  const applyDevSnapshot = useCallback(
    async (snapshot: import('../../lib/devTimeline').TimelineSnapshot) => {
      const { applyTimelineSnapshot } = await import('../../lib/devTimeline');
      await applyTimelineSnapshot(snapshot, {
        userId: user?.id ?? null,
        setAccountCreatedAt: setAccountCreatedAtState,
        // F-05.4 : le trio passe par la porte unique commitData.
        setStreakHistory: (h: StreakEntry[]) =>
          commitData({ ...dataRef.current, streakHistory: h }),
        setJokerConsumptions: (c: JokerConsumption[]) =>
          commitData({ ...dataRef.current, jokerConsumptions: c }),
        setTierReaches: (t: TierReach[]) =>
          commitData({ ...dataRef.current, tierReaches: t }),
        setNarrativeFlags: setNarrativeFlagsSynced,
        setCurrentPillarId,
        setPillarStartedAt,
        setS8FinalCompleted,
      });
    },
    [
      user,
      commitData,
      dataRef,
      setAccountCreatedAtState,
      setNarrativeFlagsSynced,
      setCurrentPillarId,
      setPillarStartedAt,
      setS8FinalCompleted,
    ],
  );

  return applyDevSnapshot;
}
