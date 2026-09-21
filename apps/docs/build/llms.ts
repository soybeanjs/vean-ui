import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { resolveContentRoutePath, toPosixPath } from './docs-routes';

type DocFile = {
  description: string;
  routePath: string;
  title: string;
  value: string;
};

type ApiDocument = {
  component: string;
  symbols: Record<string, ApiSymbolSections>;
};

type ApiSymbolSections = Partial<Record<ApiSectionKind, ApiSection>>;

type ApiSectionKind = 'props' | 'emits' | 'slots' | 'slotProps';

type ApiSection = {
  description?: string;
  callables?: ApiEntry[];
  members?: ApiEntry[];
};

type ApiEntry = {
  default?: string | null;
  description?: string;
  name?: string;
  parameters?: string | null;
  required?: boolean;
  type?: string;
};

type FrontmatterResult = {
  content: string;
  data: Record<string, string>;
};

type LlmsOutput = {
  full: string;
  index: string;
  pages: Map<string, string>;
};

const llmOnlyRegex = /<llm-only>([\s\S]*?)<\/llm-only>/giu;
const llmExcludeRegex = /<llm-exclude>[\s\S]*?<\/llm-exclude>/giu;
const htmlCommentRegex = /<!--([\s\S]*?)-->/gu;
const genericVueTagRegex = /^<\/?[A-Z][^>]*>$/gmu;

/**
 * llms.txt generation for the ubean docs site.
 *
 * Content now lives in `src/content/{en,zh}` with section folders
 * (`ui` / `chart` / `vean` / `aria`), and route mapping
 * is shared with prerender/sitemap via `build/docs-routes.ts`.
 *
 * Dev: middleware answers `/llms.txt`, `/llms-full.txt`, and per-page `<route>.md`.
 * Build: `closeBundle` writes the outputs into `dist/public` (the ubean SSG root)
 * after the prerender phase has finished.
 */
export function docsLlmsPlugin(): Plugin {
  let config: ResolvedConfig | null = null;
  let isSsrBuild = false;

  return {
    name: 'vean-docs-llms',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isSsrBuild = Boolean(resolvedConfig.build.ssr);
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!config) {
          next();
          return;
        }

        handleDevRequest(req, res, next, config);
      });
    },

    async closeBundle() {
      if (!config || isSsrBuild) {
        return;
      }

      const output = await createLlmsOutput(config.root);
      const outDir = path.resolve(config.root, 'dist/public');

      await writeLlmsOutput(outDir, output);
    }
  };
}

async function handleDevRequest(
  req: IncomingMessage & { url?: string },
  res: ServerResponse,
  next: () => void,
  config: ResolvedConfig
): Promise<void> {
  const requestPath = stripQuery(req.url ?? '');

  if (!requestPath.endsWith('.txt') && !requestPath.endsWith('.md')) {
    next();
    return;
  }

  const output = await createLlmsOutput(config.root);

  if (requestPath === '/llms.txt') {
    respondWithText(res, output.index);
    return;
  }

  if (requestPath === '/llms-full.txt') {
    respondWithText(res, output.full);
    return;
  }

  const page = output.pages.get(requestPath);

  if (page) {
    respondWithText(res, page);
    return;
  }

  next();
}

async function writeLlmsOutput(outDir: string, output: LlmsOutput): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outDir, 'llms.txt'), output.index, 'utf8'),
    writeFile(path.join(outDir, 'llms-full.txt'), output.full, 'utf8'),
    ...Array.from(output.pages.entries()).map(async ([pagePath, content]) => {
      const targetPath = path.join(outDir, pagePath.slice(1));

      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, content, 'utf8');
    })
  ]);
}

async function createLlmsOutput(rootDir: string): Promise<LlmsOutput> {
  const docsDir = path.join(rootDir, 'src/content/en');
  const docPaths = await collectMarkdownFiles(docsDir);
  const docFiles = await Promise.all(docPaths.map(docPath => createDocFile(rootDir, docsDir, docPath)));
  const sortedDocFiles = docFiles.sort((left, right) => left.routePath.localeCompare(right.routePath));
  const pages = new Map(sortedDocFiles.map(file => [`${file.routePath}.md`, createPageContent(file)]));

  return {
    full: createLlmsFull(sortedDocFiles),
    index: createLlmsIndex(sortedDocFiles),
    pages
  };
}

async function collectMarkdownFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map(async entry => {
      const resolvedPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownFiles(resolvedPath);
      }

      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [resolvedPath];
      }

      return [];
    })
  );

  return nestedPaths.flat();
}

