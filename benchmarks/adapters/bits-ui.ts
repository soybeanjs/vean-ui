import { flushSync, mount, unmount } from 'svelte';
import BitsAccordion from './fixtures/BitsAccordion.svelte';
import BitsSelect from './fixtures/BitsSelect.svelte';
import { clickElement, pointerDown, pressEscape } from './gestures';
import type { AccordionProps, Adapter, Mounted, SelectProps } from './types';

/**
 * Adapter: bits-ui (Svelte 5).
 *
 * bits-ui ships `.svelte` components, so the fixture is a Svelte file rather than
 * an imperative element graph. `mount()` commits synchronously in Svelte 5 and
 * `flushSync()` from `svelte` forces any pending effect flush before the clock
 * stops, so a deferred update cannot read as free.
 */
const mountSvelte = (component: never, props: object): Mounted => {
  const target = document.createElement('div');

  document.body.append(target);

  const instance = mount(component, { props, target });

  flushSync();

  const accordionTrigger = (): Element | null => target.querySelector('button[aria-expanded]');
  // bits-ui's trigger has no `role`: it relies on `aria-haspopup` alone.
  const selectTrigger = (): Element | null => target.querySelector('[role="combobox"], [aria-haspopup="listbox"]');

  return {
    accordionTrigger,
    dismiss: pressEscape,
    toggleAccordion: () => {
      const trigger = accordionTrigger();

      if (trigger) clickElement(trigger);
    },
    flush: async () => {
      flushSync();
    },
    openSelect: () => {
      const trigger = selectTrigger();

      if (trigger) pointerDown(trigger);
    },
    root: target,
    selectTrigger,
    unmount: async () => {
      await unmount(instance);
      target.remove();
    }
  };
};

export const name = 'bits-ui';

export const mountAccordion = async (props: AccordionProps): Promise<Mounted> =>
  mountSvelte(BitsAccordion as never, props);

export const mountSelect = async (props: SelectProps): Promise<Mounted> => mountSvelte(BitsSelect as never, props);

const adapter: Adapter = { mountAccordion, mountSelect, name };

export default adapter;
