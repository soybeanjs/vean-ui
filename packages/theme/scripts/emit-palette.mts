/**
 * Write the static palette layer to `dist/palette.css`.
 *
 * The palette table never changes at runtime, so it ships as a plain stylesheet
 * that consumers can cache forever (docs/design/theme.md §3). The format is a
 * build-time choice: `PALETTE_FORMAT=hsl|oklch pnpm build`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatePaletteCss } from '../src/emit';
import type { ColorFormat } from '../src/types';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const format = (process.env.PALETTE_FORMAT ?? 'hsl') as ColorFormat;
const target = resolve(root, 'dist/palette.css');

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${generatePaletteCss({ format })}\n`, 'utf8');

console.log(`[theme] palette.css written (${format})`);
