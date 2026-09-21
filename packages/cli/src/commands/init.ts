import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import prompts from 'prompts';
import {
  PRESET_BASE_COLORS,
  PRESET_PRIMARY_COLORS,
  PRESET_RADII,
  PRESET_ICON_LIBRARIES,
  PRESET_SIZES,
  PRESET_FONTS
} from '../registry/config';
import { createDefaultConfig, detectMonorepo, getConfig, writeConfig } from '../utils/get-config';
import { getProjectInfo } from '../utils/get-project-info';
import { decodePreset, isPresetCode } from '../registry/preset';
import { scaffoldFromTemplate, ensurePnpmWorkspace, generatePackModules, ensureTypeScriptConfig } from '../templates';

// ---------------------------------------------------------------------------
// Options schema
// ---------------------------------------------------------------------------

export const initOptionsSchema = v.object({
  cwd: v.string(),
  monorepo: v.optional(v.boolean()),
  size: v.optional(v.picklist(PRESET_SIZES)),
  base: v.optional(v.picklist(PRESET_BASE_COLORS)),
  primary: v.optional(v.picklist(PRESET_PRIMARY_COLORS)),
  radius: v.optional(v.picklist(PRESET_RADII)),
  iconLibrary: v.optional(v.picklist(PRESET_ICON_LIBRARIES)),
  fontSans: v.optional(v.picklist(PRESET_FONTS)),
  fontHeading: v.optional(v.picklist(['inherit' as const, ...PRESET_FONTS])),
  yes: v.optional(v.boolean(), false),
  defaults: v.optional(v.boolean(), false),
  force: v.optional(v.boolean(), false),
  silent: v.optional(v.boolean(), false)
});

export type InitOptions = v.InferOutput<typeof initOptionsSchema>;

// ---------------------------------------------------------------------------
// Command definition
// ---------------------------------------------------------------------------

export const init = new Command()
  .name('init')
  .alias('create')
  .description('initialize your project and install dependencies')
  .option('-c, --cwd <cwd>', 'the working directory', process.cwd())
  .option('-m, --monorepo', 'use monorepo (pnpm workspaces) structure', false)
  .option('--nuxt', 'initialize as a Nuxt 3 project', false)
  .option('--ui-dir <path>', 'component output directory (default: src/ui)', 'src/ui')
  .option('--size <size>', `component size: ${PRESET_SIZES.join('/')}`)
  .option('-b, --base <base>', `base color: ${PRESET_BASE_COLORS.join('/')}`)
  .option('--primary <primary>', `primary color: ${PRESET_PRIMARY_COLORS.join('/')}`)
  .option('--radius <radius>', `border radius: ${PRESET_RADII.join('/')}`)
  .option('-p, --preset <code>', 'preset code (base62 encoded config)')
  .option('--icon-library <library>', `icon library: ${PRESET_ICON_LIBRARIES.join('/')}`)
  .option('--font-sans <font>', `sans-serif font: ${PRESET_FONTS.join('/')}`)
  .option('--font-heading <font>', `heading font: inherit/${PRESET_FONTS.join('/')}`)
  .option('-y, --yes', 'skip confirmation prompt', false)
  .option('-d, --defaults', 'use default configuration', false)
  .option('-f, --force', 'force overwrite of existing configuration', false)
  .option('-n, --name <name>', 'project name (for new projects)')
  .option('-s, --silent', 'mute output', false)
  .action(async opts => {
    await runInit(opts);
  });

type InitActionOptions = {
  cwd: string;
  monorepo?: boolean;
  nuxt?: boolean;
  uiDir: string;
  size?: string;
  base?: string;
  primary?: string;
  radius?: string;
  iconLibrary?: string;
  fontSans?: string;
  fontHeading?: string;
  yes: boolean;
  defaults: boolean;
  force: boolean;
  silent: boolean;
  preset?: string;
  name?: string;
};

