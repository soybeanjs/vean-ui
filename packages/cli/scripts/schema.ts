/**
 * Generate JSON Schema files from Valibot schema definitions.
 *
 * Converts the Valibot schemas in src/registry/ to JSON Schema (draft-07)
 * format, enriched with descriptions, and writes them to
 * apps/docs/public/schema/ for IDE validation and documentation.
 *
 * Usage:
 *   pnpm --filter vean build:schema
 *   tsx packages/cli/scripts/schema.ts --output apps/docs/public/schema
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { toJsonSchema } from '@valibot/to-json-schema';
import type { JsonSchema } from '@valibot/to-json-schema';
import { rawConfigSchema } from '../src/registry/config';
import { registryItemSchema, registrySchema } from '../src/registry/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Schema enrichment: descriptions and extra defaults that Valibot schemas don't
 * carry natively. The structure mirrors the JSON Schema properties tree.
 */
interface SchemaEnrichment {
  $schema?: string;
  description?: string;
  properties?: Record<string, SchemaEnrichment>;
  default?: unknown;
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(fileURLToPath(import.meta.url), '../../../..');
const DEFAULT_OUTPUT_DIR = path.join(REPO_ROOT, 'apps/docs/public/schema');

// ---------------------------------------------------------------------------
// Enrichment data — descriptions & extra defaults
// ---------------------------------------------------------------------------

const VEAN_ENRICHMENT: SchemaEnrichment = {
  description: 'Vean project configuration file. Defines component style, aliases, and UnoCSS settings.',
  properties: {
    $schema: {
      description: 'JSON Schema reference for this config. Set to "https://veanui.com/schema/vean.json" for validation.'
    },
    style: {
      description:
        'The design style preset. "soybean" is the default — a balanced, modern look. "clean" is minimal with sharper corners. "dense" is compact for data-heavy interfaces.',
      default: 'soybean'
    },
    iconLibrary: {
      description: 'The Iconify icon set to use. Components use icons from this set via SIcon.',
      default: 'lucide'
    },
    uno: {
      description: 'UnoCSS theme configuration. Controls the CSS variable system via @vean/unocss.',
      properties: {
        base: {
          description: 'Base color palette for backgrounds, borders, and muted elements.',
          default: 'zinc'
        },
        primary: {
          description: 'Primary brand color for buttons, links, and accents.',
          default: 'indigo'
        },
        size: {
          description: 'Component size/density preset. Controls the base font size and spacing.',
          default: 'md'
        },
        radius: {
          description: 'Default border radius for components.',
          default: 'md'
        }
      }
    },
    font: {
      description: 'Font family configuration for the project.',
      properties: {
        sans: {
          description:
            'Sans-serif font family for body text. Set to a font key from the preset list to load it, or omit for system default.'
        },
        heading: {
          description: 'Heading font family. Set to "inherit" to use the sans font, or pick a specific font key.'
        }
      }
    },
    menu: {
      description: 'Navigation / sidebar menu styling configuration.',
      properties: {
        accent: {
          description: 'Menu accent style. "subtle" is a gentle highlight; "bold" uses stronger colors.'
        },
        color: {
          description: 'Menu color scheme for light/dark mode.'
        }
      }
    },
    registries: {
      description: 'Additional registry URLs for extending the component catalog.'
    }
  }
};

const REGISTRY_ITEM_ENRICHMENT: SchemaEnrichment = {
  description: 'A single item in the vean registry. Represents a component, style, utility, or theme.',
  properties: {
    $schema: {
      description: 'JSON Schema reference for this item.'
    },
    name: {
      description: 'The name of the item. Unique within the registry. This is the identifier used by `vean add <name>`.'
    },
    type: {
      description: "The item type. Determines the target directory and how the item is resolved in the user's project."
    },
    title: {
      description: 'A human-readable title for the item.'
    },
    description: {
      description: 'A short description of the item, shown in search results and the UI.'
    },
    dependencies: {
      description: 'npm package dependencies required by this item.'
    },
    devDependencies: {
      description: 'npm package devDependencies required by this item.'
    },
    registryDependencies: {
      description:
        'Other registry items that this item depends on. They will be added automatically when this item is added.'
    },
    files: {
      description: 'The files that belong to this registry item.',
      properties: {
        path: {
          description: 'Relative path of the file within the UI source directory.'
        },
        type: {
          description: 'The file type. Determines the target sub-directory.'
        },
        target: {
          description: 'Optional override target path. If set, the file is written to this path instead of the default.'
        },
        content: {
          description: 'Inline file content. If omitted, the file is read from the local source path.'
        }
      }
    },
    meta: {
      description: 'Metadata for the registry item.',
      properties: {
        tags: {
          description: 'Tags for categorising the item.'
        }
      }
    },
    docs: {
      description: 'Documentation URL or inline documentation for the item.'
    },
    categories: {
      description: 'Categories for organising items in the registry UI.'
    },
    preview: {
      description: 'URL or path to a preview image for the item.'
    },
    uno: {
      description:
        'UnoCSS config fragment (ADR-005). A JSON-serializable slice of UnoCSS UserConfig — presets, rules, shortcuts, theme, safelist — that ships declaratively with the item and merges during `vean add`.',
      properties: {
        presets: {
          description: 'Preset module specifiers to load (e.g. "@vean/unocss").'
        },
        rules: {
          description:
            'Declarative `[pattern, class]` rules. Pattern is a regex source string; the second element is the replacement class.'
        },
        shortcuts: {
          description: 'Shortcut name → class string mapping.'
        },
        theme: {
          description: 'UnoCSS theme object — open shape for colors, shadows, fonts, etc.'
        },
        safelist: {
          description: 'Tokens to always generate, regardless of content scanning.'
        }
      }
    },
    config: {
      description:
        'Typed Vean base config (ADR-009). Only present on `registry:base` items. Deep-partial of veanBaseConfigSchema — any subset of the Vean project shape (uno palette, aliases, themePackage, resolver, iconLibrary, rtl, pointer) can be declared.',
      properties: {
        uno: {
          description: 'UnoCSS theme palette — base/primary/size/radius picklists.',
          properties: {
            base: { description: 'Base color palette for backgrounds and borders.' },
            primary: { description: 'Primary brand color for accents and actions.' },
            size: { description: 'Component size/density preset.' },
            radius: { description: 'Default border radius for components.' }
          }
        },
        aliases: {
          description: 'Path aliases for the project source directories.',
          properties: {
            ui: { description: 'Alias for the UI components directory.' },
            theme: { description: 'Alias for the theme tokens directory.' },
            styles: { description: 'Alias for the style recipes directory.' },
            components: { description: 'Alias for the components directory.' },
            composables: { description: 'Alias for the composables directory.' }
          }
        },
        themePackage: {
          description: 'Theme token package, e.g. "@vean/theme".'
        },
        resolver: {
          description: 'Resolver module path (relative to project root), e.g. "./src/ui/resolver".'
        },
        iconLibrary: {
          description: 'The Iconify icon set to use via SIcon.'
        },
        rtl: {
          description: 'Enable right-to-left text direction.'
        },
        pointer: {
          description: 'Pointer precision hint: "coarse" (touch) or "fine" (mouse/stylus).'
        }
      }
    }
  }
};

const REGISTRY_ENRICHMENT: SchemaEnrichment = {
  description: 'A vean registry of components, styles, utilities, and themes.',
  properties: {
    $schema: {
      description:
        'JSON Schema reference for this registry. Set to "https://veanui.com/schema/registry.json" for validation.'
    },
    name: {
      description:
        'The registry name. Required when this file is used as the root registry, optional for included registry chunks.'
    },
    homepage: {
      description: 'The registry homepage URL. Required when this file is used as the root registry.'
    },
    include: {
      description:
        'An array of relative paths to registry.json files to include. The included items are merged into this registry.'
    },
    items: {
      description: 'The registry items — components, styles, utilities, and themes.'
    }
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * ADR-008 — Map enrichment over each `oneOf` / `anyOf` variant branch.
 * `JsonSchemaDefinition` allows `boolean` members (the `true`/`false` schema
 * shortcuts); those are passed through untouched since they have no
 * properties to enrich. Object branches are recursively merged so
 * descriptions/defaults/nested properties propagate into discriminated-union
 * members emitted by valibot's `v.variant()`.
 *
 * Branches are merged with `addEnrichmentOnlyProperties=false` — only
 * EXISTING branch properties are enriched. Adding enrichment-only properties
 * to a branch would leak type-specific fields across the discriminated
 * union (e.g. `config` is valid only on `registry:base`; injecting it into
 * every branch would make the published schema accept inputs valibot
 * rejects). Enrichment-only properties are added solely at the schema root.
 */
function mergeVariantBranches(branches: JsonSchema['oneOf'], enrichment: SchemaEnrichment): JsonSchema['oneOf'] {
  if (!Array.isArray(branches)) {
    return branches;
  }
  return branches.map(branch =>
    typeof branch === 'object' && branch !== null
      ? mergeJsonSchemaInternal(branch as JsonSchema, enrichment, false)
      : branch
  );
}

/**
 * Public entry: top-level merge. Adds enrichment-only properties that the
 * valibot→JSON-Schema emitter may have omitted (e.g. fields the enrichment
 * documents but valibot doesn't surface). Only the schema root does this —
 * variant branches and nested property objects use the internal helper with
 * the flag off so type-specific fields stay scoped to their own branch.
 */
function deepMergeJsonSchema(base: JsonSchema, enrichment: SchemaEnrichment): JsonSchema {
  return mergeJsonSchemaInternal(base, enrichment, true);
}

function mergeJsonSchemaInternal(
  base: JsonSchema,
  enrichment: SchemaEnrichment,
  addEnrichmentOnlyProperties: boolean
): JsonSchema {
  const result: JsonSchema = { ...base };

  if (enrichment.description !== undefined) {
    result.description = enrichment.description;
  }

  if (enrichment.default !== undefined) {
    result.default = enrichment.default as JsonSchema['default'];
  }

  // ADR-008 — descend into oneOf / anyOf variant branches so enrichment
  // (descriptions, defaults, nested properties) propagates into each
  // discriminated-union member. Without this, valibot's `v.variant()` emits
  // N copies of the common properties and the enrichment only touches the
  // top-level wrapper, leaving every branch's `name`/`type`/etc. without
  // descriptions. Recursion is safe: branches are full JsonSchemas and the
  // enrichment is idempotent for keys that don't match.
  result.oneOf = mergeVariantBranches(result.oneOf, enrichment);
  result.anyOf = mergeVariantBranches(result.anyOf, enrichment);

  if (enrichment.properties && typeof result.properties === 'object' && result.properties !== null) {
    const baseProps = result.properties as Record<string, JsonSchema>;
    const mergedProperties: Record<string, JsonSchema> = {};

    for (const [key, baseProp] of Object.entries(baseProps)) {
      const enrichmentProp = enrichment.properties[key];
      // Nested property objects also merge with the flag off so enrichment-
      // only fields don't leak into nested shapes.
      mergedProperties[key] = enrichmentProp ? mergeJsonSchemaInternal(baseProp, enrichmentProp, false) : baseProp;
    }

    // At the schema root only: add enrichment-only properties that valibot
    // didn't emit (the enrichment documents fields the auto-generator missed).
    if (addEnrichmentOnlyProperties) {
      for (const [key, enrichmentProp] of Object.entries(enrichment.properties)) {
        if (!(key in mergedProperties)) {
          mergedProperties[key] = enrichmentProp as unknown as JsonSchema;
        }
      }
    }

    result.properties = mergedProperties;
  }

  return result;
}

function addSchemaRef(schema: JsonSchema): JsonSchema {
  const { $schema: _, description, ...rest } = schema;
  const result: JsonSchema = {
    $schema: 'https://json-schema.org/draft-07/schema#'
  };
  if (description) {
    result.description = description;
  }
  Object.assign(result, rest);
  return result;
}

/**
 * Add `anyOf` condition to the registry JSON schema: must have either `items` or `include`.
 */
function addRegistryConstraints(schema: JsonSchema): JsonSchema {
  const result: JsonSchema = { ...schema };
  result.anyOf = [{ required: ['items'] } as JsonSchema, { required: ['include'] } as JsonSchema];
  return result;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

export async function generateSchemas(outputDir: string): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  // 1. vean.json — from rawConfigSchema
  const veanSchema = addSchemaRef(
    deepMergeJsonSchema(toJsonSchema(rawConfigSchema, { target: 'draft-07' }), VEAN_ENRICHMENT)
  );
  await writeFile(path.join(outputDir, 'vean.json'), JSON.stringify(veanSchema, null, 2), 'utf-8');
  console.log(`✔ Generated ${path.join(outputDir, 'vean.json')}`);

  // 2. registry-item.json — from registryItemSchema
  const registryItemSchemaResult = addSchemaRef(
    deepMergeJsonSchema(
      toJsonSchema(registryItemSchema, { target: 'draft-07', errorMode: 'ignore' }),
      REGISTRY_ITEM_ENRICHMENT
    )
  );
  await writeFile(
    path.join(outputDir, 'registry-item.json'),
    JSON.stringify(registryItemSchemaResult, null, 2),
    'utf-8'
  );
  console.log(`✔ Generated ${path.join(outputDir, 'registry-item.json')}`);

  // 3. registry.json — from registrySchema
  const registrySchemaResult = addRegistryConstraints(
    addSchemaRef(
      deepMergeJsonSchema(
        toJsonSchema(registrySchema, { target: 'draft-07', errorMode: 'ignore' }),
        REGISTRY_ENRICHMENT
      )
    )
  );
  await writeFile(path.join(outputDir, 'registry.json'), JSON.stringify(registrySchemaResult, null, 2), 'utf-8');
  console.log(`✔ Generated ${path.join(outputDir, 'registry.json')}`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const outputDir =
    outputIndex >= 0 && outputIndex + 1 < args.length ? path.resolve(args[outputIndex + 1]) : DEFAULT_OUTPUT_DIR;

  console.log(`Generating JSON Schemas → ${outputDir}`);
  await generateSchemas(outputDir);
  console.log('\nDone!');
}

const modulePath = fileURLToPath(import.meta.url);
const entryPath = path.resolve(process.argv[1] ?? '');

if (path.resolve(entryPath) === path.resolve(modulePath)) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

export { generateSchemas as generateSchemaData };
