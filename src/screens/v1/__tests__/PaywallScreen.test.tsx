/**
 * Tests PaywallScreen — variantes de copy selon position/abonnement (audit M3),
 * flow "Continuer mon parcours" (Reader App pattern : navigateur externe avec
 * user_id/email pour le Stripe Pricing Table), reload au retour, variant soft.
 *
 * Contexts mockés au niveau hooks : les mécaniques Progress/Subscription ont
 * leurs propres tests d'intégration — ici on teste l'aiguillage de l'écran.
 */

import React from 'react';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';

const mockReload = jest.fn(async () => {});
let mockSubscriptionStatus = 'free';
let mockCurrentDay = 14;
let mockCurrentPhase: 'phase_0' | 'phase_1' | 'post_s8' = 'phase_0';

jest.mock('../../../hooks/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'stephane@example.com' },
  }),
}));
jest.mock('../../../hooks/SubscriptionContext', () => ({
  useSubscription: () => ({
    reload: mockReload,
    state: { status: mockSubscriptionStatus, plan: null },
  }),
}));
jest.mock('../../../hooks/ProgressContext', () => ({
  useProgress: () => ({
    currentDay: mockCurrentDay,
    currentPhase: mockCurrentPhase,
  }),
}));

const mockOpenExternal = jest.fn(
  async (..._args: unknown[]) => ({ type: 'cancel' }),
);
jest.mock('../../../lib/openExternal', () => ({
  openExternal: (...args: unknown[]) => mockOpenExternal(...args),
}));

import PaywallScreen from '../PaywallScreen';

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscriptionStatus = 'free';
  mockCurrentDay = 14;
  mockCurrentPhase = 'phase_0';
});

describe('variantes de copy (audit M3)', () => {
  test('J5 jamais abonné → variante découverte (conversion précoce D3, pas de "tu as terminé")', async () => {
    mockCurrentDay = 5;
    await render(<PaywallScreen />);
    expect(screen.getByText('PHASE 1 À VENIR')).toBeTruthy();
    expect(screen.getByText(/La suite, quand ton corps sera prêt/)).toBeTruthy();
  });

  test('J14 → variante fin de préparation', async () => {
    mockCurrentDay = 14;
    await render(<PaywallScreen />);
    expect(screen.getByText('FIN DE TA PRÉPARATION')).toBeTruthy();
  });

  test('J17+ JAMAIS abonné → fin de préparation, pas "ton abonnement a pris fin" (mensonger)', async () => {
    mockCurrentDay = 18;
    mockSubscriptionStatus = 'free';
    await render(<PaywallScreen />);
    expect(screen.getByText('FIN DE TA PRÉPARATION')).toBeTruthy();
    expect(screen.queryByText(/abonnement a pris fin/)).toBeNull();
  });

  test('J17+ abonnement expiré → variante pause Phase 1', async () => {
    mockCurrentDay = 18;
    mockSubscriptionStatus = 'expired';
    await render(<PaywallScreen />);
    expect(screen.getByText('TON ACCÈS EST EN PAUSE')).toBeTruthy();
    expect(screen.getByText(/progression Phase 1 est en pause/)).toBeTruthy();
  });

  test('post-S8 abonnement expiré → variante consolidation en pause', async () => {
    mockCurrentPhase = 'post_s8';
    mockSubscriptionStatus = 'cancelled';
    await render(<PaywallScreen />);
    expect(screen.getByText(/consolidation libre en pause/)).toBeTruthy();
  });
});

describe('Reader App pattern — aucun prix in-app', () => {
  test.each([5, 14, 18] as const)('J%s : pas de prix ni de mention "payer"', async (day) => {
    mockCurrentDay = day;
    await render(<PaywallScreen />);
    // On ne vérifie que les nœuds texte (les styles JSON contiennent des
    // nombres décimaux qui déclencheraient des faux positifs).
    const texts: string[] = [];
    const collect = (node: unknown): void => {
      if (typeof node === 'string') texts.push(node);
      else if (Array.isArray(node)) node.forEach(collect);
      else if (node && typeof node === 'object')
        collect((node as { children?: unknown }).children);
    };
    collect(screen.toJSON());
    const allText = texts.join(' ');
    expect(allText).not.toMatch(/€|\bEUR\b|\d+[.,]\d{2}\s*(€|euros)/);
    expect(allText).not.toMatch(/\bpayer\b/i);
  });
});

describe('CTA "Continuer mon parcours"', () => {
  test('ouvre le navigateur avec user_id + email (matching webhook Stripe), puis reload', async () => {
    await render(<PaywallScreen />);
    const user = userEvent.setup();
    await user.press(screen.getByText('Continuer mon parcours'));
    await waitFor(() => expect(mockOpenExternal).toHaveBeenCalledTimes(1));
    const url = mockOpenExternal.mock.calls[0]?.[0] as unknown as string;
    expect(url).toContain('https://rawadventure.world/abonnement/');
    expect(url).toContain('user_id=user-1');
    expect(url).toContain('email=stephane%40example.com');
    // Reload au retour du navigateur — check webhook propagé (bug boucle paywall).
    await waitFor(() => expect(mockReload).toHaveBeenCalled());
  });
});

describe('variant soft (onBack fourni)', () => {
  test('bouton Retour présent, "Plus tard" ferme via onBack', async () => {
    const onBack = jest.fn();
    await render(<PaywallScreen onBack={onBack} />);
    const user = userEvent.setup();
    expect(screen.getByLabelText('Retour')).toBeTruthy();
    await user.press(screen.getByText('Plus tard'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('variant gate (sans onBack) : pas de bouton Retour', async () => {
    await render(<PaywallScreen />);
    expect(screen.queryByLabelText('Retour')).toBeNull();
  });
});
