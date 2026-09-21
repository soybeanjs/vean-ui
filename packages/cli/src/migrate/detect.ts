/**
 * Preflight for `vean migrate rebrand`: does this project actually come from
 * SoybeanUI, and if so, which surfaces does it use?
 *
 * The migration is meant for downstream projects, so a checkout that shows no
 * SoybeanUI-era trace at all is refused unless `--force` is passed. Detection is
 * marker-based (dependency declarations, `sbean.json`, and the legacy strings in
 * file text) — it never guesses from directory names.
 */
import fs from 'fs/promises';
import path from 'path';
import { PACKAGE_RENAMES } from './rules';

export interface TierMarkers {
  /** Legacy package specifiers in file text. */
  packages: number;
  /** `data-soybean-*` attributes and `--soybean-*` CSS variables. */
  runtimeContract: number;
  /** `sbean` CLI references. */
  cli: number;
  /** `ui.soybeanjs.cn` / `r2.soybeanjs.tech` / the old repository link. */
  hostnames: number;
}

export interface ProjectSignals {
  /** Legacy packages declared in `package.json`, in table order. */
  legacyPackages: string[];
  /** `sbean.json` present at the project root. */
  hasLegacyCliConfig: boolean;
  /** `vean.json` present at the project root. */
  hasCurrentCliConfig: boolean;
  markers: TierMarkers;
  /** Any SoybeanUI-era trace in dependencies, code, contracts or CLI config. */
  isLegacyProject: boolean;
}

export const EMPTY_MARKERS: TierMarkers = { packages: 0, runtimeContract: 0, cli: 0, hostnames: 0 };

/**
 * What makes a file "belong to the SoybeanUI era". Deliberately independent of
 * the rewrite rules: these patterns never change, while the rules carry the
 * replacement targets.
 */
const MARKER_PATTERNS: Readonly<Record<keyof TierMarkers, RegExp>> = {
  packages: /@soybeanjs\/(?:headless|ui|ui-uno|ui-skills|theme)(?![\w-])/g,
  runtimeContract: /(?:data-soybean-|--soybean-)/g,
  cli: /\bsbean\b/g,
  hostnames: /ui\.soybeanjs\.cn|r2\.soybeanjs\.tech|github\.com\/soybeanjs\/soybean-ui/g
};

const MANIFEST_FILE = 'package.json';
const LEGACY_CLI_CONFIG = 'sbean.json';
const CURRENT_CLI_CONFIG = 'vean.json';
const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

/** Marker counts for one file's text. */
export function countMarkers(text: string): TierMarkers {
  return {
    packages: text.match(MARKER_PATTERNS.packages)?.length ?? 0,
    runtimeContract: text.match(MARKER_PATTERNS.runtimeContract)?.length ?? 0,
    cli: text.match(MARKER_PATTERNS.cli)?.length ?? 0,
    hostnames: text.match(MARKER_PATTERNS.hostnames)?.length ?? 0
  };
}

/** Sum two marker sets. */
export function addMarkers(left: TierMarkers, right: TierMarkers): TierMarkers {
  return {
    packages: left.packages + right.packages,
    runtimeContract: left.runtimeContract + right.runtimeContract,
    cli: left.cli + right.cli,
    hostnames: left.hostnames + right.hostnames
  };
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);

    return true;
  } catch {
    return false;
  }
}

async function readManifest(root: string): Promise<Record<string, unknown> | null> {
  try {
    const parsed: unknown = JSON.parse(await fs.readFile(path.join(root, MANIFEST_FILE), 'utf8'));

    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Legacy packages declared anywhere in the manifest, in `PACKAGE_RENAMES` order. */
export function legacyPackagesOf(manifest: Record<string, unknown> | null): string[] {
  if (!manifest) {
    return [];
  }

  const declared = new Set(
    DEPENDENCY_FIELDS.flatMap(field => {
      const entries = manifest[field];

      return typeof entries === 'object' && entries !== null ? Object.keys(entries) : [];
    })
  );

  return PACKAGE_RENAMES.filter(({ legacy }) => declared.has(legacy)).map(({ legacy }) => legacy);
}

/**
 * Whether the migration should be allowed to touch this project. A hostname-only
 * checkout is accepted only when the user asked for that specific rewrite, since
 * links alone do not make a project a SoybeanUI consumer.
 */
export function shouldMigrate(
  signals: ProjectSignals,
  options: { force: boolean; newDomain?: string; newCdn?: string; repoSlug?: string }
): boolean {
  if (options.force || signals.isLegacyProject) {
    return true;
  }

  const hostRewriteRequested = Boolean(options.newDomain ?? options.newCdn ?? options.repoSlug);

  return hostRewriteRequested && signals.markers.hostnames > 0;
}

/** Read the project-level signals once the file pass has counted its markers. */
export async function readProjectSignals(root: string, markers: TierMarkers): Promise<ProjectSignals> {
  const [manifest, hasLegacyCliConfig, hasCurrentCliConfig] = await Promise.all([
    readManifest(root),
    exists(path.join(root, LEGACY_CLI_CONFIG)),
    exists(path.join(root, CURRENT_CLI_CONFIG))
  ]);

  const legacyPackages = legacyPackagesOf(manifest);

  return {
    legacyPackages,
    hasLegacyCliConfig,
    hasCurrentCliConfig,
    markers,
    isLegacyProject:
      legacyPackages.length > 0 ||
      hasLegacyCliConfig ||
      markers.packages > 0 ||
      markers.runtimeContract > 0 ||
      markers.cli > 0
  };
}

export { LEGACY_CLI_CONFIG, CURRENT_CLI_CONFIG };
