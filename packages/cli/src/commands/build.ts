import fs from 'fs/promises';
import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { expandRegistryItemFiles } from '../utils/add-components';
import { readRegistryWithIncludes, createRegistryItem, createRegistryCatalog } from '../registry/loader';
import { registryItemSchema } from '../registry/schema';

export const buildOptionsSchema = v.object({
  cwd: v.string(),
  registryFile: v.string(),
  outputDir: v.string()
});

export const build = new Command()
  .name('build')
  .description('build components for the vean registry')
  .argument('[registry]', 'path to registry.json file', './registry.json')
  .option('-o, --output <path>', 'destination directory for json files', './public/r')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (registryFile: string, opts) => {
    const options = v.parse(buildOptionsSchema, {
      cwd: path.resolve(opts.cwd),
      registryFile,
      outputDir: opts.output
    });

    const resolvedRegistryFile = path.resolve(options.cwd, options.registryFile);

    try {
      await fs.access(resolvedRegistryFile);
    } catch {
      console.error(
        `Registry file not found: ${resolvedRegistryFile}\n` +
          `Run "vean init" first to create a project, then create your registry.json.`
      );
      process.exit(1);
    }

    const registryResult = await readRegistryWithIncludes(resolvedRegistryFile, {
      cwd: options.cwd
    });

    const registryRootDir = registryResult.usesInclude
      ? path.dirname(path.resolve(options.cwd, options.registryFile))
      : options.cwd;

    // Ensure output directory exists
    await fs.mkdir(options.outputDir, { recursive: true });

    let builtCount = 0;

    for (const registryItem of registryResult.registry.items) {
      console.log(`  Building ${registryItem.name}...`);

      const itemWithContent = await createRegistryItem(registryItem, registryRootDir);
      const expandedFiles = itemWithContent.files?.length ? await expandRegistryItemFiles(itemWithContent.files) : [];

      if (expandedFiles.length > 0) {
        itemWithContent.files = expandedFiles;
      }

      // Validate the final output
      v.parse(registryItemSchema, itemWithContent);

      // Namespaced names (e.g. `ui/button`) are written into subdirectories so
      // the generated `public/r/` mirrors the package layout (EC-E02).
      const outputPath = path.resolve(options.outputDir, `${itemWithContent.name}.json`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(itemWithContent, null, 2), 'utf-8');

      builtCount++;
    }

    // Write registry catalog
    const catalog = createRegistryCatalog(registryResult, registryRootDir);
    await fs.writeFile(path.resolve(options.outputDir, 'registry.json'), JSON.stringify(catalog, null, 2), 'utf-8');

    console.log(`\n✔ Built ${builtCount} registry items → ${options.outputDir}/`);
  });
