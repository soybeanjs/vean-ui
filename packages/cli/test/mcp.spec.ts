/**
 * Tests for the Vean MCP server (ADR-011).
 *
 * Covers the 8-tool surface (7 parity + explain_gap), the SDK-based
 * transport wiring, and the project installed-components scanner.
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { createDefaultConfig, writeConfig } from '../src/utils/get-config';
import { scanInstalledComponents } from '../src/utils/scan-installed';
import { TOOLS, handleToolCall } from '../src/mcp';
import { clearRegistryCache } from '../src/registry/cache';
import { startRegistryServer } from './helpers/server';
import type { TestServer } from './helpers/server';

/** Extract the text payload from a CallToolResult's first content item. */
function textOf(result: CallToolResult): string {
  return (result.content[0] as { type: 'text'; text: string }).text;
}

describe('MCP tool surface (ADR-011)', () => {
  describe('TOOLS registry', () => {
    it('exposes exactly 8 tools (7 parity + explain_gap)', () => {
      const names = TOOLS.map(t => t.name);
      expect(names).toHaveLength(8);
      expect(names).toContain('explain_gap');
      expect(names).toContain('get_project_registries');
      expect(names).toContain('list_items_in_registries');
      expect(names).toContain('search_items_in_registries');
      expect(names).toContain('view_items_in_registries');
      expect(names).toContain('get_item_examples_from_registries');
      expect(names).toContain('get_add_command_for_items');
      expect(names).toContain('get_audit_checklist');
    });

    it('every tool has a name, description, and object inputSchema', () => {
      for (const tool of TOOLS) {
        expect(tool.name).toBeTruthy();
        expect(tool.description).toBeTruthy();
        expect(tool.inputSchema.type).toBe('object');
      }
    });
  });
});

