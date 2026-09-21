/**
 * File discovery for `vean migrate`: which files are rewritable, and which
 * directories/files are never touched.
 */
import fs from 'fs/promises';
import path from 'path';

/** Directories never traversed, at any depth. */
export const SKIP_DIRECTORIES: ReadonlySet<string> = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.nuxt',
  '.output',
  '.next',
  '.svelte-kit',
  'coverage',
  '.temp',
  '.ubean',
  '.codegraph',
  '.vite-hooks',
  '.cache',
  '.turbo',
  'vendor'
]);

/** Extensions treated as text and eligible for rewriting. */
export const TEXT_EXTENSIONS: ReadonlySet<string> = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.vue',
  '.svelte',
  '.astro',
  '.md',
  '.mdx',
  '.json',
  '.jsonc',
  '.json5',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.pcss',
  '.postcss',
  '.html',
  '.htm',
  '.yaml',
  '.yml',
  '.txt',
  '.sh',
  '.bash',
  '.toml'
]);

/** Lock files are never rewritten — they must be deleted and reinstalled. */
export const SKIP_FILES: ReadonlySet<string> = new Set([
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'bun.lock',
  'bun.lockb',
  'npm-shrinkwrap.json'
]);

export const MAX_FILE_BYTES = 4 * 1024 * 1024;

/** Dot-directories such as `.github/` are traversed; only `SKIP_DIRECTORIES` are not. */
function isRewritableName(name: string): boolean {
  return !SKIP_FILES.has(name) && TEXT_EXTENSIONS.has(path.extname(name).toLowerCase());
}

/** Unreadable directories (permissions, races) count as empty. */
async function readEntries(dir: string) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    // Unreadable directory (permissions, races) — treat it as empty.
    return [];
  }
}

/** Empty and oversized files are skipped; sizes are read lazily so the walk stays cheap. */
async function isRewritableSize(file: string): Promise<boolean> {
  try {
    const stats = await fs.stat(file);

    return stats.size > 0 && stats.size <= MAX_FILE_BYTES;
  } catch {
    return false;
  }
}

/**
 * Absolute paths of every rewritable text file under `root`, sorted so reports
 * are stable. Symlinked directories are not followed (they are not reported as
 * directories by `readdir`), which also rules out traversal cycles.
 */
export async function collectTextFiles(root: string): Promise<string[]> {
  const entries = await readEntries(root);
  const directories = entries.filter(entry => entry.isDirectory() && !SKIP_DIRECTORIES.has(entry.name));
  const candidates = entries.filter(entry => entry.isFile() && isRewritableName(entry.name));

  const [nested, files] = await Promise.all([
    Promise.all(directories.map(entry => collectTextFiles(path.join(root, entry.name)))),
    Promise.all(
      candidates.map(async entry => {
        const file = path.join(root, entry.name);

        return (await isRewritableSize(file)) ? file : null;
      })
    )
  ]);

  return [...files.filter(file => file !== null), ...nested.flat()].sort();
}
