/**
 * Tests for registry loader — reading JSON files and resolving includes.
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readRegistryWithIncludes, createRegistryItem, createRegistryCatalog } from '../src/registry/loader';
import type { RegistryItem } from '../src/registry/schema';

describe('registry loader', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-loader-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe('readRegistryWithIncludes', () => {
    it('reads a basic registry.json without includes', async () => {
      const registry = {
        name: 'test-registry',
        homepage: 'https://example.com',
        items: [{ name: 'button', type: 'registry:ui', files: [] }]
      };

      await fs.writeFile(path.join(tmpDir, 'registry.json'), JSON.stringify(registry));

      const result = await readRegistryWithIncludes('registry.json', { cwd: tmpDir });

      expect(result.registry.name).toBe('test-registry');
      expect(result.registry.homepage).toBe('https://example.com');
      expect(result.registry.items.length).toBe(1);
      expect(result.registry.items[0].name).toBe('button');
      expect(result.usesInclude).toBe(false);
    });

    it('reads a registry with include references', async () => {
      const main = {
        name: 'main-registry',
        homepage: 'https://example.com',
        include: ['extra.json'],
        items: [{ name: 'button', type: 'registry:ui', files: [] }]
      };

      const extra = {
        name: 'extra-registry',
        homepage: 'https://example.com/extra',
        items: [{ name: 'dialog', type: 'registry:ui', files: [] }]
      };

      await fs.writeFile(path.join(tmpDir, 'registry.json'), JSON.stringify(main));
      await fs.writeFile(path.join(tmpDir, 'extra.json'), JSON.stringify(extra));

      const result = await readRegistryWithIncludes('registry.json', { cwd: tmpDir });

      expect(result.usesInclude).toBe(true);
      expect(result.registry.items.length).toBe(2);
      expect(result.registry.items.map(i => i.name).sort()).toEqual(['button', 'dialog']);
    });

    it('de-duplicates items from includes (main wins)', async () => {
      const main = {
        name: 'main-registry',
        homepage: 'https://example.com',
        include: ['extra.json'],
        items: [{ name: 'button', type: 'registry:ui', description: 'main button', files: [] }]
      };

      const extra = {
        name: 'extra-registry',
        homepage: 'https://example.com/extra',
        items: [
          { name: 'button', type: 'registry:ui', description: 'extra button', files: [] },
          { name: 'dialog', type: 'registry:ui', files: [] }
        ]
      };

      await fs.writeFile(path.join(tmpDir, 'registry.json'), JSON.stringify(main));
      await fs.writeFile(path.join(tmpDir, 'extra.json'), JSON.stringify(extra));

      const result = await readRegistryWithIncludes('registry.json', { cwd: tmpDir });

      expect(result.registry.items.length).toBe(2);
      const btn = result.registry.items.find(i => i.name === 'button');
      expect(btn).toBeDefined();
      // Main registry item should take precedence
      expect(btn!.description).toBe('main button');
    });

    it('reads registry file in subdirectory', async () => {
      const subDir = path.join(tmpDir, 'sub', 'nested');
      await fs.mkdir(subDir, { recursive: true });

      const registry = {
        name: 'nested-registry',
        homepage: 'https://example.com',
        items: [{ name: 'test', type: 'registry:ui', files: [] }]
      };

      await fs.writeFile(path.join(subDir, 'registry.json'), JSON.stringify(registry));

      const result = await readRegistryWithIncludes(path.join('sub', 'nested', 'registry.json'), {
        cwd: tmpDir
      });

      expect(result.registry.name).toBe('nested-registry');
    });
  });

  describe('createRegistryItem', () => {
    it('resolves file contents from disk', async () => {
      const fileContent = '<template><div>Hello</div></template>';
      const filePath = path.join(tmpDir, 'component.vue');
      await fs.writeFile(filePath, fileContent);

      const item: RegistryItem = {
        name: 'test',
        type: 'registry:ui',
        files: [{ path: 'component.vue', type: 'registry:ui' }]
      } as RegistryItem;

      const result = await createRegistryItem(item, tmpDir);

      expect(result.files).toBeDefined();
      expect(result.files!.length).toBe(1);
      expect(result.files![0].content).toBe(fileContent);
    });

    it('handles missing files gracefully', async () => {
      const item: RegistryItem = {
        name: 'test',
        type: 'registry:ui',
        files: [{ path: 'nonexistent.vue', type: 'registry:ui' }]
      } as RegistryItem;

      const result = await createRegistryItem(item, tmpDir);

      expect(result.files).toBeDefined();
      expect(result.files![0].content).toBeUndefined();
    });

    it('handles items with no files', async () => {
      const item: RegistryItem = {
        name: 'test',
        type: 'registry:lib',
        files: undefined
      } as RegistryItem;

      const result = await createRegistryItem(item, tmpDir);

      expect(result.files).toEqual([]);
    });
  });

  describe('createRegistryCatalog', () => {
    it('creates catalog with relative file paths', async () => {
      const result = {
        registry: {
          name: 'test',
          homepage: 'https://example.com',
          items: [
            {
              name: 'button',
              type: 'registry:ui',
              files: [{ path: path.join(tmpDir, 'components', 'button.vue'), type: 'registry:ui' }]
            }
          ]
        },
        usesInclude: false
      };

      const catalog = createRegistryCatalog(result as any, tmpDir);

      expect(catalog.items[0].files![0].path).toBe('components/button.vue');
      expect(catalog.items[0].files![0].content).toBeUndefined();
    });
  });
});
