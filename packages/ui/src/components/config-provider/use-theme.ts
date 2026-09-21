import { computed, onUnmounted, reactive, ref, watch } from 'vue';
import type { ComputedRef, Ref, ShallowRef } from 'vue';
import { useContext } from '@vean/aria/composables';
import { DEFAULT_OPTIONS, resolveDocumentColorScheme } from '@vean/theme';
import type {
  DarkSelectorValue,
  PaletteKey,
  ThemeMode,
  ThemeModePreference,
  ThemeOptions,
  ThemeOverrides,
  ThemeRadiusValue,
  ThemeSizeValue,
  ThemeSpacingValue
} from '@vean/theme';
import { isServerRuntime } from '@vean/theme/ssr';
import { readThemeEnvelope } from '@vean/theme/storage';
import type { ThemeEnvelopeInput } from '@vean/theme/storage';
import type { ThemePresetColors, ThemePresetInput, ThemeSettingsState } from '@/theme';
import type { ConfigProviderProps } from './types';

const DEFAULT_BASE: PaletteKey = DEFAULT_OPTIONS.base;
const DEFAULT_PRIMARY: PaletteKey = DEFAULT_OPTIONS.primary;
const DEFAULT_RADIUS: ThemeRadiusValue = DEFAULT_OPTIONS.radius;
const DEFAULT_SIZE: ThemeSizeValue = DEFAULT_OPTIONS.size;
const DEFAULT_SPACING: ThemeSpacingValue = DEFAULT_OPTIONS.spacing;
const DEFAULT_MODE: ThemeModePreference = 'light';

/**
 * The reactive theme context exposed by `SConfigProvider`.
 *
 * It owns the persistable theme state (`base` / `primary` / `radius` / `size` /
 * `spacing` / `mode`), the custom preset management, and the effective `theme`
 * derived for the provider. Consumers read it via `useTheme()` to drive their own
 * theme UI without prop drilling or app-level state stores.
 */
export interface ThemeContext {
  /** The base color palette key. */
  base: ShallowRef<PaletteKey>;
  /** The primary color palette key. */
  primary: ShallowRef<PaletteKey>;
  /** The border radius. */
  radius: ShallowRef<ThemeRadiusValue>;
  /** The component size / density. */
  size: ShallowRef<ThemeSizeValue>;
  /** The spacing grid unit multiplier (padding / margin / gap). */
  spacing: ShallowRef<ThemeSpacingValue>;
  /** The color scheme preference (`light` / `dark` / `auto`). */
  mode: ShallowRef<ThemeModePreference>;
  /** The effective (resolved) color scheme: `auto` follows the OS preference. */
  effectiveMode: ComputedRef<ThemeMode>;
  /** Set the border radius. */
  setRadius: (value: ThemeRadiusValue) => void;
  /** Set the component size / density. */
  setSize: (value: ThemeSizeValue) => void;
  /** Set the spacing grid unit multiplier. */
  setSpacing: (value: ThemeSpacingValue) => void;
  /** Set the color scheme preference. */
  setMode: (value: ThemeModePreference) => void;
  /** The persisted custom theme presets table. */
  customPresets: Ref<Record<string, ThemePresetColors>>;
  /** The currently applied custom preset name, if any. */
  appliedPresetName: ShallowRef<string | null>;
  /** Save the current primary color as a custom preset. */
  savePreset: (name: string) => boolean;
  /** Remove a custom preset. */
  removePreset: (name: string) => boolean;
  /** Apply a custom preset by name. */
  applyPreset: (name: string) => void;
  /** Clear the applied custom preset. */
  resetPreset: () => void;
  /** Overwrite the full persistable theme state (options + mode). */
  setThemeState: (config: ThemeSettingsState) => void;
  /** The effective theme merged from the internal state and the `theme` prop. */
  theme: ComputedRef<ThemeOptions>;
}

export const [provideThemeContext, useThemeConsumer] = useContext<ThemeContext>('UiThemeContext');

export const useTheme = (consumerName?: string | null, defaultValue?: ThemeContext) =>
  useThemeConsumer(consumerName ?? 'ThemeConsumer', defaultValue);

