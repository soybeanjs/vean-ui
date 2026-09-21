import process from 'node:process';
import {
  chunkArray,
  flattenJsonMessages,
  readJsonObject,
  readResponseText,
  setNestedValue,
  writeJsonFile
} from './json';

export interface TranslateCliOptions {
  locale: string;
  sourceLocale: string;
  batchSize: number;
  limit: number | null;
  overwrite: boolean;
  dryRun: boolean;
}

export interface TranslationEntry {
  key: string;
  source: string;
}

/**
 * Surfaces `sui translate` can fill: the two generated docs datasets and the
 * aria locale bundles.
 */
export type TranslateTargetKey = 'api' | 'changelog' | 'locale';

export const translateTargetKeys: TranslateTargetKey[] = ['api', 'changelog', 'locale'];

export function resolveTranslateTargetKeys(requested: string): TranslateTargetKey[] {
  if (requested === 'all') {
    return translateTargetKeys;
  }

  const targetKey = translateTargetKeys.find(key => key === requested);

  if (!targetKey) {
    throw new Error(`Unknown translate target: ${requested}. Expected one of: api | changelog | locale | all.`);
  }

  return [targetKey];
}

interface PreparedTranslationEntry extends TranslationEntry {
  protectedSource: string;
  placeholderTokens: Map<string, string>;
}

interface DeepLTranslation {
  detected_source_language?: string;
  text?: string;
}

interface DeepLTranslateResponse {
  detail?: string;
  message?: string;
  translations?: DeepLTranslation[];
}

export const DEFAULT_TRANSLATE_BASE_URL = 'https://api-free.deepl.com/v2';
export const DEFAULT_TRANSLATE_RETRY_COUNT = 3;
export const DEFAULT_TRANSLATE_RETRY_DELAY_MS = 1500;

const deepLLanguageMap = new Map<string, string>([
  ['bg', 'BG'],
  ['cs', 'CS'],
  ['da', 'DA'],
  ['de', 'DE'],
  ['el', 'EL'],
  ['en', 'EN'],
  ['en-gb', 'EN-GB'],
  ['en-us', 'EN-US'],
  ['es', 'ES'],
  ['et', 'ET'],
  ['fi', 'FI'],
  ['fr', 'FR'],
  ['hu', 'HU'],
  ['id', 'ID'],
  ['it', 'IT'],
  ['ja', 'JA'],
  ['ko', 'KO'],
  ['lt', 'LT'],
  ['lv', 'LV'],
  ['nb', 'NB'],
  ['nb-no', 'NB'],
  ['nl', 'NL'],
  ['pl', 'PL'],
  ['pt', 'PT-PT'],
  ['pt-br', 'PT-BR'],
  ['pt-pt', 'PT-PT'],
  ['ro', 'RO'],
  ['ru', 'RU'],
  ['sk', 'SK'],
  ['sl', 'SL'],
  ['sv', 'SV'],
  ['tr', 'TR'],
  ['uk', 'UK'],
  ['zh', 'ZH'],
  ['zh-cn', 'ZH'],
  ['zh-hans', 'ZH'],
  ['zh-hk', 'ZH'],
  ['zh-sg', 'ZH'],
  ['zh-tw', 'ZH'],
  ['zh-hant', 'ZH']
]);

/**
 * Retry tuning accepts both prefixes: `TRANSLATE_*` is the documented one, while
 * `DEEPL_*` is kept working for setups that predate it.
 */
function getRetryEnvNumber(names: string[], fallback: number): number {
  for (const name of names) {
    const value = Number(process.env[name]?.trim());

    if (Number.isFinite(value) && value >= 0) {
      return value;
    }
  }

  return fallback;
}

export const DEFAULT_TRANSLATE_BATCH_SIZE = 20;
export const DEFAULT_TRANSLATE_SOURCE_LOCALE = 'en';

/**
 * Raw option values as the CLI hands them over: declared value options arrive as
 * strings, flags as booleans, and anything the caller omitted as undefined.
 */
export interface TranslateOptionInput {
  locale?: string;
  sourceLocale?: string;
  batchSize?: string | number;
  limit?: string | number;
  overwrite?: boolean;
  dryRun?: boolean;
}

