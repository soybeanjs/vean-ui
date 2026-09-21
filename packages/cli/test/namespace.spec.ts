import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { clearRegistryCache } from '../src/registry/cache';
import { fetchRegistryItem, fetchRegistryCatalog } from '../src/registry/fetcher';
import {
  resolveRegistryItemName,
  getItemBasename,
  getItemPackage,
  AmbiguousComponentNameError,
  PackageNamespaceRequiredError
} from '../src/registry/loader';
import type { RegistryItem } from '../src/registry/schema';
import { startRegistryServer } from './helpers/server';
import type { TestServer } from './helpers/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NS_FIXTURES = path.join(__dirname, 'fixtures', 'registry-ns');

describe('namespaced registry resolution (EC-E02/E04)', () => {
  let server: TestServer;
  let cacheDir: string;

  beforeAll(async () => {
    // Isolate cache to avoid collisions with flat-fixture test files
    cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-ns-cache-'));
    process.env.VEAN_CACHE_DIR = cacheDir;
    server = await startRegistryServer(0, NS_FIXTURES);
    await clearRegistryCache();
  });

  afterAll(async () => {
    await clearRegistryCache();
    await server.close();
    delete process.env.VEAN_CACHE_DIR;
    await fs.rm(cacheDir, { recursive: true, force: true }).catch(() => {});
  });

  describe('getItemBasename / getItemPackage', () => {
    it('splits namespaced names', () => {
      expect(getItemBasename('ui/accordion')).toBe('accordion');
      expect(getItemBasename('acme/widget')).toBe('widget');
      expect(getItemBasename('accordion')).toBe('accordion');
      expect(getItemBasename('@acme/foo')).toBe('foo');
    });

    it('derives the owning package', () => {
      expect(getItemPackage('ui/accordion')).toBe('ui');
      expect(getItemPackage('acme/widget')).toBe('acme');
      expect(getItemPackage('admin/app-layout')).toBe('admin');
      expect(getItemPackage('accordion')).toBe('ui');
      expect(getItemPackage('@acme/foo')).toBe('ui');
    });
  });

  describe('resolveRegistryItemName', () => {
    const items = [
      { name: 'ui/button', type: 'registry:ui' },
      { name: 'ui/dialog', type: 'registry:ui' },
      { name: 'acme/widget', type: 'registry:ui' },
      { name: 'admin/app-layout', type: 'registry:ui' }
    ] as RegistryItem[];

    it('passes through namespaced references', () => {
      expect(resolveRegistryItemName('ui/button', items)).toBe('ui/button');
      expect(resolveRegistryItemName('acme/widget', items)).toBe('acme/widget');
    });

    it('passes through registry-namespace references', () => {
      expect(resolveRegistryItemName('@acme/foo', items)).toBe('@acme/foo');
    });

    it('resolves a bare name to the core ui package', () => {
      expect(resolveRegistryItemName('button', items)).toBe('ui/button');
      expect(resolveRegistryItemName('dialog', items)).toBe('ui/dialog');
    });

    it('requires the package prefix for non-core bare names', () => {
      expect(() => resolveRegistryItemName('widget', items)).toThrow(PackageNamespaceRequiredError);
      expect(() => resolveRegistryItemName('app-layout', items)).toThrow(PackageNamespaceRequiredError);
    });

    it('throws AmbiguousComponentNameError only across non-core packages', () => {
      const ambiguous = [
        ...items,
        { name: 'admin/dialog', type: 'registry:ui' } as RegistryItem,
        { name: 'acme/dialog', type: 'registry:ui' } as RegistryItem
      ];
      // ui/dialog wins for bare `dialog` (ui is the no-prefix default)
      expect(resolveRegistryItemName('dialog', ambiguous)).toBe('ui/dialog');
      // two non-core candidates with no ui match → ambiguous
      const nonCore = [
        { name: 'admin/panel', type: 'registry:ui' } as RegistryItem,
        { name: 'acme/panel', type: 'registry:ui' } as RegistryItem
      ];
      expect(() => resolveRegistryItemName('panel', nonCore)).toThrow(AmbiguousComponentNameError);
    });

    it('returns the input unchanged when not found', () => {
      expect(resolveRegistryItemName('missing', items)).toBe('missing');
    });
  });

  describe('remote fetch', () => {
    it('fetches a namespaced item directly', async () => {
      const item = await fetchRegistryItem('ui/button', undefined, server.url);
      expect(item).not.toBeNull();
      expect(item!.name).toBe('ui/button');
      expect(item!.package).toBe('ui');
    });

    it('resolves a bare ui-package name via the catalog', async () => {
      const item = await fetchRegistryItem('button', undefined, server.url);
      expect(item).not.toBeNull();
      expect(item!.name).toBe('ui/button');
      expect(item!.package).toBe('ui');
    });

    it('requires the package prefix for non-core bare names', async () => {
      await expect(fetchRegistryItem('widget', undefined, server.url)).rejects.toThrow(PackageNamespaceRequiredError);
    });

    it('fetches a catalog with namespaced names', async () => {
      const catalog = await fetchRegistryCatalog(undefined, server.url);
      const names = catalog.map(i => i.name);
      expect(names).toContain('ui/button');
      expect(names).toContain('acme/widget');
      expect(names).toContain('admin/app-layout');
    });
  });
});
