import { createHighlighter } from 'shiki';

/**
 * Dual-theme pair mirrored from the ubean docs site (`apps/docs/build/highlight.ts`).
 * `defaultColor: false` emits `--shiki-light` / `--shiki-dark` css vars consumed by
 * `src/styles/global.css`.
 */
export const SHIKI_THEMES = { light: 'one-light', dark: 'one-dark-pro' } as const;

export const SHIKI_LANGS = [
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
  'markdown'
] as const;

export type HighlightCode = (code: string, lang: string) => string;

/** Base64 of the UTF-8 code, used as the copy-button payload (same encoding as ubean). */
function encodeBase64Utf8(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64');
}

/**
 * Build the synchronous fence renderer. Identical output shape to the ubean site:
 * a `pre.shiki.md-code-block[data-lang]` wrapper plus a copy button, so the same
 * `markdown.css` / `global.css` rules apply to both sites.
 */
export async function createDocsHighlight(): Promise<HighlightCode> {
  const highlighter = await createHighlighter({
    themes: Object.values(SHIKI_THEMES),
    langs: [...SHIKI_LANGS]
  });
  const loaded = highlighter.getLoadedLanguages();

  return (code, lang) => {
    const language = loaded.includes(lang) ? lang : 'text';
    const normalized = code.replace(/\n$/, '');

    const html = highlighter.codeToHtml(normalized, {
      lang: language,
      themes: SHIKI_THEMES,
      defaultColor: false
    });

    return wrapFence(html, lang, normalized);
  };
}

/**
 * Attach the panel wrapper + copy button. Astro's own shiki pass is bypassed for
 * fenced code (`syntaxHighlight: false`) so this hook owns fence rendering, which
 * keeps the markup byte-comparable with the ubean build.
 */
export function wrapFence(shikiHtml: string, lang: string, code: string): string {
  const openTag = shikiHtml.match(/^<pre([^>]*)>/);
  if (!openTag) {
    return shikiHtml;
  }

  const attrs = openTag[1]
    .replace(/^ class="([^"]*)"/, ` class="$1 md-code-block" data-lang="${lang}"`)
    .replace(/ tabindex="0"/, '');

  const payload = encodeBase64Utf8(code);

  return `<pre${attrs}><button type="button" class="code-btn" data-copy-code="${payload}" aria-label="Copy code"></button>${shikiHtml.slice(openTag[0].length)}`;
}
