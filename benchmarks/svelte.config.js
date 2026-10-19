/**
 * Svelte config for the benchmark workspace.
 *
 * HMR off: the hot-reload transform wraps component constructors at compile
 * time, and this workspace exists to measure construction cost. The wrapper
 * would be measured as library overhead.
 */
export default {
  compilerOptions: { hmr: false }
};
