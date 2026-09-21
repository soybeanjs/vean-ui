import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { getConfig } from '../utils/get-config';
import { fetchRegistryCatalog } from '../registry/fetcher';
import { readRegistryWithIncludes } from '../registry/loader';

export const listOptionsSchema = v.object({
  cwd: v.string(),
  package: v.optional(v.string()),
  json: v.boolean()
});

export const list = new Command()
  .name('list')
  .description('list registry items, optionally filtered by package')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('--package <name>', 'filter items by package namespace (e.g. ui, admin, chart)')
  .option('--json', 'output as JSON', false)
  .action(async opts => {
    const options = v.parse(listOptionsSchema, {
      cwd: path.resolve(opts.cwd),
      package: opts.package,
      json: opts.json
    });

    const config = await getConfig(options.cwd);

    if (!config) {
      console.error('No vean.json found. Run "vean init" first.');
      process.exit(1);
    }

    const registryFile = path.join(config.resolvedPaths.cwd, 'registry.json');
    let items: Awaited<ReturnType<typeof fetchRegistryCatalog>> = [];

    try {
      const result = await readRegistryWithIncludes(registryFile, {
        cwd: config.resolvedPaths.cwd
      });
      items = result.registry.items as Awaited<ReturnType<typeof fetchRegistryCatalog>>;
    } catch {
      // Fall back to remote
    }

    if (items.length === 0) {
      items = await fetchRegistryCatalog(config);
    }

    if (items.length === 0) {
      console.log('  No items found in registry.');
      process.exit(0);
    }

    // Filter by package (EC-E04). For items without a `package` field, infer
    // from the name: `ui/accordion` → `ui`; bare name → `ui`.
    let filtered = items;
    if (options.package) {
      filtered = items.filter(item => {
        const pkg = item.package ?? (item.name.includes('/') ? item.name.split('/')[0] : 'ui');
        return pkg === options.package;
      });
    }

    if (options.json) {
      console.log(JSON.stringify(filtered, null, 2));
      return;
    }

    // Group by package for display
    const grouped = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const pkg = item.package ?? (item.name.includes('/') ? item.name.split('/')[0] : 'ui');
      if (!grouped.has(pkg)) grouped.set(pkg, []);
      grouped.get(pkg)!.push(item);
    }

    console.log();

    for (const [pkg, pkgItems] of grouped) {
      console.log(`  Package: ${pkg} (${pkgItems.length})`);
      console.log(`  ${'─'.repeat(8 + pkg.length + String(pkgItems.length).length + 4)}`);

      for (const item of pkgItems) {
        const type = (item.type as string).replace('registry:', '');
        const depCount = (item.registryDependencies ?? []).length;
        const name = item.name;
        console.log(`    ${name.padEnd(28)} ${type.padEnd(12)}${depCount ? `deps: ${depCount}` : ''}`);
        if (item.description) {
          console.log(`    ${''.padEnd(28)} ${(item.description as string).slice(0, 60)}`);
        }
      }
      console.log();
    }

    console.log(`  ${filtered.length} item(s) total`);
    console.log(`  Run "vean list --package <name>" to filter by package.`);
    console.log();
  });
