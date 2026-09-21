import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { addComponents } from '../utils/add-components';
import { getConfig } from '../utils/get-config';
import type { Config } from '../utils/get-config';
import { fetchRegistryCatalog, fetchRegistryItem } from '../registry/fetcher';

export const addOptionsSchema = v.object({
  components: v.array(v.string()),
  yes: v.boolean(),
  overwrite: v.boolean(),
  cwd: v.string(),
  path: v.optional(v.string()),
  dryRun: v.boolean(),
  diff: v.boolean(),
  view: v.boolean(),
  all: v.boolean(),
  silent: v.boolean()
});

export const add = new Command()
  .name('add')
  .description('add a component to your project')
  .argument('[components...]', 'component names to add')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('-p, --path <path>', 'the path to add the component to.')
  .option('--dry-run', 'preview the files to be added without writing them.', false)
  .option('--diff', 'show the diff between the local file and the registry file.', false)
  .option('--view', 'view the component source code without adding it.', false)
  .option('-a, --all', 'add all available components.', false)
  .option('-s, --silent', 'mute output.', false)
  .action(async (components: string[], opts) => {
    const options = v.parse(addOptionsSchema, {
      components,
      yes: opts.yes,
      overwrite: opts.overwrite,
      cwd: path.resolve(opts.cwd),
      path: opts.path,
      dryRun: opts.dryRun,
      diff: opts.diff,
      view: opts.view,
      all: opts.all,
      silent: opts.silent
    });

    // Get all available components if --all is used
    let componentList = options.components;
    if (options.all) {
      const config = await getConfig(options.cwd);
      if (config) {
        try {
          const catalog = await fetchRegistryCatalog(config);
          if (catalog.length > 0) {
            componentList = catalog.map(item => item.name);
            if (!options.silent) {
              console.log(`Found ${componentList.length} components in registry.`);
            }
          }
        } catch {
          if (!options.silent) {
            console.warn('⚠ Could not fetch registry catalog. Using local registry if available.');
          }
        }
      }

      if (!componentList.length) {
        console.error('No components found. Make sure registry is configured.');
        process.exit(1);
      }
    }

    // Ensure components were specified (unless viewing or using --all)
    if (!options.components.length && !options.all && !options.view) {
      console.log('Usage: vean add <component...>');
      console.log('\nRun "vean search" to find available components.');
      process.exit(0);
    }

    // Read vean.json
    let config: Config | null;

    try {
      config = await getConfig(options.cwd);
    } catch {
      if (!options.silent) {
        console.error('No vean.json found. Run "vean init" first.');
      }
      process.exit(1);
    }

    if (!config) {
      if (!options.silent) {
        console.error('No vean.json found. Run "vean init" first.');
      }
      process.exit(1);
    }

    // Handle --view mode (show source code without adding)
    if (options.view) {
      for (const componentName of options.components) {
        if (!options.silent) {
          console.log(`\n=== ${componentName} ===\n`);
        }
        const item = await fetchRegistryItem(componentName, config);
        if (!item) {
          console.error(`  Component "${componentName}" not found.`);
          continue;
        }
        if (item.description && !options.silent) {
          console.log(`  ${item.description}\n`);
        }
        for (const file of item.files ?? []) {
          console.log(`  ── ${file.path} ──`);
          if (file.content) {
            const lines = file.content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              console.log(`  ${String(i + 1).padStart(4)} │ ${lines[i]}`);
            }
          }
          console.log();
        }
      }
      return;
    }

    // Confirm (unless --yes)
    if (!options.yes && !options.silent && !options.dryRun && !options.diff) {
      console.log(`Adding: ${componentList.join(', ')}`);
      console.log(`  To: ${config.resolvedPaths.ui}`);
      console.log();
    }

    await addComponents(componentList, config, {
      overwrite: options.overwrite,
      path: options.path,
      dryRun: options.dryRun,
      diff: options.diff,
      silent: options.silent
    });
  })
  .on('--help', () => {
    console.log('');
    console.log('  Component naming:');
    console.log('    Core ui components can be referenced without a prefix: "vean add button".');
    console.log('    Other packages require the namespace prefix: "vean add admin/layout".');
    console.log('    Run "vean list" to see all available components.');
  });
