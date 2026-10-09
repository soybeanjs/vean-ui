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

/**
 * Supported machine-translation backends. Azure is preferred whenever it is
 * configured; DeepL stays available as a fallback and for setups that predate
 * the Azure integration.
 */
export type TranslationProvider = 'azure' | 'deepl';

export const translationProviders: TranslationProvider[] = ['azure', 'deepl'];

export interface TranslationProviderConfig {
  provider: TranslationProvider;
  apiKey: string;
  endpoint: string;
  region?: string;
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

interface AzureTranslation {
  text?: string;
  to?: string;
}

interface AzureTranslationResult {
  detectedLanguage?: {
    language?: string;
    score?: number;
  };
  translations?: AzureTranslation[];
}

interface AzureErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}

export const DEFAULT_DEEPL_TRANSLATE_BASE_URL = 'https://api-free.deepl.com/v2';
export const DEFAULT_AZURE_TRANSLATE_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/';
export const DEFAULT_TRANSLATE_RETRY_COUNT = 3;
export const DEFAULT_TRANSLATE_RETRY_DELAY_MS = 1500;

/** Azure caps one request at 1 000 elements and 50 000 characters; stay below it. */
export const AZURE_MAX_ITEMS_PER_REQUEST = 1000;
export const AZURE_MAX_CHARACTERS_PER_REQUEST = 45000;

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
 * Azure Translator codes are BCP-47 with lowercase language subtags and a
 * qualifier only where the language actually forks. This map holds every
 * mapping that is not mechanical (Chinese script choice, Portuguese variants,
 * English variants, Norwegian Bokmål).
 */
const azureLanguageAliases = new Map<string, string>([
  ['zh', 'zh-Hans'],
  ['zh-cn', 'zh-Hans'],
  ['zh-hans', 'zh-Hans'],
  ['zh-sg', 'zh-Hans'],
  ['zh-tw', 'zh-Hant'],
  ['zh-hk', 'zh-Hant'],
  ['zh-hant', 'zh-Hant'],
  ['zh-mo', 'zh-Hant'],
  ['pt-br', 'pt'],
  ['pt-pt', 'pt-pt'],
  ['en-us', 'en'],
  ['en-gb', 'en'],
  ['nb-no', 'nb']
]);

/** Languages Azure publishes with a region subtag; anything else drops it. */
const azureRegionalLanguages = new Set(['es', 'fr']);

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

/** Source language override; `DEEPL_SOURCE_LANG` is the pre-Azure spelling. */
export function getTranslateSourceLanguage(env: NodeJS.ProcessEnv = process.env): string | undefined {
  return readEnvValue('TRANSLATE_SOURCE_LANG', env) ?? readEnvValue('DEEPL_SOURCE_LANG', env);
}

function readEnvValue(name: string, env: NodeJS.ProcessEnv): string | undefined {
  return env[name]?.trim() || undefined;
}

function resolveAzureProvider(errorMessage: string, env: NodeJS.ProcessEnv): TranslationProviderConfig {
  const apiKey = readEnvValue('AZURE_TRANSLATE_KEY', env);

  if (!apiKey) {
    throw new Error(errorMessage);
  }

  const endpoint = (
    readEnvValue('AZURE_TEXT_TRANSLATE_URL', env) ??
    readEnvValue('AZURE_TRANSLATE_URL', env) ??
    DEFAULT_AZURE_TRANSLATE_ENDPOINT
  ).replace(/\/$/u, '');

  return {
    provider: 'azure',
    apiKey,
    endpoint,
    region: readEnvValue('AZURE_TRANSLATE_REGION', env)
  };
}

function resolveDeepLProvider(errorMessage: string, env: NodeJS.ProcessEnv): TranslationProviderConfig {
  const apiKey = readEnvValue('DEEPL_API_KEY', env) ?? readEnvValue('TRANSLATE_API_KEY', env);

  if (!apiKey) {
    throw new Error(errorMessage);
  }

  const endpoint = (
    readEnvValue('DEEPL_BASE_URL', env) ??
    readEnvValue('TRANSLATE_BASE_URL', env) ??
    DEFAULT_DEEPL_TRANSLATE_BASE_URL
  ).replace(/\/$/u, '');

  return {
    provider: 'deepl',
    apiKey,
    endpoint
  };
}

const defaultProviderErrorMessage =
  'Missing translation credentials: set AZURE_TRANSLATE_KEY (preferred) or DEEPL_API_KEY';

