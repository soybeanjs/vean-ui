import path from 'node:path';
import process from 'node:process';
import { docsTargets } from '../shared/docs-targets';
import type { DocsTarget } from '../shared/docs-targets';
import { flattenJsonMessages } from '../shared/json';
import {
  createLocaleTranslationContext,
  getLocaleFilePath,
  listLocaleNames,
  readLocaleMessages,
  rebuildLocaleMessages,
  shouldTranslateKey,
  writeLocaleMessages
} from '../shared/locale-file';
import {
  getPendingEntries,
  resolveTargetLocales,
  resolveTranslateTargetKeys,
  translateEntries,
  translateJsonLocaleFile
} from '../shared/translate';
import type { TranslateCliOptions, TranslateTargetKey } from '../shared/translate';
import { generateApiData } from './api';
import { generateApiLocaleTemplates } from './api-i18n';
import { generateChangelogData } from './changelog';
import { generateChangelogLocaleTemplates } from './changelog-i18n';

/**
 * `sui translate` fills the pending translations of every generated locale
 * surface. Each target first refreshes what it translates (the surface's
 * generated data and its locale templates), so a single command can never
 * translate a stale key set — and `gen` never needs a network call.
 */
const rootDir = process.cwd();

interface TranslateTarget {
  key: TranslateTargetKey;
  /** Label used in log lines, e.g. `api (docs)`. */
  label: string;
  availableLocales(): Promise<string[]>;
  /** Refresh the translated surface from source before spending API calls. */
  prepare(): Promise<void>;
  translateLocale(locale: string, cli: TranslateCliOptions): Promise<void>;
}

function createApiTranslationContext(locale: string): string {
  return [
    `Target locale: ${locale}.`,
    'Translate technical component API documentation.',
    'Preserve Markdown, punctuation, line breaks, code fences, and inline code.',
    'Do not translate identifiers inside backticks, component names, type names, prop keys, event names, or enum-like string literals unless they are ordinary prose.',
    'Keep the output natural for software documentation.'
  ].join(' ');
}

function createChangelogTranslationContext(locale: string): string {
  return [
    `Target locale: ${locale}.`,
    'Translate concise changelog summaries for a Vue component library.',
    'Keep component names, versions, Markdown, punctuation, and inline code unchanged.',
    'Prefer short release-note wording.'
  ].join(' ');
}

/**
 * Translate one JSON locale file (the API and changelog surfaces), reporting
 * pending counts, batch progress, and the written file in one consistent shape.
 */
async function translateJsonLocale(options: {
  label: string;
  localeDir: string;
  locale: string;
  cli: TranslateCliOptions;
  createContext: () => string;
  apiKeyErrorMessage: string;
}): Promise<void> {
  const logPrefix = `${options.label} ${options.locale}`;

  await translateJsonLocaleFile({
    sourcePath: path.join(options.localeDir, `${options.cli.sourceLocale}.json`),
    targetPath: path.join(options.localeDir, `${options.locale}.json`),
    sourceLocale: options.cli.sourceLocale,
    targetLocale: options.locale,
    batchSize: options.cli.batchSize,
    overwrite: options.cli.overwrite,
    limit: options.cli.limit,
    dryRun: options.cli.dryRun,
    createContext: options.createContext,
    apiKeyErrorMessage: options.apiKeyErrorMessage,
    sourceLanguage: process.env.DEEPL_SOURCE_LANG?.trim() || undefined,
    onPendingResolved: context => {
      console.log(
        context.pendingCount
          ? `${logPrefix}: ${context.pendingCount} pending translations`
          : `${logPrefix}: no pending translations`
      );
    },
    onBatchStart: context => {
      console.log(
        `${logPrefix}: translating batch ${context.batchIndex + 1}/${context.batchCount} (${context.entryCount} entries)`
      );
    },
    onUpdated: context => {
      console.log(
        `${logPrefix}: wrote ${path.relative(rootDir, context.targetPath)} (${context.pendingCount} translations)`
      );
    }
  });
}

function createApiTarget(target: DocsTarget): TranslateTarget {
  const label = `api (${target.key})`;
  const localeDir = path.join(target.generatedDir, 'api-locales');

  return {
    key: 'api',
    label,
    availableLocales: async () => target.locales,
    prepare: async () => {
      await generateApiData(path.join(target.generatedDir, 'api'));
      await generateApiLocaleTemplates(target);
    },
    translateLocale: (locale, cli) =>
      translateJsonLocale({
        label,
        localeDir,
        locale,
        cli,
        createContext: () => createApiTranslationContext(locale),
        apiKeyErrorMessage: 'DEEPL_API_KEY is required to translate API descriptions.'
      })
  };
}

