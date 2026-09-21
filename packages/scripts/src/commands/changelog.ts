import { existsSync, readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { components as ariaComponents } from '../../../aria/src/constants/components';
import { components as uiComponents } from '../../../ui/src/constants/components';
import { kebabCase } from '../../../aria/src/shared/string';
import { writeGeneratedJsonDirectory } from '../shared/json';
import { componentRenameMap, releaseIntroducedComponents, releaseChangelogNotes } from './changelog-notes';
import type { ReleaseChangelogNoteSource } from './changelog-notes';
import { componentChangelogOverrides } from './changelog-overrides';

type ChangelogEntryType = 'breaking' | 'feature' | 'fix' | 'optimization' | 'refactor' | 'docs' | 'chore' | 'style';

interface ParsedVersionBlock {
  version: string;
  compareUrl: string;
  date: string;
  entries: ParsedChangelogEntry[];
}

interface ParsedChangelogEntry {
  version: string;
  type: ChangelogEntryType;
  scope: string;
  summary: string;
  commitHash: string | null;
  commitUrl: string | null;
  authors: string[];
  source: 'exact-scope' | 'override';
}

interface GeneratedComponentChangelogEntry {
  type: ChangelogEntryType;
  scope: string;
  summary: string;
  summaryKey: string | null;
  commitHash: string | null;
  commitUrl: string | null;
  authors: string[];
  source: 'exact-scope' | 'override';
}

interface GeneratedComponentChangelogVersion {
  version: string;
  compareUrl: string;
  date: string;
  entries: GeneratedComponentChangelogEntry[];
}

interface GeneratedComponentChangelogDocument {
  component: string;
  generatedAt: string;
  schemaVersion: 1;
  versions: GeneratedComponentChangelogVersion[];
}

interface GeneratedReleaseChangelogEntry extends GeneratedComponentChangelogEntry {
  components: string[];
}

interface GeneratedReleaseChangelogNote {
  type: ReleaseChangelogNoteSource['type'];
  summary: string;
  summaryKey: string;
  /** Content path of the upgrade guide, resolved against `src/content/{locale}/`. */
  docPath?: string;
}

interface GeneratedReleaseChangelogVersion {
  version: string;
  compareUrl: string;
  date: string;
  entryCount: number;
  componentCount: number;
  components: string[];
  newComponents: string[];
  typeCounts: Partial<Record<ChangelogEntryType, number>>;
  notes: GeneratedReleaseChangelogNote[];
  entries: GeneratedReleaseChangelogEntry[];
}

interface GeneratedReleaseChangelogDocument {
  generatedAt: string;
  schemaVersion: 1;
  releases: GeneratedReleaseChangelogVersion[];
}

interface GeneratedComponentChangelogIndexEntry {
  component: string;
  file: string;
  latestVersion: string | null;
  versionCount: number;
  entryCount: number;
}

interface GeneratedComponentChangelogIndex {
  generatedAt: string;
  schemaVersion: 1;
  components: Record<string, GeneratedComponentChangelogIndexEntry>;
}

const rootDir = process.cwd();
const changelogPath = path.join(rootDir, 'CHANGELOG.md');
/**
 * The changelog tracks the whole consumer surface: aria families plus
 * UI-only components. Admission remediation (v0.50.0) moved presentation-only
 * shells (badge/card/empty/skeleton/tag…) to the UI layer, so a component may
 * legitimately exist without an aria family.
 */
const componentNames = Array.from(new Set([...Object.keys(ariaComponents), ...Object.keys(uiComponents)]))
  .map(component => kebabCase(component))
  .sort((left, right) => left.localeCompare(right));
const componentNameSet = new Set(componentNames);

/**
 * Resolve a changelog commit scope to a catalog component, following renames
 * (`componentRenameMap`). Returns null for scopes that match no component —
 * such entries stay release-level only and never reach a component page.
 */
export function resolveChangelogComponent(scope: string): string | null {
  const renamed = componentRenameMap[scope];

  if (renamed) {
    return componentNameSet.has(renamed) ? renamed : null;
  }

  return componentNameSet.has(scope) ? scope : null;
}

const sectionTypeMap: Record<string, ChangelogEntryType> = {
  'breaking changes': 'breaking',
  features: 'feature',
  'bug fixes': 'fix',
  optimizations: 'optimization',
  refactors: 'refactor',
  documentation: 'docs',
  chore: 'chore',
  styles: 'style'
};
const typeRelevanceScoreMap: Record<ChangelogEntryType, number> = {
  breaking: 100,
  feature: 70,
  fix: 60,
  optimization: 45,
  refactor: 35,
  docs: 15,
  chore: 10,
  style: 8
};
const sharedScopeRelevanceScoreMap: Record<string, number> = {
  components: 20,
  aria: 18,
  headless: 18,
  ui: 18,
  shared: 14,
  types: 12,
  api: 10,
  i18n: 8,
  docs: -10,
  projects: -12,
  scripts: -14,
  build: -18,
  config: -18,
  workflow: -22,
  deps: -24,
  test: -16,
  styles: -14
};

/**
 * Parse `CHANGELOG.md` and write per-component + release changelog JSON into
 * `outputDir` (a docs target's `<generated>/changelog` directory).
 *
 * `contentDir` is the docs target's markdown root (`src/content`); it is used
 * to validate that note `docPath` values point at real upgrade-guide pages.
 */
export async function generateChangelogData(outputDir: string, contentDir: string): Promise<void> {
  const changelogContent = await readFile(changelogPath, 'utf8');
  const generatedAt = new Date().toISOString();
  const versionBlocks = parseChangelog(changelogContent);
  const documents = createComponentDocuments(versionBlocks, generatedAt);
  const releasesDocument = createReleaseDocument(versionBlocks, generatedAt, contentDir);

  const index = createIndex(documents, generatedAt);

  const writeResult = await writeGeneratedJsonDirectory({
    outputDir,
    documents: [
      {
        fileName: 'index.json',
        value: index
      },
      {
        fileName: 'releases.json',
        value: releasesDocument
      },
      ...documents.map(document => ({
        fileName: `${document.component}.json`,
        value: document
      }))
    ]
  });

  console.log(
    `Generated changelog data (${path.relative(rootDir, outputDir)}).` +
      ` Updated ${writeResult.written.length} of ${writeResult.written.length + writeResult.unchanged.length} files.`
  );
}

function parseChangelog(content: string): ParsedVersionBlock[] {
  const lines = content.split(/\r?\n/u);
  const versions: ParsedVersionBlock[] = [];

  let currentVersion: ParsedVersionBlock | null = null;
  let currentSectionType: ChangelogEntryType | null = null;
  let currentScope: string | null = null;

  for (const line of lines) {
    const versionMatch = line.match(/^## \[(v[^\]]+)\]\(([^)]+)\) \((\d{4}-\d{2}-\d{2})\)$/u);

    if (versionMatch) {
      currentVersion = {
        version: versionMatch[1],
        compareUrl: versionMatch[2],
        date: versionMatch[3],
        entries: []
      };

      versions.push(currentVersion);
      currentSectionType = null;
      currentScope = null;
      continue;
    }

    if (!currentVersion) {
      continue;
    }

    const sectionType = getSectionType(line);

    if (sectionType) {
      currentSectionType = sectionType;
      currentScope = null;
      continue;
    }

    if (!currentSectionType) {
      continue;
    }

    const multiScopeMatch = line.match(/^- \*\*(.+?)\*\*:\s*$/u);

    if (multiScopeMatch) {
      currentScope = multiScopeMatch[1].trim();
      continue;
    }

    const singleEntryMatch = line.match(/^- \*\*(.+?)\*\*:\s+(.+)$/u);

    if (singleEntryMatch) {
      currentScope = null;

      const entry = createEntry(
        currentVersion.version,
        currentSectionType,
        singleEntryMatch[1].trim(),
        singleEntryMatch[2]
      );

      if (entry) {
        currentVersion.entries.push(entry);
      }

      continue;
    }

    const nestedEntryMatch = line.match(/^\s{2}-\s+(.+)$/u);

    if (nestedEntryMatch && currentScope) {
      const entry = createEntry(currentVersion.version, currentSectionType, currentScope, nestedEntryMatch[1]);

      if (entry) {
        currentVersion.entries.push(entry);
      }

      continue;
    }

    if (line.trim() && !line.startsWith('  ')) {
      currentScope = null;
    }
  }

  return versions;
}

function getSectionType(line: string): ChangelogEntryType | null {
  const normalizedLine = line
    .replace(/&nbsp;/gu, ' ')
    .replace(/^#+\s*/u, '')
    .replace(/[^a-zA-Z ]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .toLowerCase();

  return sectionTypeMap[normalizedLine] ?? null;
}

function createEntry(
  version: string,
  type: ChangelogEntryType,
  scope: string,
  lineContent: string
): ParsedChangelogEntry | null {
  const parsed = parseEntryLine(lineContent);

  if (!parsed) {
    return null;
  }

  return {
    version,
    type,
    scope,
    summary: parsed.summary,
    commitHash: parsed.commitHash,
    commitUrl: parsed.commitUrl,
    authors: parsed.authors,
    source: 'exact-scope'
  };
}

function parseEntryLine(lineContent: string) {
  const normalizedContent = lineContent.trim();
  const entryMatch = normalizedContent.match(
    /^(.*?)\s+&nbsp;-&nbsp;\s+by\s+(.*?)\s+\[<samp>\(([^)]+)\)<\/samp>\]\(([^)]+)\)$/u
  );

  if (!entryMatch) {
    return null;
  }

  return {
    summary: entryMatch[1].trim(),
    authors: parseAuthors(entryMatch[2].trim()),
    commitHash: entryMatch[3].trim(),
    commitUrl: entryMatch[4].trim()
  };
}

function parseAuthors(authorsText: string) {
  return authorsText
    .split(/,| and /u)
    .map(author => author.replace(/[*@]/gu, '').trim())
    .filter(Boolean);
}

function createComponentDocuments(versionBlocks: ParsedVersionBlock[], generatedAt: string) {
  return componentNames.map(component => {
    const versions = versionBlocks
      .map(versionBlock => {
        const entries = versionBlock.entries.flatMap(entry => mapEntryToComponent(component, entry));

        if (!entries.length) {
          return null;
        }

        return {
          version: versionBlock.version,
          compareUrl: versionBlock.compareUrl,
          date: versionBlock.date,
          entries
        } satisfies GeneratedComponentChangelogVersion;
      })
      .filter((version): version is GeneratedComponentChangelogVersion => Boolean(version));

    return {
      component,
      generatedAt,
      schemaVersion: 1,
      versions
    } satisfies GeneratedComponentChangelogDocument;
  });
}

function mapEntryToComponent(component: string, entry: ParsedChangelogEntry) {
  if (resolveEntryComponents(entry).includes(component)) {
    return [toGeneratedEntry(entry)];
  }

  return [];
}

function toGeneratedEntry(entry: ParsedChangelogEntry): GeneratedComponentChangelogEntry {
  return {
    type: entry.type,
    scope: entry.scope,
    summary: entry.summary,
    summaryKey: createSummaryKey(entry),
    commitHash: entry.commitHash,
    commitUrl: entry.commitUrl,
    authors: entry.authors,
    source: entry.source
  };
}

function createSummaryKey(entry: ParsedChangelogEntry): string | null {
  const commitHash = entry.commitHash?.trim();

  if (!commitHash) {
    return null;
  }

  return `changelog.generated.${entry.version}.${commitHash}`;
}

function createReleaseDocument(
  versionBlocks: ParsedVersionBlock[],
  generatedAt: string,
  contentDir: string
): GeneratedReleaseChangelogDocument {
  const notesByRelease = resolveReleaseNotes(
    versionBlocks.map(versionBlock => versionBlock.version),
    contentDir
  );

  return {
    generatedAt,
    schemaVersion: 1,
    releases: versionBlocks.map(versionBlock => {
      const entriesWithRelevance = versionBlock.entries
        .map((entry, index) => {
          const components = resolveEntryComponents(entry);

          return {
            index,
            components,
            relevanceScore: getReleaseEntryRelevanceScore(entry, components),
            entry: {
              ...toGeneratedEntry(entry),
              components
            } satisfies GeneratedReleaseChangelogEntry
          };
        })
        .sort((left, right) => {
          const relevanceDiff = right.relevanceScore - left.relevanceScore;

          if (relevanceDiff !== 0) {
            return relevanceDiff;
          }

          const typeDiff = typeRelevanceScoreMap[right.entry.type] - typeRelevanceScoreMap[left.entry.type];

          if (typeDiff !== 0) {
            return typeDiff;
          }

          return left.index - right.index;
        });
      const entries = entriesWithRelevance.map(item => item.entry);
      const componentScoreMap = new Map<string, number>();

      for (const item of entriesWithRelevance) {
        for (const component of item.components) {
          componentScoreMap.set(component, (componentScoreMap.get(component) ?? 0) + item.relevanceScore);
        }
      }

      const components = Array.from(componentScoreMap.entries())
        .sort((left, right) => {
          const scoreDiff = right[1] - left[1];

          if (scoreDiff !== 0) {
            return scoreDiff;
          }

          return left[0].localeCompare(right[0]);
        })
        .map(([component]) => component);
      const typeCounts = entries.reduce<Partial<Record<ChangelogEntryType, number>>>((counts, entry) => {
        counts[entry.type] = (counts[entry.type] ?? 0) + 1;

        return counts;
      }, {});

      return {
        version: versionBlock.version,
        compareUrl: versionBlock.compareUrl,
        date: versionBlock.date,
        entryCount: entries.length,
        componentCount: components.length,
        components,
        newComponents: resolveIntroducedComponents(versionBlock.version),
        typeCounts,
        notes: notesByRelease.get(versionBlock.version) ?? [],
        entries
      } satisfies GeneratedReleaseChangelogVersion;
    })
  };
}

function resolveIntroducedComponents(version: string): string[] {
  return releaseIntroducedComponents[version] ?? [];
}

/**
 * The release line a version belongs to: `v0.40.0-beta.1` and `v0.40.0` both
 * resolve to `v0.40.0`, while `v0.40.1` is a line of its own.
 */
export function resolveReleaseLine(version: string): string {
  const prereleaseIndex = version.indexOf('-');

  return prereleaseIndex === -1 ? version : version.slice(0, prereleaseIndex);
}

/**
 * The release a maintainer note renders under: the newest published release of
 * the note's own release line. `publishedVersions` follows `CHANGELOG.md` order
 * (newest first), so the first match is the newest one.
 *
 * Notes are authored against the release line they document, which is what makes
 * a note for an unreleased stable (`v0.50.0`) show up on the newest prerelease
 * (`v0.50.0-beta.5`) and move to the stable release the moment it is published —
 * without editing the key and without invalidating its translations. Returns
 * `null` when the release line has no published release at all.
 */
export function resolveNoteReleaseVersion(noteVersion: string, publishedVersions: string[]): string | null {
  const releaseLine = resolveReleaseLine(noteVersion);

  return publishedVersions.find(version => resolveReleaseLine(version) === releaseLine) ?? null;
}

/**
 * Group `releaseChangelogNotes` by the release each note renders under, keeping
 * the declaration order of the notes within one release.
 */
function resolveReleaseNotes(
  publishedVersions: string[],
  contentDir: string
): Map<string, GeneratedReleaseChangelogNote[]> {
  const notesByRelease = new Map<string, GeneratedReleaseChangelogNote[]>();

  for (const [noteVersion, notes] of Object.entries(releaseChangelogNotes)) {
    if (!notes.length) {
      continue;
    }

    const releaseVersion = resolveNoteReleaseVersion(noteVersion, publishedVersions);

    if (!releaseVersion) {
      console.warn(
        `Release note "${noteVersion}" matches no release line in CHANGELOG.md; it is not rendered. ` +
          'Give the note the version of a published release line.'
      );
      continue;
    }

    const releaseNotes = notes.map((note, index) => createReleaseNote(noteVersion, note, index, contentDir));

    notesByRelease.set(releaseVersion, [...(notesByRelease.get(releaseVersion) ?? []), ...releaseNotes]);
  }

  return notesByRelease;
}

function createReleaseNote(
  noteVersion: string,
  note: ReleaseChangelogNoteSource,
  index: number,
  contentDir: string
): GeneratedReleaseChangelogNote {
  const { docPath } = note;

  if (docPath && !isExistingContentDoc(contentDir, docPath)) {
    throw new Error(
      `Release note "${noteVersion}[${index}]" points at missing upgrade guide: src/content/{locale}/${docPath}.md`
    );
  }

  return {
    type: note.type,
    summary: note.summary,
    summaryKey: `changelog.generated.note.${noteVersion}.${index}`,
    ...(docPath ? { docPath } : {})
  };
}

/** A note docPath is valid only when the markdown exists for every content locale. */
function isExistingContentDoc(contentDir: string, docPath: string): boolean {
  const locales = readdirSync(contentDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  return locales.length > 0 && locales.every(locale => existsSync(path.join(contentDir, locale, `${docPath}.md`)));
}

function resolveEntryComponents(entry: ParsedChangelogEntry): string[] {
  const component = resolveChangelogComponent(entry.scope);

  if (component) {
    return [component];
  }

  const overrideKey = `${entry.version}:${entry.commitHash ?? ''}`;
  const overrideComponents = componentChangelogOverrides[overrideKey]?.components ?? [];

  if (!overrideComponents.length) {
    return [];
  }

  return Array.from(new Set(overrideComponents)).sort((left, right) => left.localeCompare(right));
}

function getReleaseEntryRelevanceScore(entry: ParsedChangelogEntry, components: string[]) {
  let score = typeRelevanceScoreMap[entry.type];

  if (components.length) {
    score += 100 + components.length * 8;
  }

  if (resolveChangelogComponent(entry.scope)) {
    score += 24;
  }

  score += sharedScopeRelevanceScoreMap[entry.scope] ?? 0;

  return score;
}

function createIndex(
  documents: GeneratedComponentChangelogDocument[],
  generatedAt: string
): GeneratedComponentChangelogIndex {
  const components = Object.fromEntries(
    documents.map(document => [
      document.component,
      {
        component: document.component,
        file: `${document.component}.json`,
        latestVersion: document.versions[0]?.version ?? null,
        versionCount: document.versions.length,
        entryCount: document.versions.reduce((total, version) => total + version.entries.length, 0)
      } satisfies GeneratedComponentChangelogIndexEntry
    ])
  ) as Record<string, GeneratedComponentChangelogIndexEntry>;

  return {
    generatedAt,
    schemaVersion: 1,
    components
  };
}