/** Coerce CLI options into the shape the translation driver consumes. */
export function resolveTranslateOptions(input: TranslateOptionInput = {}): TranslateCliOptions {
  const batchSize = Number(input.batchSize);
  const limit = Number(input.limit);

  return {
    locale: input.locale?.trim() ?? '',
    sourceLocale: input.sourceLocale?.trim() || DEFAULT_TRANSLATE_SOURCE_LOCALE,
    batchSize: batchSize > 0 ? batchSize : DEFAULT_TRANSLATE_BATCH_SIZE,
    limit: limit > 0 ? limit : null,
    overwrite: Boolean(input.overwrite),
    dryRun: Boolean(input.dryRun)
  };
}

export function getPendingEntries(
  sourceMessages: Map<string, string>,
  targetMessages: Map<string, string>,
  overwrite: boolean,
  limit: number | null,
  shouldIncludeKey: (key: string) => boolean = () => true
): TranslationEntry[] {
  const pendingEntries = Array.from(sourceMessages.entries())
    .filter(([key]) => shouldIncludeKey(key))
    .filter(([, source]) => source.trim())
    .filter(([key]) => overwrite || !targetMessages.get(key)?.trim())
    .map(([key, source]) => ({ key, source }));

  return limit ? pendingEntries.slice(0, limit) : pendingEntries;
}

export function getTranslateApiKey(
  errorMessage: string = 'Missing required environment variable: DEEPL_API_KEY'
): string {
  const apiKey = process.env.DEEPL_API_KEY?.trim() || process.env.TRANSLATE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(errorMessage);
  }

  return apiKey;
}

export function getTranslateBaseUrl(): string {
  return (
    process.env.DEEPL_BASE_URL?.trim() ||
    process.env.TRANSLATE_BASE_URL?.trim() ||
    DEFAULT_TRANSLATE_BASE_URL
  ).replace(/\/$/u, '');
}

export function resolveTargetLocales(options: {
  availableLocales: string[];
  sourceLocale: string;
  requestedLocale?: string;
  emptyMessage?: string;
  unsupportedLocaleMessage?: (locale: string) => string;
  sameAsSourceMessage?: string;
}): string[] {
  const targetLocales = (
    options.requestedLocale
      ? [options.requestedLocale]
      : options.availableLocales.filter(locale => locale !== options.sourceLocale)
  )
    .filter((locale, index, locales) => locales.indexOf(locale) === index)
    .sort((left, right) => left.localeCompare(right));

  if (!targetLocales.length) {
    throw new Error(options.emptyMessage ?? 'No target locales available for translation.');
  }

  const invalidLocale = targetLocales.find(locale => locale === options.sourceLocale);

  if (invalidLocale) {
    throw new Error(options.sameAsSourceMessage ?? 'Target locale must be different from source locale.');
  }

  const unsupportedLocale = targetLocales.find(locale => !options.availableLocales.includes(locale));

  if (unsupportedLocale) {
    throw new Error(
      options.unsupportedLocaleMessage?.(unsupportedLocale) ?? `Unsupported locale: ${unsupportedLocale}`
    );
  }

  return targetLocales;
}

export function toDeepLLanguage(locale: string): string {
  const normalizedLocale = locale.trim().replace(/_/gu, '-').toLowerCase();
  const mappedLanguage = deepLLanguageMap.get(normalizedLocale);

  if (mappedLanguage) {
    return mappedLanguage;
  }

  const [language, region] = normalizedLocale.split('-');

  if (!region) {
    return language.toUpperCase();
  }

  return `${language.toUpperCase()}-${region.toUpperCase()}`;
}

function shouldRetryRequest(status: number): boolean {
  return status === 429 || status >= 500;
}

function getRetryDelay(attempt: number, retryDelayMs: number): number {
  return retryDelayMs * 2 ** attempt;
}

async function wait(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

function protectPlaceholders(source: string): Pick<PreparedTranslationEntry, 'placeholderTokens' | 'protectedSource'> {
  const placeholderTokens = new Map<string, string>();
  const placeholders = Array.from(source.matchAll(/\{[^}]+\}/gu), match => match[0]);

  if (!placeholders.length) {
    return { placeholderTokens, protectedSource: source };
  }

  let protectedSource = source;

  placeholders.forEach((placeholder, index) => {
    const token = `SBPH${index}TOKEN`;
    placeholderTokens.set(token, placeholder);
    protectedSource = protectedSource.replaceAll(placeholder, token);
  });

  return { placeholderTokens, protectedSource };
}

