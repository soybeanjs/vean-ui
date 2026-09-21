/**
 * Integration tests for the registry fetcher against a local HTTP server.
 *
 * Tests fetchRegistryItem and fetchRegistryCatalog with real HTTP fetch calls
 * against a locally started server serving fixture JSON files.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { clearRegistryCache } from '../src/registry/cache';
import { fetchRegistryItem, fetchRegistryCatalog } from '../src/registry/fetcher';
import { startRegistryServer } from './helpers/server';
import type { TestServer } from './helpers/server';

describe('registry fetcher (integration)', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await startRegistryServer();
    // Clear cache so we always fetch fresh from the test server
    await clearRegistryCache();
  });

  afterAll(async () => {
    await clearRegistryCache();
    await server.close();
  });

  describe('fetchRegistryCatalog', () => {
    it('fetches the full catalog from the local server', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      expect(items.length).toBeGreaterThanOrEqual(5);
      expect(items.some(i => i.name === 'button')).toBe(true);
      expect(items.some(i => i.name === 'dialog')).toBe(true);
      expect(items.some(i => i.name === 'accordion')).toBe(true);
      expect(items.some(i => i.name === 'input')).toBe(true);
      expect(items.some(i => i.name === 'test-base')).toBe(true);
    });

    it('returns items with correct types', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      const button = items.find(i => i.name === 'button');
      expect(button).toBeDefined();
      expect(button!.type).toBe('registry:ui');

      const base = items.find(i => i.name === 'test-base');
      expect(base).toBeDefined();
      expect(base!.type).toBe('registry:base');
    });

    it('returns items with metadata attached', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      for (const item of items) {
        expect(item.meta).toBeDefined();
        expect(item.meta!.registryNamespace).toBeDefined();
        expect(item.meta!.registryUrl).toBeDefined();
      }
    });

    it('returns items with registryDependencies', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      const dialog = items.find(i => i.name === 'dialog');
      expect(dialog).toBeDefined();
      expect(dialog!.registryDependencies).toContain('button');
    });

    it('handles the theme, base, and font item types', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      const theme = items.find(i => i.name === 'test-theme');
      expect(theme).toBeDefined();
      expect(theme!.type).toBe('registry:theme');

      const base = items.find(i => i.name === 'test-base');
      expect(base).toBeDefined();
      expect(base!.type).toBe('registry:base');

      const font = items.find(i => i.name === 'test-font');
      expect(font).toBeDefined();
      expect(font!.type).toBe('registry:font');
    });
  });

  describe('fetchRegistryItem', () => {
    it('fetches a single item by name', async () => {
      const item = await fetchRegistryItem('button', undefined, server.url);

      expect(item).not.toBeNull();
      expect(item!.name).toBe('button');
      expect(item!.type).toBe('registry:ui');
      expect(item!.description).toBe('Displays a button or a component that looks like a button.');
    });

    it('returns item with file contents', async () => {
      const item = await fetchRegistryItem('button', undefined, server.url);

      expect(item!.files).toBeDefined();
      expect(item!.files!.length).toBeGreaterThan(0);
      const vueFile = item!.files!.find(f => f.path.endsWith('button.vue'));
      expect(vueFile).toBeDefined();
      expect(vueFile!.content).toBeDefined();
      expect(vueFile!.content).toContain('buttonVariants');
    });

    it('returns null for non-existent component', async () => {
      const item = await fetchRegistryItem('nonexistent-component', undefined, server.url);
      expect(item).toBeNull();
    });

    it('fetches component with dependencies', async () => {
      const item = await fetchRegistryItem('dialog', undefined, server.url);

      expect(item).not.toBeNull();
      expect(item!.dependencies).toContain('@vean/aria');
      expect(item!.registryDependencies).toContain('utils');
      expect(item!.registryDependencies).toContain('button');
    });

    it('attaches registry metadata to fetched items', async () => {
      const item = await fetchRegistryItem('button', undefined, server.url);

      expect(item!.meta).toBeDefined();
      expect(item!.meta!.registryNamespace).toBe('@vean');
      expect(item!.meta!.registryUrl).toBeDefined();
    });
  });
});
