import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

/**
 * Dependency gate.
 *
 * Enforces the v0.50.0 dependency-minimization contract:
 * 1. Banned imports — packages replaced by self-built implementations or removed engines
 *    (dnd-kit, auto-animate, internationalized, fuse.js, defu/klona/ohash, aria-hidden,
 *    standard-schema, soybeanjs hooks/utils) must never be imported from any package's
 *    `src` directory.
 *    Matching is restricted to import specifiers so self-built helpers that share a name
 *    (e.g. aria `shared/object.ts` exporting its own `defu`) do not trigger it.
 * 2. Runtime dependency allowlists — `@vean/aria` and `@vean/ui` may only
 *    take runtime dependencies from the `RUNTIME_DEP_ALLOWLISTS` table below. Heavy
 *    engines must stay out of the UI package entirely.
 *
 * Run via `pnpm check:deps` (sui check deps). Exits non-zero and lists violations on failure.
 */

const BANNED_SPECIFIER_PATTERN =
  /(?:\bfrom\s*['"]|\bimport\s*['"]|\bimport\s*\(\s*['"]|\brequire\s*\(\s*['"])(@dnd-kit|@formkit\/auto-animate|@internationalized|fuse\.js|defu|klona|ohash|aria-hidden|@standard-schema\/spec|@soybeanjs\/hooks|@soybeanjs\/utils)/;

const BANNED_DEP_PATTERN =
  /^(@dnd-kit\/.+|@formkit\/auto-animate|@internationalized\/.+|fuse\.js|defu|klona|ohash|aria-hidden|@standard-schema\/spec|@soybeanjs\/hooks|@soybeanjs\/utils)$/;

/**
 * Runtime dependency whitelists. Adding an entry is a deliberate decision: it widens
 * what every consumer of the package installs. `@tanstack/vue-table` (table engine) and
 * `markstream-vue` (UI-only optional rendering base) are admitted per those decisions.
 */
const RUNTIME_DEP_ALLOWLISTS: Readonly<Record<string, readonly string[]>> = {
  '@vean/aria': [
    '@floating-ui/dom',
    '@soybeanjs/colord',
    '@tanstack/vue-form',
    '@tanstack/vue-table',
    '@tanstack/vue-virtual',
    '@vueuse/core',
    'date-fns',
    'embla-carousel'
  ],
  '@vean/ui': ['@iconify/vue', '@soybeanjs/colord', '@soybeanjs/cva', '@vean/aria', '@vean/theme', 'markstream-vue']
};

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.vue']);
const DEP_FIELDS = ['dependencies', 'peerDependencies', 'optionalDependencies'] as const;

interface Violation {
  readonly scope: string;
  readonly detail: string;
}

interface PackageManifest {
  readonly name?: string;
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly peerDependencies?: Readonly<Record<string, string>>;
  readonly optionalDependencies?: Readonly<Record<string, string>>;
}

interface PackageInfo {
  readonly name: string;
  readonly dir: string;
  readonly manifest: PackageManifest;
}

const isSourceFile = (fileName: string): boolean => SOURCE_EXTENSIONS.has(fileName.slice(fileName.lastIndexOf('.')));

const listSourceFiles = (dir: string): readonly string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(entryPath);
    }
    return isSourceFile(entry.name) ? [entryPath] : [];
  });

const readPackages = (rootDir: string): readonly PackageInfo[] =>
  readdirSync(join(rootDir, 'packages'), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(rootDir, 'packages', entry.name, 'package.json')))
    .map(entry => {
      const dir = join(rootDir, 'packages', entry.name);
      const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as PackageManifest;
      return { name: manifest.name ?? entry.name, dir, manifest };
    });

const scanSourceImports = (rootDir: string, pkg: PackageInfo): readonly Violation[] => {
  const srcDir = join(pkg.dir, 'src');

  return listSourceFiles(srcDir).flatMap(file => {
    const lines = readFileSync(file, 'utf8').split('\n');

    return lines.flatMap((line, index) => {
      if (!BANNED_SPECIFIER_PATTERN.test(line)) {
        return [];
      }
      const specifier = line.match(BANNED_SPECIFIER_PATTERN)?.[1] ?? 'unknown';
      return [
        {
          scope: relative(rootDir, file),
          detail: `line ${index + 1}: banned import "${specifier}" — ${line.trim().slice(0, 160)}`
        }
      ];
    });
  });
};

const scanDependencies = (pkg: PackageInfo): readonly Violation[] =>
  DEP_FIELDS.flatMap(field => Object.keys(pkg.manifest[field] ?? {})).flatMap(dependency => {
    if (!BANNED_DEP_PATTERN.test(dependency)) {
      return [];
    }
    return [
      {
        scope: `${pkg.name} package.json`,
        detail: `banned dependency "${dependency}" declared in ${pkg.name}`
      }
    ];
  });

const scanAllowlist = (pkg: PackageInfo): readonly Violation[] => {
  const allowlist = RUNTIME_DEP_ALLOWLISTS[pkg.name];
  if (!allowlist) {
    return [];
  }

  return Object.keys(pkg.manifest.dependencies ?? {}).flatMap(dependency => {
    if (allowlist.includes(dependency)) {
      return [];
    }
    return [
      {
        scope: `${pkg.name} package.json`,
        detail: `runtime dependency "${dependency}" is not on the §3.2 whitelist for ${pkg.name}`
      }
    ];
  });
};

const collectViolations = (rootDir: string): readonly Violation[] =>
  readPackages(rootDir).flatMap(pkg => [
    ...scanSourceImports(rootDir, pkg),
    ...scanDependencies(pkg),
    ...scanAllowlist(pkg)
  ]);

export function runDependencyGate(): void {
  const rootDir = process.cwd();
  const violations = collectViolations(rootDir);

  if (violations.length > 0) {
    console.error(`dependency gate failed with ${violations.length} violation(s):\n`);
    for (const violation of violations) {
      console.error(`  [${violation.scope}]\n    ${violation.detail}\n`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('dependency gate passed: no banned imports, runtime deps within whitelists.');
}