function restorePlaceholders(text: string, placeholderTokens: Map<string, string>): string {
  let restoredText = text;

  placeholderTokens.forEach((placeholder, token) => {
    restoredText = restoredText.replaceAll(token, placeholder);
  });

  return restoredText;
}

function getDeepLErrorMessage(payload: DeepLTranslateResponse | null, fallback: string): string {
  return payload?.message?.trim() || payload?.detail?.trim() || fallback;
}

function parseDeepLErrorResponse(responseText: string): DeepLTranslateResponse | null {
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as DeepLTranslateResponse;
  } catch {
    return null;
  }
}

export async function requestTranslations(options: {
  entries: TranslationEntry[];
  sourceLocale: string;
  targetLocale: string;
  context: string;
  apiKey: string;
  baseUrl: string;
  retryCount: number;
  retryDelayMs: number;
  preserveFormatting?: boolean;
  protectPlaceholders?: boolean;
  sourceLanguage?: string;
}): Promise<Map<string, string>> {
  const sourceLanguage = options.sourceLanguage ?? toDeepLLanguage(options.sourceLocale);
  const targetLanguage = toDeepLLanguage(options.targetLocale);
  const preparedEntries = options.protectPlaceholders
    ? options.entries.map(entry => ({ ...entry, ...protectPlaceholders(entry.source) }))
    : options.entries.map(entry => ({
        ...entry,
        placeholderTokens: new Map<string, string>(),
        protectedSource: entry.source
      }));

  let payload: DeepLTranslateResponse | null = null;

  for (let attempt = 0; attempt <= options.retryCount; attempt += 1) {
    const response = await fetch(`${options.baseUrl}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `DeepL-Auth-Key ${options.apiKey}`
      },
      body: JSON.stringify({
        context: options.context,
        preserve_formatting: options.preserveFormatting ?? true,
        source_lang: sourceLanguage,
        target_lang: targetLanguage,
        text: preparedEntries.map(entry => entry.protectedSource)
      })
    });

    if (response.ok) {
      payload = (await response.json()) as DeepLTranslateResponse;
      break;
    }

    const responseText = await readResponseText(response);
    const parsedError = parseDeepLErrorResponse(responseText);

    if (attempt < options.retryCount && shouldRetryRequest(response.status)) {
      const delayMs = getRetryDelay(attempt, options.retryDelayMs);
      console.log(
        `Translation request failed with ${response.status}. Retrying in ${delayMs}ms (${attempt + 1}/${options.retryCount})...`
      );
      await wait(delayMs);
      continue;
    }

    const details = getDeepLErrorMessage(parsedError, responseText || response.statusText);
    throw new Error(`Translation request failed: ${response.status} ${details}`);
  }

  if (!payload) {
    throw new Error('Translation request failed without a response payload.');
  }

  if (!payload.translations?.length) {
    throw new Error('Translation response did not include translations.');
  }

  const translatedEntries = new Map<string, string>();

  preparedEntries.forEach((entry, index) => {
    const translatedValue = payload?.translations?.[index]?.text;

    if (typeof translatedValue !== 'string') {
      throw new Error(`Missing translated value for key: ${entry.key}`);
    }

    translatedEntries.set(entry.key, restorePlaceholders(translatedValue, entry.placeholderTokens));
  });

  return translatedEntries;
}

export async function translateEntries(options: {
  entries: TranslationEntry[];
  batchSize: number;
  sourceLocale: string;
  targetLocale: string;
  createContext: (entries: TranslationEntry[]) => string;
  apiKeyErrorMessage?: string;
  sourceLanguage?: string;
  protectPlaceholders?: boolean;
  onBatchStart?: (context: { batchIndex: number; batchCount: number; entryCount: number; locale: string }) => void;
}): Promise<Map<string, string>> {
  const apiKey = getTranslateApiKey(options.apiKeyErrorMessage);
  const baseUrl = getTranslateBaseUrl();
  const retryCount = getRetryEnvNumber(['TRANSLATE_RETRY_COUNT', 'DEEPL_RETRY_COUNT'], DEFAULT_TRANSLATE_RETRY_COUNT);
  const retryDelayMs = getRetryEnvNumber(
    ['TRANSLATE_RETRY_DELAY_MS', 'DEEPL_RETRY_DELAY_MS'],
    DEFAULT_TRANSLATE_RETRY_DELAY_MS
  );
  const translatedTextCache = new Map<string, string>();
  const translatedEntries = new Map<string, string>();
  const entryChunks = chunkArray(options.entries, options.batchSize);

  for (const [chunkIndex, entryChunk] of entryChunks.entries()) {
    const uncachedEntries = entryChunk.filter(entry => !translatedTextCache.has(entry.source));

    if (uncachedEntries.length) {
      options.onBatchStart?.({
        batchIndex: chunkIndex,
        batchCount: entryChunks.length,
        entryCount: uncachedEntries.length,
        locale: options.targetLocale
      });

      const nextTranslations = await requestTranslations({
        entries: uncachedEntries,
        sourceLocale: options.sourceLocale,
        targetLocale: options.targetLocale,
        context: options.createContext(uncachedEntries),
        apiKey,
        baseUrl,
        retryCount,
        retryDelayMs,
        sourceLanguage: options.sourceLanguage,
        protectPlaceholders: options.protectPlaceholders
      });

      uncachedEntries.forEach(entry => {
        translatedTextCache.set(entry.source, nextTranslations.get(entry.key) ?? '');
      });
    }

    entryChunk.forEach(entry => {
      const translatedValue = translatedTextCache.get(entry.source);

      if (translatedValue === undefined) {
        throw new Error(`Missing cached translation for key: ${entry.key}`);
      }

      translatedEntries.set(entry.key, translatedValue);
    });
  }

  return translatedEntries;
}

export async function translateJsonLocaleFile(options: {
  sourcePath: string;
  targetPath: string;
  sourceLocale: string;
  targetLocale: string;
  batchSize: number;
  overwrite: boolean;
  limit: number | null;
  dryRun: boolean;
  createContext: (entries: TranslationEntry[]) => string;
  shouldIncludeKey?: (key: string) => boolean;
  apiKeyErrorMessage?: string;
  sourceLanguage?: string;
  protectPlaceholders?: boolean;
  onPendingResolved?: (context: { locale: string; pendingCount: number }) => void;
  onBatchStart?: (context: { batchIndex: number; batchCount: number; entryCount: number; locale: string }) => void;
  onUpdated?: (context: { locale: string; pendingCount: number; targetPath: string }) => void;
}): Promise<{
  pendingEntries: TranslationEntry[];
  updated: boolean;
}> {
  const [sourceMessages, targetMessages] = await Promise.all([
    readJsonObject(options.sourcePath),
    readJsonObject(options.targetPath)
  ]);
  const pendingEntries = getPendingEntries(
    flattenJsonMessages(sourceMessages),
    flattenJsonMessages(targetMessages),
    options.overwrite,
    options.limit,
    options.shouldIncludeKey
  );

  options.onPendingResolved?.({
    locale: options.targetLocale,
    pendingCount: pendingEntries.length
  });

  if (!pendingEntries.length || options.dryRun) {
    return {
      pendingEntries,
      updated: false
    };
  }

  const translatedEntries = await translateEntries({
    entries: pendingEntries,
    batchSize: options.batchSize,
    sourceLocale: options.sourceLocale,
    targetLocale: options.targetLocale,
    createContext: options.createContext,
    apiKeyErrorMessage: options.apiKeyErrorMessage,
    sourceLanguage: options.sourceLanguage,
    protectPlaceholders: options.protectPlaceholders,
    onBatchStart: options.onBatchStart
  });

  pendingEntries.forEach(entry => {
    const translatedValue = translatedEntries.get(entry.key);

    if (translatedValue === undefined) {
      throw new Error(`Missing translated value for key: ${entry.key}`);
    }

    setNestedValue(targetMessages, entry.key, translatedValue);
  });

  await writeJsonFile(options.targetPath, targetMessages, { sort: true });
  options.onUpdated?.({
    locale: options.targetLocale,
    pendingCount: pendingEntries.length,
    targetPath: options.targetPath
  });

  return {
    pendingEntries,
    updated: true
  };
}
