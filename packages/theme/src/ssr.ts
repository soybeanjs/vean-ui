import { darkClassName, resolveDocumentColorScheme } from './shared';
import { THEME_STORAGE_KEY, THEME_STYLE_ID } from './storage';
import type { DarkSelectorValue } from './types';

/**
 * First-paint helpers (docs/theme.md §6.3).
 *
 * The mechanism is a **single runtime `<style id="vean-theme">` owned by the
 * head script and taken over by the provider**:
 *
 * - the static palette table + the default alias block ship with the preset
 *   (emitted with `:where()` — zero specificity), so the page is themed with no
 *   JavaScript at all;
 * - a non-default theme needs its block applied before the first paint, and a
 *   head inline script necessarily runs *before* the body exists — so it writes
 *   the runtime element itself (creating it in `<head>` when absent) and the
 *   provider adopts that same element on mount;
 * - precedence comes from **specificity, not `!important`**: the static default
 *   layer is `:where(...)`-weakened, so the plain-selector runtime block wins
 *   regardless of source order (a head script cannot be ordered after the
 *   stylesheet, which is why the first generation had to resort to `!important`).
 *
 * Two placement rules for the consumer (they cannot be enforced from here): the
 * script must be the **first** `<script>` in `<head>` (a parser-inserted script
 * after a blocking stylesheet is deferred by the HTML spec), and it should carry
 * the page's `nonce` when a CSP is in force — the tag, not the helper, owns that.
 */

/** whether the current runtime is a server (no `window`), SSR-safe. */
export function isServerRuntime(): boolean {
  return typeof window === 'undefined';
}

/** options of the inline init script. */
export interface ThemeInitScriptOptions {
  /** the envelope key; must match the writer's key. */
  storageKey?: string;
  /** the style element to patch. */
  styleId?: string;
  /** how dark mode is expressed in the generated CSS. */
  darkSelector?: DarkSelectorValue;
  /**
   * whether the script also sets `documentElement.style.colorScheme`.
   *
   * The engine's CSS already carries `color-scheme` per block; setting it inline
   * as well makes the UA-drawn surfaces (canvas, scrollbars, form controls)
   * correct even when the stylesheet has not been parsed yet.
   *
   * @defaultValue true
   */
  setColorScheme?: boolean;
}

/**
 * generate the inline `<head>` script that applies the persisted theme before
 * the first paint.
 *
 * It reads the envelope, toggles the dark class from the stored preference
 * (`auto` resolves against `prefers-color-scheme`), sets `color-scheme` and
 * patches the alias block into the style element. Every step is guarded, so a
 * missing/blocked storage or a foreign payload degrades to the static default
 * theme instead of throwing.
 */
export function createThemeInitScript(options: ThemeInitScriptOptions = {}): string {
  const {
    storageKey = THEME_STORAGE_KEY,
    styleId = THEME_STYLE_ID,
    darkSelector = 'class',
    setColorScheme = true
  } = options;
  const darkClass = darkClassName(darkSelector) ?? '';
  const statements = [
    '(function () {',
    '  try {',
    '    var doc = document.documentElement;',
    '    var raw = null;',
    // 裸全局标识符而非 `window.x`：浏览器里二者等价，但脚本在非 window 作用域
    // （worker / 测试宿主）下也能运行
    `    try { raw = localStorage.getItem(${JSON.stringify(storageKey)}); } catch (e) {}`,
    '    if (!raw) return;',
    '    var env = JSON.parse(raw);',
    '    if (!env) return;',
    '    var mode = env.mode;',
    '    var auto = mode !== "light" && mode !== "dark";',
    '    var prefersDark = typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;',
    '    var isDark = mode === "dark" || (auto && prefersDark);'
  ];

  if (darkClass) {
    statements.push(`    doc.classList.toggle(${JSON.stringify(darkClass)}, isDark);`);
  }

  if (setColorScheme) {
    const lightScheme = resolveDocumentColorScheme('light', darkSelector);
    const darkScheme = resolveDocumentColorScheme('dark', darkSelector);

    // media mode advertises both schemes whichever way the OS currently leans,
    // so the value is a constant there and the ternary would be noise.
    statements.push(
      lightScheme === darkScheme
        ? `    doc.style.colorScheme = ${JSON.stringify(lightScheme)};`
        : `    doc.style.colorScheme = isDark ? ${JSON.stringify(darkScheme)} : ${JSON.stringify(lightScheme)};`
    );
  }

  statements.push(
    '    var css = env.style;',
    '    if (typeof css === "string" && css) {',
    `      var style = document.getElementById(${JSON.stringify(styleId)});`,
    '      if (!style) {',
    '        style = document.createElement("style");',
    `        style.id = ${JSON.stringify(styleId)};`,
    '        document.head.appendChild(style);',
    '      }',
    '      style.textContent = css;',
    '    }',
    '  } catch (e) {}',
    '})();'
  );

  return statements.join('\n');
}
