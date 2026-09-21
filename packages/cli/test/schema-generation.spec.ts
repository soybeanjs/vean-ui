import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { generateSchemaData } from '../scripts/schema';

interface JsonSchemaLike {
  description?: string;
  default?: unknown;
  oneOf?: unknown[];
  anyOf?: unknown[];
  properties?: Record<string, JsonSchemaLike>;
  required?: string[];
  type?: string;
  const?: string;
  enum?: string[];
}

async function readJsonSchema(dir: string, fileName: string): Promise<JsonSchemaLike> {
  const raw = await readFile(path.join(dir, fileName), 'utf-8');
  return JSON.parse(raw) as JsonSchemaLike;
}

describe('generateSchemaData (ADR-008)', () => {
  let schemaDir: string;

  beforeAll(async () => {
    schemaDir = await mkdtemp(path.join(tmpdir(), 'vean-schema-'));
    await generateSchemaData(schemaDir);
  });

  afterAll(async () => {
    if (schemaDir) {
      await rm(schemaDir, { recursive: true, force: true });
    }
  });

  it('writes all three schema files', async () => {
    const files = await readdir(schemaDir);
    expect(files.sort()).toEqual(['registry-item.json', 'registry.json', 'vean.json']);
  });

  // -----------------------------------------------------------------------
  // ADR-008: oneOf / anyOf descent — descriptions must propagate into
  // discriminated-union variant branches, not just the top-level wrapper.
  // -----------------------------------------------------------------------

  describe('oneOf descent in registry-item.json', () => {
    let schema: JsonSchemaLike;

    beforeAll(async () => {
      schema = await readJsonSchema(schemaDir, 'registry-item.json');
    });

    it('emits a top-level oneOf (valibot variant) with the wrapper description', () => {
      expect(Array.isArray(schema.oneOf)).toBe(true);
      expect(schema.description).toMatch(/vean registry/i);
    });

    it('propagates the `name` property description into EVERY variant branch', () => {
      const branches = (schema.oneOf ?? []) as JsonSchemaLike[];
      expect(branches.length).toBeGreaterThanOrEqual(3);
      for (const branch of branches) {
        const nameProp = branch.properties?.name;
        expect(nameProp, `branch missing properties.name`).toBeDefined();
        expect(nameProp?.description, `branch properties.name.description missing`).toMatch(/identifier/i);
      }
    });

    it('propagates the `type` property description into every variant branch', () => {
      const branches = (schema.oneOf ?? []) as JsonSchemaLike[];
      for (const branch of branches) {
        const typeProp = branch.properties?.type;
        expect(typeProp?.description, `branch properties.type.description missing`).toMatch(/item type/i);
      }
    });

    it('propagates the `dependencies` description into every variant branch', () => {
      const branches = (schema.oneOf ?? []) as JsonSchemaLike[];
      for (const branch of branches) {
        const depProp = branch.properties?.dependencies;
        expect(depProp?.description).toMatch(/npm package dependencies/i);
      }
    });

    it('propagates the `uno` nested property descriptions into every variant branch', () => {
      const branches = (schema.oneOf ?? []) as JsonSchemaLike[];
      for (const branch of branches) {
        const unoProp = branch.properties?.uno;
        expect(unoProp?.description).toMatch(/UnoCSS config fragment/i);
        expect(unoProp?.properties?.presets?.description).toMatch(/Preset module specifiers/i);
      }
    });

    it('keeps the `target` field on registry:file / registry:page branches (ADR-002)', () => {
      const branches = (schema.oneOf ?? []) as JsonSchemaLike[];
      const filePageBranch = branches.find(branch => branch.properties?.type?.enum?.includes('registry:file'));
      expect(filePageBranch, 'registry:file / registry:page branch missing').toBeDefined();
      expect(filePageBranch?.required).toContain('target');
      expect(filePageBranch?.properties?.target?.type).toBe('string');
    });

    it('includes the config enrichment on the registry:base branch (ADR-009)', () => {
      const branches = (schema.oneOf ?? []) as JsonSchemaLike[];
      const baseBranch = branches.find(branch => branch.properties?.type?.const === 'registry:base');
      expect(baseBranch, 'registry:base branch missing').toBeDefined();
      const configProp = baseBranch?.properties?.config;
      expect(configProp?.description).toMatch(/Typed Vean base config/i);
      expect(configProp?.properties?.themePackage?.description).toMatch(/Theme token package/i);
    });

    it('does NOT leak type-specific properties across variant branches (ADR-008 regression)', () => {
      // `config` is valid only on registry:base; the oneOf descent must not
      // inject it into the font / file-page / generic branches. Likewise
      // `font` is valid only on registry:font and must not appear elsewhere.
      const branches = (schema.oneOf ?? []) as JsonSchemaLike[];
      const nonBaseBranches = branches.filter(branch => branch.properties?.type?.const !== 'registry:base');
      expect(nonBaseBranches.length).toBeGreaterThan(0);
      for (const branch of nonBaseBranches) {
        expect(branch.properties?.config, `non-base branch leaks 'config'`).toBeUndefined();
      }
      const nonFontBranches = branches.filter(branch => branch.properties?.type?.const !== 'registry:font');
      for (const branch of nonFontBranches) {
        expect(branch.properties?.font, `non-font branch leaks 'font'`).toBeUndefined();
      }
    });
  });

  describe('vean.json (project config)', () => {
    it('carries enrichment descriptions at the top level (no variant)', async () => {
      const schema = await readJsonSchema(schemaDir, 'vean.json');
      expect(schema.description).toMatch(/Vean project configuration/i);
      expect(schema.properties?.style?.description).toMatch(/design style preset/i);
      expect(schema.properties?.uno?.properties?.base?.description).toMatch(/Base color palette/i);
    });
  });

  describe('registry.json', () => {
    it('applies the anyOf constraint for items/include and keeps descriptions', async () => {
      const schema = await readJsonSchema(schemaDir, 'registry.json');
      expect(Array.isArray(schema.anyOf)).toBe(true);
      expect(schema.description).toMatch(/registry of components/i);
      expect(schema.properties?.name?.description).toMatch(/registry name/i);
      expect(schema.properties?.items?.description).toMatch(/registry items/i);
    });
  });
});