export async function runInit(opts: InitActionOptions) {
  const cwd = path.resolve(opts.cwd);

  // Check existing config
  const existingConfig = await getConfig(cwd);
  if (existingConfig && !opts.force) {
    console.log('⚠ vean.json already exists. Use --force to overwrite.');
    return;
  }

  // Detect project info
  const projectInfo = await getProjectInfo(cwd);

  // Detect monorepo status (from CLI flag, then auto-detect, then prompt)
  const autoMonorepo = await detectMonorepo(cwd);
  const isMonorepo = opts.monorepo ?? autoMonorepo;

  // Handle preset code (overrides defaults, but CLI flags take precedence)
  if (opts.preset) {
    if (!isPresetCode(opts.preset)) {
      console.error(`Invalid preset code: ${opts.preset}`);
      console.log('Generate one at https://veanui.com/create (coming soon)');
      process.exit(1);
    }
    const preset = decodePreset(opts.preset);
    if (!preset) {
      console.error(`Failed to decode preset: ${opts.preset}`);
      process.exit(1);
    }
    opts.base = opts.base || preset.base;
    opts.primary = opts.primary || preset.primary;
    opts.radius = opts.radius || preset.radius;
    opts.iconLibrary = opts.iconLibrary || preset.iconLibrary;
    opts.fontSans = opts.fontSans || preset.fontSans;
    opts.fontHeading = opts.fontHeading || preset.fontHeading;
  }

  // Prompt if not using defaults/yes
  if (!opts.defaults && !opts.yes) {
    await promptConfig(opts);
  }

  // Determine Nuxt status
  const isNuxt = opts.nuxt ?? false;

  // Scaffold new project if no package.json exists
  if (!projectInfo) {
    const framework = isNuxt ? 'nuxt' : 'vue-vite';
    console.log(`No package.json found. Creating a new ${isNuxt ? 'Nuxt 3' : 'Vue + Vite'} project...`);
    await scaffoldFromTemplate(cwd, framework, {
      projectName: opts.name,
      uiDir: opts.uiDir,
      nuxt: isNuxt
    });
  }

  // Write vean.json with all config values
  const config = await createDefaultConfig(cwd, {
    iconLibrary: (opts.iconLibrary as (typeof PRESET_ICON_LIBRARIES)[number]) || 'lucide',
    uno: {
      base: (opts.base || 'zinc') as (typeof PRESET_BASE_COLORS)[number],
      primary: (opts.primary || 'indigo') as (typeof PRESET_PRIMARY_COLORS)[number],
      size: (opts.size || 'md') as (typeof PRESET_SIZES)[number],
      radius: (opts.radius || 'md') as (typeof PRESET_RADII)[number]
    },
    font: buildFontConfig(opts)
  });
  await writeConfig(cwd, config);

  if (!opts.silent) {
    console.log('✔ Created vean.json');
  }

  // For existing projects (no scaffolding), still ensure infra files exist
  if (projectInfo) {
    await ensurePnpmWorkspace(cwd, isMonorepo);
    await ensureTypeScriptConfig(cwd, opts.uiDir);
    await generatePackModules(cwd, opts.uiDir, isNuxt);
  }

  console.log('\nDone! Run "vean add <component>" to add components.');
}

// ---------------------------------------------------------------------------
// Interactive prompts
// ---------------------------------------------------------------------------

async function promptConfig(opts: InitActionOptions) {
  const recommended = {
    base: 'zinc',
    primary: 'indigo'
  } as const;

  const answers = await prompts([
    {
      type: 'select',
      name: 'size',
      message: 'Which component size / density?',
      choices: [
        { title: 'md (recommended — 16px base)', value: 'md' },
        { title: 'xs — extra small (12px)', value: 'xs' },
        { title: 'sm — small (14px)', value: 'sm' },
        { title: 'lg — large (18px)', value: 'lg' },
        { title: 'xl — extra large (20px)', value: 'xl' },
        { title: '2xl — huge (24px)', value: '2xl' }
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'base',
      message: 'Which base color?',
      choices: [recommended.base, ...PRESET_BASE_COLORS.filter(b => b !== recommended.base)].map(b => ({
        title: b === recommended.base ? `${b} (recommended)` : b,
        value: b
      })),
      initial: 0
    },
    {
      type: 'select',
      name: 'primary',
      message: 'Which primary color?',
      choices: [recommended.primary, ...PRESET_PRIMARY_COLORS.filter(p => p !== recommended.primary)].map(p => ({
        title: p === recommended.primary ? `${p} (recommended)` : p,
        value: p
      })),
      initial: 0
    },
    {
      type: 'select',
      name: 'fontSans',
      message: 'Which sans-serif font? (skip for system default)',
      choices: [
        { title: 'inter (recommended)', value: 'inter' },
        { title: 'none (system default)', value: '' },
        ...PRESET_FONTS.filter(f => f !== 'inter').map(f => ({
          title: f,
          value: f
        }))
      ],
      initial: 0
    },
    {
      type: (prev: string) => (prev ? 'select' : (null as any)),
      name: 'fontHeading',
      message: 'Which heading font? (or inherit from sans)',
      choices: [
        { title: 'inherit (recommended)', value: 'inherit' },
        ...PRESET_FONTS.map(f => ({
          title: f,
          value: f
        }))
      ],
      initial: 0
    }
  ]);

  if (answers.size) opts.size = answers.size as (typeof PRESET_SIZES)[number];
  if (answers.base) opts.base = answers.base as (typeof PRESET_BASE_COLORS)[number];
  if (answers.primary) opts.primary = answers.primary as (typeof PRESET_PRIMARY_COLORS)[number];
  if (answers.fontSans !== undefined && answers.fontSans !== '') {
    opts.fontSans = answers.fontSans as (typeof PRESET_FONTS)[number];
  }
  if (answers.fontHeading !== undefined) {
    opts.fontHeading = answers.fontHeading as 'inherit' | (typeof PRESET_FONTS)[number];
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildFontConfig(opts: InitActionOptions): {
  sans?: (typeof PRESET_FONTS)[number];
  heading?: 'inherit' | (typeof PRESET_FONTS)[number];
} {
  const overrides: ReturnType<typeof buildFontConfig> = {};

  if (opts.fontSans && PRESET_FONTS.includes(opts.fontSans as (typeof PRESET_FONTS)[number])) {
    overrides.sans = opts.fontSans as (typeof PRESET_FONTS)[number];
  }
  if (opts.fontHeading) {
    const heading = opts.fontHeading;
    if (heading === 'inherit') {
      overrides.heading = 'inherit';
    } else if (PRESET_FONTS.includes(heading as (typeof PRESET_FONTS)[number])) {
      overrides.heading = heading as (typeof PRESET_FONTS)[number];
    }
  }

  return overrides;
}
