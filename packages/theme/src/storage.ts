import { isThemeSpacing } from './shared';
import { PALETTE_KEYS, isPaletteKey } from './palette';
import { isSemanticToken } from './semantic';
import type { SemanticToken, SurfaceStyle, ThemeModePreference, ThemeOptions, ThemeOverrides } from './types';

/**
 * Persistence (docs/theme.md §6.2).
 *
 * One key, one envelope, one writer:
 *
 * - **one key** (`__VEAN_THEME`) removes the cross-key races the first
 *   generation had (four keys, three writers, a cross-tab listener that watched
 *   only two of them);
 * - **one envelope** carries the validated options, the light/dark preference and
 *   the style snapshot the first-paint script applies;
 * - **one debounced writer** owns every write, so dragging a knob cannot produce
 *   a write per frame.
 *
 * Everything here is SSR-safe: reads/writes are no-ops without `localStorage`,
 * and every access is wrapped in `try/catch` because blocked storage throws on
 * *access* (Firefox third-party contexts), not just on write.
 */

/** the single storage key. */
export const THEME_STORAGE_KEY = '__VEAN_THEME';

/**
 * the current envelope schema version.
 *
 * v2 renamed the token vocabulary (`surface` → `card`, `elevated` → `popover`,
 * `sidebar-surface` → `sidebar`, `scrim` → `mask`) and deleted several tokens
 * (the status `-text` / `-subtle` / `-border` roles, `border-strong`,
 * `foreground-subtle`). A pre-v2 payload is therefore **translated**, not
 * discarded: `migrateTokenKey` renames what has a v2 counterpart, drops the rest,
 * and the unreadable first-paint snapshot is dropped so the provider re-emits it
 * on mount (docs/theme.md §6.2).
 *
 * Older-but-known versions are accepted on purpose (a returning user keeps their
 * theme); only a **future** version is refused, because that shape cannot be
 * guessed.
 */
export const THEME_ENVELOPE_VERSION = 2;

/** the style element id the first-paint script patches in place. */
export const THEME_STYLE_ID = 'vean-theme';

/**
 * an upper bound for the style snapshot: a runaway value must not fill the
 * user's storage (the alias block is ~6 KB; during the migration the payload also
 * carries the first-generation block, hence the headroom).
 */
const MAX_STYLE_LENGTH = 64 * 1024;

/** the persisted envelope. */
export interface ThemeEnvelope {
  /** the schema version. */
  v: number;
  /** the engine options. */
  options: ThemeOptions;
  /** the light / dark / auto preference. */
  mode?: ThemeModePreference;
  /**
   * the style payload applied by the first-paint script (`#vean-theme`).
   *
   * The snapshot is what removes the theme flash on refresh: the head script
   * applies it before any stylesheet is parsed, then the runtime provider
   * patches the same element in place.
   */
  style?: string;
  /** custom theme presets (the theme customizer's saved color schemes). */
  presets?: Record<string, unknown>;
  /** the name of the currently applied custom preset, if any. */
  appliedPreset?: string;
}

/** what a caller hands to the writer; the version is added for them. */
export type ThemeEnvelopeInput = Omit<ThemeEnvelope, 'v'>;

/** SSR-safe `localStorage`, `null` when unavailable or blocked. */
function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isMode = (value: unknown): value is ThemeModePreference =>
  value === 'light' || value === 'dark' || value === 'auto';

const isSurfaceStyle = (value: unknown): value is SurfaceStyle => value === 'layered' || value === 'flat';

/** non-empty CSS family string (one arm of `ThemeOptions.font`). */
const isFontFamily = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

/**
 * whether a value is a usable `font` option: a record whose known arms are
 * non-empty strings. Unknown arms are ignored by the engine's spread, but a
 * wholly wrong shape is dropped so a stale envelope cannot invent a declaration.
 */
function isThemeFont(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return ['sans', 'heading', 'mono', 'serif'].every(key => {
    const arm = value[key];

    return arm === undefined || isFontFamily(arm);
  });
}

/**
 * the token renames a pre-v2 payload still speaks (docs/theme.md §3.12 / §6.2).
 */
const V1_TOKEN_ALIASES: Readonly<Record<string, string>> = {
  surface: 'card',
  elevated: 'popover',
  'sidebar-surface': 'sidebar',
  scrim: 'mask'
};

