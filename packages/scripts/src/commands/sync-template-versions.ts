/**
 * Syncs the @soybeanjs/* version constant used by project templates.
 *
 * Reads the current version from the root `package.json` and writes it to
 * `packages/cli/src/templates/versions.ts`. This ensures that newly
 * scaffolded projects always reference the latest published version of
 * internal workspace packages.
 *
 * This command is invoked automatically during `pnpm release-execute`
 * (which runs after `bumpp` bumps all package versions).
 *
 * Usage:
 *   pnpm sync-template-versions
 *   # or: pnpm sui sync-template-versions
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export async function runSyncTemplateVersions(): Promise<void> {
  const rootDir = process.cwd();

  // Read root version
  const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  const version = rootPkg.version as string;

  if (!version) {
    throw new Error('Could not read version from root package.json');
  }

  // Generate versions.ts
  const content = `/**
 * Current version of @soybeanjs/* packages.
 *
 * This file is auto-generated during release by \`packages/scripts/src/commands/sync-template-versions.ts\`.
 * Do not edit manually — run \`pnpm sync-template-versions\` to update.
 *
 * The version is read from the root \`package.json\` at release time so that
 * project templates always scaffold with the latest published version.
 */
export const VEAN_VERSION = '${version}';
`;

  const versionsPath = path.join(rootDir, 'packages/cli/src/templates/versions.ts');
  fs.writeFileSync(versionsPath, content, 'utf-8');

  console.log(`✔ Synced template versions to ${version}`);
  console.log(`  Updated: packages/cli/src/templates/versions.ts`);
}