async function createDocFile(rootDir: string, docsDir: string, filePath: string): Promise<DocFile> {
  const relativePath = toPosixPath(path.relative(docsDir, filePath));
  const rawContent = await readFile(filePath, 'utf8');
  const { content, data } = parseFrontmatter(rawContent);
  const generatedApiPath = resolveGeneratedApiPath(relativePath);
  const apiSummary = generatedApiPath ? await createApiSummary(rootDir, generatedApiPath) : null;
  const normalizedContent = normalizeMarkdownContent(content, relativePath, apiSummary);
  const title = data.title || extractTitle(normalizedContent) || humanizeTitle(relativePath);
  const description = data.description || extractDescription(normalizedContent);
  const routePath = resolveContentRoutePath(relativePath.replace(/\.md$/u, ''));

  return {
    description,
    routePath,
    title,
    value: normalizedContent
  };
}

function createLlmsIndex(docFiles: DocFile[]): string {
  const toc = docFiles.map(file => {
    const descriptionSuffix = file.description ? `: ${file.description}` : '';

    return `- [${file.title}](${file.routePath}.md)${descriptionSuffix}`;
  });

  return `${[
    '# Vean Docs',
    '',
    'English LLM-friendly documentation index for the Vean docs site.',
    '',
    '## Details',
    '',
    '- Generated from src/content/en for the ubean documentation site.',
    '- Mirrors the current docs routing model: overview pages and component detail pages.',
    '- Markdown component placeholders are normalized into short textual hints for LLM consumption.',
    '',
    '## Table of Contents',
    '',
    ...toc
  ]
    .join('\n')
    .trimEnd()}\n`;
}

function createLlmsFull(docFiles: DocFile[]): string {
  const sections = docFiles.flatMap(file => [
    `## ${file.title}`,
    '',
    `- Page URL: ${file.routePath}`,
    `- Markdown URL: ${file.routePath}.md`,
    ...(file.description ? [`- Description: ${file.description}`] : []),
    '',
    file.value.trim(),
    ''
  ]);

  return `${['# Vean Docs', '', 'English LLM-friendly documentation bundle for the Vean docs site.', '', ...sections]
    .join('\n')
    .trimEnd()}\n`;
}

function createPageContent(file: DocFile): string {
  return [
    `# ${file.title}`,
    '',
    `Source URL: ${file.routePath}`,
    `Markdown URL: ${file.routePath}.md`,
    ...(file.description ? [`Description: ${file.description}`] : []),
    '',
    file.value.trim(),
    ''
  ].join('\n');
}

function parseFrontmatter(source: string): FrontmatterResult {
  if (!source.startsWith('---\n')) {
    return { content: source, data: {} };
  }

  const endIndex = source.indexOf('\n---\n', 4);

  if (endIndex < 0) {
    return { content: source, data: {} };
  }

  const rawFrontmatter = source.slice(4, endIndex).trim();
  const content = source.slice(endIndex + 5);
  const data = Object.fromEntries(
    rawFrontmatter
      .split('\n')
      .map(line => {
        const separatorIndex = line.indexOf(':');

        if (separatorIndex < 0) {
          return null;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^['"]|['"]$/g, '');

        return key ? [key, value] : null;
      })
      .filter((entry): entry is [string, string] => entry !== null)
  );

  return { content, data };
}

function normalizeMarkdownContent(source: string, _relativePath: string, apiSummary: string | null): string {
  return source
    .replace(htmlCommentRegex, '')
    .replace(llmExcludeRegex, '')
    .replace(llmOnlyRegex, '$1')
    .replace(/<UsageCode\s+component="([^"]+)"\s*\/>/gu, (_, component: string) => {
      return `Usage examples for ${component} are rendered on the site.`;
    })
    .replace(/<PlaygroundGallery\s+component="([^"]+)"\s*\/>/gu, (_, component: string) => {
      return `Interactive demos for ${component} are rendered on the site.`;
    })
    .replace(/<ComponentApi\s+component="([^"]+)"\s*\/>/gu, (_, component: string) => {
      return apiSummary ?? `Structured API data for ${component} is rendered on the site.`;
    })
    .replace(genericVueTagRegex, '')
    .replace(/\n{3,}/g, '\n\n');
}

