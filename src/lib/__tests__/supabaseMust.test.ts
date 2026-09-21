/**
 * Tests must() — garde d'écriture Supabase (F-03/F-08 audit Lou).
 * supabase-js résout { data, error } sans throw : must() convertit tout
 * error non-null en exception et rend data sinon.
 */

import { must } from '../supabaseMust';

describe('must — conversion { data, error } → data | throw', () => {
  test('error null → renvoie data', async () => {
    await expect(
      must(Promise.resolve({ data: [1, 2], error: null })),
    ).resolves.toEqual([1, 2]);
  });

  test('error objet supabase { message } → throw Error avec le message', async () => {
    await expect(
      must(Promise.resolve({ data: null, error: { message: 'RLS denied' } })),
    ).rejects.toThrow('RLS denied');
  });

  test('error déjà Error → re-throw tel quel', async () => {
    const boom = new Error('réseau');
    await expect(
      must(Promise.resolve({ data: null, error: boom })),
    ).rejects.toBe(boom);
  });

  test('error non-objet (string) → throw Error stringifié', async () => {
    await expect(
      must(Promise.resolve({ data: null, error: 'boom' })),
    ).rejects.toThrow('boom');
  });
});