/** The internal theme context held by `SConfigProvider` (adds storage helpers). */
export type ConfigProviderThemeContext = ThemeContext & {
  /** Overwrite the internal theme state (used by cross-tab sync and `commitThemeConfig`). */
  setThemeState: (config: ThemeSettingsState) => void;
  /**
   * Re-read the persisted envelope (options / mode / presets / applied preset)
   * from storage and force a re-derive (cross-tab sync).
   */
  refreshThemeConfig: () => void;
};

/**
 * resolve the dark mode class name from a `darkSelector` value.
 *
 * - 'class' → 'dark'
 * - 'media' → `null` (media queries follow the OS preference, no class toggled)
 * - any other string is a custom class selector used verbatim (dot stripped).
 */
const getDarkClass = (selector: DarkSelectorValue): string | null => {
  if (selector === 'media') {
    return null;
  }

  if (selector === 'class') {
    return 'dark';
  }

  return selector.replace(/^\./, '');
};

/**
 * whether a preset input is an inline color preset (mode-split, carries
 * `light`). A reference-only input carries just `name` and no `light`.
 */
const isInlineColorPreset = (preset: ThemePresetInput | undefined): preset is ThemePresetColors =>
  !!preset && 'light' in preset;

/**
 * Create the theme context for a `SConfigProvider` instance.
 *
 * The persistable theme state is initialized once from the persisted source
 * (the injected `themeConfig` on the server, the theme envelope on the client)
 * and kept in sync on every change, so the theme survives across refreshes and
 * matches between server and client rendering.
 *
 * **Persistence**: the context itself writes nothing — the provider's single
 * envelope writer (see `useConfigProviderTheme`) watches the derived state and
 * owns every write to the one storage key.
 */
