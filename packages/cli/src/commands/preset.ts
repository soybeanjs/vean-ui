import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { getConfig, writeConfig } from '../utils/get-config';
import { encodePreset, decodePreset, isPresetCode } from '../registry/preset';
import type { PresetConfig } from '../registry/preset';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function resolvePresetConfig(presetArg: string): Promise<PresetConfig | null> {
  if (isPresetCode(presetArg)) {
    return decodePreset(presetArg);
  }

  const presetsDir = path.resolve(__dirname, '../../presets');
  const presetFile = path.join(presetsDir, `${presetArg}.json`);

  try {
    const content = JSON.parse(await fs.readFile(presetFile, 'utf-8'));

    return {
      base: content.base ?? 'zinc',
      primary: content.primary ?? 'indigo',
      iconLibrary: content.iconLibrary ?? 'lucide',
      radius: content.radius ?? 'md'
    };
  } catch {
    return null;
  }
}

export async function applyPresetToProject(presetArg: string, cwd: string): Promise<void> {
  const config = await resolvePresetConfig(presetArg);

  if (!config) {
    console.error(`Preset "${presetArg}" not found.`);
    process.exit(1);
  }

  const existingConfig = await getConfig(cwd);

  if (!existingConfig) {
    console.error('No vean.json found. Run "vean init" first.');
    process.exit(1);
  }

  const updated = {
    ...existingConfig,
    iconLibrary: config.iconLibrary as typeof existingConfig.iconLibrary,
    uno: {
      ...existingConfig.uno,
      base: config.base as typeof existingConfig.uno.base,
      primary: config.primary as typeof existingConfig.uno.primary,
      radius: config.radius as typeof existingConfig.uno.radius
    }
  };

  await writeConfig(cwd, updated);
  console.log(`✔ Applied preset "${presetArg}" to vean.json`);
  console.log('  Run "vean info" to see the updated config.');
}

export const preset = new Command()
  .name('preset')
  .description('manage design system presets')
  .addCommand(
    new Command()
      .name('list')
      .description('list available built-in presets')
      .action(async () => {
        const presetsDir = path.resolve(__dirname, '../../presets');
        let files: string[];

        try {
          files = await fs.readdir(presetsDir);
        } catch {
          console.log('No built-in presets found.');
          return;
        }

        console.log();
        console.log('  Built-in Presets');
        console.log('  ────────────────');
        console.log();

        for (const file of files.filter(f => f.endsWith('.json'))) {
          const name = file.replace('.json', '');
          const content = JSON.parse(await fs.readFile(path.join(presetsDir, file), 'utf-8'));
          console.log(`  ${name.padEnd(16)} ${content.title ?? ''}`);
          if (content.description) {
            console.log(`  ${''.padEnd(16)} ${(content.description as string).slice(0, 60)}`);
          }
          console.log();
        }

        console.log(`  Use "vean init <name>" to apply a preset.`);
        console.log();
      })
  )
  .addCommand(
    new Command()
      .name('show')
      .description('show the config for a given preset name or code')
      .argument('<preset>', 'preset name (soybean/clean/dense) or code (e.g. a0)')
      .action(async (presetArg: string) => {
        const config = await resolvePresetConfig(presetArg);

        if (!config) {
          console.error(`Preset "${presetArg}" not found. Available: soybean, clean, dense`);
          process.exit(1);
        }

        console.log();
        console.log(`  Preset: ${presetArg}`);
        console.log(`  ${'─'.repeat(8 + presetArg.length)}`);
        console.log();
        console.log(`  Base:          ${config.base}`);
        console.log(`  Primary:       ${config.primary}`);
        console.log(`  Icon Library:  ${config.iconLibrary}`);
        console.log(`  Radius:        ${config.radius}`);
        console.log();
        console.log(`  Preset code:   ${encodePreset(config)}`);
        console.log();
        console.log(`  Apply:  vean init --preset ${encodePreset(config)}`);
        console.log();
      })
  )
  .addCommand(
    new Command()
      .name('apply')
      .description('apply a preset to an existing project')
      .argument('<preset>', 'preset name or code')
      .option('-c, --cwd <cwd>', 'the working directory', process.cwd())
      .action(async (presetArg: string, opts) => {
        await applyPresetToProject(presetArg, path.resolve(opts.cwd));
      })
  );
