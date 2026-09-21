import fs from 'fs/promises';
import path from 'path';
import * as v from 'valibot';
import { rawConfigSchema, configSchema } from '../registry/config';
import type { Config } from '../registry/config';

export type { Config };

/**
 * Walk up from `cwd` to find the nearest `vean.json`.
 */
export async function findConfigFile(cwd: string): Promise<{ configPath: string; configDir: string } | null> {
  let dir = path.resolve(cwd);
  const root = path.parse(dir).root;

  while (true) {
    const configPath = path.join(dir, 'vean.json');
    try {
      await fs.access(configPath);
      return { configPath, configDir: dir };
    } catch {}

    if (dir === root) break;
    dir = path.dirname(dir);
  }

  return null;
}

/**
 * Detect if the project is a monorepo.
 */
export async function detectMonorepo(cwd: string): Promise<boolean> {
  let dir = path.resolve(cwd);
  const root = path.parse(dir).root;

  while (true) {
    try {
      await fs.access(path.join(dir, 'pnpm-workspace.yaml'));
      return true;
    } catch {}

    try {
      const pkg = JSON.parse(await fs.readFile(path.join(dir, 'package.json'), 'utf-8'));
      if (pkg.workspaces) return true;
    } catch {}

    if (dir === root) break;
    dir = path.dirname(dir);
  }

  return false;
}

/**
 * Find and read vean.json.
 */
export async function getConfig(cwd: string): Promise<Config | null> {
  const found = await findConfigFile(cwd);
  if (!found) return null;

  const raw = await fs.readFile(found.configPath, 'utf-8');
  const parsed = JSON.parse(raw);
  const rawConfig = v.parse(rawConfigSchema, parsed);

  return resolveConfigPaths(found.configDir, rawConfig);
}

/**
 * Resolve an import alias (shadcn-vue style, EC-E03) to an absolute output
 * directory.
 *
 * Resolution order:
 *   1. `compilerOptions.paths` in `tsconfig.json` / `jsconfig.json`
 *      (e.g. `#admin/*` → `./src/admin/*`).
 *   2. Convention fallback: `#ui` / `@/ui` → `src/ui`; explicit relative
 *      (`./src/ui`, `src/ui`) used as-is; bare names → `src/<name>`.
 */
export async function resolveAliasDir(cwd: string, alias: string | undefined): Promise<string | null> {
  if (!alias) return null;

  // 1) tsconfig / jsconfig paths
  for (const file of ['tsconfig.json', 'jsconfig.json']) {
    try {
      const raw = JSON.parse(await fs.readFile(path.join(cwd, file), 'utf-8')) as {
        compilerOptions?: { paths?: Record<string, string[]> };
      };
      const paths = raw?.compilerOptions?.paths;
      const target = paths?.[`${alias}/*`]?.[0] ?? paths?.[alias]?.[0];

      if (typeof target === 'string') {
        return path.resolve(cwd, target.replace(/^\.\//, '').replace(/\*$/, ''));
      }
    } catch {
      // Ignore unreadable configs
    }
  }

  // 2) Convention fallback
  const cleaned = alias
    .replace(/^[#@]\//, '')
    .replace(/^[#@]/, '')
    .replace(/^\//, '');
  if (!cleaned) return null;

  if (cleaned.startsWith('.') || cleaned.startsWith('src/') || path.isAbsolute(cleaned)) {
    return path.resolve(cwd, cleaned);
  }

  return path.resolve(cwd, 'src', cleaned);
}

/**
 * Resolve uiDir / per-package dirs to absolute paths. Each package alias maps
 * to an output directory; `ui` always resolves (default `src/ui`).
 */
export async function resolveConfigPaths(cwd: string, config: v.InferOutput<typeof rawConfigSchema>): Promise<Config> {
  const aliases = config.aliases ?? {};

  const packages: Record<string, string> = {};

  const uiDir = (await resolveAliasDir(cwd, aliases.ui)) ?? path.resolve(cwd, 'src/ui');
  packages.ui = uiDir;

  for (const [pkg, alias] of Object.entries(aliases)) {
    if (pkg === 'ui') continue;

    const dir = (await resolveAliasDir(cwd, alias)) ?? path.resolve(cwd, `src/${pkg}`);
    packages[pkg] = dir;
  }

  return v.parse(configSchema, {
    ...config,
    resolvedPaths: {
      cwd,
      ui: uiDir,
      packages
    }
  });
}

/**
 * Create a minimal default config.
 */
export async function createDefaultConfig(
  cwd: string,
  overrides?: Partial<v.InferOutput<typeof rawConfigSchema>>
): Promise<Config> {
  const raw: v.InferOutput<typeof rawConfigSchema> = {
    iconLibrary: 'lucide',
    uno: {
      base: 'zinc',
      primary: 'indigo',
      radius: 'md'
    },
    font: {},
    aliases: {
      ui: '#ui'
    },
    registries: {},
    ...overrides
  };

  return resolveConfigPaths(cwd, raw);
}

/**
 * Write vean.json to disk.
 */
export async function writeConfig(cwd: string, config: Config): Promise<void> {
  const configPath = path.join(cwd, 'vean.json');
  const { resolvedPaths: _, ...rest } = config;
  await fs.writeFile(configPath, JSON.stringify(rest, null, 2), 'utf-8');
}
