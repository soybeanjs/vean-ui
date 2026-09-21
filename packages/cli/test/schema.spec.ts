import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
  rawConfigSchema,
  PRESET_BASE_COLORS,
  PRESET_ICON_LIBRARIES,
  PRESET_PRIMARY_COLORS,
  PRESET_RADII,
  PRESET_SIZES
} from '../src/registry/config';
import {
  registryItemSchema,
  registryItemTypeSchema,
  registrySchema,
  veanBaseConfigSchema,
  veanBaseItemConfigSchema
} from '../src/registry/schema';

describe('config schema', () => {
  const minimalConfig = {
    iconLibrary: 'lucide',
    uno: {
      base: 'zinc',
      primary: 'indigo',
      radius: 'md'
    },
    font: {}
  };

  it('parses a minimal valid config', () => {
    const result = v.safeParse(rawConfigSchema, minimalConfig);
    expect(result.success).toBe(true);
  });

  it('accepts all valid radius values', () => {
    for (const radius of PRESET_RADII) {
      const result = v.safeParse(rawConfigSchema, {
        ...minimalConfig,
        uno: { ...minimalConfig.uno, radius }
      });
      expect(result.success).toBe(true);
    }
  });

  it('accepts all valid icon libraries', () => {
    for (const iconLibrary of PRESET_ICON_LIBRARIES) {
      const result = v.safeParse(rawConfigSchema, {
        ...minimalConfig,
        iconLibrary
      });
      expect(result.success).toBe(true);
    }
  });

  it('accepts full config with optional fields', () => {
    const fullConfig = {
      ...minimalConfig,
      $schema: 'https://veanui.com/schema.json',
      uno: {
        ...minimalConfig.uno,
        size: 'lg'
      },
      font: {
        sans: 'inter',
        heading: 'inherit'
      },
      registries: {
        '@acme': 'https://example.com/r/{name}.json'
      }
    };

    const result = v.safeParse(rawConfigSchema, fullConfig);
    expect(result.success).toBe(true);
  });
});

describe('registry item schema', () => {
  it('parses a ui component', () => {
    const item = {
      type: 'registry:ui',
      name: 'button',
      description: 'A button component',
      dependencies: ['@vean/aria', '@soybeanjs/cva'],
      files: [{ path: 'button.vue', type: 'registry:ui' }]
    };

    const result = v.safeParse(registryItemSchema, item);
    expect(result.success).toBe(true);
  });

  it('parses a style item', () => {
    const item = {
      type: 'registry:style',
      name: 'soybean-style',
      files: [],
      cssVars: {
        light: { '--background': '0 0% 100%' },
        dark: { '--background': '0 0% 3.9%' }
      }
    };

    const result = v.safeParse(registryItemSchema, item);
    expect(result.success).toBe(true);
  });

  it('parses a base item with config', () => {
    const item = {
      type: 'registry:base',
      name: 'soybean-base',
      config: {},
      files: []
    };

    const result = v.safeParse(registryItemSchema, item);
    expect(result.success).toBe(true);
  });
});

