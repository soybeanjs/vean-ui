/**
 * Client-side theme state, mirroring `@vean/theme`'s storage contract.
 *
 * The envelope, the storage key and the DOM side effects (`.dark` class,
 * `color-scheme`, the `<style id="vean-theme">` block) are copied from
 * `packages/theme/src/ssr.ts` (`createThemeInitScript`) so a value written by the
 * Astro toolbar is read back by the same head script — and so the two sites share
 * one `localStorage` shape if they are ever served from the same origin.
 */
export const THEME_STORAGE_KEY = '__VEAN_THEME';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeEnvelope {
  mode: ThemeMode;
  /** Serialized theme CSS emitted by the customizer; empty when untouched. */
  style?: string;
}

export function readTheme(): ThemeEnvelope {
  if (typeof localStorage === 'undefined') {
    return { mode: 'auto' };
  }

  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);

    if (!raw) {
      return { mode: 'auto' };
    }

    const parsed = JSON.parse(raw) as Partial<ThemeEnvelope>;

    return { mode: (parsed.mode as ThemeMode) ?? 'auto', style: parsed.style };
  } catch {
    return { mode: 'auto' };
  }
}

export function writeTheme(envelope: ThemeEnvelope): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    // Private-mode browsers reject the write; the DOM update below still applies.
  }

  applyTheme(envelope);
}

/** Same DOM effects as the inline head script. */
export function applyTheme(envelope: ThemeEnvelope): void {
  if (typeof document === 'undefined') {
    return;
  }

  const doc = document.documentElement;
  const mode = envelope.mode;
  const prefersDark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = mode === 'dark' || (mode !== 'light' && mode !== 'dark' && prefersDark);

  doc.classList.toggle('dark', isDark);
  doc.style.colorScheme = isDark ? 'dark' : 'light';

  if (typeof envelope.style === 'string' && envelope.style) {
    let style = document.getElementById('vean-theme');

    if (!style) {
      style = document.createElement('style');
      style.id = 'vean-theme';
      document.head.append(style);
    }

    style.textContent = envelope.style;
  }
}

/** Resolve `auto` against the current system preference (for label/icon state). */
export function resolvedMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }

  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
