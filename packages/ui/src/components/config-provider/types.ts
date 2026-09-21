import type { ConfigProviderProps as _ConfigProviderProps } from '@vean/aria/config-provider';
import type { ProgressProviderProps } from '@vean/aria/progress';
import type { ThemeOptions } from '@vean/theme';
import type { ThemeEnvelopeInput } from '@vean/theme/storage';
import type { ThemeSize } from '@/theme';
import type { ThemePresetColors, ThemePresetInput } from '@/theme/types';
import type { ToastProviderProps } from '../toast/types';

/**
 * UI-level theme options accepted by `SConfigProvider`.
 *
 * The engine's `ThemeOptions` carries `overrides` for inline token overrides.
 * The provider additionally accepts a `preset` input — either an inline
 * mode-split override or a `{ name }` reference to a stored preset. The
 * provider resolves named references to their colors and materializes the
 * result as `overrides` before handing the options to the engine, so the
 * engine only ever receives resolved options.
 */
export type ConfigProviderThemeOptions = ThemeOptions & {
  /**
   * A custom color preset: either an inline mode-split override (light/dark
   * partial tokens) or a `{ name }` reference to a stored preset. Resolved to
   * `overrides` before the engine resolves the map.
   */
  preset?: ThemePresetInput;
};

export interface IconifyOptions {
  /**
   * The default width of the icon.
   *
   * @defaultValue '1.25em'
   */
  width?: string;
  /**
   * The default height of the icon.
   *
   * @defaultValue '1.25em'
   */
  height?: string;
}

/**
 * Properties for the ConfigProvider component.
 */
export interface ConfigProviderProps extends _ConfigProviderProps {
  /** The theme options. */
  theme?: ConfigProviderThemeOptions;
  /**
   * The size options.
   *
   * @deprecated Use `theme.size` instead.
   */
  size?: ThemeSize;
  /** The iconify options. */
  iconify?: IconifyOptions;
  /** The global top progress configuration of your application. */
  progress?: Partial<ProgressProviderProps>;
  /** The global toast configuration of your application. This will be inherited by the related components. */
  toast?: Partial<ToastProviderProps>;
  /**
   * Whether to use custom toast rendering. If set to `true`, the `ToastProvider` will not render the default toast UI, and you can import `ToastProvider` component to render custom toast UI.
   *
   * @default false
   */
  customToast?: boolean;
  /**
   * Whether to enable persisted theme reading from localStorage.
   *
   * When disabled (default), the ConfigProvider only consumes the explicit
   * `theme` prop and never reads or writes any storage, keeping the current
   * behavior. When enabled, the persisted theme envelope fills in keys not
   * explicitly provided by `theme`, and changes are written back through a
   * single debounced writer.
   *
   * @defaultValue false
   */
  persistTheme?: boolean;
  /**
   * The persisted theme envelope injected from the server.
   *
   * Used during SSR to render the same theme the client persisted; on the
   * client the localStorage envelope is the source of truth.
   *
   * @type ThemeEnvelopeInput
   */
  themeConfig?: ThemeEnvelopeInput;
  /**
   * The server-side custom theme preset registry resolver.
   *
   * Maps a stored preset name to its definition so SSR can render custom
   * presets without localStorage access. Only used when `persistTheme` is
   * enabled on the server; on the client the presets table (carried by the
   * theme envelope) is the source of truth.
   *
   * @param name The stored preset name to resolve.
   */
  presetProvider?: (name: string) => ThemePresetColors | null | undefined;
  /**
   * Whether the component is running in a server environment.
   *
   * The UI library is pre-built, so `import.meta.env.SSR` is baked at build
   * time and cannot detect the consumer's runtime. This defaults to runtime
   * detection (`typeof window === 'undefined'`), and can be overridden with
   * the app's own flag (e.g. Nuxt's `import.meta.server`) when the app is
   * bundled for both server and client.
   *
   * @defaultValue isServerRuntime()
   */
  isServer?: boolean;
}

/**
 * Context for the ConfigProvider component: a plain shallow-readonly snapshot of the props.
 */
export type ConfigProviderContext = Readonly<ConfigProviderProps>;

export type { ThemeOptions, ThemePresetColors };
