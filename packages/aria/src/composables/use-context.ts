import { inject, provide } from 'vue';

type ContextName = string | { name: string; key: string | symbol };

/**
 * Shared registry for auto-generated context keys, stored on `globalThis` so
 * that two evaluations of this module (Vite dev HMR re-evaluation, mixed
 * barrel/subpath imports) resolve the same context name to the same key.
 *
 * Without this, a dev-server hot update can leave two live copies of a
 * provider module around: `provide` registers under the old copy's `Symbol`,
 * `inject` looks up the new copy's — the symbols never match and the consumer
 * throws "must be used within" in SSR, even though the tree is correct.
 */
const contextKeyRegistry: Map<string, symbol> = (() => {
  const registry = globalThis as typeof globalThis & { __SOYBEAN_CONTEXT_KEYS__?: Map<string, symbol> };

  registry.__SOYBEAN_CONTEXT_KEYS__ ??= new Map<string, symbol>();

  return registry.__SOYBEAN_CONTEXT_KEYS__;
})();

const getSharedContextKey = (name: string): symbol => {
  let key = contextKeyRegistry.get(name);

  if (!key) {
    key = Symbol(name);
    contextKeyRegistry.set(name, key);
  }

  return key;
};

type AnyComposable = (...args: never[]) => unknown;

export type ContextValue<T> = T extends AnyComposable ? ReturnType<T> : T;

export type ContextProvider<T> = T extends AnyComposable ? (...args: Parameters<T>) => ReturnType<T> : (value: T) => T;

export interface ContextConsumerFn<T> {
  /** Required consumption: throws when the context is missing. */
  (consumerName: string, defaultValue?: T): T;
  /** Optional consumption: returns `null` when the context is missing. */
  (consumerName?: string | null, defaultValue?: T): T | null;
}

export type ContextConsumer<T> = T extends AnyComposable ? ContextConsumerFn<ReturnType<T>> : ContextConsumerFn<T>;

/**
 * Creates a context provider and consumer pair.
 *
 * @param contextName - The name of the context. This can be a string or an object with a `name` and `key` property.
 * @param composable - An optional composable that computes the context value from the provider arguments. When
 * omitted, the context value is the first argument passed to the provider.
 */
export function useContext<T>(contextName: ContextName): [ContextProvider<T>, ContextConsumer<T>];
export function useContext<T extends AnyComposable>(
  contextName: ContextName,
  composable: T
): [ContextProvider<T>, ContextConsumer<ReturnType<T>>];
export function useContext(contextName: ContextName, composable?: (...args: never[]) => unknown) {
  const name = typeof contextName === 'string' ? contextName : contextName.name;
  const key = typeof contextName === 'string' ? getSharedContextKey(contextName) : contextName.key;

  const provideContext = (...args: never[]) => {
    const value = composable?.(...args) ?? args[0];
    provide(key, value);
    return value;
  };

  const useConsumer = (consumerName?: string | null, defaultValue?: unknown) => {
    const value = inject(key, defaultValue) ?? null;
    if (consumerName != null && value === null) {
      throw new Error(`\`${consumerName}\` must be used within \`${name}\``);
    }
    return value;
  };

  return [provideContext, useConsumer] as const;
}
