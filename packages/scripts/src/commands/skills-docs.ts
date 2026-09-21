/// <reference types="node" />

import type { Dirent } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { menuData } from '../../../../apps/docs/src/constants/menus';
import type { MenuData } from '../../../../apps/docs/src/constants/menus';

type FrontmatterResult = {
  content: string;
  data: Record<string, string>;
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

type SkillComponentDoc = {
  categoryKey: string;
  categoryTitle: string;
  description: string;
  fileName: string;
  output: string;
  slug: string;
  title: string;
};

type GenerateSkillDocsOptions = {
  skillsRootDir?: string;
};

const siteBaseUrl = 'https://veanui.com';
const llmOnlyRegex = /<llm-only>([\s\S]*?)<\/llm-only>/giu;
const llmExcludeRegex = /<llm-exclude>[\s\S]*?<\/llm-exclude>/giu;
const htmlCommentRegex = /<!--([\s\S]*?)-->/gu;
const genericVueTagRegex = /^<\/?[A-Z][^>]*>$/gmu;
const repoRoot = process.cwd();
const generatedApiDir = path.resolve(repoRoot, 'apps/docs/src/generated/api');
const defaultSkillsRootDir = path.resolve(repoRoot, 'skills/skills');

type SkillDocSource = {
  key: string;
  docsDir: string;
  apiDir: string;
  routePrefix: string;
  menu: MenuData[];
  categoryTitles: Record<string, string>;
};

const uiCategoryTitleMap: Record<string, string> = {
  general: 'General',
  groupLayout: 'Layout',
  navigation: 'Navigation',
  forms: 'Forms',
  dataDisplay: 'Data Display',
  feedback: 'Feedback',
  overlay: 'Overlay',
  utilities: 'Utilities',
  other: 'Other'
};

const skillDocSources: SkillDocSource[] = [
  {
    key: 'ui',
    docsDir: path.resolve(repoRoot, 'apps/docs/src/content/en/ui/components'),
    apiDir: 'ui',
    routePrefix: '/components',
    menu: menuData,
    categoryTitles: uiCategoryTitleMap
  }
];

const categoryTitleMap = Object.assign({}, ...skillDocSources.map(source => source.categoryTitles), { other: 'Other' });

const skillOrderedCategoryKeys = [
  ...new Set(skillDocSources.flatMap(source => source.menu.map(group => group.value))),
  'other'
];

export async function generateSkillDocs(options: GenerateSkillDocsOptions = {}): Promise<void> {
  const outputPaths = resolveSkillOutputPaths(options.skillsRootDir ?? defaultSkillsRootDir);
  const docs = await collectSourceDocs();
  const sortedDocs = docs.sort((left, right) => left.slug.localeCompare(right.slug));

  await rm(outputPaths.veanUiComponentsOutputDir, { recursive: true, force: true });
  await mkdir(outputPaths.veanUiComponentsOutputDir, { recursive: true });
  await mkdir(outputPaths.veanUiReferencesOutputDir, { recursive: true });
  await mkdir(outputPaths.veanAriaReferencesOutputDir, { recursive: true });

  await Promise.all(
    sortedDocs.map(doc =>
      writeFile(path.resolve(outputPaths.veanUiComponentsOutputDir, doc.fileName), doc.output, 'utf8')
    )
  );

  await Promise.all([
    writeFile(outputPaths.veanUiComponentsIndexPath, createComponentsIndex(sortedDocs), 'utf8'),
    writeFile(outputPaths.veanAriaComponentsIndexPath, createAriaComponentsIndex(sortedDocs), 'utf8')
  ]);

  console.log(`Generated Vean skill docs for ${sortedDocs.length} components.`);
}

async function collectSourceDocs(): Promise<SkillComponentDoc[]> {
  const collectedDocs = await Promise.all(
    skillDocSources.map(async source => {
      const componentPaths = await collectMarkdownFiles(source.docsDir);

      return Promise.all(componentPaths.map(componentPath => createComponentDoc(componentPath, source)));
    })
  );

  return collectedDocs.flat();
}

function resolveSkillOutputPaths(skillsRootDir: string) {
  const veanUiSkillRootDir = path.resolve(skillsRootDir, 'vean-ui');
  const veanUiComponentsOutputDir = path.resolve(veanUiSkillRootDir, 'components');
  const veanUiReferencesOutputDir = path.resolve(veanUiSkillRootDir, 'references');
  const veanUiComponentsIndexPath = path.resolve(veanUiReferencesOutputDir, 'components.md');
  const veanAriaSkillRootDir = path.resolve(skillsRootDir, 'vean-aria');
  const veanAriaReferencesOutputDir = path.resolve(veanAriaSkillRootDir, 'references');
  const veanAriaComponentsIndexPath = path.resolve(veanAriaReferencesOutputDir, 'components.md');

  return {
    veanAriaComponentsIndexPath,
    veanAriaReferencesOutputDir,
    veanUiComponentsIndexPath,
    veanUiComponentsOutputDir,
    veanUiReferencesOutputDir
  };
}

async function collectMarkdownFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map(async (entry: Dirent) => {
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

async function createComponentDoc(filePath: string, source: SkillDocSource): Promise<SkillComponentDoc> {
  const slug = path.basename(filePath, '.md');
  const rawContent = await readFile(filePath, 'utf8');
  const { content, data } = parseFrontmatter(rawContent);
  const apiSummary = await createApiSummary(path.resolve(generatedApiDir, source.apiDir, `${slug}.json`));
  const normalizedContent = normalizeMarkdownContent(content, slug, apiSummary);
  const title = data.title || extractTitle(normalizedContent) || humanizeTitle(slug);
  const description = data.description || extractDescription(normalizedContent);
  const bodyContent = stripLeadingTitle(normalizedContent);
  const categoryKey = resolveCategoryKey(slug, source);
  const categoryTitle = source.categoryTitles[categoryKey] ?? source.categoryTitles.other;
  const routePath = `${source.routePrefix}/${slug}`;
  const markdownPath = `${routePath}.md`;
  const output = [
    `# ${title}`,
    '',
    `Source URL: ${siteBaseUrl}${routePath}`,
    `Markdown URL: ${siteBaseUrl}${markdownPath}`,
    `Category: ${categoryTitle}`,
    ...(description ? [`Description: ${description}`] : []),
    '',
    bodyContent,
    ''
  ].join('\n');

  return {
    categoryKey,
    categoryTitle,
    description,
    fileName: `${slug}.md`,
    output,
    slug,
    title
  };
}

function resolveCategoryKey(slug: string, source: SkillDocSource): string {
  for (const group of source.menu) {
    if (group.items.some(item => toKebabCase(item) === slug)) {
      return group.value;
    }
  }

  return 'other';
}

function createComponentsIndex(docs: SkillComponentDoc[]): string {
  const groupedDocs = new Map<string, SkillComponentDoc[]>();

  for (const doc of docs) {
    const group = groupedDocs.get(doc.categoryKey) ?? [];

    group.push(doc);
    groupedDocs.set(doc.categoryKey, group);
  }

  const sections = skillOrderedCategoryKeys.flatMap(categoryKey => {
    const categoryDocs = groupedDocs.get(categoryKey)?.sort((left, right) => left.slug.localeCompare(right.slug)) ?? [];

    if (categoryDocs.length === 0) {
      return [];
    }

    return [
      `## ${categoryTitleMap[categoryKey] ?? categoryTitleMap.other}`,
      '',
      '| Component | Description | File |',
      '| --- | --- | --- |',
      ...categoryDocs.map(doc => {
        const description = doc.description || 'Component documentation and generated API summary.';

        return `| **${doc.slug}** | ${escapeTableText(description)} | [components/${doc.fileName}](../components/${doc.fileName}) |`;
      }),
      ''
    ];
  });

  return `${[
    '# Components',
    '',
    '> Auto-generated. Run `pnpm sui gen skills` to update.',
    '',
    'Component index for the Vean consumer skill. Each file is generated from the English component docs plus build-time API metadata.',
    '',
    ...sections
  ]
    .join('\n')
    .trimEnd()}\n`;
}

function createAriaComponentsIndex(docs: SkillComponentDoc[]): string {
  const groupedDocs = new Map<string, SkillComponentDoc[]>();

  for (const doc of docs) {
    const group = groupedDocs.get(doc.categoryKey) ?? [];

    group.push(doc);
    groupedDocs.set(doc.categoryKey, group);
  }

  const sections = skillOrderedCategoryKeys.flatMap(categoryKey => {
    const categoryDocs = groupedDocs.get(categoryKey)?.sort((left, right) => left.slug.localeCompare(right.slug)) ?? [];

    if (categoryDocs.length === 0) {
      return [];
    }

    return [
      `## ${categoryTitleMap[categoryKey] ?? categoryTitleMap.other}`,
      '',
      '| Component | Description | Shared File |',
      '| --- | --- | --- |',
      ...categoryDocs.map(doc => {
        const description = doc.description || 'Aria component documentation and generated API summary.';

        return `| **${doc.slug}** | ${escapeTableText(description)} | [vean-ui/components/${doc.fileName}](../../vean-ui/components/${doc.fileName}) |`;
      }),
      ''
    ];
  });

  return `${[
    '# Components',
    '',
    '> Auto-generated. Run `pnpm sui gen skills` to update.',
    '',
    'Shared component index for the Vean Aria consumer skill.',
    'Links point to the Vean generated component reference files because those files already include aria exports such as `Root`, `Trigger`, `Content`, and `Compact` symbols from the generated API metadata.',
    '',
    ...sections
  ]
    .join('\n')
    .trimEnd()}\n`;
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

function normalizeMarkdownContent(source: string, component: string, apiSummary: string | null): string {
  return source
    .replace(htmlCommentRegex, '')
    .replace(llmExcludeRegex, '')
    .replace(llmOnlyRegex, '$1')
    .replace(/<UsageCode\s+component="([^"]+)"\s*\/>/gu, (_, usageComponent: string) => {
      return `Usage examples for ${usageComponent} are rendered on the site.`;
    })
    .replace(/<PlaygroundGallery\s+component="([^"]+)"\s*\/>/gu, (_, playgroundComponent: string) => {
      return `Interactive demos for ${playgroundComponent} are rendered on the site.`;
    })
    .replace(/<ComponentApi\s+component="([^"]+)"\s*\/>/gu, () => {
      return apiSummary ?? `Structured API data for ${component} is rendered on the site.`;
    })
    .replace(genericVueTagRegex, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function createApiSummary(filePath: string): Promise<string | null> {
  try {
    const document = JSON.parse(await readFile(filePath, 'utf8')) as ApiDocument;
    const symbolEntries = Object.entries(document.symbols);

    if (symbolEntries.length === 0) {
      return 'Structured API data is rendered on the site. No detailed API summary was available for this skill export.';
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
    return 'Structured API data is rendered on the site. Build-time API metadata was unavailable for this skill export.';
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

function stripLeadingTitle(source: string): string {
  return source.replace(/^#\s+.+?\n\n/u, '').trim();
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

function humanizeTitle(value: string): string {
  return value
    .split(/[-_]/u)
    .filter(Boolean)
    .map(segment => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ');
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function escapeTableText(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}
