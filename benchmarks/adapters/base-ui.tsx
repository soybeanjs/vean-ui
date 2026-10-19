import { createElement } from 'react';
import type { ReactElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { Accordion } from '@base-ui-components/react/accordion';
import { Select } from '@base-ui-components/react/select';
import { clickElement, pressEscape } from './gestures';
import type { AccordionProps, Adapter, Mounted, SelectProps } from './types';

/**
 * Adapter: Base UI (React).
 *
 * Same two shapes as every other adapter. `flushSync` forces React to commit
 * before the clock stops — without it the benchmark would measure React's
 * scheduling decision instead of the render, and a concurrent-mode deferral
 * would read as "free".
 */

const makeItems = (count: number): { title: string; value: string }[] =>
  Array.from({ length: count }, (_, index) => ({ title: `Section ${index}`, value: `s${index}` }));

const makeOptions = (count: number): { label: string; value: string }[] =>
  Array.from({ length: count }, (_, index) => ({ label: `Option ${index}`, value: `o${index}` }));

const accordion = (props: AccordionProps): ReactElement =>
  createElement(
    Accordion.Root,
    // `multiple: false` so one panel is open at a time, matching `type: 'single'`
    // in the Vue libraries. Base UI has no `collapsible` prop — a re-openable
    // single panel is what `multiple: false` already gives. No `defaultValue`:
    // every item starts collapsed, which is the shape being compared.
    { multiple: false },
    makeItems(props.items).map(item =>
      createElement(
        Accordion.Item,
        { key: item.value, value: item.value },
        createElement(Accordion.Header, null, createElement(Accordion.Trigger, null, item.title)),
        createElement(Accordion.Panel, null, `Content ${item.value}`)
      )
    )
  );

const select = (props: SelectProps): ReactElement =>
  createElement(
    Select.Root,
    { defaultOpen: props.open ?? false, defaultValue: null },
    createElement(Select.Trigger, { 'aria-label': 'Pick' }, createElement(Select.Value, null)),
    createElement(
      Select.Portal,
      null,
      createElement(
        Select.Positioner,
        null,
        createElement(
          Select.Popup,
          null,
          makeOptions(props.options).map(option =>
            createElement(
              Select.Item,
              { key: option.value, value: option.value },
              createElement(Select.ItemText, null, option.label)
            )
          )
        )
      )
    )
  );

const mountReact = (element: ReactElement): Mounted => {
  const container = document.createElement('div');

  document.body.append(container);

  const root: Root = createRoot(container);

  flushSync(() => root.render(element));

  const accordionTrigger = (): Element | null => container.querySelector('button[aria-expanded]');
  const selectTrigger = (): Element | null => container.querySelector('[role="combobox"]');

  return {
    accordionTrigger,
    dismiss: pressEscape,
    toggleAccordion: () => {
      const trigger = accordionTrigger();

      if (trigger) clickElement(trigger);
    },
    flush: async () => {
      // `flushSync` needs a callback; an empty one is the whole point — it
      // commits whatever React has queued and nothing else.
      flushSync(() => {});
    },
    // Base UI opens on `click`, unlike the pointerdown-driven libraries. Found
    // by probing: `pointerdown` here leaves the popup shut.
    openSelect: () => {
      const trigger = selectTrigger();

      if (trigger) clickElement(trigger);
    },
    root: container,
    selectTrigger,
    unmount: async () => {
      flushSync(() => root.unmount());
      container.remove();
    }
  };
};

export const name = 'base-ui';

export const mountAccordion = async (props: AccordionProps): Promise<Mounted> => mountReact(accordion(props));

export const mountSelect = async (props: SelectProps): Promise<Mounted> => mountReact(select(props));

const adapter: Adapter = { mountAccordion, mountSelect, name };

export default adapter;
