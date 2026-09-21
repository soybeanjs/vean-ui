import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateCatalog } from '../src/commands/catalog';

async function createTemporaryDirectory(prefix: string): Promise<string> {
  return mkdtemp(path.join(tmpdir(), prefix));
}

/**
 * Minimal `packages/aria/src` fixture: a barrel re-exporting one component
 * dir, whose index exports a family root (`Button`).
 */
async function createFixture(rootDir: string): Promise<{ srcDir: string; barrelPath: string }> {
  const srcDir = path.join(rootDir, 'packages/aria/src');
  const barrelPath = path.join(srcDir, 'index.ts');

  await mkdir(path.join(srcDir, 'components/button'), { recursive: true });
  await writeFile(barrelPath, "export * from './components/button';\n", 'utf8');
  await writeFile(
    path.join(srcDir, 'components/button/index.ts'),
    "export { default as Button } from './button.vue';\nexport type * from './types';\n",
    'utf8'
  );

  return { srcDir, barrelPath };
}

describe('generateCatalog', () => {
  it('writes the catalog files on the first pass', async () => {
    const rootDir = await createTemporaryDirectory('sui-catalog-write-');
    const { srcDir } = await createFixture(rootDir);

    try {
      const written = await generateCatalog('aria', rootDir, { format: false });

      expect(written).toHaveLength(2);

      const components = await readFile(path.join(srcDir, 'constants/components.ts'), 'utf8');

      expect(components).toContain("button: ['Button']");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it('skips the second pass without touching the files (mtime stays intact)', async () => {
    const rootDir = await createTemporaryDirectory('sui-catalog-skip-');
    const { srcDir } = await createFixture(rootDir);
    const outputPath = path.join(srcDir, 'constants/components.ts');

    try {
      await generateCatalog('aria', rootDir, { format: false });

      const before = await stat(outputPath);

      // Filesystem mtime granularity can be coarse; a later timestamp must not
      // be produced by the skipped pass at all.
      await new Promise(resolve => setTimeout(resolve, 20));

      const written = await generateCatalog('aria', rootDir, { format: false });
      const after = await stat(outputPath);

      expect(written).toEqual([]);
      expect(after.mtimeMs).toBe(before.mtimeMs);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it('regenerates when a component index changes', async () => {
    const rootDir = await createTemporaryDirectory('sui-catalog-change-');
    const { srcDir } = await createFixture(rootDir);
    const outputPath = path.join(srcDir, 'constants/components.ts');

    try {
      await generateCatalog('aria', rootDir, { format: false });

      await writeFile(
        path.join(srcDir, 'components/button/index.ts'),
        "export { default as Button } from './button.vue';\nexport { default as ButtonGroup } from './group.vue';\n",
        'utf8'
      );

      const written = await generateCatalog('aria', rootDir, { format: false });
      const components = await readFile(outputPath, 'utf8');

      expect(written).toContain(path.join(srcDir, 'constants/components.ts'));
      expect(components).toContain("'Button'");
      expect(components).toContain("'ButtonGroup'");
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });
});
