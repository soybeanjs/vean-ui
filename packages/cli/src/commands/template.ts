import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { listAllTemplates, scaffoldFromTemplate, getTemplate } from '../templates';
import type { FrameworkType } from '../templates';

/** Framework flag values accepted by `--framework` (ADR-010). */
type FrameworkFlag = 'vite' | 'nuxt';

/** Map a `--framework` value to its internal `FrameworkType` template name. */
const FRAMEWORK_TO_TEMPLATE: Record<FrameworkFlag, FrameworkType> = {
  vite: 'vue-vite',
  nuxt: 'nuxt'
};

export const templateOptionsSchema = v.object({
  name: v.optional(v.string()),
  framework: v.optional(v.picklist(['vite', 'nuxt'])),
  cwd: v.string(),
  output: v.optional(v.string()),
  list: v.boolean()
});

export const template = new Command()
  .name('template')
  .description('list or scaffold project templates')
  .argument('[name]', 'template name to scaffold (vue-vite, nuxt)')
  .option('-l, --list', 'list available templates', false)
  .option('-o, --output <dir>', 'output directory for scaffolded project')
  .option('-f, --framework <framework>', 'scaffold by framework (vite, nuxt)')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (name: string | undefined, opts) => {
    const options = v.parse(templateOptionsSchema, {
      name,
      framework: opts.framework,
      cwd: path.resolve(opts.cwd),
      output: opts.output,
      list: opts.list
    });

    // --framework takes precedence over the [name] positional (ADR-010).
    const templateName = options.framework ? FRAMEWORK_TO_TEMPLATE[options.framework] : options.name;

    // List mode — triggered by --list or when no template is selected.
    if (options.list || !templateName) {
      const templates = listAllTemplates();

      console.log();
      console.log('  Available project templates:');
      console.log();
      console.log('  Name          Framework         Description');
      console.log('  ────          ─────────         ───────────');

      for (const tpl of templates) {
        console.log(`  ${tpl.name.padEnd(14)} ${tpl.framework.padEnd(17)} ${tpl.description}`);
      }

      console.log();
      console.log('  Usage: vean template <name> [--output <dir>]');
      console.log('         vean template --framework <vite|nuxt> [--output <dir>]');
      console.log();

      if (templateName) {
        showTemplateDetails(templateName);
      }

      return;
    }

    // Scaffold mode
    const resolvedTemplate = templateName ?? 'vue-vite';
    const projectName: string = options.output ?? resolvedTemplate;

    console.log();
    console.log(`  Scaffolding project: ${projectName}`);
    console.log(`  Template: ${resolvedTemplate}`);

    const outputDir = path.join(options.cwd, projectName);

    try {
      await scaffoldFromTemplate(outputDir, resolvedTemplate, { projectName });

      console.log();
      console.log(`  ✔ Project scaffolded at: ${outputDir}`);
      console.log();

      // Show next steps
      console.log('  Next steps:');
      console.log(`    cd ${projectName}`);
      console.log('    pnpm install');
      console.log('    vean init');
      console.log('    vean add <component>');
      console.log();
    } catch (error) {
      console.error(`  ✖ Failed to scaffold project: ${(error as Error).message}`);
      process.exit(1);
    }
  });

/**
 * Show detailed information about a specific template (read from template definitions).
 */
function showTemplateDetails(name: string): void {
  const tpl = getTemplate(name as FrameworkType);
  if (!tpl) return;

  console.log();
  console.log(`  ${tpl.description}`);
  console.log(`  Dependencies: ${Object.keys(tpl.dependencies).join(', ') || 'none'}`);
  console.log(`  Dev Dependencies: ${Object.keys(tpl.devDependencies).join(', ') || 'none'}`);
  console.log(`  Scripts: ${Object.keys(tpl.scripts).join(', ')}`);
  console.log();
}
