/**
 * Tests for the `template` command's `--framework` flag (ADR-010).
 *
 * Verifies schema validation and that `--framework vite|nuxt` scaffolds the
 * correct template via the Commander action handler.
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as v from 'valibot';
import { template, templateOptionsSchema } from '../src/commands/template';

describe('templateOptionsSchema (ADR-010 --framework)', () => {
  it('accepts framework: "vite"', () => {
    const parsed = v.parse(templateOptionsSchema, {
      framework: 'vite',
      cwd: '/tmp',
      list: false
    });
    expect(parsed.framework).toBe('vite');
  });

  it('accepts framework: "nuxt"', () => {
    const parsed = v.parse(templateOptionsSchema, {
      framework: 'nuxt',
      cwd: '/tmp',
      list: false
    });
    expect(parsed.framework).toBe('nuxt');
  });

  it('accepts absent framework (backward compat)', () => {
    const parsed = v.parse(templateOptionsSchema, {
      name: 'vue-vite',
      cwd: '/tmp',
      list: false
    });
    expect(parsed.framework).toBeUndefined();
    expect(parsed.name).toBe('vue-vite');
  });

  it('rejects an invalid framework value', () => {
    expect(() =>
      v.parse(templateOptionsSchema, {
        framework: 'laravel',
        cwd: '/tmp',
        list: false
      })
    ).toThrow();
  });
});

describe('template command --framework scaffolding (ADR-010)', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-tpl-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  async function runCommand(args: string[]): Promise<void> {
    await template.parseAsync(args, { from: 'user' });
  }

  it('scaffolds vue-vite via --framework vite', async () => {
    const projectDir = path.join(tmpDir, 'my-vite-app');

    await runCommand(['--framework', 'vite', '--cwd', tmpDir, '--output', 'my-vite-app']);

    const files = await fs.readdir(projectDir);
    expect(files).toContain('vite.config.ts');
    expect(files).toContain('index.html');
    expect(files).toContain('uno.config.ts');
  });

  it('scaffolds nuxt via --framework nuxt', async () => {
    const projectDir = path.join(tmpDir, 'my-nuxt-app');

    await runCommand(['--framework', 'nuxt', '--cwd', tmpDir, '--output', 'my-nuxt-app']);

    const files = await fs.readdir(projectDir);
    expect(files).toContain('nuxt.config.ts');
    expect(files).toContain('app.vue');
    expect(files).toContain('uno.config.ts');
  });

  it('--framework takes precedence over [name] positional', async () => {
    // [name] says "nuxt" but --framework says "vite" → should scaffold vue-vite
    const projectDir = path.join(tmpDir, 'precedence-test');

    await runCommand(['nuxt', '--framework', 'vite', '--cwd', tmpDir, '--output', 'precedence-test']);

    const files = await fs.readdir(projectDir);
    // vue-vite template has index.html, nuxt does not
    expect(files).toContain('index.html');
    expect(files).not.toContain('nuxt.config.ts');
  });

  it('scaffolds via [name] positional when --framework is absent (backward compat)', async () => {
    const projectDir = path.join(tmpDir, 'positional-nuxt');

    await runCommand(['nuxt', '--cwd', tmpDir, '--output', 'positional-nuxt']);

    const files = await fs.readdir(projectDir);
    expect(files).toContain('nuxt.config.ts');
    expect(files).toContain('app.vue');
  });
});

describe('FrameworkType coverage (ADR-010)', () => {
  it('vue-vite and nuxt are both registered templates', async () => {
    const { TEMPLATES } = await import('../src/templates');
    expect(Object.keys(TEMPLATES).sort()).toEqual(['nuxt', 'vue-vite']);
  });
});
