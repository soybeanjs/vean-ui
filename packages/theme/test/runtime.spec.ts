import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createThemeInitScript } from '../src/ssr';
import {
  THEME_ENVELOPE_VERSION,
  THEME_STORAGE_KEY,
  THEME_STYLE_ID,
  clearThemeEnvelope,
  createThemeWriter,
  parseThemeEnvelope,
  parseThemeOptions,
  readThemeEnvelope,
  writeThemeEnvelope
} from '../src/storage';

/**
 * P4 —— persistence + first paint (docs/theme.md §6.2–§6.3).
 *
 * The envelope contract: one key, per-field validation (a bad field must not
 * discard the rest), version-gated reads, and one debounced writer.
 */

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  // 测试共享同一个 happy-dom 文档：先清掉 <html> 上的类/内联样式与 body 内容，
  // 否则断言会依赖执行顺序
  document.documentElement.className = '';
  document.documentElement.style.colorScheme = '';
  document.body.innerHTML = '';
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key)
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('theme envelope', () => {
  it('round-trips options, mode and the alias snapshot', () => {
    const ok = writeThemeEnvelope({
      options: { base: 'slate', primary: 'emerald', surfaceStyle: 'flat' },
      mode: 'auto',
      style: ':root{--background:var(--slate-100)}'
    });

    expect(ok).toBe(true);

    const envelope = readThemeEnvelope();

    expect(envelope).toMatchObject({
      v: THEME_ENVELOPE_VERSION,
      mode: 'auto',
      options: { base: 'slate', primary: 'emerald', surfaceStyle: 'flat' }
    });
    expect(envelope?.style).toContain('--background');
    expect(store.has(THEME_STORAGE_KEY)).toBe(true);
  });

  it('keeps valid fields and drops only the invalid ones', () => {
    const options = parseThemeOptions({
      base: 'not-a-palette',
      primary: 'rose',
      surfaceStyle: 'flat',
      styleTarget: 'body',
      borderOpacity: 2,
      format: 'oklch'
    });

    expect(options).toEqual({ primary: 'rose', surfaceStyle: 'flat', format: 'oklch' });
  });

  it('accepts a spacing preset or a bounded grid multiplier, and nothing else', () => {
    expect(parseThemeOptions({ spacing: 'spacious' })).toEqual({ spacing: 'spacious' });
    expect(parseThemeOptions({ spacing: 1.25 })).toEqual({ spacing: 1.25 });
    // 一个坏值只丢自己：倍率有界（0 < k ≤ 4），预设必须是已知键
    expect(parseThemeOptions({ spacing: 0, radius: 'lg' })).toEqual({ radius: 'lg' });
    expect(parseThemeOptions({ spacing: 99 })).toEqual({});
    expect(parseThemeOptions({ spacing: 'unit' })).toEqual({});
  });

  it('keeps overrides that carry string values and drops the rest', () => {
    const options = parseThemeOptions({
      overrides: { light: { primary: 'zinc.800', card: 42 }, dark: { carbon: 'oklch(20% 0 0)' } }
    });

    expect(options.overrides).toEqual({
      light: { primary: 'zinc.800' },
      dark: { carbon: 'oklch(20% 0 0)' }
    });
  });

  it('drops override keys that are not tokens of the current contract', () => {
    // 键也是契约的一部分（§6.2）：未知键被展开进模式映射后，发射器会为它写一条
    // 声明；若只覆盖了一个模式，另一个模式读不到该键，发射器的暗色差异块会读到
    // undefined 并抛错（v1 信封正是这样把 provider 打挂的）
    const options = parseThemeOptions({
      overrides: { light: { card: 'zinc.100', ghost: 'zinc.300', 'border-strong': 'zinc.600' } }
    });

    expect(options.overrides).toEqual({ light: { card: 'zinc.100' } });
  });

  it('returns null for malformed, empty and future-versioned payloads', () => {
    expect(parseThemeEnvelope('not json')).toBeNull();
    expect(parseThemeEnvelope('null')).toBeNull();
    expect(parseThemeEnvelope(JSON.stringify({ v: THEME_ENVELOPE_VERSION + 1, options: {} }))).toBeNull();
    expect(readThemeEnvelope()).toBeNull();
  });

  it('translates a v1 payload into the current vocabulary instead of discarding it', () => {
    // v2 改了 token 名（§3.12）：旧信封的键要**翻译**而不是当成未知 token 应用，
    // 也不该整份丢弃（用户的自定义主题应当活过版本升级）
    const envelope = parseThemeEnvelope(
      JSON.stringify({
        v: 1,
        mode: 'dark',
        options: {
          base: 'zinc',
          overrides: {
            light: { surface: 'stone.200', elevated: 'stone.100', 'sidebar-surface': 'stone.50' }
          }
        },
        presets: {
          mine: {
            light: { surface: 'stone.200', elevated: 'stone.100' },
            dark: { scrim: 'black' }
          },
          // 键全部属于已删除的 token：整条 preset 没有可迁移的内容
          dead: { light: { 'border-strong': 'zinc.600', 'destructive-subtle': 'red.50' } }
        },
        appliedPreset: 'dead'
      })
    );

    expect(envelope?.v).toBe(THEME_ENVELOPE_VERSION);
    expect(envelope?.options.overrides).toEqual({
      light: { card: 'stone.200', popover: 'stone.100', sidebar: 'stone.50' }
    });
    expect(envelope?.presets).toEqual({
      mine: { light: { card: 'stone.200', popover: 'stone.100' }, dark: { mask: 'black' } }
    });
    // preset 迁移后消失了，就不能再声称它已应用
    expect(envelope?.appliedPreset).toBeUndefined();
    expect(envelope?.mode).toBe('dark');
  });

  it('drops a pre-v2 style snapshot but keeps a current one', () => {
    const v1 = parseThemeEnvelope(
      JSON.stringify({
        v: 1,
        options: {},
        style: ':root {\n  --vean-background: var(--zinc-50);\n}'
      })
    );
    const v2 = parseThemeEnvelope(
      JSON.stringify({
        v: THEME_ENVELOPE_VERSION,
        options: {},
        style: ':root {\n  --background: var(--zinc-50);\n}'
      })
    );

    // 快照是引擎产物：旧词汇的快照会让首帧停在没有主题变量的静态默认层上，
    // 并且注入一批死声明；provider 挂载后会按迁移后的 options 重发并写回
    expect(v1?.style).toBeUndefined();
    expect(v2?.style).toContain('--background');
  });

  it('normalizes a version-less (v0) payload', () => {
    const envelope = parseThemeEnvelope(JSON.stringify({ options: { base: 'zinc' }, mode: 'dark' }));

    expect(envelope?.v).toBe(THEME_ENVELOPE_VERSION);
    expect(envelope?.options.base).toBe('zinc');
  });

  it('drops an oversized style snapshot instead of failing the write', () => {
    writeThemeEnvelope({ options: {}, style: 'x'.repeat(70 * 1024) });

    expect(readThemeEnvelope()?.style).toBeUndefined();
  });

  it('survives blocked storage on read, write and clear', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      }
    });

    expect(readThemeEnvelope()).toBeNull();
    expect(writeThemeEnvelope({ options: {} })).toBe(false);
    expect(() => clearThemeEnvelope()).not.toThrow();
  });

  it('clears the envelope', () => {
    writeThemeEnvelope({ options: { base: 'zinc' } });
    clearThemeEnvelope();

    expect(readThemeEnvelope()).toBeNull();
  });
});

