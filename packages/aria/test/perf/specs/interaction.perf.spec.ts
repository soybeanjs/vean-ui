import { afterAll, describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import type { Component } from 'vue';
import { render } from 'vitest-browser-vue';
import type { RenderResult } from 'vitest-browser-vue';
import { page } from 'vitest/browser';
import { assertWithinCeiling, benchmark, formatBenchmarks } from '../shared/benchmark';
import type { BenchmarkStats } from '../shared/benchmark';
import { AccordionCompact } from '../../../src/components/accordion';
import { ConfigProvider } from '../../../src/components/config-provider';
import { SelectCompact } from '../../../src/components/select';

/**
 * Interaction latency: how much work a component does between a gesture and the
 * settled DOM.
 *
 * This is the axis a mount benchmark cannot see. A component can mount in 3 ms
 * and still feel broken if opening it costs 200 ms, because the open path runs
 * code mount never touches — portal creation, focus trapping, floating-position
 * measurement, a reactive invalidation cascade.
 *
 * ## Why the clock starts at DOM dispatch, not at the Playwright call
 *
 * A Playwright `userEvent.click` costs ~50–100 ms before the page sees anything
 * (actionability checks, CDP input dispatch, settle wait), and a bare `<button>`
 * toggle measures the same ~100 ms through it. Measured that way the component's
 * own work is a 3 % sliver on top of the driver and the number says nothing. So
 * the gesture is dispatched directly at the element — a real event through Vue's
 * own listener path, no driver roundtrip — and the measurement covers
 * dispatch → settled DOM, which is the component's work and nothing else.
 *
 * The trade-off is explicit: these are untrusted events, and a component that
 * branches on `event.isTrusted` would take a different path. That is fine *here*
 * because this file measures latency, not behaviour. Every contract that depends
 * on a trusted gesture is asserted in `test/browser/specs/`, which uses the real
 * driver for exactly that reason. A latency number must not silently become a
 * behaviour test, and a behaviour test must not silently become a latency
 * number.
 *
 * Each measured region ends with a `nextTick`, and the last thing each test does
 * is assert the effect outside the timed region — the number is only meaningful
 * if the sequence actually opened and closed something.
 */
const stats: BenchmarkStats[] = [];

afterAll(() => {
  console.log(`\n${formatBenchmarks(stats)}\n`);
});

const record = (value: BenchmarkStats): BenchmarkStats => {
  stats.push(value);

  return value;
};

/** Keeps the props off the wrapper's root element; see `perf/shared/mount.ts`. */
const createRoot = (component: Component): Component =>
  defineComponent({
    inheritAttrs: false,
    name: 'PerfInteractionRoot',
    props: { mountProps: { default: () => ({}), type: Object } },
    setup: props => () => h(ConfigProvider, null, { default: () => h(component, props.mountProps) })
  });

const mountRoot = async (component: Component, props: Record<string, unknown>): Promise<RenderResult<never>> => {
  const result = (await render(createRoot(component), { props: { mountProps: props } })) as RenderResult<never>;

  await nextTick();

  return result;
};

/**
 * A left-button press dispatched straight at the element.
 *
 * `element.click()` is not enough for components that open on `pointerdown`
 * (Select, Menu, Popover all do, to beat the browser's focus handling): a
 * `click` event never reaches that listener. Dispatching the pointer pair keeps
 * the real listener path and skips only the driver roundtrip.
 */
const press = (element: HTMLElement): void => {
  const init = {
    bubbles: true,
    button: 0,
    cancelable: true,
    clientX: 4,
    clientY: 4,
    pointerId: 1,
    pointerType: 'mouse'
  };

  element.dispatchEvent(new PointerEvent('pointerdown', init));
  element.dispatchEvent(new PointerEvent('pointerup', init));
  element.dispatchEvent(new MouseEvent('click', init));
};

const options = Array.from({ length: 100 }, (_, index) => ({ label: `Option ${index}`, value: `o${index}` }));

describe('SelectCompact open latency', () => {
  it('opens and closes a 100-option list', async () => {
    const mounted = await mountRoot(SelectCompact, { items: options, placeholder: 'Pick' });
    const trigger = page.getByRole('combobox');

    await expect.element(trigger).toBeVisible();
    const element = trigger.element() as HTMLElement;

    const measured = record(
      await benchmark(
        'interaction/select-open-close',
        async () => {
          press(element);
          // `nextTick` is where the open path's work happens: the portal mounts,
          // the 100-option listbox renders, the dismissable layer attaches, focus
          // moves, the floating position is measured. `expect.element` here would
          // add its retry polling to the timed region and inflate the figure by
          // roughly 30%.
          await nextTick();
          // `Escape` is handled by a real keydown listener; dispatching it on the
          // trigger is the same path a keyboard user takes.
          element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
          await nextTick();
        },
        { iterations: 20, warmup: 3 }
      )
    );

    // One open + one close per sample. The open path is the expensive half: the
    // portal mounts, 100 options render, the dismissable layer attaches, focus
    // moves and the floating position is measured. ~57 ms measured on a
    // development machine; the ceiling leaves room for a slower runner while
    // still failing on a real regression (per-option reflow, a reposition per
    // key, a lost memo on the option list).
    assertWithinCeiling(measured, 160);

    // Correctness, outside the timed region: the loop above really does open and
    // close the list, so the number is not measuring a no-op.
    const listbox = page.getByRole('listbox');

    press(element);
    await nextTick();
    expect(listbox.query()).not.toBeNull();

    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await nextTick();
    expect(listbox.query()).toBeNull();

    await mounted.unmount();
  });
});

describe('AccordionCompact toggle latency', () => {
  it('expands one section of a 50-item accordion and closes it again', async () => {
    const items = Array.from({ length: 50 }, (_, index) => ({ title: `Section ${index}`, value: `s${index}` }));
    const mounted = await mountRoot(AccordionCompact, { collapsible: true, items, type: 'single' });

    const trigger = page.getByRole('button', { name: 'Section 0' });

    await expect.element(trigger).toBeVisible();
    const element = trigger.element() as HTMLElement;

    const measured = record(
      await benchmark(
        'interaction/accordion-toggle',
        async () => {
          element.click();
          await nextTick();
          element.click();
          await nextTick();
        },
        { iterations: 20, warmup: 5 }
      )
    );

    // Two toggles per sample. The collapsed-height transition is what makes this
    // more than a `v-if`: enter reads `scrollHeight` and leave reads
    // `offsetHeight` (`src/shared/collapse-motion.ts`), so each toggle costs a
    // synchronous full-document layout. ~16 ms for two toggles is that layout; a
    // doubling means the read moved inside a loop or a second forced reflow was
    // added.
    assertWithinCeiling(measured, 30);

    await mounted.unmount();
  });
});
