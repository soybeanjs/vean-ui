import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { build } from 'esbuild';
import type { Plugin } from 'esbuild';
import { buildFixtureSource, resolvePublishedSpecifier } from './size';
import type { SizeMetrics, WorkspacePackageManifest } from './size';

/**
 * Measurement I/O for `sui size`: reading build output, packing a publishable
 * package, and bundling a consumer-shaped fixture. The rules that turn these
 * numbers into verdicts live in `./size`.
 *
 * Bundle measurements deliberately resolve through each workspace package's
 * `publishConfig.exports` map rather than the in-repo `exports` map, because the
 * latter points at `./src/*.ts`; measuring source instead of the published
 * artifact would silently overstate every number.
 */

const sourceSegment = `${path.sep}src${path.sep}`;

const toRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const readStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export function readManifest(packageDir: string): WorkspacePackageManifest | null {
  const manifestPath = path.join(packageDir, 'package.json');

  if (!existsSync(manifestPath)) {
    return null;
  }

  const raw = toRecord(JSON.parse(readFileSync(manifestPath, 'utf8')));
  const name = typeof raw.name === 'string' ? raw.name : null;

  if (!name) {
    return null;
  }

  return {
    dependencies: readStringArray(Object.keys(toRecord(raw.dependencies))),
    dir: packageDir,
    // `publishConfig.exports` is what npm consumers resolve; the top-level
    // `exports` map is the in-repo (source) surface for aria and ui.
    exports: toRecord(toRecord(raw.publishConfig).exports ?? raw.exports),
    name,
    peerDependencies: readStringArray(Object.keys(toRecord(raw.peerDependencies)))
  };
}

export function discoverWorkspacePackages(rootDir: string): WorkspacePackageManifest[] {
  const packagesDir = path.join(rootDir, 'packages');

  if (!existsSync(packagesDir)) {
    return [];
  }

  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .flatMap(entry => {
      const manifest = readManifest(path.join(packagesDir, entry.name));

      return manifest ? [manifest] : [];
    });
}

export function measureBuffer(buffer: Buffer): SizeMetrics {
  return {
    brotli: brotliCompressSync(buffer, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length,
    gzip: gzipSync(buffer, { level: 9 }).length,
    raw: buffer.length
  };
}

export function measureFileMetrics(filePath: string): SizeMetrics {
  return measureBuffer(readFileSync(filePath));
}

const runCommand = (command: string, args: readonly string[], cwd: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, [...args], { cwd, env: process.env, stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';

    child.stderr?.on('data', chunk => {
      stderr += String(chunk);
    });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}: ${stderr.trim()}`));
    });
  });

/**
 * Publish-artifact size. `pnpm pack` normalizes mtimes, so the tarball is
 * byte-identical across runs of the same build (verified: stable sha256), which
 * makes it safe to compare across branches.
 */
export async function measurePackMetrics(options: { cacheDir: string; packageDir: string }): Promise<SizeMetrics> {
  const destination = path.join(options.cacheDir, 'pack');

  rmSync(destination, { force: true, recursive: true });
  mkdirSync(destination, { recursive: true });

  await runCommand('pnpm', ['pack', '--pack-destination', destination], options.packageDir);

  const archives = readdirSync(destination).filter(fileName => fileName.endsWith('.tgz'));

  if (archives.length !== 1) {
    throw new Error(`expected exactly one tarball from pnpm pack, found ${archives.length} in ${destination}`);
  }

  return { raw: statSync(path.join(destination, archives[0])).size };
}

const isExternalSpecifier = (specifier: string, external: readonly string[]): boolean =>
  external.some(entry => specifier === entry || specifier.startsWith(`${entry}/`));

const createPublishedShapePlugin = (
  manifests: readonly WorkspacePackageManifest[],
  external: readonly string[]
): Plugin => ({
  name: 'vean-ui-published-shape',
  setup(context) {
    context.onResolve({ filter: /^@vean\// }, args => {
      if (isExternalSpecifier(args.path, external)) {
        return null;
      }

      const manifest = manifests.find(entry => args.path === entry.name || args.path.startsWith(`${entry.name}/`));

      if (!manifest) {
        return null;
      }

      const target = resolvePublishedSpecifier(manifest, args.path);

      if (!target) {
        return {
          errors: [
            {
              text: `"${args.path}" is not part of the published surface of ${manifest.name} (publishConfig.exports). Add it to the exports map or drop the import.`
            }
          ]
        };
      }

      if (target.includes(sourceSegment) || target.endsWith('.ts')) {
        return {
          errors: [
            { text: `"${args.path}" resolved to source (${target}); size checks must measure published output.` }
          ]
        };
      }

      if (!existsSync(target)) {
        return {
          errors: [{ text: `"${args.path}" resolved to ${target}, which does not exist. Run \`pnpm build\` first.` }]
        };
      }

      return { path: target };
    });
  }
});

export async function measureBundleMetrics(options: {
  entryPath: string;
  external: readonly string[];
  importClause: string | null;
  manifests: readonly WorkspacePackageManifest[];
  rootDir: string;
}): Promise<SizeMetrics> {
  const result = await build({
    bundle: true,
    external: [...options.external],
    format: 'esm',
    legalComments: 'none',
    logLevel: 'silent',
    minify: true,
    outfile: 'size-fixture.js',
    platform: 'browser',
    plugins: [createPublishedShapePlugin(options.manifests, options.external)],
    stdin: {
      contents: buildFixtureSource({ entryPath: options.entryPath, importClause: options.importClause }),
      loader: 'js',
      resolveDir: options.rootDir,
      sourcefile: 'size-fixture-entry.js'
    },
    target: 'es2020',
    treeShaking: true,
    write: false
  });
  const output = result.outputFiles?.[0];

  if (!output) {
    throw new Error(`esbuild produced no output for ${options.entryPath}`);
  }

  return measureBuffer(Buffer.from(output.contents));
}

export function readEsbuildVersion(): string {
  try {
    const require = createRequire(import.meta.url);
    const manifest = toRecord(JSON.parse(readFileSync(require.resolve('esbuild/package.json'), 'utf8')));

    return typeof manifest.version === 'string' ? manifest.version : 'unknown';
  } catch {
    return 'unknown';
  }
}

export function readGitCommit(rootDir: string): Promise<string | null> {
  const child = spawn('git', ['rev-parse', '--short', 'HEAD'], { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] });
  let stdout = '';

  child.stdout?.on('data', chunk => {
    stdout += String(chunk);
  });

  return new Promise(resolve => {
    child.on('error', () => resolve(null));
    child.on('close', code => resolve(code === 0 ? stdout.trim() || null : null));
  });
}