/**
 * translate an override key from an older envelope into the current vocabulary.
 *
 * A pre-v2 key is renamed when it has a v2 counterpart and dropped otherwise —
 * the deleted `border-strong` / `foreground-subtle` / `{s}-text` / `{s}-subtle`
 * / `{s}-border` roles, and anything a hand-edited payload invented. Returning
 * `undefined` is what keeps the engine's promise that every emitted declaration
 * belongs to the contract (docs/theme.md §6.2).
 */
function migrateTokenKey(key: string, version: number): SemanticToken | undefined {
  if (isSemanticToken(key)) {
    return key;
  }

  if (version >= THEME_ENVELOPE_VERSION) {
    return undefined;
  }

  const alias = V1_TOKEN_ALIASES[key];

  return alias && isSemanticToken(alias) ? alias : undefined;
}

/**
 * re-key a `token → value` record into the current vocabulary, values untouched.
 *
 * Only non-empty string values survive: this layer deliberately does not encode
 * the override vocabulary (`stone.950` / `oklch(...)` / `token.primary` / …) —
 * `parseOverride` / `applyOverrides` in the pipeline decide what a value means,
 * and an unrecognised complete color is still emitted as-is, so an envelope
 * written before the type was narrowed keeps working.
 */
function migrateTokenRecord(side: unknown, version: number): Record<string, string> | undefined {
  if (!isRecord(side)) {
    return undefined;
  }

  const entries = Object.entries(side).flatMap(([key, value]) => {
    if (typeof value !== 'string' || value.length === 0) {
      return [];
    }

    const token = migrateTokenKey(key, version);

    return token ? [[token, value] as const] : [];
  });

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

/**
 * validate (and, for a pre-v2 payload, translate) the override record, so a stale
 * or hand-edited payload cannot reach the engine.
 */
function parseOverrides(value: unknown, version: number): ThemeOverrides | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const light = migrateTokenRecord(value.light, version) as Partial<Record<SemanticToken, string>> | undefined;
  const dark = migrateTokenRecord(value.dark, version) as Partial<Record<SemanticToken, string>> | undefined;

  return light || dark ? ({ ...(light ? { light } : {}), ...(dark ? { dark } : {}) } as ThemeOverrides) : undefined;
}

/**
 * translate the custom-preset table: each preset carries the same `light` /
 * `dark` token maps as `options.overrides`, so a pre-v2 table is keyed in the old
 * vocabulary too. A preset whose light map translates to nothing is dropped —
 * there is nothing left to apply.
 */
function parsePresets(value: unknown, version: number): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (version >= THEME_ENVELOPE_VERSION) {
    return value;
  }

  const entries = Object.entries(value).flatMap(([name, preset]) => {
    if (!isRecord(preset)) {
      return [[name, preset] as const];
    }

    const light = migrateTokenRecord(preset.light, version);

    if (!light) {
      return [];
    }

    const dark = migrateTokenRecord(preset.dark, version);

    return [[name, dark ? { light, dark } : { light }] as const];
  });

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

/**
 * validate and normalize engine options.
 *
 * Invalid *fields* are dropped while the rest of the configuration survives —
 * the first generation discarded the whole config as soon as one enum was
 * unknown, which silently reset the user's colour scheme (audit P1-4).
 */
export function parseThemeOptions(value: unknown, version: number = THEME_ENVELOPE_VERSION): ThemeOptions {
  if (!isRecord(value)) {
    return {};
  }

  const options: Record<string, unknown> = {};
  const copy = (key: keyof ThemeOptions, valid: (input: unknown) => boolean): void => {
    if (value[key] !== undefined && valid(value[key])) {
      options[key] = value[key];
    }
  };

  copy('base', input => isPaletteKey(input) && (PALETTE_KEYS as readonly string[]).includes(input as string));
  copy('primary', input => isPaletteKey(input) && (PALETTE_KEYS as readonly string[]).includes(input as string));
  copy('feedback', input => typeof input === 'string' && input.length > 0);
  copy('surfaceStyle', isSurfaceStyle);
  copy('prefix', input => input === false || (typeof input === 'string' && input.length > 0));
  copy('size', input => typeof input === 'string' && input.length > 0);
  copy('radius', input => typeof input === 'string' && input.length > 0);
  // 间距刻度：预设键或网格倍率（有界，避免一个坏值把整条间距刻度清零或撑爆）
  copy(
    'spacing',
    input => isThemeSpacing(input) || (typeof input === 'number' && Number.isFinite(input) && input > 0 && input <= 4)
  );
  // 字体：{ sans?, heading?, mono? }，每臂为非空字符串（完整 stack 或字体名）
  copy('font', isThemeFont);
  copy('borderOpacity', input => typeof input === 'number' && input >= 0 && input <= 1);
  copy('format', input => input === 'hsl' || input === 'oklch');
  copy('styleTarget', input => input === 'html' || input === ':root');
  copy('darkSelector', input => typeof input === 'string' && input.length > 0);

  const overrides = parseOverrides(value.overrides, version);

  if (overrides) {
    options.overrides = overrides;
  }

  return options as ThemeOptions;
}

