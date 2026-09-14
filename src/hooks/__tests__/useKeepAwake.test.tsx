/**
 * Tests useKeepAwakeWhile — verrou d'écran pendant une session active
 * (volet 2 du fix salve M2, 11 sept 2026).
 *
 * L'API Screen Wake Lock n'existe ni en natif ni en jsdom : on injecte des
 * doubles sur globalThis (navigator.wakeLock + document) et on restaure.
 */

import { renderHook } from '@testing-library/react-native';
import { useKeepAwakeWhile } from '../useKeepAwake';

type Listener = () => void;

function installWakeLockDouble() {
  const release = jest.fn().mockResolvedValue(undefined);
  const request = jest.fn().mockResolvedValue({ release });
  const listeners: Record<string, Listener[]> = {};
  const docDouble = {
    visibilityState: 'visible',
    addEventListener: (type: string, cb: Listener) => {
      (listeners[type] ??= []).push(cb);
    },
    removeEventListener: (type: string, cb: Listener) => {
      listeners[type] = (listeners[type] ?? []).filter((l) => l !== cb);
    },
  };
  const g = globalThis as Record<string, unknown>;
  const prevNavDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const prevDocDesc = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'navigator', {
    value: { wakeLock: { request } },
    configurable: true,
  });
  Object.defineProperty(globalThis, 'document', {
    value: docDouble,
    configurable: true,
  });
  const restore = () => {
    if (prevNavDesc) Object.defineProperty(globalThis, 'navigator', prevNavDesc);
    else delete g.navigator;
    if (prevDocDesc) Object.defineProperty(globalThis, 'document', prevDocDesc);
    else delete g.document;
  };
  const fireVisibility = (state: string) => {
    docDouble.visibilityState = state;
    for (const cb of listeners.visibilitychange ?? []) cb();
  };
  return { request, release, restore, fireVisibility };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('useKeepAwakeWhile', () => {
  test('active → demande le verrou ; désactivation → le libère', async () => {
    const dbl = installWakeLockDouble();
    try {
      const { rerender, unmount } = await renderHook(
        ({ on }: { on: boolean }) => useKeepAwakeWhile(on),
        { initialProps: { on: true } },
      );
      await flush();
      expect(dbl.request).toHaveBeenCalledWith('screen');

      await rerender({ on: false });
      await flush();
      expect(dbl.release).toHaveBeenCalledTimes(1);
      unmount();
    } finally {
      dbl.restore();
    }
  });

  test('retour visible → redemande le verrou (l OS le libère en arrière-plan)', async () => {
    const dbl = installWakeLockDouble();
    try {
      const { unmount } = await renderHook(() => useKeepAwakeWhile(true));
      await flush();
      expect(dbl.request).toHaveBeenCalledTimes(1);

      dbl.fireVisibility('hidden');
      dbl.fireVisibility('visible');
      await flush();
      expect(dbl.request).toHaveBeenCalledTimes(2);
      unmount();
    } finally {
      dbl.restore();
    }
  });

  test('API absente → no-op silencieux', async () => {
    const g = globalThis as Record<string, unknown>;
    const prevNavDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    Object.defineProperty(globalThis, 'navigator', {
      value: {},
      configurable: true,
    });
    try {
      const { unmount } = await renderHook(() => useKeepAwakeWhile(true));
      await flush();
      unmount();
    } finally {
      if (prevNavDesc) Object.defineProperty(globalThis, 'navigator', prevNavDesc);
      else delete g.navigator;
    }
  });

  test('refus du navigateur → silencieux, pas d exception', async () => {
    const dbl = installWakeLockDouble();
    dbl.request.mockRejectedValue(new Error('NotAllowedError'));
    try {
      const { unmount } = await renderHook(() => useKeepAwakeWhile(true));
      await flush();
      expect(dbl.release).not.toHaveBeenCalled();
      unmount();
    } finally {
      dbl.restore();
    }
  });
});
