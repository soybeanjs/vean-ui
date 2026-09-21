import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import process from 'node:process';
import ariaPkg from '../../../aria/package.json' with { type: 'json' };

const ariaExports = {
  '.': './src/index.ts',
  './constants': './src/constants/index.ts',
  './composables': './src/composables/index.ts',
  './date': './src/date/index.ts',
  './locale': './src/locale/index.ts',
  './locale/*': './src/locale/langs/*.ts',
  './shared': './src/shared/index.ts',
  './nuxt': './src/nuxt/index.ts',
  './resolver': './src/resolver/index.ts',
  './namespaced': './src/namespaced/index.ts',
  './types': './src/types/index.ts',
  './*': './src/components/*/index.ts'
};

const pkgPath = 'packages/aria/package.json';

async function handleStub(reset?: boolean) {
  const pkgExports = reset ? ariaPkg.publishConfig.exports : ariaExports;
  const manifest = ariaPkg as Omit<typeof ariaPkg, 'exports'> & {
    exports: Record<string, unknown>;
  };

  manifest.exports = pkgExports;

  await writeFile(pkgPath, JSON.stringify(manifest, null, 2), 'utf8');
}

function formatPackageManifest(): void {
  const result = spawnSync('vp', ['fmt', pkgPath], {
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.status !== 0) {
    throw new Error(`vp fmt ${pkgPath} exited with code ${result.status ?? 'unknown'}.`);
  }
}

export async function runStub(options?: { reset?: boolean }): Promise<void> {
  await handleStub(options?.reset);
  formatPackageManifest();
}
