import { defineComponent, h, nextTick } from 'vue';
import type { Component } from 'vue';
import { AccordionCompact } from '@vean/aria/accordion';
import { ConfigProvider } from '@vean/aria/config-provider';
import { SelectCompact } from '@vean/aria/select';
import { render } from 'vitest-browser-vue';
import { clickElement, pointerDown, pressEscape } from './gestures';
import type { AccordionProps, Adapter, Mounted, SelectProps } from './types';

/**
 * Adapter: `@vean/aria` (Vue).
 *
 * Every adapter in this directory exposes the same functions and the same two
 * component shapes, so the benchmark file never branches per library. The shape
 * is the point: an accordion of N items and a select of N options, with the same
 * content, no styling, and as few extra wrappers as the library requires.
 */

const makeItems = (count: number): { title: string; value: string }[] =>
  Array.from({ length: count }, (_, index) => ({ title: `Section ${index}`, value: `s${index}` }));

const makeOptions = (count: number): { label: string; value: string }[] =>
  Array.from({ length: count }, (_, index) => ({ label: `Option ${index}`, value: `o${index}` }));

const Accordion = defineComponent({
  name: 'AriaAccordion',
  props: { items: { default: 10, type: Number } },
  setup: props => () => h(AccordionCompact, { collapsible: true, items: makeItems(props.items), type: 'single' })
});

const Select = defineComponent({
  name: 'AriaSelect',
  props: { open: { default: false, type: Boolean }, options: { default: 10, type: Number } },
  setup: props => () =>
    h(SelectCompact, { defaultOpen: props.open, items: makeOptions(props.options), placeholder: 'Pick' })
});

/**
 * Mounted inside `ConfigProvider`, because without it `useConfigProvider` logs a
 * `[Vue warn]: injection "Symbol(ConfigProvider)" not found` on every mount — 20
 * warning constructions per benchmark, which is measurable overhead the other
 * three libraries do not have. A real consumer mounts it too, so this is the
 * honest shape as well as the fair one.
 */
const wrap = (component: Component): Component =>
  defineComponent({
    inheritAttrs: false,
    name: 'AriaMountRoot',
    props: { mountProps: { default: () => ({}), type: Object } },
    setup: props => () => h(ConfigProvider, null, { default: () => h(component, props.mountProps) })
  });

/**
 * Props go through a declared `mountProps` prop, not through attrs. Passing them
 * as attrs lands them on the wrapper's root element instead of the component,
 * which the component then sees as empty.
 */
const mountComponent = async (component: Component, props: object): Promise<Mounted> => {
  const result = await render(wrap(component), { props: { mountProps: props } });

  await nextTick();

  const root = result.container as HTMLElement;
  const accordionTrigger = (): Element | null => root.querySelector('button[aria-expanded]');
  // An aria `button` carries `role="combobox"`; bits-ui's carries only
  // `aria-haspopup`, so the benchmark asks the adapter instead of guessing.
  const selectTrigger = (): Element | null => root.querySelector('[role="combobox"], [aria-haspopup="listbox"]');

  return {
    accordionTrigger,
    dismiss: pressEscape,
    // Accordion toggles on `click`: a plain button with a click listener.
    toggleAccordion: () => {
      const trigger = accordionTrigger();

      if (trigger) clickElement(trigger);
    },
    flush: () => nextTick(),
    // Select opens on `pointerdown`; see
    // `packages/aria/src/components/select/select-trigger.vue:onPointerDown`.
    // A synthetic `click` never reaches it.
    openSelect: () => {
      const trigger = selectTrigger();

      if (trigger) pointerDown(trigger);
    },
    root,
    selectTrigger,
    unmount: async () => result.unmount()
  };
};

export const name = '@vean/aria';

export const mountAccordion = (props: AccordionProps): Promise<Mounted> => mountComponent(Accordion, props);

export const mountSelect = (props: SelectProps): Promise<Mounted> => mountComponent(Select, props);

const adapter: Adapter = { mountAccordion, mountSelect, name };

export default adapter;
