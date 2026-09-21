/**
 * Bundle fixture entry — simulates a consumer bundling `import { SButton } from '@vean/ui'`.
 *
 * The component must be *referenced*, not merely re-exported: an entry that only
 * re-exports a binding can be elided wholesale by the bundler, which would make the
 * fixture graph empty. Referencing SButton forces the bundler to retain its full
 * dependency subtree, matching real consumer usage.
 */
import { SButton } from '@vean/ui';

console.log(SButton);
