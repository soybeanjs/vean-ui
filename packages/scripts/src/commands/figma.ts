import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { writeJsonFile } from '../shared/json';
import { collectComponentProps, readComponentApiDocuments } from './figma-components';
import { buildFigmaTokenDocuments } from './figma-tokens';

/**
 * The committed Figma export (docs/design/figma.md), served by the docs site so a
 * designer can download it straight from the deployment.
 *
 * Four files, two audiences:
 *
 * - `light.json` / `dark.json` are the DTCG token documents. Figma creates one
 *   **mode per imported file**, so each is imported separately — and because the
 *   two carry the same token names, the second import lands as a mode of the
 *   first collection instead of a second collection.
 * - `components.json` is the prop vocabulary (see figma-components.ts). It is
 *   not a token file and must not be imported as one.
 * - `tokens.css` is the flat CSS mirror, for the many designers who wire Figma
 *   up through a CSS-variable importer instead of a DTCG one.
 *
 * The directory is excluded from the formatter (root `vite.config.ts`) because
 * the CSS is compared byte-for-byte: anything that rewrites the file (including
 * a repo-wide `pnpm fmt`) would make the next generation look like a change and
 * bump mtime on an otherwise clean tree.
 */
export const FIGMA_OUTPUT_DIR = 'apps/docs/public/figma';

const LIGHT_FILE = 'light.json';
const DARK_FILE = 'dark.json';
const COMPONENTS_FILE = 'components.json';
const CSS_FILE = 'tokens.css';

/**
 * write only when the content actually changed.
 *
 * Same reason as the catalog generator: a no-op write bumps mtime, and anything
 * watching the tree (the dev server, an IDE) reads that as a change.
 */
async function writeTextIfChanged(filePath: string, contents: string): Promise<boolean> {
  const existing = await readFile(filePath, 'utf8').catch(() => null);

  if (existing === contents) {
    return false;
  }

  await writeFile(filePath, contents, 'utf8');

  return true;
}

/**
 * generate every Figma artifact and return the paths that were actually written
 * (an up-to-date repo writes nothing, so a no-op pass is a no-op).
 */
export async function generateFigmaAssets(rootDir: string = process.cwd()): Promise<string[]> {
  const outputDir = path.join(rootDir, FIGMA_OUTPUT_DIR);
  const tokens = buildFigmaTokenDocuments();
  const componentApiDocuments = await readComponentApiDocuments(rootDir);
  const components = {
    generatedAt: new Date().toISOString(),
    components: collectComponentProps(componentApiDocuments)
  };

  await mkdir(outputDir, { recursive: true });

  const writes: Array<[string, () => Promise<boolean>]> = [
    [LIGHT_FILE, () => writeJsonFile(path.join(outputDir, LIGHT_FILE), tokens.light, { preserveGeneratedAt: true })],
    [DARK_FILE, () => writeJsonFile(path.join(outputDir, DARK_FILE), tokens.dark, { preserveGeneratedAt: true })],
    [
      COMPONENTS_FILE,
      () => writeJsonFile(path.join(outputDir, COMPONENTS_FILE), components, { preserveGeneratedAt: true })
    ],
    [CSS_FILE, () => writeTextIfChanged(path.join(outputDir, CSS_FILE), tokens.css)]
  ];

  const written: string[] = [];

  for (const [fileName, write] of writes) {
    if (await write()) {
      written.push(path.join(outputDir, fileName));
    }
  }

  return written;
}
