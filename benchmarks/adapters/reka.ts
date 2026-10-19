import { defineComponent, h, nextTick } from 'vue';
import type { Component } from 'vue';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui';
import { render } from 'vitest-browser-vue';
import { clickElement, pointerDown, pressEscape } from './gestures';
import type { AccordionProps, Adapter, Mounted, SelectProps } from './types';

/**
 * Adapter: `reka-ui` — the closest peer to `@vean/aria`. Same Vue runtime, same
 * headless-primitive philosophy, so a difference here is a difference in
 * implementation rather than in the framework.
 *
 * Both shapes use reka's compositional parts directly, with no styling and no
 * wrapper of ours, which is the cheapest way to build them in that library.
 */

const makeItems = (count: number): { title: string; value: string }[] =>
  Array.from({ length: count }, (_, index) => ({ title: `Section ${index}`, value: `s${index}` }));

const makeOptions = (count: number): { label: string; value: string }[] =>
  Array.from({ length: count }, (_, index) => ({ label: `Option ${index}`, value: `o${index}` }));

const Accordion = defineComponent({
  name: 'RekaAccordion',
  props: { items: { default: 10, type: Number } },
  setup: props => () =>
    h(
      AccordionRoot,
      { collapsible: true, type: 'single' },
      {
        default: () =>
          makeItems(props.items).map(item =>
            h(
              AccordionItem,
              { key: item.value, value: item.value },
              {
                default: () => [
                  h(AccordionHeader, null, {
                    default: () => h(AccordionTrigger, null, { default: () => item.title })
                  }),
                  h(AccordionContent, null, { default: () => `Content ${item.value}` })
                ]
              }
            )
          )
      }
    )
});

const Select = defineComponent({
  name: 'RekaSelect',
  props: { open: { default: false, type: Boolean }, options: { default: 10, type: Number } },
  setup: props => () =>
    h(
      SelectRoot,
      { defaultOpen: props.open },
      {
        default: () => [
          h(SelectTrigger, { 'aria-label': 'Pick' }, { default: () => h(SelectValue, { placeholder: 'Pick' }) }),
          h(SelectPortal, null, {
            default: () =>
              h(SelectContent, null, {
                default: () =>
                  h(SelectViewport, null, {
                    default: () =>
                      makeOptions(props.options).map(option =>
                        h(
                          SelectItem,
                          { key: option.value, value: option.value },
                          {
                            default: () => h(SelectItemText, null, { default: () => option.label })
                          }
                        )
                      )
                  })
              })
          })
        ]
      }
    )
});

const mountComponent = async (component: Component, props: object): Promise<Mounted> => {
  const result = await render(component, { props });

  await nextTick();

  const root = result.container as HTMLElement;
  const accordionTrigger = (): Element | null => root.querySelector('button[aria-expanded]');
  const selectTrigger = (): Element | null => root.querySelector('[role="combobox"]');

  return {
    accordionTrigger,
    dismiss: pressEscape,
    toggleAccordion: () => {
      const trigger = accordionTrigger();

      if (trigger) clickElement(trigger);
    },
    flush: () => nextTick(),
    openSelect: () => {
      const trigger = selectTrigger();

      if (trigger) pointerDown(trigger);
    },
    root,
    selectTrigger,
    unmount: async () => result.unmount()
  };
};

export const name = 'reka-ui';

export const mountAccordion = (props: AccordionProps): Promise<Mounted> => mountComponent(Accordion, props);

export const mountSelect = (props: SelectProps): Promise<Mounted> => mountComponent(Select, props);

const adapter: Adapter = { mountAccordion, mountSelect, name };

export default adapter;
