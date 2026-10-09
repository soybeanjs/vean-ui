import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { JsonObject } from '../src/shared/json';
import {
  getPendingEntries,
  requestAzureTranslations,
  requestDeepLTranslations,
  resolveTargetLocales,
  resolveTranslateOptions,
  resolveTranslationProvider,
  splitEntriesByCharacterBudget,
  toAzureLanguage,
  toDeepLLanguage,
  translateJsonLocaleFile
} from '../src/shared/translate';

interface MockFetchOptions {
  ok?: boolean;
  status?: number;
  statusText?: string;
}

function createMockResponse(
  payload: unknown,
  options: MockFetchOptions = {}
): {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
} {
  const { ok = true, status = 200, statusText = 'OK' } = options;
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);

  return {
    ok,
    status,
    statusText,
    async json() {
      return payload;
    },
    async text() {
      return body;
    }
  };
}

function mockFetch(impl: (input: RequestInfo | URL, init?: RequestInit) => unknown): void {
  vi.stubGlobal('fetch', vi.fn(impl));
}

function jsonBody(init: RequestInit | undefined): JsonObject {
  return JSON.parse(String(init?.body)) as JsonObject;
}

async function createTempFile(fileName: string, content: JsonObject): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'sui-translate-'));

  return writeFile(path.join(tempDir, fileName), JSON.stringify(content), 'utf8').then(() =>
    path.join(tempDir, fileName)
  );
}

async function removeTempDir(filePath: string): Promise<void> {
  await rm(path.dirname(filePath), { recursive: true, force: true });
}