function createChangelogTarget(target: DocsTarget): TranslateTarget {
  const label = `changelog (${target.key})`;
  const localeDir = path.join(target.generatedDir, 'changelog-locales');

  return {
    key: 'changelog',
    label,
    availableLocales: async () => target.locales,
    prepare: async () => {
      await generateChangelogData(path.join(target.generatedDir, 'changelog'), target.contentDir);
      await generateChangelogLocaleTemplates(target);
    },
    translateLocale: (locale, cli) =>
      translateJsonLocale({
        label,
        localeDir,
        locale,
        cli,
        createContext: () => createChangelogTranslationContext(locale),
        apiKeyErrorMessage: 'DEEPL_API_KEY is required to translate changelog summaries.'
      })
  };
}

/** Aria locale bundles are hand-written source, so there is nothing to prepare. */
function createLocaleTarget(): TranslateTarget {
  return {
    key: 'locale',
    label: 'locale',
    availableLocales: listLocaleNames,
    prepare: async () => {},
    translateLocale: translateAriaLocale
  };
}

async function translateAriaLocale(locale: string, cli: TranslateCliOptions): Promise<void> {
  const logPrefix = `locale ${locale}`;
  const sourceMessages = await readLocaleMessages(cli.sourceLocale);

  if (!Object.keys(sourceMessages).length) {
    throw new Error(`Unable to find source locale: ${cli.sourceLocale}`);
  }

  const flattenedTargetMessages = flattenJsonMessages(await readLocaleMessages(locale));
  const pendingEntries = getPendingEntries(
    flattenJsonMessages(sourceMessages),
    flattenedTargetMessages,
    cli.overwrite,
    cli.limit,
    shouldTranslateKey
  );

  if (!pendingEntries.length) {
    console.log(`${logPrefix}: no pending translations`);
    return;
  }

  console.log(`${logPrefix}: ${pendingEntries.length} pending translations`);

  if (cli.dryRun) {
    return;
  }

  const translatedEntries = await translateEntries({
    entries: pendingEntries,
    batchSize: cli.batchSize,
    sourceLocale: cli.sourceLocale,
    targetLocale: locale,
    createContext: entries => createLocaleTranslationContext(locale, entries),
    sourceLanguage: process.env.DEEPL_SOURCE_LANG?.trim() || undefined,
    protectPlaceholders: true,
    onBatchStart: context => {
      console.log(
        `${logPrefix}: translating batch ${context.batchIndex + 1}/${context.batchCount} (${context.entryCount} entries)`
      );
    }
  });

  pendingEntries.forEach(entry => {
    const translatedValue = translatedEntries.get(entry.key);

    if (translatedValue === undefined) {
      throw new Error(`Missing translated value for key: ${entry.key}`);
    }

    flattenedTargetMessages.set(entry.key, translatedValue);
  });

  await writeLocaleMessages(locale, rebuildLocaleMessages(sourceMessages, flattenedTargetMessages));
  console.log(
    `${logPrefix}: wrote ${path.relative(rootDir, getLocaleFilePath(locale))} (${pendingEntries.length} translations)`
  );
}

function createTargets(targetKey: TranslateTargetKey): TranslateTarget[] {
  if (targetKey === 'locale') {
    return [createLocaleTarget()];
  }

  return docsTargets.map(target => (targetKey === 'api' ? createApiTarget(target) : createChangelogTarget(target)));
}

export async function runTranslate(requestedTarget: string, cli: TranslateCliOptions): Promise<void> {
  for (const targetKey of resolveTranslateTargetKeys(requestedTarget)) {
    for (const target of createTargets(targetKey)) {
      const availableLocales = await target.availableLocales();

      if (!availableLocales.includes(cli.sourceLocale)) {
        throw new Error(
          `Unknown source locale for ${target.label}: ${cli.sourceLocale}. Available: ${availableLocales.join(', ')}.`
        );
      }

      await target.prepare();

      const targetLocales = resolveTargetLocales({
        availableLocales,
        sourceLocale: cli.sourceLocale,
        requestedLocale: cli.locale,
        emptyMessage: `No locales available for ${target.label}.`,
        unsupportedLocaleMessage: locale => `Unknown target locale: ${locale}`
      });

      for (const locale of targetLocales) {
        await target.translateLocale(locale, cli);
      }
    }
  }
}
