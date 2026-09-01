/**
 * supabaseMock.ts — mock chaînable du client Supabase pour les tests.
 *
 * Fichier volontairement SANS import de code app : il est requis depuis les
 * factories `jest.mock('../../lib/supabase', ...)` (hoistées avant les
 * imports), tout import app créerait un cycle de résolution.
 *
 * Usage type dans un fichier de test :
 *
 *   jest.mock('../../lib/supabase', () => {
 *     const { createSupabaseMock } = require('../../test-utils/supabaseMock');
 *     const m = createSupabaseMock();
 *     return { supabase: m.client, __supabaseMock: m };
 *   });
 *   const { __supabaseMock: sb } = jest.requireMock('../../lib/supabase');
 *
 *   beforeEach(() => sb.reset());
 *   // sb.setTables({ profiles: {...} }) pour configurer les selects
 *   // sb.calls pour asserter les écritures (insert/update/upsert/delete)
 */

export type SupabaseCall = {
  table: string;
  op: 'select' | 'insert' | 'update' | 'upsert' | 'delete';
  payload?: unknown;
};

export type SupabaseMock = {
  client: {
    from: (table: string) => unknown;
    auth: Record<string, unknown>;
    channel: (name: string) => unknown;
    removeChannel: (channel: unknown) => Promise<void>;
  };
  calls: SupabaseCall[];
  setTables: (tables: Record<string, unknown>) => void;
  reset: () => void;
  /** Callbacks realtime enregistrés via channel().on() — pour simuler un
   *  event Postgres Changes : `sb.realtimeCallbacks[0]({ new: row })`. */
  realtimeCallbacks: Array<(payload: { new: unknown }) => void>;
};

export function createSupabaseMock(
  initialTables: Record<string, unknown> = {},
): SupabaseMock {
  let tables: Record<string, unknown> = { ...initialTables };
  const calls: SupabaseCall[] = [];
  const realtimeCallbacks: Array<(payload: { new: unknown }) => void> = [];

  function makeBuilder(table: string) {
    const read = () => {
      const raw = tables[table];
      const asArray = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
      const asSingle = Array.isArray(raw) ? (raw[0] ?? null) : (raw ?? null);
      return { asArray, asSingle };
    };

    const builder: Record<string, unknown> = {};
    const chain = () => () => builder;

    builder.select = chain();
    builder.eq = chain();
    builder.order = chain();
    builder.limit = chain();
    builder.single = async () => ({ data: read().asSingle, error: null });
    builder.maybeSingle = async () => ({ data: read().asSingle, error: null });
    builder.insert = (payload: unknown) => {
      calls.push({ table, op: 'insert', payload });
      return builder;
    };
    builder.update = (payload: unknown) => {
      calls.push({ table, op: 'update', payload });
      return builder;
    };
    builder.upsert = (payload: unknown) => {
      calls.push({ table, op: 'upsert', payload });
      return builder;
    };
    builder.delete = () => {
      calls.push({ table, op: 'delete' });
      return builder;
    };
    // thenable : `await supabase.from(t)...` résout { data, error: null }.
    builder.then = (resolve: (v: { data: unknown; error: null }) => unknown) =>
      Promise.resolve(resolve({ data: read().asArray, error: null }));
    return builder;
  }

  return {
    client: {
      from: (table: string) => makeBuilder(table),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signOut: async () => ({ error: null }),
      },
      channel: (_name: string) => {
        const channel = {
          on: (
            _event: string,
            _filter: unknown,
            cb: (payload: { new: unknown }) => void,
          ) => {
            realtimeCallbacks.push(cb);
            return channel;
          },
          subscribe: () => channel,
        };
        return channel;
      },
      removeChannel: async () => {},
    },
    calls,
    realtimeCallbacks,
    setTables: (t) => {
      tables = { ...t };
    },
    reset: () => {
      tables = { ...initialTables };
      calls.length = 0;
      realtimeCallbacks.length = 0;
    },
  };
}