describe('debounced writer', () => {
  it('collapses rapid writes into one', () => {
    vi.useFakeTimers();
    const writer = createThemeWriter({ delay: 200 });

    writer.write({ options: { base: 'zinc' } });
    writer.write({ options: { base: 'slate' } });
    writer.write({ options: { base: 'stone' } });

    expect(readThemeEnvelope()).toBeNull();

    vi.advanceTimersByTime(200);

    expect(readThemeEnvelope()?.options.base).toBe('stone');
    vi.useRealTimers();
  });

  it('flushes and cancels explicitly', () => {
    vi.useFakeTimers();
    const writer = createThemeWriter({ delay: 500 });

    writer.write({ options: { base: 'slate' } });
    writer.cancel();
    vi.advanceTimersByTime(500);
    expect(readThemeEnvelope()).toBeNull();

    writer.write({ options: { base: 'stone' } });
    writer.flush();
    expect(readThemeEnvelope()?.options.base).toBe('stone');
    vi.useRealTimers();
  });
});

describe('first-paint script', () => {
  const runScript = (script: string): void => {
    // the generated script is an IIFE over `document` / `window`
    new Function(script)();
  };

  it('patches the existing style element instead of adding one', () => {
    document.head.innerHTML = '';
    document.body.innerHTML = `<style id="${THEME_STYLE_ID}">:root{--background:var(--zinc-100)}</style>`;
    writeThemeEnvelope({
      options: {},
      mode: 'dark',
      style: ':root{--background:var(--slate-900)}'
    });

    const stylesBefore = document.querySelectorAll('style').length;
    runScript(createThemeInitScript());

    expect(document.querySelectorAll('style').length).toBe(stylesBefore);
    expect(document.getElementById(THEME_STYLE_ID)?.textContent).toContain('var(--slate-900)');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('does nothing without a stored envelope', () => {
    document.head.innerHTML = '';
    document.body.innerHTML = `<style id="${THEME_STYLE_ID}">untouched</style>`;

    runScript(createThemeInitScript());

    expect(document.getElementById(THEME_STYLE_ID)?.textContent).toBe('untouched');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('resolves auto against the OS preference and honours the media selector', () => {
    document.documentElement.classList.remove('dark');
    writeThemeEnvelope({ options: {}, mode: 'auto' });
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('dark'),
      media: query
    }));
    runScript(createThemeInitScript());
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    document.documentElement.classList.remove('dark');
    runScript(createThemeInitScript({ darkSelector: 'media' }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    vi.unstubAllGlobals();
  });

  it('advertises both schemes in media mode so the OS can flip without a rewrite', () => {
    writeThemeEnvelope({ options: {}, mode: 'dark' });
    runScript(createThemeInitScript({ darkSelector: 'media' }));

    // media 模式下暗色块本身不发 `color-scheme`（它已经在
    // `@media (prefers-color-scheme: dark)` 里），文档级则必须两种都宣告：
    // 钉死成 "dark" 会让 OS 之后切回亮色时留下一个压过媒体查询的行内值
    expect(document.documentElement.style.colorScheme).toBe('light dark');
  });

  it('keeps a custom dark selector and can skip color-scheme', () => {
    document.documentElement.classList.remove('night');
    writeThemeEnvelope({ options: {}, mode: 'dark' });
    runScript(createThemeInitScript({ darkSelector: '.night', setColorScheme: false }));

    expect(document.documentElement.classList.contains('night')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('');
  });

  it('creates the runtime element only when the page has none, and never uses !important', () => {
    document.body.innerHTML = '';
    writeThemeEnvelope({
      options: {},
      mode: 'light',
      style: ':root{--background:var(--slate-50)}'
    });

    runScript(createThemeInitScript());

    expect(document.getElementById(THEME_STYLE_ID)?.textContent).toContain('--slate-50');
    expect(document.querySelectorAll(`#${THEME_STYLE_ID}`).length).toBe(1);

    // 再跑一次不应新增第二个元素
    runScript(createThemeInitScript());
    expect(document.querySelectorAll(`#${THEME_STYLE_ID}`).length).toBe(1);

    const script = createThemeInitScript();

    expect(script).not.toContain('!important');
    expect(script).toContain('appendChild');
  });
});
