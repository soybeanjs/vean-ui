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
 * 3. Vue peer floor — a package may not declare a `vue` peer range whose lower bound is
 *    below the Vue version that introduced an API its `src` actually imports. See
 *    `VUE_API_FLOORS`.
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
    '@tanstack/table-core',
    '@tanstack/vue-form',
    '@tanstack/vue-table',
    '@tanstack/vue-virtual',
    '@vueuse/core',
    'date-fns',
    'embla-carousel'
  ],
  '@vean/ui': [
    '@iconify/vue',
    '@soybeanjs/colord',
    '@soybeanjs/cva',
    '@tanstack/vue-virtual',
    '@vean/aria',
    '@vean/theme',
    'markstream-vue'
  ]
};

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.vue']);
const DEP_FIELDS = ['dependencies', 'peerDependencies', 'optionalDependencies'] as const;

/**
 * Vue APIs that only exist from a given version on, keyed by that version.
 *
 * Why this is checked: consuming a project breaks at **build** time, not install time, when
 * a package's `dist` imports an API the consumer's Vue does not export. The bundler reports
 * `MISSING_EXPORT "useTemplateRef" is not exported by .../vue.runtime.esm-bundler.js` — a
 * message that names the consumer's dependency, not ours, so the trail back to a too-wide
 * `peerDependencies.vue` is cold.
 *
 * 2026-10-09: `@vean/ui@0.50.0` / `@vean/aria@0.50.0` declared `vue: >=3.2.0` while their
 * `dist` needed 3.5 APIs, which turned ubean's nightly Vue 3.4 compatibility cell red
 * (`packages/devtools` client build, 67 MISSING_EXPORT errors before its L2 tests even ran).
 * Both floors are now `>=3.5.0` and this scan keeps them honest.
 */
const VUE_API_FLOORS: ReadonlyArray<{ api: string; since: string }> = [
  { api: 'onWatcherCleanup', since: '3.5.0' },
  { api: 'useId', since: '3.5.0' },
  { api: 'useTemplateRef', since: '3.5.0' },
  { api: 'defineModel', since: '3.4.0' },
  { api: 'toValue', since: '3.3.0' }
];

const VUE_IMPORT_PATTERN = /^\s*import\s+(?!type\b)\{([^}]*)\}\s*from\s*['"]vue['"]/;

/**
 * Lower bound of a semver range, as `[major, minor, patch]`. Non-numeric ranges (`workspace:*`,
 * `latest`) yield `null` and are skipped rather than guessed — a bogus floor would be worse
 * than no floor.
 */
const parseFloor = (range: string): readonly [number, number, number] | null => {
  const match = range.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

const belowFloor = (floor: readonly [number, number, number], required: string): boolean => {
  const requiredParts = parseFloor(required);
  if (!requiredParts) {
    return false;
  }
  for (let i = 0; i < 3; i += 1) {
    if (floor[i] !== requiredParts[i]) {
      return floor[i] < requiredParts[i];
    }
  }
  return false;
};

/** Names imported from `vue` by value, per source file. `import type` is skipped: type-only
 * imports impose no runtime export requirement. */
const collectVueValueImports = (file: string): readonly string[] =>
  readFileSync(file, 'utf8')
    .split('\n')
    .flatMap(line => {
      const match = line.match(VUE_IMPORT_PATTERN);
      if (!match) {
        return [];
      }
      return match[1]
        .split(',')
        .map(name =>
          name
            .trim()
            .split(/\s+as\s+/)[0]
            .trim()
        )
        .filter(Boolean);
    });

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

/**
 * The `vue` peer floor must cover every Vue API the package's `src` imports.
 *
 * Only packages that declare a `vue` peer are checked: a package with no peer has made no
 * claim, and `@vean/theme` / `@vean/unocss` / `@vean/cli` are in that bucket.
 */
const scanVuePeerFloor = (rootDir: string, pkg: PackageInfo): readonly Violation[] => {
  const declared = pkg.manifest.peerDependencies?.vue;
  if (!declared) {
    return [];
  }

  const floor = parseFloor(declared);
  if (!floor) {
    return [];
  }

  const srcDir = join(pkg.dir, 'src');

  return listSourceFiles(srcDir).flatMap(file => {
    const imported = new Set(collectVueValueImports(file));

    return VUE_API_FLOORS.flatMap(({ api, since }) => {
      if (!imported.has(api) || !belowFloor(floor, since)) {
        return [];
      }
      return [
        {
          scope: relative(rootDir, file),
          detail: `imports "${api}" from 'vue', which exists only since ${since}, but ${pkg.name} declares peerDependencies.vue = "${declared}"`
        }
      ];
    });
  });
};

const collectViolations = (rootDir: string): readonly Violation[] =>
  readPackages(rootDir).flatMap(pkg => [
    ...scanSourceImports(rootDir, pkg),
    ...scanDependencies(pkg),
    ...scanAllowlist(pkg),
    ...scanVuePeerFloor(rootDir, pkg)
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

  console.log(
    'dependency gate passed: no banned imports, runtime deps within whitelists, vue peer floors cover the APIs used.'
  );
}
