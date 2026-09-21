/**
 * Text rules behind `vean migrate rebrand` — the SoybeanUI → Vean rename.
 *
 * Rules are tiered: the package rules are the migration itself and always run,
 * while the runtime-contract / CLI / hostname rules are opt-in because they
 * reach into consumer CSS, scripts and URLs. See `buildRules`.
 */

export interface MigrateRule {
  /** Stable id, printed per file and totalled in the summary. */
  id: string;
  /** Global pattern, applied with `String.prototype.replace`. */
  pattern: RegExp;
  /** Replacement text; `$1`-style backreferences are supported. */
  to: string;
}

export interface MigrateRuleHit {
  id: string;
  count: number;
}

export interface MigrateRuleOptions {
  /** Also rewrite `data-soybean-*` / `--soybean-*` — breaks consumer CSS selectors. */
  runtimeContract?: boolean;
  /** Also rewrite `sbean` CLI references. */
  cli?: boolean;
  /** Document hostname to rewrite `ui.soybeanjs.cn` to. */
  newDomain?: string;
  /** CDN hostname; defaults to `assets.<newDomain>`. */
  newCdn?: string;
  /** Repository slug to rewrite `github.com/soybeanjs/soybean-ui` to. */
  repoSlug?: string;
}

const HOSTNAME_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
const REPO_SLUG_PATTERN = /^[\w.-]+\/[\w.-]+$/;

/** `https://veanui.com/` → `veanui.com`; `null` when it is not a bare hostname. */
export function normalizeHostname(value: string): string | null {
  const hostname = value.replace(/^https?:\/\//, '').replace(/\/+$/, '');

  return HOSTNAME_PATTERN.test(hostname) ? hostname : null;
}

/** `https://github.com/soybeanjs/vean-ui` → `soybeanjs/vean-ui`; `null` when it is not `<owner>/<repo>`. */
export function normalizeRepoSlug(value: string): string | null {
  const slug = value.replace(/^https?:\/\/github\.com\//, '').replace(/\/+$/, '');

  return REPO_SLUG_PATTERN.test(slug) ? slug : null;
}

/**
 * Package renames, single source of truth: the rewrite rules below and the
 * dependency-swap advice in the report are both derived from this table.
 * Longest names first, so the report reads in the order a human would replace.
 */
export const PACKAGE_RENAMES: readonly { legacy: string; current: string }[] = [
  { legacy: '@soybeanjs/headless', current: '@vean/aria' },
  { legacy: '@soybeanjs/ui-uno', current: '@vean/unocss' },
  { legacy: '@soybeanjs/ui-skills', current: '@vean/skills' },
  { legacy: '@soybeanjs/ui', current: '@vean/ui' },
  { legacy: '@soybeanjs/theme', current: '@vean/theme' }
];

function escapeSpecifier(value: string): string {
  return value.replace(/[/@.]/g, character => `\\${character}`);
}

/**
 * Package specifiers. The `(?![\w-])` lookahead is load-bearing: without it
 * `@soybeanjs/ui-uno` would be half-rewritten into `@vean/ui-uno`, and
 * unrelated packages in the same scope (`@soybeanjs/ui-x`, `@soybeanjs/cva`,
 * `@soybeanjs/colord`) would be mangled.
 */
export const PACKAGE_RULES: readonly MigrateRule[] = [
  ...PACKAGE_RENAMES.map(({ legacy, current }) => ({
    id: `pkg:${legacy.replace('@soybeanjs/', '')}`,
    pattern: new RegExp(`${escapeSpecifier(legacy)}(?![\\w-])`, 'g'),
    to: current
  })),
  // Nuxt `imports.transform.exclude` matches the resolved dist path, not the
  // package specifier, so the rules above never reach it.
  { id: 'path:aria-dist-escaped', pattern: /headless\\\/dist\\\//g, to: 'aria\\/dist\\/' },
  { id: 'path:aria-dist', pattern: /headless\/dist\//g, to: 'aria/dist/' }
];

/** Runtime contracts: `data-soybean-*` markers and component-scoped `--soybean-*` variables. */
export const RUNTIME_RULES: readonly MigrateRule[] = [
  { id: 'rt:data-attr', pattern: /data-soybean-/g, to: 'data-vean-' },
  { id: 'rt:css-var', pattern: /--soybean-/g, to: '--vean-' }
];

/** CLI surface: config filename and invocations. The file itself is renamed separately. */
export const CLI_RULES: readonly MigrateRule[] = [
  { id: 'cli:config-file', pattern: /\bsbean\.json\b/g, to: 'vean.json' },
  { id: 'cli:runner', pattern: /\b(npx|pnpm\s+dlx|pnpm|yarn|bunx|bun)\s+sbean\b/g, to: '$1 vean' },
  { id: 'cli:binary', pattern: /\bfilter\s+sbean\b/g, to: 'filter vean' }
];

/**
 * Hostnames are the one brand carrier the package rules cannot reach. Each flag
 * stands on its own: `--new-cdn` moves only the CDN host, `--repo-slug` only the
 * repository link, and neither needs `--new-domain`.
 *
 * The CDN object-path prefix (`r2.soybeanjs.tech/soybeanjs/...`) is deliberately
 * left alone: it names an object inside the bucket, so rewriting it without
 * moving the object produces 404s — bind a custom domain to the bucket instead.
 */
export function buildHostnameRules({ newDomain, newCdn, repoSlug }: MigrateRuleOptions): readonly MigrateRule[] {
  const rules: MigrateRule[] = [];

  if (newDomain) {
    rules.push({ id: 'domain:docs-registry', pattern: /ui\.soybeanjs\.cn/g, to: newDomain });
  }

  const cdnHost = newCdn ?? (newDomain ? `assets.${newDomain}` : undefined);

  if (cdnHost) {
    rules.push({ id: 'domain:cdn', pattern: /r2\.soybeanjs\.tech/g, to: cdnHost });
  }

  if (repoSlug) {
    rules.push({
      id: 'domain:repo',
      pattern: /github\.com\/soybeanjs\/soybean-ui(?![\w-])/g,
      to: `github.com/${repoSlug}`
    });
  }

  return rules;
}

/** Rules for one run, in application order. */
export function buildRules(options: MigrateRuleOptions): readonly MigrateRule[] {
  return [
    ...PACKAGE_RULES,
    ...(options.runtimeContract ? RUNTIME_RULES : []),
    ...(options.cli ? CLI_RULES : []),
    ...buildHostnameRules(options)
  ];
}

/**
 * Rewrite `text` with every rule, reporting how many times each one matched.
 * Patterns must be global; `to` may use `$1`-style backreferences.
 */
export function applyRules(text: string, rules: readonly MigrateRule[]): { text: string; hits: MigrateRuleHit[] } {
  const hits: MigrateRuleHit[] = [];

  const rewritten = rules.reduce((current, rule) => {
    const count = current.match(rule.pattern)?.length ?? 0;

    if (count === 0) {
      return current;
    }

    hits.push({ id: rule.id, count });

    return current.replace(rule.pattern, rule.to);
  }, text);

  return { text: rewritten, hits };
}
