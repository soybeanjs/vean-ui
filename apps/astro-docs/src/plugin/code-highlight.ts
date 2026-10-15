import { createHighlighter } from 'shiki';
import type { HighlighterCore } from 'shiki/core';

/**
 * Build-time code highlighting for the `<UsageCode>` blocks.
 *
 * The ubean site leaves fences empty in the SSR HTML and fills them on the client
 * (`code-block.vue` + `shared/highlight.ts`, lazily on viewport intersection). Here the
 * work happens once at build time instead, so the page ships final markup and no
 * highlighting JS at all — that difference is deliberate and is part of what the
 * comparison measures.
 *
 * The output is byte-compatible with what the ubean build emits for a fence:
 * `pre.shiki.md-code-block[data-lang]` with the copy button as its first child, which
 * is what the shared `styles/markdown.css` / `styles/global.css` key off.
 */

const THEMES = { light: 'one-light', dark: 'one-dark-pro' } as const;

const LANGS = [
  'vue',
  'ts',
  'tsx',
  'js',
  'jsx',
  'bash',
  'json',
  'jsonc',
  'html',
  'css',
  'scss',
  'yaml',
  'markdown',
  'text'
] as const;

type GrammarLang = Exclude<(typeof LANGS)[number], 'text'>;

let highlighterPromise: Promise<HighlighterCore> | undefined;

async function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighter({
    themes: Object.values(THEMES),
    langs: LANGS.filter(lang => lang !== 'text')
  });

  return highlighterPromise;
}

/** `@vean/ui` renders its copy button with a lucide icon; the static mirror inlines it. */
const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">' +
  '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">' +
  '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>' +
  '</g></svg>';

/**
 * The ubean build renders this button with `SButtonIcon`, so the static mirror reuses
 * the exact class string that component produced — the shared stylesheet is the only
 * thing that has to line up, and copying the classes keeps both sites pixel-identical.
 */
const COPY_BUTTON_CLASS =
  'inline-flex items-center justify-center font-medium transition-all-150 outline-none focus-visible:ring-3 ' +
  'focus-visible:ring-offset-card data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ' +
  'focus-visible:ring-accent-foreground/10 text-accent-foreground bg-transparent text-sm rounded-md ' +
  'data-[normal]:hover:bg-accent data-[normal]:active:bg-accent-foreground/10 h-8 p-0 gap-0 w-8 shadow-none ' +
  'absolute end-3 top-3 z-10 opacity-78 transition-opacity duration-200 hover:opacity-100';

function encodeBase64Utf8(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64');
}

function copyButton(code: string): string {
  return (
    `<button data-vean-button data-normal type="button" class="${COPY_BUTTON_CLASS}" ` +
    `aria-label="Copy code" data-copy-code="${encodeBase64Utf8(code)}">${COPY_ICON}</button>`
  );
}

/**
 * Highlights `code` into the docs' fence markup. `lang` outside the preloaded set
 * degrades to a plain-text passthrough, matching the client-side loader's fallback.
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  const loaded = highlighter.getLoadedLanguages().includes(lang);
  const resolvedLang: GrammarLang = loaded ? (lang as GrammarLang) : 'text';

  const html = highlighter.codeToHtml(code, {
    lang: resolvedLang,
    themes: THEMES,
    defaultColor: false
  });

  // Shiki emits `<pre class="shiki shiki-themes <light> <dark>" style="...">`; the docs'
  // stylesheet expects `shiki md-code-block` plus the grammar on `data-lang`, and the
  // copy button as the first child of the `<pre>`. The extra theme-name classes are kept
  // (harmless, and they are what the ubean build also emits).
  return html.replace(/<pre class="([^"]*)"([^>]*)>/, (_match, classes: string, rest: string) => {
    const style = rest.match(/\sstyle="([^"]*)"/)?.[1] ?? '';
    const styleAttr = style ? ` style="${style}"` : '';

    return `<pre class="${classes} md-code-block"${styleAttr} data-lang="${resolvedLang}">${copyButton(code)}`;
  });
}