function resolveGeneratedApiPath(relativePath: string): string | null {
  const packageMatch = relativePath.match(/^(ui|admin|chart)\/components\/([^/]+)\.md$/u);

  if (!packageMatch) {
    return null;
  }

  return `src/generated/api/${packageMatch[1]}/${packageMatch[2]}.json`;
}

async function createApiSummary(rootDir: string, generatedApiPath: string): Promise<string | null> {
  const filePath = path.resolve(rootDir, generatedApiPath);

  try {
    const document = JSON.parse(await readFile(filePath, 'utf8')) as ApiDocument;
    const symbolEntries = Object.entries(document.symbols);

    if (symbolEntries.length === 0) {
      return 'Structured API data is rendered on the site. No detailed API summary was available for this llms export.';
    }

    const exportedSymbols = symbolEntries.map(([symbolName]) => symbolName);
    const symbolDetails = symbolEntries.flatMap(([symbolName, sections]) => renderApiSymbol(symbolName, sections));

    return [
      'Structured API summary generated from build-time component metadata.',
      `- Exported symbols (${exportedSymbols.length}): ${exportedSymbols.join(', ')}.`,
      '',
      ...symbolDetails
    ].join('\n');
  } catch {
    return 'Structured API data is rendered on the site. Build-time API metadata was unavailable for this llms export.';
  }
}

function renderApiSymbol(symbolName: string, sections: ApiSymbolSections): string[] {
  const renderedSections = (['props', 'emits', 'slots', 'slotProps'] as const)
    .flatMap(kind => renderApiSection(kind, sections[kind]))
    .filter(Boolean);

  if (renderedSections.length === 0) {
    return [`### ${symbolName}`, '', '- No documented props, emits, slots, or slot props were available.', ''];
  }

  return [`### ${symbolName}`, '', ...renderedSections, ''];
}

function renderApiSection(kind: ApiSectionKind, section?: ApiSection): string[] {
  if (!section) {
    return [];
  }

  const entries = [...(section.members ?? []), ...(section.callables ?? [])].filter(entry => entry.name || entry.type);

  if (entries.length === 0) {
    return [];
  }

  return [
    `#### ${humanizeApiSectionKind(kind)}`,
    ...(section.description ? [section.description, ''] : []),
    ...entries.map(entry => renderApiEntry(kind, entry)),
    ''
  ];
}

function renderApiEntry(kind: ApiSectionKind, entry: ApiEntry): string {
  const label = entry.name ? `\`${entry.name}\`` : '`entry`';
  const description = normalizeInlineText(entry.description) || 'No description.';
  const details = [
    entry.type ? `type ${formatInlineCode(entry.type)}` : '',
    entry.parameters && entry.parameters !== entry.type ? `parameters ${formatInlineCode(entry.parameters)}` : '',
    entry.default && entry.default !== 'null' ? `default ${formatInlineCode(entry.default)}` : '',
    kind === 'props' || kind === 'slotProps' ? (entry.required ? 'required' : 'optional') : ''
  ].filter(Boolean);

  if (details.length === 0) {
    return `- ${label}: ${description}`;
  }

  return `- ${label}: ${description} (${details.join('; ')})`;
}

function humanizeApiSectionKind(kind: ApiSectionKind): string {
  if (kind === 'slotProps') {
    return 'Slot Props';
  }

  return `${kind.charAt(0).toUpperCase()}${kind.slice(1)}`;
}

function normalizeInlineText(value?: string): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function formatInlineCode(value: string): string {
  const normalizedValue = normalizeInlineText(value);

  if (normalizedValue.length <= 120) {
    return `\`${normalizedValue}\``;
  }

  return `\`${normalizedValue.slice(0, 117)}...\``;
}

function extractTitle(source: string): string {
  const titleMatch = source.match(/^#\s+(.+)$/mu);

  return titleMatch?.[1]?.trim() ?? '';
}

function extractDescription(source: string): string {
  const lines = source.split('\n').map(line => line.trim());

  for (const line of lines) {
    if (!line) {
      continue;
    }

    if (line.startsWith('#') || line.startsWith('<') || line.startsWith('```') || line.startsWith('- ')) {
      continue;
    }

    return line;
  }

  return '';
}

function humanizeTitle(relativePath: string): string {
  const fileName = path.basename(relativePath, '.md');

  return fileName
    .split(/[-_]/u)
    .filter(Boolean)
    .map(segment => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ');
}

function stripQuery(url: string): string {
  return url.split('?')[0] || '/';
}

function respondWithText(res: ServerResponse, content: string): void {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(content);
}
