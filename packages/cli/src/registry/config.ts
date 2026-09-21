import * as v from 'valibot';
import { NEUTRAL_PALETTES, PALETTE_KEYS, themeSizeKeys, themeRadiusKeys, themeFontKeys } from '@vean/theme';

// ---------------------------------------------------------------------------
// Vean config (vean.json) — the user-facing project config
// ---------------------------------------------------------------------------

export const PRESET_ICON_LIBRARIES = ['lucide', 'material-symbols', 'ph', 'tabler', 'solar', 'radix-icons'] as const;

export const PRESET_RADII = themeRadiusKeys;

export const PRESET_BASE_COLORS = NEUTRAL_PALETTES;

export const PRESET_PRIMARY_COLORS = PALETTE_KEYS;

export const PRESET_SIZES = themeSizeKeys;

/**
 * The preset families `vean.json` accepts, taken straight from the theme
 * engine so a family added to the engine reaches the CLI without a second edit.
 *
 * The engine's `themeFontKeys` is the loadable catalog (sans → mono → serif,
 * matching shadcn's declaration order); `system` is excluded there because it is
 * a theme-only fallback rather than a family a consumer can load.
 */
export const PRESET_FONTS = themeFontKeys;

export const rawConfigSchema = v.object({
  $schema: v.optional(v.string()),
  iconLibrary: v.picklist(PRESET_ICON_LIBRARIES),
  uno: v.object({
    base: v.picklist(PRESET_BASE_COLORS),
    primary: v.picklist(PRESET_PRIMARY_COLORS),
    size: v.optional(v.picklist(PRESET_SIZES)),
    radius: v.picklist(PRESET_RADII)
  }),
  font: v.object({
    sans: v.optional(v.picklist(PRESET_FONTS)),
    /** serif copy / pull quotes; `--font-serif`. */
    serif: v.optional(v.picklist(PRESET_FONTS)),
    mono: v.optional(v.picklist(PRESET_FONTS)),
    heading: v.optional(v.picklist(['inherit' as const, ...PRESET_FONTS]))
  }),
  /**
   * Import aliases per package (shadcn-vue style, EC-E03). Key = package
   * namespace (ui, admin, chart); value = import alias prefix such as
   * `#ui` / `#admin` / `@/ui`. The CLI resolves each alias to an output
   * directory (via tsconfig paths, else `src/<package>`).
   */
  aliases: v.optional(v.record(v.string(), v.string())),
  registries: v.optional(v.record(v.string(), v.string()))
});

export type RawConfig = v.InferOutput<typeof rawConfigSchema>;

// ---------------------------------------------------------------------------
// Resolved config — with resolved absolute paths
// ---------------------------------------------------------------------------

export const configSchema = v.object({
  ...rawConfigSchema.entries,
  resolvedPaths: v.object({
    cwd: v.string(),
    /** Core `ui` package output dir (alias `ui`, default `src/ui`). */
    ui: v.string(),
    /** Per-package output dirs: package namespace → absolute directory. */
    packages: v.record(v.string(), v.string())
  })
});

export type Config = v.InferOutput<typeof configSchema>;
