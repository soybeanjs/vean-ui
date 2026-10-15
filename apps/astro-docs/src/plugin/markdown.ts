import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { toHeadingId } from '../shared/heading';
import { rehypeDocsCode } from './rehype-code.mjs';

/** A heading in the right-hand outline, mirroring `AnchorOptionData`. */
export interface OutlineItem {
  href: string;
  title: string;
  children?: OutlineItem[];
}

/** One run of the rendered body: static HTML, or a placeholder for a Vue island. */
export type DocSegment =
  | { kind: 'html'; html: string }
  | { kind: 'usage-code'; component: string; file: string }
  | { kind: 'playground'; component: string }
  | { kind: 'api'; component: string }
  | { kind: 'data-table'; preset: 'props' | 'emits' | 'slots'; rows: unknown[] }
  | { kind: 'tailwind-palette' };

export interface RenderedDoc {
  segments: DocSegment[];
  outline: OutlineItem[];
  frontmatter: { title?: string; description?: string };
}

/**
 * The docs markdown uses five custom component tags. Astro's markdown pipeline runs
 * `rehypeRaw` *after* user rehype plugins (see `@astrojs/markdown-remark`), so a
 * user plugin never sees them as elements — and `remarkRehype` is configured with
 * `passThrough: []`, so leaving them as raw HTML makes the parser nest them inside
 * one another with the closing tags stranded at EOF.
 *
 * Rewriting each tag to a lower-case placeholder element fixes both problems: lower
 * case survives `rehypeRaw` as a real element, and because every tag is now a normal
 * block element the nesting is correct. The page then splits the rendered HTML on
 * these placeholders and mounts the real component for each one.
 */
const PLACEHOLDER_PREFIX = 'ubean-md';

const TAG_REWRITES: { tag: string; placeholder: string }[] = [
  { tag: 'UsageCode', placeholder: 'usage-code' },
  { tag: 'PlaygroundGallery', placeholder: 'playground' },
  { tag: 'ComponentApi', placeholder: 'api' },
  { tag: 'DataTable', placeholder: 'data-table' },
  { tag: 'TailwindPalette', placeholder: 'tailwind-palette' }
];

function rewriteCustomTags(markdown: string): string {
  let out = markdown;

  for (const { tag, placeholder } of TAG_REWRITES) {
    const selfClosing = new RegExp(`<${tag}\\b([^>]*?)/>`, 'g');
    const paired = new RegExp(`<${tag}\\b([^>]*?)>([\\s\\S]*?)</${tag}>`, 'g');

    out = out.replace(selfClosing, (_match, attrs: string) => `<${PLACEHOLDER_PREFIX}-${placeholder}${attrs}></${PLACEHOLDER_PREFIX}-${placeholder}>`);
    out = out.replace(paired, (_match, attrs: string, body: string) => `<${PLACEHOLDER_PREFIX}-${placeholder}${attrs}>${body}</${PLACEHOLDER_PREFIX}-${placeholder}>`);
  }

  return out;
}

/**
 * All 226 content files carry exactly a three-line frontmatter block
 * (`---` / `head:` / indented `title:` + `description:` / `---`). The bare
 * `createMarkdownProcessor` does not strip it (Astro's own content pipeline does),
 * so without this the `---` renders as an `<hr>` and the keys leak as an `<h2>`.
 */
function splitFrontmatter(source: string): { body: string; frontmatter: RenderedDoc['frontmatter'] } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!match) {
    return { body: source, frontmatter: {} };
  }

  const frontmatter: RenderedDoc['frontmatter'] = {};

  for (const line of match[1].split(/\r?\n/)) {
    const entry = line.match(/^\s+(title|description):\s*(.*)$/);

    if (entry) {
      frontmatter[entry[1] as 'title' | 'description'] = entry[2].trim();
    }
  }

  return { body: source.slice(match[0].length), frontmatter };
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_m, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, '')).trim();
}

/**
 * Assigns `toHeadingId` slugs to every heading, reproducing what `DocMd` does on the
 * client in the ubean build — here it happens at build time, so anchors work before
 * hydration and the outline is static.
 *
 * The dedup bookkeeping mirrors `doc-md.vue`'s `updateDocOutline`: existing ids are
 * collected first, then each heading takes its base slug or the next free `-N` suffix.
 */
