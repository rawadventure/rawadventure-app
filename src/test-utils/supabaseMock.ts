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

export type SupabaseAuthSpies = {
  signInWithPassword: jest.Mock;
  signUp: jest.Mock;
  resetPasswordForEmail: jest.Mock;
  updateUser: jest.Mock;
  resend: jest.Mock;
  verifyOtp: jest.Mock;
  signOut: jest.Mock;
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
  /** Session renvoyée par `auth.getSession()` au prochain appel. */
  setSession: (session: unknown) => void;
  /** Simule un event `onAuthStateChange` (SIGNED_IN, SIGNED_OUT,
   *  PASSWORD_RECOVERY, TOKEN_REFRESHED…) vers tous les listeners
   *  enregistrés, et pose la session comme session courante. */
  emitAuthEvent: (event: string, session?: unknown) => void;
  /** Spies jest sur les méthodes auth — pour asserter les appels ou
   *  configurer un retour (`sb.authSpies.signUp.mockResolvedValueOnce(...)`).
   *  `reset()` restaure les implémentations par défaut (succès vides). */
  authSpies: SupabaseAuthSpies;
};

export function createSupabaseMock(
  initialTables: Record<string, unknown> = {},
): SupabaseMock {
  let tables: Record<string, unknown> = { ...initialTables };
  const calls: SupabaseCall[] = [];
  const realtimeCallbacks: Array<(payload: { new: unknown }) => void> = [];

  function makeBuilder(table: string) {
    // Filtres eq() accumulés sur CE builder (un builder par `from()`).
    // Une ligne-objet qui porte la colonne doit matcher la valeur ; une ligne
    // scalaire ou sans la colonne passe (rétro-compatibilité des tests
    // existants qui posent des valeurs simples).
    const filters: Array<[string, unknown]> = [];
    const read = () => {
      const raw = tables[table];
      let asArray = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
      if (filters.length > 0) {
        asArray = asArray.filter((row) =>
          filters.every(([col, val]) =>
            row !== null && typeof row === 'object' && col in row
              ? (row as Record<string, unknown>)[col] === val
              : true,
          ),
        );
      }
      const asSingle = asArray[0] ?? null;
      return { asArray, asSingle };
    };

    const builder: Record<string, unknown> = {};
    const chain = () => () => builder;

    builder.select = chain();
    builder.eq = (col: string, val: unknown) => {
      filters.push([col, val]);
      return builder;
    };
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

  // --- Auth pilotable ---
  let authSession: unknown = null;
  const authCallbacks: Array<(event: string, session: unknown) => void> = [];

  const authDefaults: Record<keyof SupabaseAuthSpies, (...a: unknown[]) => Promise<unknown>> = {
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: null,
    }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ error: null }),
    resend: async () => ({ error: null }),
    verifyOtp: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
  };
  const authSpies = Object.fromEntries(
    (Object.keys(authDefaults) as Array<keyof SupabaseAuthSpies>).map((k) => [
      k,
      jest.fn(authDefaults[k]),
    ]),
  ) as SupabaseAuthSpies;

  return {
    client: {
      from: (table: string) => makeBuilder(table),
      auth: {
        getSession: async () => ({
          data: { session: authSession },
          error: null,
        }),
        onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
          authCallbacks.push(cb);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        ...authSpies,
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
    setSession: (session) => {
      authSession = session;
    },
    emitAuthEvent: (event, session = null) => {
      authSession = session;
      for (const cb of authCallbacks) cb(event, session);
    },
    authSpies,
    reset: () => {
      tables = { ...initialTables };
      calls.length = 0;
      realtimeCallbacks.length = 0;
      authSession = null;
      authCallbacks.length = 0;
      for (const k of Object.keys(authSpies) as Array<keyof SupabaseAuthSpies>) {
        authSpies[k].mockReset();
        authSpies[k].mockImplementation(authDefaults[k]);
      }
    },
  };
}
