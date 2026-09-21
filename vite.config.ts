import { defineConfig } from 'vite-plus';
import { lint, fmt } from '@soybeanjs/oxc-config';

export default defineConfig({
  staged: {
    '*': 'vp check --fix'
  },
  fmt: {
    ...fmt,
    // generated: `typings` is rewritten by `pnpm sui gen api`, and the Figma
    // export is compared byte-for-byte by its generator — reformatting either
    // makes the next generation look like a real change.
    ignorePatterns: ['apps/docs/src/typings', 'apps/docs/public/figma']
  },
  lint,
  run: {
    tasks: {
      'build-ui': {
        command: 'pnpm --filter @vean/ui build',
        dependsOn: ['build-aria']
      },
      'dev-docs': {
        command: 'pnpm --filter @vean/docs dev',
        dependsOn: ['build-ui']
      },
      'build-docs': {
        command: 'pnpm --filter @vean/docs build && vp fmt',
        dependsOn: ['build-ui']
      }
    }
  }
});