describe('MCP handleToolCall (integration)', () => {
  let server: TestServer;
  let tmpDir: string;
  let originalCwd: string;

  beforeAll(async () => {
    server = await startRegistryServer();
    await clearRegistryCache();
    originalCwd = process.cwd();
  });

  afterAll(async () => {
    process.chdir(originalCwd);
    await clearRegistryCache();
    await server.close();
  });

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-mcp-'));
    process.chdir(tmpDir);

    // Write a vean.json that points every built-in registry at the test server.
    // `@vean` is the default namespace; overriding only the legacy aliases would
    // leave the catalog resolving against the real remote registry.
    const config = await createDefaultConfig(tmpDir);
    config.registries = {
      '@vean': `${server.url}/{name}.json`,
      '@soybean': `${server.url}/{name}.json`,
      '@sbean': `${server.url}/{name}.json`
    };
    await writeConfig(tmpDir, config);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe('get_project_registries', () => {
    it('lists configured registry namespaces', async () => {
      const result = await handleToolCall('get_project_registries', {});
      expect(result.isError).toBeFalsy();
      expect(result.content[0].type).toBe('text');
      const text = textOf(result);
      expect(text).toContain('@vean');
      expect(text).toContain('@soybean');
      expect(text).toContain('@sbean');
    });
  });

  describe('list_items_in_registries', () => {
    it('lists items from the registry', async () => {
      const result = await handleToolCall('list_items_in_registries', {});
      const text = textOf(result);
      expect(text).toContain('button');
      expect(text).toContain('dialog');
    });

    it('rejects invalid limit', async () => {
      const result = await handleToolCall('list_items_in_registries', { limit: 'abc' });
      expect(result.isError).toBe(true);
    });
  });

  describe('search_items_in_registries', () => {
    it('finds items by query', async () => {
      const result = await handleToolCall('search_items_in_registries', { query: 'button' });
      const text = textOf(result);
      expect(text).toContain('button');
    });

    it('returns not-found message for unknown query', async () => {
      const result = await handleToolCall('search_items_in_registries', {
        query: 'zzznonexistent'
      });
      const text = textOf(result);
      expect(text).toContain('No items found');
    });

    it('rejects empty query', async () => {
      const result = await handleToolCall('search_items_in_registries', { query: '' });
      expect(result.isError).toBe(true);
    });
  });

  describe('view_items_in_registries', () => {
    it('fetches full item details', async () => {
      const result = await handleToolCall('view_items_in_registries', { items: ['button'] });
      const text = textOf(result);
      expect(text).toContain('## button');
      expect(text).toContain('Type: registry:ui');
    });

    it('reports not found for unknown items', async () => {
      const result = await handleToolCall('view_items_in_registries', { items: ['zzzfake'] });
      const text = textOf(result);
      expect(text).toContain('Not found');
    });
  });

  describe('get_add_command_for_items', () => {
    it('returns the add command', async () => {
      const result = await handleToolCall('get_add_command_for_items', {
        items: ['button', 'dialog']
      });
      const text = textOf(result);
      expect(text).toBe('npx @vean/cli@latest add button dialog');
    });

    it('rejects empty items array', async () => {
      const result = await handleToolCall('get_add_command_for_items', { items: [] });
      expect(result.isError).toBe(true);
    });
  });

  describe('get_audit_checklist', () => {
    it('returns a checklist', async () => {
      const result = await handleToolCall('get_audit_checklist', {});
      const text = textOf(result);
      expect(text).toContain('vean info');
      expect(text).toContain('typecheck');
    });
  });

  describe('explain_gap', () => {
    it('reports missing components when some are installed', async () => {
      // Simulate button being installed
      await fs.mkdir(path.join(tmpDir, 'src', 'ui', 'components', 'button'), { recursive: true });

      const result = await handleToolCall('explain_gap', {});
      expect(result.isError).toBeFalsy();
      const text = textOf(result);

      expect(text).toContain('Installed: 1');
      // button is installed, so dialog/accordion/input should be "missing"
      expect(text).toContain('dialog');
      expect(text).toContain('accordion');
      expect(text).toContain('input');
      // button should NOT appear as missing
      expect(text).not.toMatch(/^- button$/m);
      // Should suggest the add command
      expect(text).toContain('npx @vean/cli@latest add');
    });

    it('reports all components missing when none installed', async () => {
      const result = await handleToolCall('explain_gap', {});
      const text = textOf(result);

      expect(text).toContain('Installed: 0');
      expect(text).toContain('Missing from registry: 4');
      expect(text).toContain('button');
      expect(text).toContain('dialog');
    });

    it('excludes non-registry:ui items from the gap (theme/base/font)', async () => {
      // Install all 4 UI components
      for (const name of ['button', 'dialog', 'accordion', 'input']) {
        await fs.mkdir(path.join(tmpDir, 'src', 'ui', 'components', name), { recursive: true });
      }

      const result = await handleToolCall('explain_gap', {});
      const text = textOf(result);

      // All UI components installed → no gap
      expect(text).toContain('appear to be installed');
      // Non-UI items should not be reported as missing
      expect(text).not.toContain('test-theme');
      expect(text).not.toContain('test-base');
      expect(text).not.toContain('test-font');
    });

    it('reports no config found when vean.json is absent', async () => {
      // Move to a dir without vean.json
      const bareDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-bare-'));
      process.chdir(bareDir);

      try {
        const result = await handleToolCall('explain_gap', {});
        const text = textOf(result);
        expect(text).toContain('No vean.json found');
      } finally {
        process.chdir(tmpDir);
        await fs.rm(bareDir, { recursive: true, force: true });
      }
    });
  });

  describe('unknown tool', () => {
    it('returns an error for unknown tool name', async () => {
      const result = await handleToolCall('totally_fake_tool', {});
      expect(result.isError).toBe(true);
    });
  });
});

describe('scanInstalledComponents', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-scan-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('returns empty array when components directory does not exist', async () => {
    const result = await scanInstalledComponents(tmpDir);
    expect(result).toEqual([]);
  });

  it('returns sorted component names from subdirectories', async () => {
    await fs.mkdir(path.join(tmpDir, 'components', 'button'), { recursive: true });
    await fs.mkdir(path.join(tmpDir, 'components', 'dialog'), { recursive: true });
    await fs.mkdir(path.join(tmpDir, 'components', 'accordion'), { recursive: true });

    const result = await scanInstalledComponents(tmpDir);
    expect(result).toEqual(['accordion', 'button', 'dialog']);
  });

  it('ignores hidden directories and files', async () => {
    await fs.mkdir(path.join(tmpDir, 'components', 'button'), { recursive: true });
    await fs.mkdir(path.join(tmpDir, 'components', '.cache'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, 'components', 'README.md'), '');

    const result = await scanInstalledComponents(tmpDir);
    expect(result).toEqual(['button']);
  });
});
