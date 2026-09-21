import { computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { DEFAULT_OPTIONS } from '@vean/theme';
import type { ThemeModePreference, ThemeOptions, ThemeOverrides } from '@vean/theme';
import { readThemeEnvelope, writeThemeEnvelope, THEME_STORAGE_KEY } from '@vean/theme/storage';

/** the editable theme settings state: engine options plus the mode preference. */
export type ThemeSettingsState = ThemeOptions & { mode?: ThemeModePreference };

/**
 * Options for `useThemeSettings`.
 */
export interface UseThemeSettingsOptions {
  /**
   * The initial configuration. When omitted and `persist` is enabled, the
   * persisted envelope is read from storage.
   */
  initial?: ThemeSettingsState;
  /**
   * Whether to read/write the persisted theme envelope from storage.
   *
   * Off by default: inside an `SConfigProvider` tree the provider owns the
   * single envelope writer, and `apply` hands the state to the runtime. Enable
   * it only for standalone usage without a provider.
   *
   * @default false
   */
  persist?: boolean;
  /**
   * The localStorage key backing the persisted envelope.
   *
   * @default THEME_STORAGE_KEY
   */
  storageKey?: string;
  /**
   * The callback invoked by `commit()` to apply the config to the runtime
   * (e.g. `useTheme().setThemeState`).
   */
  apply?: (state: ThemeSettingsState) => void;
}

/**
 * The return value of `useThemeSettings`.
 */
export interface UseThemeSettingsReturn {
  /** The complete writable config (engine options + mode preference). */
  state: Ref<ThemeSettingsState>;
  /** Immutably patch the config (single field or object). */
  setState: (patch: Partial<ThemeSettingsState>) => void;
  /** The editable light/dark single-token overrides. */
  overrides: ComputedRef<ThemeOverrides>;
  /**
   * Set or clear a single override token. Empty values are removed.
   *
   * The key is a token name owned by the engine (`SemanticToken`); it stays a
   * plain `string` here so the settings layer does not encode the vocabulary,
   * and the persisted payload is validated field by field anyway.
   */
  setOverride: (mode: 'light' | 'dark', key: string, value: string) => void;
  /** The engine options derived from `state` (mode stripped), ready for the engine. */
  resolved: ComputedRef<ThemeOptions>;
  /** Persist the config (when `persist`) and call `apply` to push it to the runtime. */
  commit: () => void;
  /** Reset to the engine defaults and clear overrides. */
  reset: () => void;
}

const hasAnyOverride = (overrides: ThemeOverrides | undefined): boolean =>
  overrides != null && (Object.keys(overrides.light ?? {}).length > 0 || Object.keys(overrides.dark ?? {}).length > 0);

/**
 * The UI-layer theme configuration state core.
 *
 * Owns the editable settings state (base/primary/feedback/levels/surface
 * style/size/radius/spacing/overrides/mode), immutable `setState`/`setOverride`
 * updates, and the engine options derived from the state. Used by the theme
 * customizer; pure logic and storage, no component rendering.
 */
export function useThemeSettings(options: UseThemeSettingsOptions = {}): UseThemeSettingsReturn {
  const { initial, persist = false, storageKey = THEME_STORAGE_KEY, apply } = options;

  const persisted = persist && !initial ? readThemeEnvelope(storageKey) : null;
  const state = ref<ThemeSettingsState>({
    ...(persisted ? { ...persisted.options, ...(persisted.mode ? { mode: persisted.mode } : {}) } : undefined),
    ...initial
  });

  const setState = (patch: Partial<ThemeSettingsState>): void => {
    state.value = { ...state.value, ...patch };
  };

  const overrides = computed<ThemeOverrides>(
    () =>
      state.value.overrides ?? {
        light: {},
        dark: {}
      }
  );

  /**
   * set or clear one override value.
   *
   * The value stays a plain `string`: this layer deliberately does not encode the
   * `TokenOverride` vocabulary (`stone.950` / `oklch(...)` / `white` / `token.primary` …),
   * because the values come from pickers and inputs, and the engine's own parser
   * decides what a value means. The write therefore asserts into the narrower
   * `ThemeOverrides` — validation lives in `parseOverrides`, not here.
   */
  const setOverride = (mode: 'light' | 'dark', key: string, value: string): void => {
    const current: ThemeOverrides = state.value.overrides ?? {
      light: {},
      dark: {}
    };
    const modeTokens = { ...current[mode] } as Record<string, string>;

    if (value === '') {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete modeTokens[key];
    } else {
      modeTokens[key] = value;
    }

    const next = { ...current, [mode]: modeTokens } as ThemeOverrides;

    if (!hasAnyOverride(next)) {
      setState({ overrides: undefined });
      return;
    }

    setState({ overrides: next });
  };

  const resolved = computed<ThemeOptions>(() => {
    const { mode: _mode, ...rest } = state.value;

    return rest;
  });

  const commit = (): void => {
    if (persist) {
      // read-modify-write: standalone usage must not drop the style snapshot or
      // the presets the provider may have written into the same envelope
      const envelope = readThemeEnvelope(storageKey);

      writeThemeEnvelope({ ...envelope, options: resolved.value, mode: state.value.mode }, storageKey);
    }

    apply?.(state.value);
  };

  const reset = (): void => {
    state.value = {
      base: DEFAULT_OPTIONS.base,
      primary: DEFAULT_OPTIONS.primary,
      feedback: DEFAULT_OPTIONS.feedback,
      surfaceStyle: DEFAULT_OPTIONS.surfaceStyle,
      size: DEFAULT_OPTIONS.size,
      radius: DEFAULT_OPTIONS.radius,
      spacing: DEFAULT_OPTIONS.spacing,
      // 字体回到引擎默认系统栈（LITERAL_DEFAULTS）
      font: undefined,
      borderOpacity: DEFAULT_OPTIONS.borderOpacity,
      format: DEFAULT_OPTIONS.format,
      mode: 'light',
      overrides: undefined
    };
  };

  return {
    state,
    setState,
    overrides,
    setOverride,
    resolved,
    commit,
    reset
  };
}