export function createThemeContext(props: ConfigProviderProps): ConfigProviderThemeContext {
  const isServer = props.isServer ?? isServerRuntime();

  // —— 初始主题状态：persistTheme 关闭时不读任何存储；开启时优先注入的
  //    themeConfig（SSR），否则客户端从主题信封解析。服务端没有
  //    localStorage，首帧由内联脚本（createThemeInitScript）在客户端应用 ——
  let persisted: ThemeEnvelopeInput | null = null;

  if (props.persistTheme) {
    if (props.themeConfig) {
      // 显式注入的 themeConfig（SSR）优先，避免读取 localStorage
      persisted = props.themeConfig;
    } else if (!isServer) {
      persisted = readThemeEnvelope();
    }
  }

  const themeState = reactive<ThemeSettingsState>({
    ...persisted?.options,
    base: persisted?.options?.base ?? DEFAULT_BASE,
    primary: persisted?.options?.primary ?? DEFAULT_PRIMARY,
    radius: persisted?.options?.radius ?? DEFAULT_RADIUS,
    size: persisted?.options?.size ?? DEFAULT_SIZE,
    spacing: persisted?.options?.spacing ?? DEFAULT_SPACING,
    mode: persisted?.mode ?? DEFAULT_MODE
  });

  const base = computed<PaletteKey>({
    get: () => themeState.base ?? DEFAULT_BASE,
    set: value => {
      themeState.base = value;
    }
  });
  const primary = computed<PaletteKey>({
    get: () => themeState.primary ?? DEFAULT_PRIMARY,
    set: value => {
      themeState.primary = value;
    }
  });
  const radius = computed<ThemeRadiusValue>({
    get: () => themeState.radius ?? DEFAULT_RADIUS,
    set: value => {
      themeState.radius = value as ThemeRadiusValue;
    }
  });
  const size = computed<ThemeSizeValue>({
    get: () => themeState.size ?? DEFAULT_SIZE,
    set: value => {
      themeState.size = value as ThemeSizeValue;
    }
  });
  const spacing = computed<ThemeSpacingValue>({
    get: () => themeState.spacing ?? DEFAULT_SPACING,
    set: value => {
      themeState.spacing = value as ThemeSpacingValue;
    }
  });
  const mode = computed<ThemeModePreference>({
    get: () => themeState.mode ?? DEFAULT_MODE,
    set: value => {
      themeState.mode = value;
    }
  });

  // —— auto 模式的系统偏好解析：跟踪 `prefers-color-scheme`，SSR 下无
  //    matchMedia 时回退为 light，首帧由 createThemeInitScript 在浏览器处理 ——
  const systemDark = ref(false);
  let mql: MediaQueryList | undefined;

  if (!isServer && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    mql = window.matchMedia('(prefers-color-scheme: dark)');
    systemDark.value = mql.matches;
  }

  const onSystemColorChange = (event: MediaQueryListEvent): void => {
    systemDark.value = event.matches;
  };

  mql?.addEventListener('change', onSystemColorChange);

  onUnmounted(() => {
    mql?.removeEventListener('change', onSystemColorChange);
  });

  /** `auto` 解析为系统偏好；显式 `light` / `dark` 原样返回 */
  const effectiveMode = computed<ThemeMode>(() =>
    mode.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : mode.value
  );

  // —— 暗色模式 class 同步（首帧前由 createThemeInitScript 应用，此处幂等并负责运行中切换）——
  // class 名与 darkSelector 机制保持一致：'media' 不切换任何 class。
  //
  // 切换时临时禁用 CSS 过渡（复刻 @vueuse/core useColorMode 的 disableTransition
  // 手法）：注入 `*{transition:none!important}` → 切换 class → 强制 reflow → 移除。
  // 否则带 `transition-all` 的组件（如按钮）会相对无过渡的页面背景延迟 150ms 才变色。
  //
  // 监听 `effectiveMode`（而非偏好 `mode`）：`auto` 会解析为系统 `prefers-color-scheme`，
  // 且系统偏好变化时 computed 重新求值，从而在 `auto` 下也能随 OS 明暗切换同步 class。
  //
  // `color-scheme` 必须在这里一并同步：首帧脚本把它写成**行内样式**，而行内样式压过
  // 任何选择器——只切 class 的话，`.dark` 块里的声明永远赢不了首帧那个陈旧值，UA 绘制的
  // 界面（滚动条 / 表单控件 / canvas）会一直停在 light。两个写入者（脚本 + 此处）都走
  // `resolveDocumentColorScheme`，因此口径一致。
  watch(
    effectiveMode,
    value => {
      if (typeof document === 'undefined') {
        return;
      }

      const darkSelector = props.theme?.darkSelector ?? 'class';
      const darkClass = getDarkClass(darkSelector);

      document.documentElement.style.colorScheme = resolveDocumentColorScheme(value, darkSelector);

      if (!darkClass) {
        return;
      }

      const disableTransitionsStyle = document.createElement('style');
      disableTransitionsStyle.appendChild(
        document.createTextNode(
          '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
        )
      );
      document.head.appendChild(disableTransitionsStyle);

      document.documentElement.classList.toggle(darkClass, value === 'dark');

      // 强制浏览器同步重算样式，确保禁用过渡的规则在 class 切换前生效
      void window.getComputedStyle(disableTransitionsStyle).opacity;
      document.head.removeChild(disableTransitionsStyle);
    },
    { immediate: true }
  );

  // —— 缓存失效版本：storage 事件触发后递增，强制主题重派生 ——
  const cacheVersion = ref(0);

  // —— 自定义 preset（随主题信封持久化；persistTheme 关闭时仅内存态）——
  const customPresets = ref<Record<string, ThemePresetColors>>(
    (persisted?.presets as Record<string, ThemePresetColors> | undefined) ?? {}
  );
  const appliedPresetName = ref<string | null>(persisted?.appliedPreset ?? null);

  /**
   * 跨标签页同步：另开标签页写入主题信封后，重读并同步到内存状态，
   * 递增缓存版本强制主题重派生。`themeConfig` 注入（SSR）时不重读 localStorage。
   */
  const refreshThemeConfig = (): void => {
    if (!props.persistTheme || props.themeConfig) {
      return;
    }

    const envelope = readThemeEnvelope();

    if (envelope) {
      Object.assign(themeState, envelope.options, { mode: envelope.mode ?? themeState.mode });
      customPresets.value = (envelope.presets as Record<string, ThemePresetColors> | undefined) ?? {};
      appliedPresetName.value = envelope.appliedPreset ?? null;
    }

    cacheVersion.value++;
  };

  const savePreset = (name: string): boolean => {
    const preset: ThemePresetColors = {
      light: { primary: `${primary.value}.600`, ring: `${primary.value}.500` },
      dark: { primary: `${primary.value}.400`, ring: `${primary.value}.300` }
    };

    customPresets.value = { ...customPresets.value, [name]: preset };
    setAppliedPreset(name);

    return true;
  };

  const removePreset = (name: string): boolean => {
    if (!(name in customPresets.value)) {
      return false;
    }

    const next = { ...customPresets.value };

    delete next[name];
    customPresets.value = next;

    if (appliedPresetName.value === name) {
      setAppliedPreset(null);
    }

    return true;
  };

  const applyPreset = (name: string): void => {
    setAppliedPreset(name);
  };

  const resetPreset = (): void => {
    setAppliedPreset(null);
  };

  const setAppliedPreset = (name: string | null): void => {
    appliedPresetName.value = name;
  };

  // —— 有效主题：显式 theme prop 覆盖内部状态 ——
  const resolvePreset = (): ThemePresetColors | undefined => {
    const input = props.theme?.preset;

    // 内联 mode-split preset（自定义颜色）直接使用，不受 persistTheme 限制
    if (isInlineColorPreset(input)) {
      return input;
    }

    // 具名 preset 引用（{ name }）或当前应用的 preset
    const presetName = (input as { name?: string } | undefined)?.name ?? appliedPresetName.value;

    if (!presetName) {
      return undefined;
    }

    if (!props.persistTheme) {
      return undefined;
    }

    // SSR：走注入的 presetProvider（应用层注册表）；客户端：读内存 preset 表。
    const preset = isServer ? (props.presetProvider?.(presetName) ?? undefined) : customPresets.value[presetName];

    if (!preset && isServer) {
      console.warn(`[SConfigProvider] theme preset "${presetName}" not found, falling back to built-in colors.`);
    }

    return preset;
  };

  const theme = computed<ThemeOptions>(() => {
    // 依赖缓存版本：storage 事件置脏后强制重派生（映射表重新解析）
    void cacheVersion.value;

    const t = props.theme ?? {};

    // 内联颜色预设 → overrides；具名 preset 引用在 resolvePreset 中已解析为
    // 颜色。显式 `overrides` 优先于解析出的 preset。
    const colorPreset = resolvePreset();

    const overrides: ThemeOverrides | undefined =
      t.overrides ??
      themeState.overrides ??
      (colorPreset
        ? {
            light: colorPreset.light,
            ...(colorPreset.dark ? { dark: colorPreset.dark } : {})
          }
        : undefined);

    return {
      base: t.base ?? themeState.base ?? DEFAULT_BASE,
      primary: t.primary ?? themeState.primary ?? DEFAULT_PRIMARY,
      feedback: t.feedback ?? themeState.feedback,
      overrides,
      // size/radius 作为顶层选项传入：来源为持久化状态 → size prop。
      size: t.size ?? themeState.size ?? props.size ?? DEFAULT_SIZE,
      radius: t.radius ?? themeState.radius ?? DEFAULT_RADIUS,
      // 间距单位：只影响 padding / margin / gap / inset，不动尺寸与字号
      spacing: t.spacing ?? themeState.spacing,
      // 字体族：引擎的三条 `--font-*` 字面量，改一只影响字族栈
      font: t.font ?? themeState.font,
      format: t.format ?? themeState.format,
      surfaceStyle: t.surfaceStyle ?? themeState.surfaceStyle,
      borderOpacity: t.borderOpacity ?? themeState.borderOpacity,
      styleTarget: t.styleTarget ?? themeState.styleTarget,
      darkSelector: t.darkSelector ?? themeState.darkSelector
    };
  });

  return {
    base,
    primary,
    radius,
    size,
    spacing,
    mode,
    effectiveMode,
    setRadius: value => {
      radius.value = value;
    },
    setSize: value => {
      size.value = value;
    },
    setSpacing: value => {
      spacing.value = value;
    },
    setMode: value => {
      mode.value = value;
    },
    customPresets,
    appliedPresetName,
    savePreset,
    removePreset,
    applyPreset,
    resetPreset,
    theme,
    setThemeState: (config: ThemeSettingsState) => {
      Object.assign(themeState, config);
    },
    refreshThemeConfig
  };
}