/**
 * Resolve the active backend. Precedence: the explicit `TRANSLATE_PROVIDER` /
 * caller override, then Azure, then DeepL — so an environment that has both keys
 * translates through Azure without any extra configuration.
 *
 * `env` is a parameter so tests can state the credential set explicitly instead
 * of inheriting whatever the ambient shell exports.
 */
export function resolveTranslationProvider(
  options: {
    requestedProvider?: string;
    errorMessage?: string;
    env?: NodeJS.ProcessEnv;
  } = {}
): TranslationProviderConfig {
  const env = options.env ?? process.env;
  const requestedProvider = (options.requestedProvider ?? readEnvValue('TRANSLATE_PROVIDER', env))?.toLowerCase();
  const errorMessage = options.errorMessage ?? defaultProviderErrorMessage;

  if (requestedProvider) {
    if (requestedProvider === 'azure') {
      return resolveAzureProvider(errorMessage, env);
    }

    if (requestedProvider === 'deepl') {
      return resolveDeepLProvider(errorMessage, env);
    }

    throw new Error(
      `Unknown translation provider: ${requestedProvider}. Expected one of: ${translationProviders.join(' | ')}.`
    );
  }

  if (readEnvValue('AZURE_TRANSLATE_KEY', env)) {
    return resolveAzureProvider(errorMessage, env);
  }

  if (readEnvValue('DEEPL_API_KEY', env) ?? readEnvValue('TRANSLATE_API_KEY', env)) {
    return resolveDeepLProvider(errorMessage, env);
  }

  throw new Error(errorMessage);
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

function formatAzureSubtag(subtag: string): string {
  // 4-letter subtags are ISO 15924 scripts (`zh-Hans`, `sr-Cyrl`), not regions.
  return subtag.length === 4 ? `${subtag[0]?.toUpperCase()}${subtag.slice(1).toLowerCase()}` : subtag.toUpperCase();
}

export function toAzureLanguage(locale: string): string {
  const normalizedLocale = locale.trim().replace(/_/gu, '-').toLowerCase();
  const mappedLanguage = azureLanguageAliases.get(normalizedLocale);

  if (mappedLanguage) {
    return mappedLanguage;
  }

  const [language, subtag] = normalizedLocale.split('-');

  if (!subtag) {
    return language;
  }

  if (subtag.length === 4) {
    return `${language}-${formatAzureSubtag(subtag)}`;
  }

  // A region Azure does not publish (`en-GB`, `de-AT`) resolves to the base
  // language; only the forked languages keep their region subtag.
  return azureRegionalLanguages.has(language) ? `${language}-${subtag.toUpperCase()}` : language;
}

export function toProviderLanguage(locale: string, provider: TranslationProvider): string {
  return provider === 'azure' ? toAzureLanguage(locale) : toDeepLLanguage(locale);
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

function prepareEntries(options: {
  entries: TranslationEntry[];
  protectPlaceholders?: boolean;
}): PreparedTranslationEntry[] {
  if (!options.protectPlaceholders) {
    return options.entries.map(entry => ({
      ...entry,
      placeholderTokens: new Map<string, string>(),
      protectedSource: entry.source
    }));
  }

  return options.entries.map(entry => ({ ...entry, ...protectPlaceholders(entry.source) }));
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

function getAzureErrorMessage(payload: AzureErrorResponse | null, fallback: string): string {
  return payload?.error?.message?.trim() || payload?.error?.code?.trim() || fallback;
}

function parseAzureErrorResponse(responseText: string): AzureErrorResponse | null {
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as AzureErrorResponse;
  } catch {
    return null;
  }
}

async function postJson(options: {
  url: string;
  headers: Record<string, string>;
  body: unknown;
  retryCount: number;
  retryDelayMs: number;
  describeFailure: (responseText: string, statusText: string) => string;
}): Promise<{ ok: true; payload: unknown } | { ok: false; message: string; status: number }> {
  for (let attempt = 0; attempt <= options.retryCount; attempt += 1) {
    const response = await fetch(options.url, {
      method: 'POST',
      headers: options.headers,
      body: JSON.stringify(options.body)
    });

    if (response.ok) {
      return { ok: true, payload: (await response.json()) as unknown };
    }

    const responseText = await readResponseText(response);

    if (attempt < options.retryCount && shouldRetryRequest(response.status)) {
      const delayMs = getRetryDelay(attempt, options.retryDelayMs);
      console.log(
        `Translation request failed with ${response.status}. Retrying in ${delayMs}ms (${attempt + 1}/${options.retryCount})...`
      );
      await wait(delayMs);
      continue;
    }

    return {
      ok: false,
      status: response.status,
      message: options.describeFailure(responseText, response.statusText)
    };
  }

  return { ok: false, status: 0, message: 'Translation request failed without a response payload.' };
}

export async function requestDeepLTranslations(options: {
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
  const preparedEntries = prepareEntries(options);

  const result = await postJson({
    url: `${options.baseUrl}/translate`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `DeepL-Auth-Key ${options.apiKey}`
    },
    body: {
      context: options.context,
      preserve_formatting: options.preserveFormatting ?? true,
      source_lang: sourceLanguage,
      target_lang: targetLanguage,
      text: preparedEntries.map(entry => entry.protectedSource)
    },
    retryCount: options.retryCount,
    retryDelayMs: options.retryDelayMs,
    describeFailure: (responseText, statusText) =>
      getDeepLErrorMessage(parseDeepLErrorResponse(responseText), responseText || statusText)
  });

  if (!result.ok) {
    throw new Error(`Translation request failed: ${result.status} ${result.message}`);
  }

  const payload = result.payload as DeepLTranslateResponse;

  if (!payload.translations?.length) {
    throw new Error('Translation response did not include translations.');
  }

  const translatedEntries = new Map<string, string>();

  preparedEntries.forEach((entry, index) => {
    const translatedValue = payload.translations?.[index]?.text;

    if (typeof translatedValue !== 'string') {
      throw new Error(`Missing translated value for key: ${entry.key}`);
    }

    translatedEntries.set(entry.key, restorePlaceholders(translatedValue, entry.placeholderTokens));
  });

  return translatedEntries;
}

/**
 * Azure Translator has no `context` field, so the caller's context is dropped;
 * the request is one positional array whose response items line up by index.
 * The endpoint already ends without a trailing slash (`AZURE_TEXT_TRANSLATE_URL`
 * is normalized for this reason).
 */
export async function requestAzureTranslations(options: {
  entries: TranslationEntry[];
  sourceLocale: string;
  targetLocale: string;
  apiKey: string;
  endpoint: string;
  region?: string;
  retryCount: number;
  retryDelayMs: number;
  protectPlaceholders?: boolean;
  sourceLanguage?: string;
}): Promise<Map<string, string>> {
  const preparedEntries = prepareEntries(options);
  const sourceLanguage = options.sourceLanguage ?? toAzureLanguage(options.sourceLocale);
  const targetLanguage = toAzureLanguage(options.targetLocale);
  const translatedEntries = new Map<string, string>();

  for (const batch of splitEntriesByCharacterBudget(
    preparedEntries,
    AZURE_MAX_ITEMS_PER_REQUEST,
    AZURE_MAX_CHARACTERS_PER_REQUEST
  )) {
    const requestUrl = new URL(`${options.endpoint}/translate`);

    requestUrl.searchParams.set('api-version', '3.0');
    requestUrl.searchParams.set('from', sourceLanguage);
    requestUrl.searchParams.set('to', targetLanguage);

    const result = await postJson({
      url: requestUrl.toString(),
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': options.apiKey,
        ...(options.region ? { 'Ocp-Apim-Subscription-Region': options.region } : {})
      },
      body: batch.map(entry => ({ text: entry.protectedSource })),
      retryCount: options.retryCount,
      retryDelayMs: options.retryDelayMs,
      describeFailure: (responseText, statusText) =>
        getAzureErrorMessage(parseAzureErrorResponse(responseText), responseText || statusText)
    });

    if (!result.ok) {
      throw new Error(`Translation request failed: ${result.status} ${result.message}`);
    }

    if (!Array.isArray(result.payload)) {
      throw new Error('Translation response did not include translations.');
    }

    const payload = result.payload as AzureTranslationResult[];

    batch.forEach((entry, index) => {
      const translatedValue = payload[index]?.translations?.[0]?.text;

      if (typeof translatedValue !== 'string') {
        throw new Error(`Missing translated value for key: ${entry.key}`);
      }

      translatedEntries.set(entry.key, restorePlaceholders(translatedValue, entry.placeholderTokens));
    });
  }

  return translatedEntries;
}

/**
 * Split Azure batches by both limits: `maxItems` guards the array length and
 * `maxCharacters` the cumulative request size, so one oversized entry still
 * travels alone rather than failing the whole chunk.
 */
export function splitEntriesByCharacterBudget<T extends TranslationEntry>(
  entries: T[],
  maxItems: number,
  maxCharacters: number
): T[][] {
  const batches: T[][] = [];
  let currentBatch: T[] = [];
  let currentCharacters = 0;

  for (const entry of entries) {
    const entryCharacters = entry.source.length;
    const wouldOverflow =
      currentBatch.length >= maxItems ||
      (currentBatch.length > 0 && currentCharacters + entryCharacters > maxCharacters);

    if (wouldOverflow) {
      batches.push(currentBatch);
      currentBatch = [];
      currentCharacters = 0;
    }

    currentBatch.push(entry);
    currentCharacters += entryCharacters;
  }

  if (currentBatch.length) {
    batches.push(currentBatch);
  }

  return batches;
}

export async function requestProviderTranslations(options: {
  provider: TranslationProviderConfig;
  entries: TranslationEntry[];
  sourceLocale: string;
  targetLocale: string;
  context: string;
  retryCount: number;
  retryDelayMs: number;
  protectPlaceholders?: boolean;
  sourceLanguage?: string;
}): Promise<Map<string, string>> {
  if (options.provider.provider === 'azure') {
    return requestAzureTranslations({
      entries: options.entries,
      sourceLocale: options.sourceLocale,
      targetLocale: options.targetLocale,
      apiKey: options.provider.apiKey,
      endpoint: options.provider.endpoint,
      region: options.provider.region,
      retryCount: options.retryCount,
      retryDelayMs: options.retryDelayMs,
      protectPlaceholders: options.protectPlaceholders,
      sourceLanguage: options.sourceLanguage
    });
  }

  return requestDeepLTranslations({
    entries: options.entries,
    sourceLocale: options.sourceLocale,
    targetLocale: options.targetLocale,
    context: options.context,
    apiKey: options.provider.apiKey,
    baseUrl: options.provider.endpoint,
    retryCount: options.retryCount,
    retryDelayMs: options.retryDelayMs,
    protectPlaceholders: options.protectPlaceholders,
    sourceLanguage: options.sourceLanguage
  });
}

export async function translateEntries(options: {
  entries: TranslationEntry[];
  batchSize: number;
  sourceLocale: string;
  targetLocale: string;
  createContext: (entries: TranslationEntry[]) => string;
  providerErrorMessage?: string;
  provider?: TranslationProviderConfig;
  sourceLanguage?: string;
  protectPlaceholders?: boolean;
  onProviderResolved?: (provider: TranslationProviderConfig) => void;
  onBatchStart?: (context: { batchIndex: number; batchCount: number; entryCount: number; locale: string }) => void;
}): Promise<Map<string, string>> {
  const provider = options.provider ?? resolveTranslationProvider({ errorMessage: options.providerErrorMessage });
  const retryCount = getRetryEnvNumber(['TRANSLATE_RETRY_COUNT', 'DEEPL_RETRY_COUNT'], DEFAULT_TRANSLATE_RETRY_COUNT);
  const retryDelayMs = getRetryEnvNumber(
    ['TRANSLATE_RETRY_DELAY_MS', 'DEEPL_RETRY_DELAY_MS'],
    DEFAULT_TRANSLATE_RETRY_DELAY_MS
  );
  const translatedTextCache = new Map<string, string>();
  const translatedEntries = new Map<string, string>();
  // Azure bills and caps per request, so it is chunked by the request budget
  // (`--batch-size` would otherwise throttle it to DeepL-sized requests); DeepL
  // keeps the explicit, user-tunable batch size.
  const entryChunks =
    provider.provider === 'azure'
      ? splitEntriesByCharacterBudget(options.entries, AZURE_MAX_ITEMS_PER_REQUEST, AZURE_MAX_CHARACTERS_PER_REQUEST)
      : chunkArray(options.entries, options.batchSize);

  options.onProviderResolved?.(provider);

  for (const [chunkIndex, entryChunk] of entryChunks.entries()) {
    const uncachedEntries = entryChunk.filter(entry => !translatedTextCache.has(entry.source));

    if (uncachedEntries.length) {
      options.onBatchStart?.({
        batchIndex: chunkIndex,
        batchCount: entryChunks.length,
        entryCount: uncachedEntries.length,
        locale: options.targetLocale
      });

      const nextTranslations = await requestProviderTranslations({
        provider,
        entries: uncachedEntries,
        sourceLocale: options.sourceLocale,
        targetLocale: options.targetLocale,
        context: options.createContext(uncachedEntries),
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
  providerErrorMessage?: string;
  provider?: TranslationProviderConfig;
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
    providerErrorMessage: options.providerErrorMessage,
    provider: options.provider,
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