/**
 * parse a stored envelope.
 *
 * Returns `null` for a missing, malformed or **future-versioned** payload: an
 * unknown schema is never guessed (the version is bumped when the shape changes).
 */
export function parseThemeEnvelope(raw: string | null | undefined): ThemeEnvelope | null {
  if (!raw) {
    return null;
  }

  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(data)) {
    return null;
  }

  const version = typeof data.v === 'number' && Number.isInteger(data.v) && data.v > 0 ? data.v : 0;

  if (version > THEME_ENVELOPE_VERSION) {
    return null;
  }

  const envelope: ThemeEnvelope = {
    v: THEME_ENVELOPE_VERSION,
    options: parseThemeOptions(data.options, version)
  };

  if (isMode(data.mode)) {
    envelope.mode = data.mode;
  }

  /**
   * The snapshot is **engine output**, so a pre-v2 one declares variables this
   * engine no longer reads (`--vean-*`, `--surface`, …). Applying it would leave
   * the first paint on the static default block *and* inject dead declarations,
   * so it is dropped: the provider emits the migrated theme from
   * `envelope.options` on mount and writes the fresh snapshot back through the
   * writer, which makes the next load exact.
   */
  if (
    version >= THEME_ENVELOPE_VERSION &&
    typeof data.style === 'string' &&
    data.style.length > 0 &&
    data.style.length <= MAX_STYLE_LENGTH
  ) {
    envelope.style = data.style;
  }

  const presets = parsePresets(data.presets, version);

  if (presets) {
    envelope.presets = presets;
  }

  // 迁移后 preset 可能整条消失（键全属旧词汇）：此时不能再声称它已应用
  if (
    typeof data.appliedPreset === 'string' &&
    data.appliedPreset.length > 0 &&
    (presets === undefined || data.appliedPreset in presets)
  ) {
    envelope.appliedPreset = data.appliedPreset;
  }

  return envelope;
}

/** read the persisted envelope (SSR-safe). */
export function readThemeEnvelope(key: string = THEME_STORAGE_KEY): ThemeEnvelope | null {
  let raw: string | null = null;

  try {
    raw = getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }

  return parseThemeEnvelope(raw);
}

/** write the envelope (SSR-safe; returns whether the write landed). */
export function writeThemeEnvelope(envelope: ThemeEnvelopeInput, key: string = THEME_STORAGE_KEY): boolean {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  const payload: ThemeEnvelope = { v: THEME_ENVELOPE_VERSION, ...envelope };

  if (payload.style && payload.style.length > MAX_STYLE_LENGTH) {
    delete payload.style;
  }

  try {
    storage.setItem(key, JSON.stringify(payload));

    return true;
  } catch {
    return false;
  }
}

/** remove the envelope (SSR-safe). */
export function clearThemeEnvelope(key: string = THEME_STORAGE_KEY): void {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // 存储被禁用时无需处理：没有写入就没有需要清理的状态
  }
}

/** the debounced single writer. */
export interface ThemeWriter {
  /** queue a write; the latest payload wins within the debounce window. */
  write(envelope: ThemeEnvelopeInput): void;
  /** write immediately (page hide, tests). */
  flush(): void;
  /** drop a queued write. */
  cancel(): void;
}

/**
 * create the single debounced writer for the theme envelope.
 *
 * One writer per application removes the "two watchers write two keys" race of
 * the first generation, and the debounce keeps a slider drag from writing on
 * every frame.
 */
export function createThemeWriter(options: { key?: string; delay?: number } = {}): ThemeWriter {
  const { key = THEME_STORAGE_KEY, delay = 250 } = options;
  let pending: ThemeEnvelopeInput | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    if (pending) {
      writeThemeEnvelope(pending, key);
      pending = null;
    }
  };

  return {
    write: envelope => {
      pending = envelope;

      if (timer !== null) {
        return;
      }

      timer = setTimeout(flush, delay);
    },
    flush,
    cancel: () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }

      pending = null;
    }
  };
}
