import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The docs package version, read at build time.
 *
 * The ubean header renders `v{version}` from the docs package (`apps/docs`), so the
 * Astro header reads the *same* package rather than the astro-docs one — both sites
 * then print the same number.
 */
const here = path.dirname(fileURLToPath(import.meta.url));

const docsPackage = JSON.parse(readFileSync(path.join(here, '../../../docs/package.json'), 'utf8')) as {
  version?: string;
};

export const docsVersion = docsPackage.version ?? '0.0.0';
