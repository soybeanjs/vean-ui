import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { getConfig } from '../utils/get-config';
import { fetchRegistryCatalog } from '../registry/fetcher';
import { readRegistryWithIncludes } from '../registry/loader';
import type { RegistryItem } from '../registry/schema';
import { searchRegistry } from '../registry/search';

export const searchOptionsSchema = v.object({
  query: v.optional(v.string()),
  cwd: v.string(),
  all: v.boolean(),
  type: v.optional(v.string()),
  package: v.optional(v.string()),
  limit: v.optional(v.number()),
  offset: v.optional(v.number())
});

export const search = new Command()
  .name('search')
  .description('search for components in the registry')
  .argument('[query]', 'search query')
  .option('-a, --all', 'show all components', false)
  .option('-t, --type <type>', 'filter by type (component, hook, style, lib, theme, base, font, block)')
  .option('--package <name>', 'filter by package namespace (ui, admin, chart)')
  .option('-l, --limit <limit>', 'max results to show', '50')
  .option('-o, --offset <offset>', 'offset for pagination', '0')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (query: string | undefined, opts) => {
    const options = v.parse(searchOptionsSchema, {
      query,
      cwd: path.resolve(opts.cwd),
      all: opts.all,
      type: opts.type,
      package: opts.package,
      limit: opts.limit ? Number.parseInt(opts.limit, 10) : undefined,
      offset: opts.offset ? Number.parseInt(opts.offset, 10) : undefined
    });

    const config = await getConfig(options.cwd);

    if (!config) {
      console.error('No vean.json found. Run "vean init" first.');
      process.exit(1);
    }

    const registryFile = path.join(config.resolvedPaths.cwd, 'registry.json');

    let items: RegistryItem[] = [];

    try {
      const result = await readRegistryWithIncludes(registryFile, {
        cwd: config.resolvedPaths.cwd
      });
      items = result.registry.items;
    } catch {
      // No local registry, try remote
    }

    if (items.length === 0) {
      console.log('  Fetching registry catalog from veanui.com...');
      items = await fetchRegistryCatalog(config);

      if (items.length === 0) {
        console.log('  No components found in remote registry either.');
        console.log('  Run "vean init" first to create vean.json, then try again.');
        console.log();
        process.exit(0);
      }
    }

    // Filter by package (EC-E04) — pre-filter items before the search engine.
    let filtered: RegistryItem[];
    if (options.package) {
      filtered = items.filter(item => {
        const pkg = item.package ?? (item.name.includes('/') ? item.name.split('/')[0] : 'ui');
        return pkg === options.package;
      });
    } else {
      filtered = items;
    }

    // Filter by query using advanced search engine
    let searchResult: ReturnType<typeof searchRegistry> | null = null;

    if (!options.all && options.query) {
      searchResult = searchRegistry(filtered, {
        query: options.query,
        type: options.type,
        sortBy: 'relevance',
        limit: options.limit ?? 50,
        offset: options.offset ?? 0
      });
      filtered = searchResult.items;
    } else if (options.type || options.limit || options.offset) {
      // Apply type filter and pagination even without query
      searchResult = searchRegistry(filtered, {
        type: options.type,
        sortBy: 'name',
        limit: options.limit ?? 50,
        offset: options.offset ?? 0
      });
      filtered = searchResult.items;
    }

    if (filtered.length === 0) {
      const filters: string[] = [];
      if (options.query) filters.push(`"${options.query}"`);
      if (options.type) filters.push(`type: ${options.type}`);
      console.log(`\n  No components found${filters.length ? ` for ${filters.join(', ')}` : ''}.`);
      console.log();
      process.exit(0);
    }

    console.log();
    const summaryParts: string[] = [`Found ${searchResult?.total ?? filtered.length} component(s)`];
    if (options.query) summaryParts.push(`matching "${options.query}"`);
    if (options.type) summaryParts.push(`(type: ${options.type})`);
    if (options.package) summaryParts.push(`(package: ${options.package})`);
    console.log(`  ${summaryParts.join(' ')}`);
    if (searchResult && searchResult.total > filtered.length) {
      console.log(
        `  Showing ${searchResult.offset + 1}-${searchResult.offset + filtered.length} of ${searchResult.total}`
      );
    }
    console.log();

    for (const item of filtered) {
      const type = item.type.replace('registry:', '');
      const depCount = item.registryDependencies?.length ?? 0;

      const lineParts: string[] = [item.name.padEnd(24), type.padEnd(12)];
      if (depCount) lineParts.push(`deps: ${depCount}`);

      // Show relevance score when query is specified
      if (options.query) {
        const label = getRelevanceLabel(item.name, options.query);
        if (label) lineParts.push(label);
      }

      console.log(`  ${lineParts.join(' ')}`);
      if (item.description) {
        console.log(`  ${''.padEnd(24)} ${item.description.slice(0, 60)}`);
      }
    }

    console.log();
    console.log(`  Run "vean add <name>" to add a component.`);
    console.log(`  Run "vean view <name>" to see its source code.`);
    console.log();
  });

/**
 * Get a relevance label for display.
 */
function getRelevanceLabel(name: string, query: string): string {
  const normalizedName = name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (normalizedName === normalizedQuery) return '[exact]';
  if (normalizedName.startsWith(normalizedQuery)) return '[prefix]';
  if (normalizedName.includes(normalizedQuery)) return '[match]';

  // Check for fuzzy match
  const distance = levenshteinDistanceSimple(normalizedName, normalizedQuery);
  if (distance <= 2) return `[~${distance}]`;

  return '';
}

/**
 * Simple Levenshtein distance for display labeling.
 */
function levenshteinDistanceSimple(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  const dp: number[][] = Array(aLen + 1)
    .fill(null)
    .map(() => Array(bLen + 1).fill(0));

  for (let i = 0; i <= aLen; i++) dp[i][0] = i;
  for (let j = 0; j <= bLen; j++) dp[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[aLen][bLen];
}
