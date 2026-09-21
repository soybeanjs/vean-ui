/**
 * Tree-shake bundle fixture (v0.50.0 T8.3).
 *
 * Bundles `import { SButton } from '@vean/ui'` (the package-root consumer surface)
 * with Vite/Rolldown and asserts the retained module graph contains no heavy-engine code:
 * table, form, date (Aria date kernel + date-fns), embla carousel, or markstream.
 *
 * Assertions run on the bundler's retained-module metadata, which only lists modules that
 * contributed code to the output — tree-shaken barrels (parsed but dropped) are excluded.
 * The build itself runs in a plain Node child process (see test/bundle/build-sbutton-fixture.mjs).
 */
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

// Vitest runs with the package root (packages/ui) as cwd, where the unit-test config lives.
const uiRoot = process.cwd();

const BANNED_MODULE_PATTERN =
  /components\/(table|form)\b|\/src\/date\/|node_modules\/(date-fns|embla-carousel)|@tanstack\/(vue-form|vue-table)|markstream-vue/;

interface FixtureChunk {
  fileName: string;
  code: string;
  moduleIds: string[];
}

function buildFixture(): FixtureChunk[] {
  const stdout = execFileSync(process.execPath, ['test/bundle/build-sbutton-fixture.mjs'], {
    cwd: uiRoot,
    encoding: 'utf8',
    timeout: 120_000
  });

  return JSON.parse(stdout) as FixtureChunk[];
}

describe('bundle fixture (tree-shake)', () => {
  it('importing SButton from the package root retains its subtree without heavy-engine code', () => {
    const chunks = buildFixture();

    expect(chunks.length).toBeGreaterThan(0);
    for (const chunk of chunks) {
      expect(chunk.code.length, `${chunk.fileName} should contain code`).toBeGreaterThan(0);
    }

    const moduleIds = chunks.flatMap(chunk => chunk.moduleIds);

    // Sanity: the SButton subtree must actually be retained, otherwise the assertions
    // below would pass vacuously on an empty graph.
    const buttonModule = moduleIds.find(id => id.includes('components/button'));
    expect(buttonModule, 'SButton subtree should be retained in the bundle').toBeTruthy();
    const buttonChunk = chunks.find(chunk => chunk.code.includes('SButton'));
    expect(buttonChunk, 'emitted code should contain the SButton component').toBeTruthy();

    const banned = moduleIds.filter(id => BANNED_MODULE_PATTERN.test(id));
    expect(banned, `heavy-engine modules leaked into the SButton bundle: ${banned.join(', ')}`).toEqual([]);
  }, 180_000);
});
