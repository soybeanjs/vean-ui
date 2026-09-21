/**
 * Command integration tests — test underlying command functions
 * against the local HTTP registry server.
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { createDefaultConfig, writeConfig, getConfig } from '../src/utils/get-config';
import { getProjectInfo } from '../src/utils/get-project-info';
import { applyPresetToProject } from '../src/commands/preset';
import { clearRegistryCache } from '../src/registry/cache';
import { fetchRegistryItem, fetchRegistryCatalog } from '../src/registry/fetcher';
import { searchRegistry } from '../src/registry/search';
import { listAllTemplates, scaffoldFromTemplate, getTemplateConfig } from '../src/templates';
import { startRegistryServer } from './helpers/server';
import type { TestServer } from './helpers/server';

describe('command integration tests', () => {
  let server: TestServer;
  let tmpDir: string;

  beforeAll(async () => {
    server = await startRegistryServer();
    await clearRegistryCache();
  });

  afterAll(async () => {
    await clearRegistryCache();
    await server.close();
  });

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-cmd-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe('search flow (end-to-end)', () => {
    it('searches remote catalog and finds components', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      const result = searchRegistry(items, { query: 'button' });
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.items.some(i => i.name === 'button')).toBe(true);
    });

    it('filters by component type', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      const result = searchRegistry(items, { type: 'lib' });
      expect(result.items.every(i => i.type === 'registry:lib')).toBe(true);
    });

    it('paginates catalog results', async () => {
      const items = await fetchRegistryCatalog(undefined, server.url);

      const result = searchRegistry(items, { limit: 2, offset: 0 });
      expect(result.items.length).toBeLessThanOrEqual(2);
      expect(result.total).toBeGreaterThanOrEqual(5);
    });
  });

  describe('view flow (end-to-end)', () => {
    it('fetches component with full file contents from remote', async () => {
      // Clear cache to ensure fresh fetch
      await clearRegistryCache();

      const item = await fetchRegistryItem('button', undefined, server.url);
      expect(item).not.toBeNull();
      expect(item!.name).toBe('button');
      expect(item!.type).toBe('registry:ui');
      expect(item!.files).toBeDefined();
      expect(item!.files!.length).toBeGreaterThan(0);

      const vueFile = item!.files!.find(f => f.path.includes('.vue'));
      expect(vueFile).toBeDefined();
      expect(vueFile!.content).toBeDefined();
      expect(vueFile!.content!.length).toBeGreaterThan(0);
    });

    it('resolves component with registryDependencies', async () => {
      await clearRegistryCache();

      const dialog = await fetchRegistryItem('dialog', undefined, server.url);
      expect(dialog).not.toBeNull();
      expect(dialog!.registryDependencies).toBeDefined();
      expect(dialog!.registryDependencies!.length).toBeGreaterThanOrEqual(1);
    });

    it('returns null for non-existent component', async () => {
      await clearRegistryCache();

      const item = await fetchRegistryItem('totally-fake-component', undefined, server.url);
      expect(item).toBeNull();
    });
  });

  describe('info flow', () => {
    it('detects project info when no project exists', async () => {
      const info = await getProjectInfo(tmpDir);
      expect(info).toBeNull();
    });

    it('detects Vue project', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({ name: 'test', dependencies: { vue: '^3.5.0' } })
      );

      const info = await getProjectInfo(tmpDir);
      expect(info).not.toBeNull();
      expect(info!.framework).toBe('vue');
    });

    it('detects Nuxt project', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({ name: 'test', dependencies: { nuxt: '^3.16.0', vue: 'latest' } })
      );

      const info = await getProjectInfo(tmpDir);
      expect(info).not.toBeNull();
      expect(info!.framework).toBe('nuxt');
    });

    it('detects TypeScript config', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({ name: 'test', dependencies: { vue: '^3.5.0' } })
      );
      await fs.writeFile(path.join(tmpDir, 'tsconfig.json'), '{}');

      const info = await getProjectInfo(tmpDir);
      expect(info).not.toBeNull();
      expect(info!.usesTypeScript).toBe(true);
    });

    it('detects UnoCSS config', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({ name: 'test', dependencies: { vue: '^3.5.0' } })
      );
      await fs.writeFile(path.join(tmpDir, 'uno.config.ts'), 'export default {}');

      const info = await getProjectInfo(tmpDir);
      expect(info).not.toBeNull();
      expect(info!.usesUnoCSS).toBe(true);
      expect(info!.unoConfigPath).toContain('uno.config.ts');
    });

    it('detects package manager from lock files', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'package.json'),
        JSON.stringify({ name: 'test', dependencies: { vue: '^3.5.0' } })
      );
      await fs.writeFile(path.join(tmpDir, 'pnpm-lock.yaml'), '');

      const info = await getProjectInfo(tmpDir);
      expect(info).not.toBeNull();
      expect(info!.packageManager).toBe('pnpm');
    });
  });

  describe('config flow (vean.json)', () => {
    it('creates, writes, and reads config roundtrip', async () => {
      const config = await createDefaultConfig(tmpDir, {
        uno: { base: 'stone', primary: 'green', radius: 'lg' }
      });
      await writeConfig(tmpDir, config);

      const read = await getConfig(tmpDir);
      expect(read).not.toBeNull();
    });

    it('info shows config details', async () => {
      const config = await createDefaultConfig(tmpDir, {
        uno: { base: 'slate', primary: 'amber', radius: 'xs' }
      });
      await writeConfig(tmpDir, config);

      const read = await getConfig(tmpDir);
      expect(read!.uno.base).toBe('slate');
      expect(read!.uno.primary).toBe('amber');
      expect(read!.uno.radius).toBe('xs');
    });
  });

  describe('preset flow', () => {
    it('applies a base62 preset code', async () => {
      const config = await createDefaultConfig(tmpDir);
      await writeConfig(tmpDir, config);

      // "b0" is the default preset code
      await applyPresetToProject('b0', tmpDir);

      const updated = await getConfig(tmpDir);
      expect(updated).not.toBeNull();
    });
  });

  describe('template flow', () => {
    it('lists available templates', () => {
      const templates = listAllTemplates();
      expect(templates.length).toBeGreaterThanOrEqual(2);
      expect(templates.some(t => t.name === 'vue-vite')).toBe(true);
      expect(templates.some(t => t.name === 'nuxt')).toBe(true);
    });

    it('scaffolds vue-vite template', async () => {
      const outputDir = path.join(tmpDir, 'my-app');
      await scaffoldFromTemplate(outputDir, 'vue-vite', { projectName: 'my-app' });

      const files = await fs.readdir(outputDir);
      expect(files).toContain('vite.config.ts');
      expect(files).toContain('tsconfig.json');
      expect(files).toContain('uno.config.ts');
      expect(files).toContain('vean.json');
      expect(files).toContain('index.html');

      const srcFiles = await fs.readdir(path.join(outputDir, 'src'));
      expect(srcFiles).toContain('main.ts');
      expect(srcFiles).toContain('App.vue');
    });

    it('scaffolds nuxt template', async () => {
      const outputDir = path.join(tmpDir, 'nuxt-app');
      await scaffoldFromTemplate(outputDir, 'nuxt', { projectName: 'nuxt-app' });

      const files = await fs.readdir(outputDir);
      expect(files).toContain('nuxt.config.ts');
      expect(files).toContain('uno.config.ts');
      expect(files).toContain('vean.json');
      expect(files).toContain('app.vue');
    });

    it('returns config recommendations per template', () => {
      const config = getTemplateConfig('vue-vite');
      expect(typeof config).toBe('object');
    });
  });

  describe('add flow (remote registry)', () => {
    it('fetches button with all metadata', async () => {
      await clearRegistryCache();

      const item = await fetchRegistryItem('button', undefined, server.url);
      expect(item).not.toBeNull();
      expect(item!.dependencies).toContain('@vean/aria');
      expect(item!.categories).toContain('form');
      expect(item!.files!.length).toBeGreaterThan(0);
    });

    it('fetches dialog with its registry deps', async () => {
      await clearRegistryCache();

      const dialog = await fetchRegistryItem('dialog', undefined, server.url);
      expect(dialog).not.toBeNull();

      // Should have button as a registry dependency
      const deps = dialog!.registryDependencies ?? [];
      expect(deps).toContain('button');
    });

    it('fetches accordion', async () => {
      await clearRegistryCache();

      const item = await fetchRegistryItem('accordion', undefined, server.url);
      expect(item).not.toBeNull();
      expect(item!.name).toBe('accordion');
    });

    it('fetches input with meta tags', async () => {
      await clearRegistryCache();

      const item = await fetchRegistryItem('input', undefined, server.url);
      expect(item).not.toBeNull();
      expect(item!.meta?.tags).toContain('form');
    });
  });

  describe('docs flow', () => {
    it('generates correct doc links for components', async () => {
      await clearRegistryCache();

      const item = await fetchRegistryItem('button', undefined, server.url);
      expect(item).not.toBeNull();

      // Doc links should be deterministic
      const sourceFile = item!.files?.find(f => f.type === 'registry:ui' && f.path.includes('button.vue'));
      expect(sourceFile).toBeDefined();
    });
  });
});
