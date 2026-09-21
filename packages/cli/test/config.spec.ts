/**
 * Tests for config management and validation.
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as v from 'valibot';
import { rawConfigSchema } from '../src/registry/config';
import {
  getConfig,
  createDefaultConfig,
  writeConfig,
  resolveConfigPaths,
  resolveAliasDir
} from '../src/utils/get-config';

describe('config management', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe('createDefaultConfig', () => {
    it('creates a default config with correct values', async () => {
      const config = await createDefaultConfig(tmpDir);

      expect(config.iconLibrary).toBe('lucide');
      expect(config.uno.base).toBe('zinc');
      expect(config.uno.primary).toBe('indigo');
      expect(config.uno.radius).toBe('md');
    });

    it('creates config with resolved paths', async () => {
      const config = await createDefaultConfig(tmpDir);

      expect(config.resolvedPaths).toBeDefined();
      expect(config.resolvedPaths.cwd).toBe(tmpDir);
      expect(config.resolvedPaths.ui).toContain('ui');
    });

    it('accepts overrides', async () => {
      const config = await createDefaultConfig(tmpDir, {
        uno: { base: 'stone', primary: 'green', radius: 'lg' },
        iconLibrary: 'tabler'
      });

      expect(config.uno.base).toBe('stone');
      expect(config.uno.primary).toBe('green');
      expect(config.uno.radius).toBe('lg');
      expect(config.iconLibrary).toBe('tabler');
    });
  });

  describe('writeConfig / getConfig', () => {
    it('writes and reads config roundtrip', async () => {
      const config = await createDefaultConfig(tmpDir, {
        uno: { base: 'slate', primary: 'amber', radius: 'xs' }
      });

      await writeConfig(tmpDir, config);
      const read = await getConfig(tmpDir);

      expect(read).not.toBeNull();
      expect(read!.uno.base).toBe('slate');
      expect(read!.uno.primary).toBe('amber');
      expect(read!.uno.radius).toBe('xs');
    });

    it('returns null when no vean.json exists', async () => {
      const config = await getConfig(tmpDir);
      expect(config).toBeNull();
    });

    it('rejects invalid icon library', async () => {
      // Write an invalid config manually
      await fs.writeFile(
        path.join(tmpDir, 'vean.json'),
        JSON.stringify({
          iconLibrary: 'invalid-library',
          uno: { base: 'zinc', primary: 'indigo', radius: 'md' },
          font: {}
        }),
        'utf-8'
      );

      await expect(getConfig(tmpDir)).rejects.toThrow();
    });

    it('writes config without resolvedPaths', async () => {
      const config = await createDefaultConfig(tmpDir);
      await writeConfig(tmpDir, config);

      const raw = JSON.parse(await fs.readFile(path.join(tmpDir, 'vean.json'), 'utf-8'));
      expect(raw.resolvedPaths).toBeUndefined();
    });
  });

  describe('resolveConfigPaths', () => {
    it('resolves ui to correct absolute path', async () => {
      const resolved = await resolveConfigPaths(tmpDir, {
        iconLibrary: 'lucide',
        uno: { base: 'zinc', primary: 'indigo', radius: 'md' },
        font: {}
      });

      expect(resolved.resolvedPaths.ui).toBe(path.join(tmpDir, 'src', 'ui'));
    });

    it('resolves per-package dirs from aliases (EC-E03)', async () => {
      const resolved = await resolveConfigPaths(tmpDir, {
        iconLibrary: 'lucide',
        uno: { base: 'zinc', primary: 'indigo', radius: 'md' },
        font: {},
        aliases: {
          ui: '#ui',
          acme: '#acme',
          admin: './src/soybean-admin'
        }
      });

      expect(resolved.resolvedPaths.packages.ui).toBe(path.join(tmpDir, 'src', 'ui'));
      expect(resolved.resolvedPaths.packages.acme).toBe(path.join(tmpDir, 'src', 'acme'));
      expect(resolved.resolvedPaths.packages.admin).toBe(path.join(tmpDir, 'src', 'soybean-admin'));
    });

    it('defaults missing aliases to src/<package>', async () => {
      const resolved = await resolveConfigPaths(tmpDir, {
        iconLibrary: 'lucide',
        uno: { base: 'zinc', primary: 'indigo', radius: 'md' },
        font: {},
        aliases: { acme: '#acme' }
      });

      // `ui` is always present even without an explicit alias
      expect(resolved.resolvedPaths.packages.ui).toBe(path.join(tmpDir, 'src', 'ui'));
      expect(resolved.resolvedPaths.packages.acme).toBe(path.join(tmpDir, 'src', 'acme'));
    });
  });

  describe('resolveAliasDir', () => {
    it('resolves tsconfig paths over the convention fallback', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            paths: { '#ui/*': ['./custom/ui/*'] }
          }
        })
      );

      expect(await resolveAliasDir(tmpDir, '#ui')).toBe(path.join(tmpDir, 'custom', 'ui'));
    });

    it('falls back to src/<name> convention', async () => {
      expect(await resolveAliasDir(tmpDir, '#ui')).toBe(path.join(tmpDir, 'src', 'ui'));
      expect(await resolveAliasDir(tmpDir, '@/ui')).toBe(path.join(tmpDir, 'src', 'ui'));
    });

    it('uses explicit relative dirs as-is', async () => {
      expect(await resolveAliasDir(tmpDir, './src/ui')).toBe(path.join(tmpDir, 'src', 'ui'));
      expect(await resolveAliasDir(tmpDir, 'src/admin')).toBe(path.join(tmpDir, 'src', 'admin'));
    });

    it('returns null for empty alias', async () => {
      expect(await resolveAliasDir(tmpDir, undefined)).toBeNull();
    });
  });
});

describe('config schema validation', () => {
  const minimalConfig = {
    iconLibrary: 'lucide',
    uno: { base: 'zinc', primary: 'indigo', radius: 'md' },
    font: {}
  };

  it('validates minimal config', () => {
    const result = v.safeParse(rawConfigSchema, minimalConfig);
    expect(result.success).toBe(true);
  });

  it('rejects invalid base color', () => {
    const result = v.safeParse(rawConfigSchema, {
      ...minimalConfig,
      uno: { ...minimalConfig.uno, base: 'rainbow' }
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid primary color', () => {
    const result = v.safeParse(rawConfigSchema, {
      ...minimalConfig,
      uno: { ...minimalConfig.uno, primary: 'rainbow' }
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid radius', () => {
    const result = v.safeParse(rawConfigSchema, {
      ...minimalConfig,
      uno: { ...minimalConfig.uno, radius: 'huge' }
    });
    expect(result.success).toBe(false);
  });
});