function assignHeadingIds(html: string): { html: string; headings: { level: number; id: string; title: string }[] } {
  const usedIds = new Set<string>();
  const headings: { level: number; id: string; title: string }[] = [];

  // Astro's own `rehypeHeadingIds` has already stamped every heading with a slug, but
  // that slug is not the docs' `toHeadingId` convention. Seeding the "already taken"
  // set from headings would therefore force every real slug into a `-2` suffix, so
  // ids are collected from everything *except* headings and the heading ids are
  // reassigned from scratch below.
  for (const match of html.replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/g, '').matchAll(/\sid="([^"]+)"/g)) {
    usedIds.add(match[1]);
  }

  const idCounter = new Map<string, number>();

  const rewritten = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, depth: string, attrs: string, inner: string) => {
    const title = stripTags(inner);
    const baseId = toHeadingId(title);
    const current = idCounter.get(baseId) ?? 0;
    let next = current;
    let candidate = '';

    do {
      next += 1;
      candidate = next > 1 ? `${baseId}-${next}` : baseId;
    } while (usedIds.has(candidate));

    idCounter.set(baseId, next);
    usedIds.add(candidate);

    const cleanedAttrs = attrs.replace(/\sid="[^"]*"/, '').trimEnd();
    headings.push({ level: Number.parseInt(depth, 10), id: candidate, title });

    return `<h${depth}${cleanedAttrs} id="${candidate}">${inner}</h${depth}>`;
  });

  return { html: rewritten, headings };
}

/** Mirrors `buildAnchorItems` in `doc-md.vue`: h2/h3/h4 nest by depth. */
function buildOutline(headings: { level: number; id: string; title: string }[]): OutlineItem[] {
  const root: OutlineItem[] = [];
  const stack: { level: number; item: OutlineItem }[] = [];

  for (const heading of headings) {
    if (heading.level < 2 || heading.level > 4) {
      continue;
    }

    while (stack.length && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    const node: OutlineItem = { href: `#${heading.id}`, title: heading.title };
    const parent = stack[stack.length - 1]?.item;

    if (parent) {
      parent.children ??= [];
      parent.children.push(node);
    } else {
      root.push(node);
    }

    stack.push({ level: heading.level, item: node });
  }

  return root;
}

const SEGMENT_RE = new RegExp(
  `<${PLACEHOLDER_PREFIX}-(${TAG_REWRITES.map(entry => entry.placeholder).join('|')})([^>]*)><\\/${PLACEHOLDER_PREFIX}-[a-z-]+>`,
  'g'
);

function readAttr(attrs: string, name: string): string | undefined {
  const match = attrs.match(new RegExp(`\\b${name}="([^"]*)"`));

  return match?.[1];
}

/**
 * Parses a `:data="[...]"` attribute. The payload is a JS array literal written by
 * hand in the docs' own markdown, so it is evaluated at build time on trusted input;
 * a failure degrades to an empty table instead of breaking the whole page.
 */
function parseRows(expression: string | undefined): unknown[] {
  if (!expression) {
    return [];
  }

  try {
    // eslint-disable-next-line no-new-func
    const value = new Function(`return (${expression});`)();

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | undefined;

async function getProcessor() {
  processor ??= await createMarkdownProcessor({
    shikiConfig: {
      themes: { light: 'one-light', dark: 'one-dark-pro' },
      defaultColor: false,
      wrap: false
    },
    rehypePlugins: [rehypeDocsCode]
  });

  return processor;
}

/**
 * Renders one content file to a list of segments plus the outline.
 *
 * The body is wrapped in `.markdown-wrapper` so the shared `styles/markdown.css`
 * (copied verbatim from the ubean site) styles it identically on both sites.
 */
export async function renderDoc(source: string): Promise<RenderedDoc> {
  const { body, frontmatter } = splitFrontmatter(source);
  const md = await getProcessor();
  const rendered = await md.render(rewriteCustomTags(body));

  const { html, headings } = assignHeadingIds(rendered.code);
  const segments: DocSegment[] = [];
  let cursor = 0;

  for (const match of html.matchAll(SEGMENT_RE)) {
    const index = match.index ?? 0;

    if (index > cursor) {
      segments.push({ kind: 'html', html: html.slice(cursor, index) });
    }

    const attrs = match[2] ?? '';
    const component = readAttr(attrs, 'component') ?? '';

    switch (match[1]) {
      case 'usage-code':
        segments.push({ kind: 'usage-code', component, file: readAttr(attrs, 'file') ?? 'basic' });
        break;
      case 'playground':
        segments.push({ kind: 'playground', component });
        break;
      case 'api':
        segments.push({ kind: 'api', component });
        break;
      case 'data-table':
        segments.push({
          kind: 'data-table',
          preset: (readAttr(attrs, 'preset') as 'props' | 'emits' | 'slots') ?? 'props',
          rows: parseRows(readAttr(attrs, ':data'))
        });
        break;
      default:
        segments.push({ kind: 'tailwind-palette' });
        break;
    }

    cursor = index + match[0].length;
  }

  if (cursor < html.length) {
    segments.push({ kind: 'html', html: html.slice(cursor) });
  }

  return {
    segments: [{ kind: 'html', html: '<div class="markdown-wrapper">' }, ...segments, { kind: 'html', html: '</div>' }],
    outline: buildOutline(headings),
    frontmatter
  };
}