describe('shared/translate', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe('toDeepLLanguage', () => {
    it('maps known locales to DeepL language codes', () => {
      expect(toDeepLLanguage('zh')).toBe('ZH');
      expect(toDeepLLanguage('zh-cn')).toBe('ZH');
      expect(toDeepLLanguage('pt-br')).toBe('PT-BR');
      expect(toDeepLLanguage('en-gb')).toBe('EN-GB');
      expect(toDeepLLanguage('ja')).toBe('JA');
    });

    it('normalizes underscores and falls back to uppercase', () => {
      expect(toDeepLLanguage('de')).toBe('DE');
      expect(toDeepLLanguage('xx-zz')).toBe('XX-ZZ');
    });
  });

  describe('toAzureLanguage', () => {
    it('maps forked languages to Azure BCP-47 codes', () => {
      expect(toAzureLanguage('zh')).toBe('zh-Hans');
      expect(toAzureLanguage('zh-CN')).toBe('zh-Hans');
      expect(toAzureLanguage('zh-TW')).toBe('zh-Hant');
      expect(toAzureLanguage('zh-HK')).toBe('zh-Hant');
      expect(toAzureLanguage('pt-BR')).toBe('pt');
    });

    it('lowercases the language subtag and keeps the uppercase region', () => {
      expect(toAzureLanguage('ja')).toBe('ja');
      expect(toAzureLanguage('es_MX')).toBe('es-MX');
      expect(toAzureLanguage('fr-CA')).toBe('fr-CA');
    });

    it('drops a region Azure does not publish', () => {
      expect(toAzureLanguage('en-GB')).toBe('en');
      expect(toAzureLanguage('de-AT')).toBe('de');
    });

    it('keeps script subtags in Title Case', () => {
      expect(toAzureLanguage('sr-cyrl')).toBe('sr-Cyrl');
      expect(toAzureLanguage('az-Latn')).toBe('az-Latn');
    });
  });

  describe('resolveTranslationProvider', () => {
    it('prefers Azure when both credentials are present', () => {
      vi.stubEnv('AZURE_TRANSLATE_KEY', 'azure-key');
      vi.stubEnv('AZURE_TRANSLATE_REGION', 'southeastasia');
      vi.stubEnv('AZURE_TEXT_TRANSLATE_URL', 'https://api.cognitive.microsofttranslator.com/');
      vi.stubEnv('DEEPL_API_KEY', 'deepl-key');

      expect(resolveTranslationProvider()).toEqual({
        provider: 'azure',
        apiKey: 'azure-key',
        endpoint: 'https://api.cognitive.microsofttranslator.com',
        region: 'southeastasia'
      });
    });

    it('falls back to DeepL when only DEEPL_API_KEY is set', () => {
      vi.stubEnv('DEEPL_API_KEY', 'deepl-key');

      expect(resolveTranslationProvider()).toEqual({
        provider: 'deepl',
        apiKey: 'deepl-key',
        endpoint: 'https://api-free.deepl.com/v2'
      });
    });

    it('defaults to the global Azure endpoint when only the key is set', () => {
      vi.stubEnv('AZURE_TRANSLATE_KEY', 'azure-key');

      expect(resolveTranslationProvider()).toMatchObject({
        provider: 'azure',
        endpoint: 'https://api.cognitive.microsofttranslator.com'
      });
    });

    it('honors an explicit provider override', () => {
      vi.stubEnv('AZURE_TRANSLATE_KEY', 'azure-key');
      vi.stubEnv('DEEPL_API_KEY', 'deepl-key');

      expect(resolveTranslationProvider({ requestedProvider: 'deepl' }).provider).toBe('deepl');
    });

    it('rejects an unknown provider', () => {
      expect(() => resolveTranslationProvider({ requestedProvider: 'google' })).toThrow(
        'Unknown translation provider: google'
      );
    });

    it('throws when no credentials are configured', () => {
      expect(() => resolveTranslationProvider({ env: {} })).toThrow('Missing translation credentials');
    });
  });

  describe('splitEntriesByCharacterBudget', () => {
    it('splits on the item limit', () => {
      const entries = [1, 2, 3, 4, 5].map(index => ({ key: `k${index}`, source: 'text' }));

      expect(splitEntriesByCharacterBudget(entries, 2, 1000).map(batch => batch.length)).toEqual([2, 2, 1]);
    });

    it('splits on the cumulative character budget', () => {
      const entries = [
        { key: 'a', source: 'aa' },
        { key: 'b', source: 'bb' },
        { key: 'c', source: 'cc' }
      ];

      expect(splitEntriesByCharacterBudget(entries, 100, 4).map(batch => batch.length)).toEqual([2, 1]);
    });

    it('keeps an entry larger than the budget in its own batch', () => {
      const entries = [
        { key: 'a', source: 'x'.repeat(50) },
        { key: 'b', source: 'y' }
      ];

      expect(splitEntriesByCharacterBudget(entries, 100, 10).map(batch => batch.length)).toEqual([1, 1]);
    });
  });

  describe('resolveTranslateOptions', () => {
    it('applies defaults', () => {
      expect(resolveTranslateOptions()).toEqual({
        locale: '',
        sourceLocale: 'en',
        batchSize: 20,
        limit: null,
        overwrite: false,
        dryRun: false
      });
    });

    it('maps CLI option values and flags', () => {
      expect(
        resolveTranslateOptions({
          locale: 'zh',
          sourceLocale: 'en',
          batchSize: '5',
          limit: '10',
          overwrite: true,
          dryRun: true
        })
      ).toEqual({
        locale: 'zh',
        sourceLocale: 'en',
        batchSize: 5,
        limit: 10,
        overwrite: true,
        dryRun: true
      });
    });

    it('falls back to defaults for non-positive numbers', () => {
      expect(resolveTranslateOptions({ batchSize: '0', limit: '0' })).toMatchObject({
        batchSize: 20,
        limit: null
      });
      expect(resolveTranslateOptions({ batchSize: 'nope', limit: 'nope' })).toMatchObject({
        batchSize: 20,
        limit: null
      });
    });

    it('treats an empty locale or source locale as unset', () => {
      expect(resolveTranslateOptions({ locale: '  ', sourceLocale: '  ' })).toMatchObject({
        locale: '',
        sourceLocale: 'en'
      });
    });
  });

  describe('resolveTargetLocales', () => {
    it('returns every locale except the source, sorted and deduped', () => {
      expect(
        resolveTargetLocales({
          availableLocales: ['zh', 'en', 'ja', 'zh'],
          sourceLocale: 'en'
        })
      ).toEqual(['ja', 'zh']);
    });

    it('returns only the requested locale when given', () => {
      expect(
        resolveTargetLocales({
          availableLocales: ['zh', 'en', 'ja'],
          sourceLocale: 'en',
          requestedLocale: 'ja'
        })
      ).toEqual(['ja']);
    });

    it('rejects a target equal to the source', () => {
      expect(() =>
        resolveTargetLocales({
          availableLocales: ['en'],
          sourceLocale: 'en',
          requestedLocale: 'en'
        })
      ).toThrow('Target locale must be different from source locale.');
    });

    it('rejects an unsupported target locale', () => {
      expect(() =>
        resolveTargetLocales({
          availableLocales: ['en', 'zh'],
          sourceLocale: 'en',
          requestedLocale: 'fr'
        })
      ).toThrow('Unsupported locale: fr');
    });
  });

  describe('getPendingEntries', () => {
    const source = new Map([
      ['a', 'Hello'],
      ['b', 'World'],
      ['c', '   ']
    ]);

    it('skips blank sources and already-translated targets', () => {
      const target = new Map([['a', '你好']]);

      expect(getPendingEntries(source, target, false, null)).toEqual([{ key: 'b', source: 'World' }]);
    });

    it('re-translates existing targets when overwrite is set', () => {
      const target = new Map([['a', '你好']]);

      expect(getPendingEntries(source, target, true, null).map(entry => entry.key)).toEqual(['a', 'b']);
    });

    it('applies a limit', () => {
      expect(getPendingEntries(source, new Map(), false, 1).map(entry => entry.key)).toEqual(['a']);
    });

    it('filters keys through shouldIncludeKey', () => {
      const result = getPendingEntries(source, new Map(), false, null, key => key !== 'b');

      expect(result.map(entry => entry.key)).toEqual(['a']);
    });
  });

  describe('requestDeepLTranslations', () => {
    it('posts a DeepL-shaped request and maps responses back to keys', async () => {
      mockFetch(() => createMockResponse({ translations: [{ text: '你好' }, { text: '世界' }] }));

      const result = await requestDeepLTranslations({
        entries: [
          { key: 'root.title', source: 'Hello' },
          { key: 'root.desc', source: 'World' }
        ],
        sourceLocale: 'en',
        targetLocale: 'zh',
        context: 'Component API docs.',
        apiKey: 'test-key',
        baseUrl: 'https://example.com/v2',
        retryCount: 0,
        retryDelayMs: 1
      });

      const init = vi.mocked(fetch).mock.calls[0]?.[1];

      expect(init?.method).toBe('POST');
      expect(init?.headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'DeepL-Auth-Key test-key'
      });
      expect(jsonBody(init)).toEqual({
        context: 'Component API docs.',
        preserve_formatting: true,
        source_lang: 'EN',
        target_lang: 'ZH',
        text: ['Hello', 'World']
      });
      expect(result).toEqual(
        new Map([
          ['root.title', '你好'],
          ['root.desc', '世界']
        ])
      );
    });

    it('protects and restores {placeholders} when requested', async () => {
      mockFetch(() => createMockResponse({ translations: [{ text: '世界 SBPH0TOKEN 值' }] }));

      const result = await requestDeepLTranslations({
        entries: [{ key: 'root', source: 'World {color} value' }],
        sourceLocale: 'en',
        targetLocale: 'zh',
        context: '',
        apiKey: 'test-key',
        baseUrl: 'https://example.com/v2',
        retryCount: 0,
        retryDelayMs: 1,
        protectPlaceholders: true
      });

      const init = vi.mocked(fetch).mock.calls[0]?.[1];
      const text = jsonBody(init).text as string[];

      expect(text).toEqual(['World SBPH0TOKEN value']);
      expect(result.get('root')).toBe('世界 {color} 值');
    });

    it('retries 429 responses up to retryCount', async () => {
      let callCount = 0;

      mockFetch(() => {
        callCount += 1;

        if (callCount === 1) {
          return createMockResponse({ message: 'Quota exceeded' }, { ok: false, status: 429 });
        }

        return createMockResponse({ translations: [{ text: '你好' }] });
      });

      const result = await requestDeepLTranslations({
        entries: [{ key: 'root', source: 'Hello' }],
        sourceLocale: 'en',
        targetLocale: 'zh',
        context: '',
        apiKey: 'test-key',
        baseUrl: 'https://example.com/v2',
        retryCount: 1,
        retryDelayMs: 1
      });

      expect(callCount).toBe(2);
      expect(result.get('root')).toBe('你好');
    });

    it('throws with the DeepL error detail on non-retryable failures', async () => {
      mockFetch(() => createMockResponse({ message: 'Bad Request' }, { ok: false, status: 400 }));

      await expect(
        requestDeepLTranslations({
          entries: [{ key: 'root', source: 'Hello' }],
          sourceLocale: 'en',
          targetLocale: 'zh',
          context: '',
          apiKey: 'test-key',
          baseUrl: 'https://example.com/v2',
          retryCount: 0,
          retryDelayMs: 1
        })
      ).rejects.toThrow('Translation request failed: 400 Bad Request');
    });
  });

  describe('requestAzureTranslations', () => {
    it('posts an Azure-shaped request and maps responses back to keys', async () => {
      mockFetch(() =>
        createMockResponse([
          { translations: [{ text: '你好', to: 'zh-Hans' }] },
          { translations: [{ text: '世界', to: 'zh-Hans' }] }
        ])
      );

      const result = await requestAzureTranslations({
        entries: [
          { key: 'root.title', source: 'Hello' },
          { key: 'root.desc', source: 'World' }
        ],
        sourceLocale: 'en',
        targetLocale: 'zh-CN',
        apiKey: 'test-key',
        endpoint: 'https://api.cognitive.microsofttranslator.com',
        region: 'southeastasia',
        retryCount: 0,
        retryDelayMs: 1
      });

      const [requestUrl, init] = vi.mocked(fetch).mock.calls[0] ?? [];
      const query = new URL(String(requestUrl)).searchParams;

      expect(init?.method).toBe('POST');
      expect(init?.headers).toEqual({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'test-key',
        'Ocp-Apim-Subscription-Region': 'southeastasia'
      });
      expect(query.get('api-version')).toBe('3.0');
      expect(query.get('from')).toBe('en');
      expect(query.get('to')).toBe('zh-Hans');
      expect(jsonBody(init)).toEqual([{ text: 'Hello' }, { text: 'World' }]);
      expect(result).toEqual(
        new Map([
          ['root.title', '你好'],
          ['root.desc', '世界']
        ])
      );
    });

    it('omits the region header when no region is configured', async () => {
      mockFetch(() => createMockResponse([{ translations: [{ text: '你好' }] }]));

      await requestAzureTranslations({
        entries: [{ key: 'root', source: 'Hello' }],
        sourceLocale: 'en',
        targetLocale: 'zh',
        apiKey: 'test-key',
        endpoint: 'https://api.cognitive.microsofttranslator.com',
        retryCount: 0,
        retryDelayMs: 1
      });

      const init = vi.mocked(fetch).mock.calls[0]?.[1];

      expect(init?.headers).toEqual({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'test-key'
      });
    });

    it('protects and restores {placeholders} when requested', async () => {
      mockFetch(() => createMockResponse([{ translations: [{ text: '世界 SBPH0TOKEN 值' }] }]));

      const result = await requestAzureTranslations({
        entries: [{ key: 'root', source: 'World {color} value' }],
        sourceLocale: 'en',
        targetLocale: 'zh',
        apiKey: 'test-key',
        endpoint: 'https://api.cognitive.microsofttranslator.com',
        retryCount: 0,
        retryDelayMs: 1,
        protectPlaceholders: true
      });

      const init = vi.mocked(fetch).mock.calls[0]?.[1];

      expect(jsonBody(init)).toEqual([{ text: 'World SBPH0TOKEN value' }]);
      expect(result.get('root')).toBe('世界 {color} 值');
    });

    it('splits oversized entry sets into several requests', async () => {
      mockFetch((_input, init) => {
        const batch = JSON.parse(String(init?.body)) as { text: string }[];

        return createMockResponse(batch.map(item => ({ translations: [{ text: item.text.toUpperCase() }] })));
      });

      const entries = Array.from({ length: 1200 }, (_value, index) => ({
        key: `k${index}`,
        source: `text-${index}`
      }));
      const result = await requestAzureTranslations({
        entries,
        sourceLocale: 'en',
        targetLocale: 'zh',
        apiKey: 'test-key',
        endpoint: 'https://api.cognitive.microsofttranslator.com',
        retryCount: 0,
        retryDelayMs: 1
      });

      expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
      expect(result.size).toBe(1200);
      expect(result.get('k1199')).toBe('TEXT-1199');
    });

    it('throws with the Azure error detail on non-retryable failures', async () => {
      mockFetch(() =>
        createMockResponse(
          { error: { code: '401000', message: 'The request is not authorized.' } },
          { ok: false, status: 401 }
        )
      );

      await expect(
        requestAzureTranslations({
          entries: [{ key: 'root', source: 'Hello' }],
          sourceLocale: 'en',
          targetLocale: 'zh',
          apiKey: 'test-key',
          endpoint: 'https://api.cognitive.microsofttranslator.com',
          retryCount: 0,
          retryDelayMs: 1
        })
      ).rejects.toThrow('Translation request failed: 401 The request is not authorized.');
    });
  });

  describe('translateJsonLocaleFile', () => {
    it('translates pending entries and writes them into the target file', async () => {
      // The network layer is mocked below; stub a dummy key so the test does
      // not depend on a real DEEPL_API_KEY being present in the environment
      // (it must stay hermetic on CI, where no such secret exists).
      vi.stubEnv('DEEPL_API_KEY', 'test-key');

      const sourcePath = await createTempFile('en.json', {
        root: { title: 'Hello', desc: 'World {x}' }
      });
      const targetPath = await createTempFile('zh.json', {
        root: { title: '', desc: '' }
      });

      mockFetch((_input, init) => {
        const text = jsonBody(init).text as string[];

        return createMockResponse({
          translations: text.map(item => ({
            text: item === 'Hello' ? '你好' : '世界 SBPH0TOKEN'
          }))
        });
      });

      const result = await translateJsonLocaleFile({
        sourcePath,
        targetPath,
        sourceLocale: 'en',
        targetLocale: 'zh',
        batchSize: 20,
        overwrite: false,
        limit: null,
        dryRun: false,
        createContext: () => '',
        protectPlaceholders: true
      });

      const written = JSON.parse(await readFile(targetPath, 'utf8')) as JsonObject;

      expect(result.updated).toBe(true);
      expect(result.pendingEntries).toHaveLength(2);
      expect(written).toEqual({
        root: { title: '你好', desc: '世界 {x}' }
      });
      await removeTempDir(targetPath);
    });

    it('skips the network call in dry-run mode', async () => {
      const sourcePath = await createTempFile('en.json', { root: 'Hello' });
      const targetPath = await createTempFile('zh.json', { root: '' });
      const fetchMock = vi.fn();

      vi.stubGlobal('fetch', fetchMock);

      const result = await translateJsonLocaleFile({
        sourcePath,
        targetPath,
        sourceLocale: 'en',
        targetLocale: 'zh',
        batchSize: 20,
        overwrite: false,
        limit: null,
        dryRun: true,
        createContext: () => ''
      });

      expect(result.updated).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
      await removeTempDir(targetPath);
    });

    it('does nothing when there are no pending entries', async () => {
      const sourcePath = await createTempFile('en.json', { root: 'Hello' });
      const targetPath = await createTempFile('zh.json', { root: '你好' });
      const fetchMock = vi.fn();

      vi.stubGlobal('fetch', fetchMock);

      const result = await translateJsonLocaleFile({
        sourcePath,
        targetPath,
        sourceLocale: 'en',
        targetLocale: 'zh',
        batchSize: 20,
        overwrite: false,
        limit: null,
        dryRun: false,
        createContext: () => ''
      });

      expect(result.updated).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
      await removeTempDir(targetPath);
    });
  });
});
