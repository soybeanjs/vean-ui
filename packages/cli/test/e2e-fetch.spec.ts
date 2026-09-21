/**
 * End-to-end verification: directly fetch component JSON from a local server
 * using the native fetch API, confirming the full JSON fetching flow.
 *
 * This test mirrors exactly what "vean search", "vean view", and
 * "vean add" do when interacting with the remote registry.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startRegistryServer } from './helpers/server';
import type { TestServer } from './helpers/server';

describe('end-to-end: component JSON fetching flow', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await startRegistryServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('fetches registry catalog via raw fetch', async () => {
    const response = await fetch(`${server.url}/registry.json`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');

    const data = (await response.json()) as Record<string, any>;
    expect(data).toBeDefined();
    expect(data.name).toBe('test-registry');
    expect(data.homepage).toBe('https://veanui.com');
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThanOrEqual(5);
  });

  it('fetches a single component JSON via raw fetch', async () => {
    const response = await fetch(`${server.url}/button.json`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');

    const data = (await response.json()) as Record<string, any>;
    expect(data.name).toBe('button');
    expect(data.type).toBe('registry:ui');
    expect(data.description).toBeTruthy();
    expect(data.dependencies).toContain('@vean/aria');
    expect(data.registryDependencies).toContain('utils');
    expect(data.files).toBeDefined();
    expect(data.files.length).toBeGreaterThan(0);

    // Verify file content is present
    const vueFile = data.files.find((f: any) => f.path.endsWith('.vue'));
    expect(vueFile).toBeDefined();
    expect(vueFile.content).toBeDefined();
    expect(vueFile.content).toContain('buttonVariants');
  });

  it('fetches component with cross-registry dependencies', async () => {
    const response = await fetch(`${server.url}/dialog.json`);

    expect(response.status).toBe(200);
    const data = (await response.json()) as Record<string, any>;

    // Dialog depends on both utils and button
    expect(data.registryDependencies).toContain('utils');
    expect(data.registryDependencies).toContain('button');
  });

  it('returns 404 for non-existent component', async () => {
    const response = await fetch(`${server.url}/nonexistent.json`);
    expect(response.status).toBe(404);
  });

  it('supports ETags via If-None-Match', async () => {
    // First request to get ETag
    const firstResponse = await fetch(`${server.url}/button.json`);
    expect(firstResponse.status).toBe(200);
    const etag = firstResponse.headers.get('etag');
    expect(etag).toBeTruthy();

    // Second request with matching ETag should return 304
    const secondResponse = await fetch(`${server.url}/button.json`, {
      headers: { 'If-None-Match': etag! }
    });
    expect(secondResponse.status).toBe(304);
    expect(secondResponse.headers.get('etag')).toBe(etag);
  });

  it('serves all component types correctly', async () => {
    // theme type
    const themeResponse = await fetch(`${server.url}/registry.json`);
    const catalog = (await themeResponse.json()) as Record<string, any>;
    const types = new Set(catalog.items.map((i: any) => i.type));

    expect(types.has('registry:ui')).toBe(true);
    expect(types.has('registry:theme')).toBe(true);
    expect(types.has('registry:base')).toBe(true);
    expect(types.has('registry:font')).toBe(true);
  });

  it('validates all catalog items have required fields', async () => {
    const response = await fetch(`${server.url}/registry.json`);
    const catalog = (await response.json()) as Record<string, any>;

    for (const item of catalog.items as any[]) {
      expect(item.name).toBeTruthy();
      expect(item.type).toBeTruthy();
      expect(item.type.startsWith('registry:')).toBe(true);
      expect(Array.isArray(item.files)).toBe(true);
    }
  });

  it('fetches and resolves the full add flow (simulated)', async () => {
    // Step 1: Fetch catalog to find components
    const catalogRes = await fetch(`${server.url}/registry.json`);
    const catalog = (await catalogRes.json()) as Record<string, any>;

    // Step 2: Find a component and its dependencies
    const dialogItem = catalog.items.find((i: any) => i.name === 'dialog');
    expect(dialogItem).toBeDefined();

    // Step 3: Fetch each dependency
    const deps = dialogItem.registryDependencies as string[];
    for (const dep of deps) {
      const depRes = await fetch(`${server.url}/${dep}.json`);
      if (depRes.status === 200) {
        const depData = (await depRes.json()) as Record<string, any>;
        expect(depData.name).toBe(dep);
        expect(depData.files).toBeDefined();
      }
      // Some deps (like 'utils') might exist only in the catalog
    }

    // Step 4: Verify dialog's own JSON has content
    const dialogRes = await fetch(`${server.url}/dialog.json`);
    const dialogData = (await dialogRes.json()) as Record<string, any>;
    expect(dialogData.files[0].content).toBeDefined();
    expect(dialogData.files[0].content).toContain('dialog');
  });
});
