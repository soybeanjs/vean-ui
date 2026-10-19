import { defineComponent, h } from 'vue';
import type { Component } from 'vue';
import { render } from 'vitest-browser-vue';
import type { RenderResult } from 'vitest-browser-vue';
import { ConfigProvider } from '../../../src/components/config-provider';
import { benchmark } from './benchmark';
import type { BenchmarkStats } from './benchmark';

/**
 * Mount-cost benchmarking for aria components.
 *
 * Four rules make these numbers mean something:
 *
 * 1. Props are forwarded through an explicit `mountProps` prop, not through
 *    fallthrough attrs. A `Setup`-style wrapper has no declared props, so
 *    anything passed to it becomes an attr and gets applied to the wrapper's
 *    root element — the component under test would mount with no props at all
 *    and the benchmark would happily time an empty tree.
 * 2. Every mount sits inside `ConfigProvider`. Sans it, `useConfigProvider`
 *    logs `[Vue warn]: injection "Symbol(ConfigProvider)" not found` on every
 *    iteration; in a timed loop that is 50 warning constructions per benchmark,
 *    which can cost more than the component being measured. A provider is also
 *    how a real app mounts, so including it is the honest shape.
 * 3. Each iteration unmounts before the next starts, so iteration N is not
 *    measured while the previous subtree is still laid out.
 * 4. `getBoundingClientRect()` is read before the clock stops. Without a layout
 *    read the browser may defer style and layout past the measurement, and
 *    "mount cost" silently becomes "time to hand back a detached tree" —
 *    identical for a `<div>` and a 500-row table.
 *
 * The measured region therefore covers what a consumer pays on first mount (Vue
 * setup, the composable graph, the DOM writes, and the layout they force) and
 * excludes unmount, which the teardown benchmarks measure separately.
 */
export interface MountCase {
  /** The component under test. */
  readonly component: Component;
  /** Human-readable case name, e.g. `TableCompact/100-rows`. */
  readonly name: string;
  /** Fresh `props` for one mount. A function, so no iteration reuses a mutated object. */
  readonly props: () => Record<string, unknown>;
}

export interface MountMeasureOptions {
  readonly iterations?: number;
  readonly warmup?: number;
}

/**
 * One wrapper component, created once per benchmark, receiving the real props.
 *
 * `inheritAttrs: false` is what keeps the props on `mountProps` instead of
 * letting Vue stamp them onto the provider's root element.
 */
const createRoot = (component: Component): Component =>
  defineComponent({
    inheritAttrs: false,
    name: 'PerfMountRoot',
    props: { mountProps: { default: () => ({}), type: Object } },
    setup: props => () => h(ConfigProvider, null, { default: () => h(component, props.mountProps) })
  });

export async function benchmarkMount(testCase: MountCase, options: MountMeasureOptions = {}): Promise<BenchmarkStats> {
  const Root = createRoot(testCase.component);
  let mounted: RenderResult<never> | undefined;

  return benchmark(
    testCase.name,
    async () => {
      mounted = (await render(Root, { props: { mountProps: testCase.props() } })) as RenderResult<never>;
      // Force style + layout while the clock is running.
      void mounted.container.getBoundingClientRect();

      return mounted;
    },
    {
      ...options,
      cleanup: async () => {
        await mounted?.unmount();
        mounted = undefined;
      }
    }
  );
}
