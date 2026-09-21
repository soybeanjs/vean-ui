import path from 'path';
import * as v from 'valibot';
import { THEME_RADIUS } from '@vean/theme';
import { Command } from 'commander';
import { PRESET_BASE_COLORS, PRESET_PRIMARY_COLORS, PRESET_RADII, PRESET_ICON_LIBRARIES } from '../registry/config';
import { getConfig } from '../utils/get-config';
import { getProjectInfo } from '../utils/get-project-info';

/**
 * the preset seed → the length it resolves to, derived from the engine table so
 * the CLI cannot drift from `THEME_RADIUS`. `none` is a CLI-only extra: it is a
 * radius a project may set, but it is not a seed the engine's ladder knows.
 */
const RADIUS_LABEL_MAP: Record<string, string> = { none: '0', ...THEME_RADIUS };

export const infoOptionsSchema = v.object({
  cwd: v.string(),
  json: v.boolean()
});

export const info = new Command()
  .name('info')
  .description('show project and registry information')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('--json', 'output as JSON', false)
  .action(async opts => {
    const options = v.parse(infoOptionsSchema, {
      cwd: path.resolve(opts.cwd),
      json: opts.json
    });

    // Detect project
    const projectInfo = await getProjectInfo(options.cwd);
    const config = await getConfig(options.cwd);

    if (options.json) {
      console.log(
        JSON.stringify(
          {
            project: projectInfo,
            config,
            presets: {
              base: PRESET_BASE_COLORS,
              primary: PRESET_PRIMARY_COLORS,
              radius: PRESET_RADII,
              icons: PRESET_ICON_LIBRARIES
            }
          },
          null,
          2
        )
      );

      return;
    }

    console.log();
    console.log('  Project Info');
    console.log('  ────────────');

    if (projectInfo) {
      console.log(`  Framework:      ${projectInfo.framework}`);
      console.log(`  TypeScript:     ${projectInfo.usesTypeScript ? 'yes' : 'no'}`);
      console.log(`  UnoCSS:         ${projectInfo.usesUnoCSS ? 'yes' : 'no'}`);
      console.log(`  Package mgr:    ${projectInfo.packageManager}`);
    }

    console.log();

    if (config) {
      console.log('  vean.json Config');
      console.log('  ─────────────────');

      console.log(`  Base color:     ${config.uno.base}`);
      console.log(`  Primary color:  ${config.uno.primary}`);
      console.log(`  Size:           ${config.uno.size ?? 'md'}`);
      console.log(
        `  Radius:         ${config.uno.radius} (${RADIUS_LABEL_MAP[config.uno.radius] ?? config.uno.radius})`
      );
      console.log(`  Icon library:   ${config.iconLibrary}`);

      if (config.font.sans) {
        console.log(`  Font sans:      ${config.font.sans}`);
      }
      if (config.font.heading) {
        console.log(`  Font heading:   ${config.font.heading}`);
      }

      if (config.registries && Object.keys(config.registries).length > 0) {
        console.log();
        console.log('  Registries');

        for (const [name, registryUrl] of Object.entries(config.registries)) {
          console.log(`    ${name} -> ${registryUrl}`);
        }
      }

      console.log();
      console.log('  Paths');
      for (const [pkg, dir] of Object.entries(config.resolvedPaths.packages)) {
        const alias = config.aliases?.[pkg] ?? (pkg === 'ui' ? '#ui' : `#${pkg}`);
        console.log(`    ${pkg.padEnd(8)} ${alias.padEnd(10)} → ${dir}`);
      }
    } else {
      console.log('  No vean.json found. Run "vean init" to create one.');
    }

    console.log();
    console.log('  Available Preset Values');
    console.log('  ───────────────────────');
    console.log(`  Base:       ${PRESET_BASE_COLORS.join(', ')}`);
    console.log(`  Primary:    ${PRESET_PRIMARY_COLORS.join(', ')}`);
    console.log(`  Radius:     ${PRESET_RADII.join(', ')}`);
    console.log(`  Icons:      ${PRESET_ICON_LIBRARIES.join(', ')}`);
    console.log();
  });