describe('registry schema', () => {
  it('parses a valid registry', () => {
    const registry = {
      name: 'vean',
      homepage: 'https://veanui.com',
      items: [
        {
          type: 'registry:ui',
          name: 'button',
          dependencies: ['@vean/aria'],
          files: [{ path: 'button.vue', type: 'registry:ui' }]
        }
      ]
    };

    const result = v.safeParse(registrySchema, registry);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ADR-005: registry-item `uno` field is structured, mirroring UnoCSS UserConfig
// ---------------------------------------------------------------------------

describe('registry item uno field (ADR-005)', () => {
  it('parses an item without uno (optional)', () => {
    const item = {
      type: 'registry:ui',
      name: 'button',
      files: [{ path: 'button.vue', type: 'registry:ui' }]
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses an empty uno object', () => {
    const item = {
      type: 'registry:style',
      name: 'empty-uno',
      uno: {},
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses a fully populated structured uno', () => {
    const item = {
      type: 'registry:style',
      name: 'rich-uno',
      uno: {
        presets: ['@vean/unocss', 'presetIcons'],
        rules: [['^btn-(.+)$', 'btn-$1']],
        shortcuts: { 'btn-primary': 'bg-primary text-primary-foreground' },
        theme: { colors: { brand: '#3b82f6' } },
        safelist: ['btn-primary', 'btn-secondary']
      },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses a partial uno (only shortcuts)', () => {
    const item = {
      type: 'registry:style',
      name: 'shortcuts-only',
      uno: { shortcuts: { 'card-hover': 'transition hover:shadow-lg' } },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses a registry:base item carrying uno fragments alongside config', () => {
    const item = {
      type: 'registry:base',
      name: 'starter-base',
      uno: {
        presets: ['@vean/unocss'],
        safelist: ['sr-only']
      },
      config: {},
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('rejects a rule tuple with wrong arity', () => {
    const item = {
      type: 'registry:style',
      name: 'bad-rule',
      uno: { rules: [['only-one']] },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(false);
  });

  it('rejects a non-string shortcut value', () => {
    const item = {
      type: 'registry:style',
      name: 'bad-shortcut',
      uno: { shortcuts: { 'btn-primary': 123 } },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ADR-009: registry:base config is typed Vean-native (veanBaseConfigSchema)
// ---------------------------------------------------------------------------

describe('veanBaseConfigSchema (ADR-009)', () => {
  it('parses a full Vean-native base config', () => {
    const config = {
      uno: {
        base: 'zinc',
        primary: 'indigo',
        size: 'md',
        radius: 'md'
      },
      aliases: {
        ui: '@/ui',
        theme: '@/theme',
        styles: '@/styles',
        components: '@/components',
        composables: '@/composables'
      },
      themePackage: '@vean/theme',
      resolver: './src/ui/resolver',
      iconLibrary: 'lucide',
      rtl: false,
      pointer: 'fine'
    };
    expect(v.safeParse(veanBaseConfigSchema, config).success).toBe(true);
  });

  it('rejects an invalid uno.base value', () => {
    const config = {
      uno: { base: 'rainbow', primary: 'indigo', radius: 'md' },
      aliases: {
        ui: '@/ui',
        theme: '@/theme',
        styles: '@/styles',
        components: '@/components',
        composables: '@/composables'
      },
      themePackage: '@vean/theme',
      resolver: './src/ui/resolver',
      iconLibrary: 'lucide',
      rtl: false,
      pointer: 'fine'
    };
    expect(v.safeParse(veanBaseConfigSchema, config).success).toBe(false);
  });

  it('rejects an invalid pointer value', () => {
    const config = {
      uno: { base: 'zinc', primary: 'indigo', radius: 'md' },
      aliases: {
        ui: '@/ui',
        theme: '@/theme',
        styles: '@/styles',
        components: '@/components',
        composables: '@/composables'
      },
      themePackage: '@vean/theme',
      resolver: './src/ui/resolver',
      iconLibrary: 'lucide',
      rtl: false,
      pointer: 'touch'
    };
    expect(v.safeParse(veanBaseConfigSchema, config).success).toBe(false);
  });

  it('accepts every PRESET_BASE_COLORS / PRIMARY / SIZE / RADIUS / ICON value', () => {
    for (const base of PRESET_BASE_COLORS) {
      for (const primary of PRESET_PRIMARY_COLORS) {
        const config = {
          uno: { base, primary, size: PRESET_SIZES[2], radius: PRESET_RADII[3] },
          aliases: {
            ui: '@/ui',
            theme: '@/theme',
            styles: '@/styles',
            components: '@/components',
            composables: '@/composables'
          },
          themePackage: '@vean/theme',
          resolver: './src/ui/resolver',
          iconLibrary: PRESET_ICON_LIBRARIES[0],
          rtl: false,
          pointer: 'fine'
        };
        expect(v.safeParse(veanBaseConfigSchema, config).success).toBe(true);
      }
    }
  });
});

describe('registry:base config deep-partial (ADR-009)', () => {
  it('veanBaseItemConfigSchema accepts empty object (all fields optional)', () => {
    expect(v.safeParse(veanBaseItemConfigSchema, {}).success).toBe(true);
  });

  it('veanBaseItemConfigSchema accepts a partial uno (only base color)', () => {
    expect(v.safeParse(veanBaseItemConfigSchema, { uno: { base: 'zinc' } }).success).toBe(true);
  });

  it('veanBaseItemConfigSchema accepts a partial aliases (only ui)', () => {
    expect(v.safeParse(veanBaseItemConfigSchema, { aliases: { ui: '@/ui' } }).success).toBe(true);
  });

  it('veanBaseItemConfigSchema accepts only themePackage + resolver', () => {
    expect(
      v.safeParse(veanBaseItemConfigSchema, {
        themePackage: '@vean/theme',
        resolver: './src/ui/resolver'
      }).success
    ).toBe(true);
  });

  it('veanBaseItemConfigSchema rejects an invalid uno.base even when partial', () => {
    expect(v.safeParse(veanBaseItemConfigSchema, { uno: { base: 'rainbow' } }).success).toBe(false);
  });

  it('veanBaseItemConfigSchema rejects an invalid pointer even when partial', () => {
    expect(v.safeParse(veanBaseItemConfigSchema, { pointer: 'touch' }).success).toBe(false);
  });

  it('parses a registry:base item with empty config (backward compat)', () => {
    const item = { type: 'registry:base', name: 'soybean-base', config: {}, files: [] };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses a registry:base item with a fully typed config', () => {
    const item = {
      type: 'registry:base',
      name: 'full-base',
      config: {
        uno: { base: 'zinc', primary: 'indigo', size: 'md', radius: 'md' },
        aliases: {
          ui: '@/ui',
          theme: '@/theme',
          styles: '@/styles',
          components: '@/components',
          composables: '@/composables'
        },
        themePackage: '@vean/theme',
        resolver: './src/ui/resolver',
        iconLibrary: 'lucide',
        rtl: false,
        pointer: 'fine'
      },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses a registry:base item with a partial config (only uno subset)', () => {
    const item = {
      type: 'registry:base',
      name: 'partial-base',
      config: { uno: { base: 'stone', radius: 'lg' } },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses a registry:base item with a partial config (only aliases + iconLibrary)', () => {
    const item = {
      type: 'registry:base',
      name: 'alias-base',
      config: { aliases: { ui: '#ui' }, iconLibrary: 'tabler' },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('rejects a registry:base item with invalid uno.base in config', () => {
    const item = {
      type: 'registry:base',
      name: 'bad-base',
      config: { uno: { base: 'nonexistent' } },
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ADR-002: adopt shadcn's 6 missing item types verbatim
// ---------------------------------------------------------------------------

describe('registry item type taxonomy (ADR-002)', () => {
  it('registryItemTypeSchema accepts all 15 shadcn-vue item types', () => {
    const allTypes = [
      'registry:ui',
      'registry:component',
      'registry:style',
      'registry:lib',
      'registry:hook',
      'registry:theme',
      'registry:base',
      'registry:font',
      'registry:block',
      'registry:composable',
      'registry:page',
      'registry:file',
      'registry:item',
      'registry:example',
      'registry:internal'
    ];
    for (const type of allTypes) {
      expect(v.safeParse(registryItemTypeSchema, type).success).toBe(true);
    }
  });

  it('registryItemTypeSchema rejects an unknown type', () => {
    expect(v.safeParse(registryItemTypeSchema, 'registry:unknown').success).toBe(false);
  });
});

describe('registry:file / registry:page discriminated target (ADR-002)', () => {
  it('parses a registry:file item with mandatory target', () => {
    const item = {
      type: 'registry:file',
      name: 'env-file',
      target: '.env',
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('parses a registry:page item with mandatory target', () => {
    const item = {
      type: 'registry:page',
      name: 'login-page',
      target: 'src/pages/login.vue',
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('rejects a registry:file item missing target', () => {
    const item = {
      type: 'registry:file',
      name: 'env-file',
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(false);
  });

  it('rejects a registry:page item missing target', () => {
    const item = {
      type: 'registry:page',
      name: 'login-page',
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(false);
  });

  it('parses a registry:file item carrying files + dependencies alongside target', () => {
    const item = {
      type: 'registry:file',
      name: 'config-file',
      target: 'src/config/app.ts',
      dependencies: ['dotenv'],
      files: [{ path: 'src/config/app.ts', type: 'registry:lib' }]
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('rejects a non-string target on a registry:file item', () => {
    const item = {
      type: 'registry:file',
      name: 'env-file',
      target: 42,
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(false);
  });
});

describe('internal-only item types (ADR-002)', () => {
  it.each(['registry:composable', 'registry:item', 'registry:example', 'registry:internal'] as const)(
    'parses a %s item via the generic branch',
    type => {
      const item = { type, name: `sample-${type}`, files: [] };
      expect(v.safeParse(registryItemSchema, item).success).toBe(true);
    }
  );

  it('parses a registry:composable item with dependencies', () => {
    const item = {
      type: 'registry:composable',
      name: 'use-form-state',
      dependencies: ['@vueuse/core'],
      files: []
    };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });

  it('internal-only items do NOT require target', () => {
    const item = { type: 'registry:internal', name: 'no-target', files: [] };
    expect(v.safeParse(registryItemSchema, item).success).toBe(true);
  });
});
