import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { BUILTIN_REGISTRIES, DEFAULT_REGISTRY_NAMESPACE } from '../registry/constants';
import { getConfig } from '../utils/get-config';
import { scanInstalledComponents } from '../utils/scan-installed';
import { fetchRegistryCatalog, fetchRegistryItem } from '../registry/fetcher';
import { getItemBasename } from '../registry/loader';

type TextContent = { type: 'text'; text: string };

function createTextResult(text: string, isError = false): CallToolResult {
  return {
    content: [{ type: 'text', text } satisfies TextContent],
    ...(isError ? { isError: true } : {})
  };
}

export const TOOLS: Tool[] = [
  {
    name: 'get_project_registries',
    description: 'List configured registry namespaces from vean.json.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'list_items_in_registries',
    description: 'List registry items from all or selected registries.',
    inputSchema: {
      type: 'object',
      properties: {
        registries: {
          type: 'array',
          items: { type: 'string' }
        },
        limit: { type: 'number' },
        offset: { type: 'number' }
      }
    }
  },
  {
    name: 'search_items_in_registries',
    description: 'Search registry items by name, description, or category.',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string' },
        registries: {
          type: 'array',
          items: { type: 'string' }
        },
        limit: { type: 'number' },
        offset: { type: 'number' }
      }
    }
  },
  {
    name: 'view_items_in_registries',
    description: 'View full registry item metadata and file contents.',
    inputSchema: {
      type: 'object',
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  },
  {
    name: 'get_item_examples_from_registries',
    description: 'Return implementation code for items matching an example-style query.',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string' },
        registries: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  },
  {
    name: 'get_add_command_for_items',
    description: 'Return the vean add command for the given items.',
    inputSchema: {
      type: 'object',
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  },
  {
    name: 'get_audit_checklist',
    description: 'Return a short post-generation checklist for Vean projects.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'explain_gap',
    description: "Compare a project's installed components against the registry and suggest missing ones.",
    inputSchema: {
      type: 'object',
      properties: {
        registries: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
];

function getItemRegistry(item: Awaited<ReturnType<typeof fetchRegistryCatalog>>[number]): string {
  const namespace = item.meta?.registryNamespace;

  return typeof namespace === 'string' ? namespace : DEFAULT_REGISTRY_NAMESPACE;
}

function sliceResults<T>(items: T[], limit?: number, offset?: number): T[] {
  const start = Math.max(offset ?? 0, 0);

  if (limit === 0) {
    return items.slice(start);
  }

  const end = start + Math.max(limit ?? 100, 0);
  return items.slice(start, end);
}

function parseStringArray(value: unknown): string[] | null {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    return null;
  }

  return value;
}

function parseNumber(value: unknown, fallback: number): number | null {
  if (value === undefined) {
    return fallback;
  }

  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

async function resolveConfig() {
  return getConfig(process.cwd());
}

/** Max missing-component names listed in the gap report. */
const MAX_MISSING_LISTED = 50;

/** Max component names in the suggested `vean add` batch. */
const MAX_ADD_BATCH = 5;

type GapItem = { name: string; description?: string };

/**
 * Build the `explain_gap` text report from the installed set and the missing
 * list. Pure — no I/O — so it can be unit-tested without a registry server.
 */
function formatGapReport(installed: string[], missing: GapItem[]): string {
  if (missing.length === 0) {
    return `All ${installed.length} registry UI component(s) appear to be installed.`;
  }

  const lines = [
    `Installed: ${installed.length} component(s).`,
    `Missing from registry: ${missing.length} component(s).`,
    '',
    ...missing
      .slice(0, MAX_MISSING_LISTED)
      .map(item => `- ${item.name}${item.description ? ` — ${item.description}` : ''}`)
  ];

  if (missing.length > MAX_MISSING_LISTED) {
    lines.push(`... and ${missing.length - MAX_MISSING_LISTED} more.`);
  }

  const addBatch = missing
    .slice(0, MAX_ADD_BATCH)
    .map(item => item.name)
    .join(' ');
  lines.push(
    '',
    `Add missing components:`,
    `  npx @vean/cli@latest add ${addBatch}${missing.length > MAX_ADD_BATCH ? ' ...' : ''}`
  );

  return lines.join('\n');
}

async function getCatalog(registries?: string[]) {
  const config = await resolveConfig();
  const catalog = await fetchRegistryCatalog(config);

  if (!registries?.length) {
    return catalog;
  }

  return catalog.filter(item => registries.includes(getItemRegistry(item)));
}

export async function handleToolCall(name: string, args: Record<string, unknown>): Promise<CallToolResult> {
  switch (name) {
    case 'get_project_registries': {
      const config = await resolveConfig();
      const registries = {
        ...BUILTIN_REGISTRIES,
        ...config?.registries
      };

      return createTextResult(Object.keys(registries).join('\n') || DEFAULT_REGISTRY_NAMESPACE);
    }

    case 'list_items_in_registries': {
      const registries = parseStringArray(args.registries);
      const limit = parseNumber(args.limit, 100);
      const offset = parseNumber(args.offset, 0);

      if (!registries || limit === null || offset === null) {
        return createTextResult('Invalid arguments for list_items_in_registries.', true);
      }

      const items = sliceResults(await getCatalog(registries), limit, offset);
      const text = items
        .map(item => `- ${item.name} (${item.type})${item.description ? `: ${item.description}` : ''}`)
        .join('\n');

      return createTextResult(text || 'No items found.');
    }

    case 'search_items_in_registries': {
      const query = typeof args.query === 'string' ? args.query.trim().toLowerCase() : '';
      const registries = parseStringArray(args.registries);
      const limit = parseNumber(args.limit, 20);
      const offset = parseNumber(args.offset, 0);

      if (!query || !registries || limit === null || offset === null) {
        return createTextResult('Invalid arguments for search_items_in_registries.', true);
      }

      const items = (await getCatalog(registries)).filter(item => {
        const haystack = [item.name, item.description ?? '', ...(item.categories ?? [])].join(' ').toLowerCase();
        return haystack.includes(query);
      });

      const text = sliceResults(items, limit, offset)
        .map(item => `- ${item.name} (${item.type})${item.description ? `: ${item.description}` : ''}`)
        .join('\n');

      return createTextResult(text || `No items found for "${query}".`);
    }

    case 'view_items_in_registries': {
      const items = parseStringArray(args.items);

      if (!items?.length) {
        return createTextResult('Invalid arguments for view_items_in_registries.', true);
      }

      const config = await resolveConfig();
      const results: string[] = [];

      for (const itemName of items) {
        const item = await fetchRegistryItem(itemName, config);

        if (!item) {
          results.push(`## ${itemName}\nNot found.`);
          continue;
        }

        const files = item.files?.map(file => `### ${file.path}\n\n${file.content ?? '(no content)'}`).join('\n\n');

        results.push(
          [`## ${item.name}`, item.description ?? '', `Type: ${item.type}`, files ?? ''].filter(Boolean).join('\n\n')
        );
      }

      return createTextResult(results.join('\n\n---\n\n'));
    }

    case 'get_item_examples_from_registries': {
      const query = typeof args.query === 'string' ? args.query.trim().toLowerCase() : '';
      const registries = parseStringArray(args.registries);

      if (!query || !registries) {
        return createTextResult('Invalid arguments for get_item_examples_from_registries.', true);
      }

      const catalog = await getCatalog(registries);
      const matched = catalog.filter(
        item => item.name.toLowerCase().includes(query.replace(/\s+/g, '-')) || item.name.toLowerCase().includes(query)
      );
      const config = await resolveConfig();
      const items = await Promise.all(matched.slice(0, 5).map(item => fetchRegistryItem(item.name, config)));
      const text = items
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map(item => {
          const files = item.files?.map(file => `### ${file.path}\n\n${file.content ?? '(no content)'}`).join('\n\n');

          return [`## ${item.name}`, item.description ?? '', files ?? ''].filter(Boolean).join('\n\n');
        })
        .join('\n\n---\n\n');

      return createTextResult(text || `No examples found for "${query}".`);
    }

    case 'get_add_command_for_items': {
      const items = parseStringArray(args.items);

      if (!items?.length) {
        return createTextResult('Invalid arguments for get_add_command_for_items.', true);
      }

      return createTextResult(`npx @vean/cli@latest add ${items.join(' ')}`);
    }

    case 'get_audit_checklist': {
      return createTextResult(
        [
          '- Run vean info --json to confirm aliases and registries.',
          '- Run vean search or vean view on the added items to verify registry resolution.',
          '- Run your project typecheck/build to confirm copied files compile.',
          '- If you changed theme settings, review vean.json and uno.config.ts together.'
        ].join('\n')
      );
    }

    case 'explain_gap': {
      const registries = parseStringArray(args.registries);

      if (!registries) {
        return createTextResult('Invalid arguments for explain_gap.', true);
      }

      const config = await resolveConfig();

      if (!config) {
        return createTextResult('No vean.json found. Run `vean init` first to configure the project.');
      }

      const uiDirs = Object.values(config.resolvedPaths.packages);
      const installed = (await Promise.all(uiDirs.map(dir => scanInstalledComponents(dir)))).flat();
      const catalog = await getCatalog(registries);
      const installedSet = new Set(installed);

      // Compare against user-facing UI components only — base/theme/font items
      // don't map to a `components/<name>/` directory and would always look "missing".
      // Installed dirs are bare names; catalog items are namespaced (`ui/button`),
      // so match on the basename (EC-E04).
      const missing = catalog.filter(
        item => item.type === 'registry:ui' && !installedSet.has(getItemBasename(item.name))
      );

      return createTextResult(formatGapReport(installed, missing));
    }

    default:
      return createTextResult(`Unknown tool: ${name}`, true);
  }
}

/**
 * Start the Vean MCP server over stdio using the official
 * `@modelcontextprotocol/sdk` transport (ADR-011).
 */
export async function startMcpServer(): Promise<void> {
  const server = new Server(
    { name: 'vean', version: '1.0.0' },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: toolArgs } = request.params;
    return handleToolCall(name, toolArgs ?? {});
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
