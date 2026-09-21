import { computed, shallowRef, useId } from 'vue';
import { getDisclosureState } from '../../shared';
import { provideCollapsibleUi } from '../collapsible/context';
import { useContext, useForwardElement, useUiContext } from '../../composables';
import type { DisclosureState } from '../../types';
import type { AccordionItemContextParams, AccordionRootContext, AccordionUiSlot } from './types';

export const [provideAccordionRootContext, useAccordionRootContext] = useContext<AccordionRootContext>('AccordionRoot');

export const [provideAccordionItemContext, useAccordionItemContext] = useContext(
  'AccordionItem',
  (params: AccordionItemContextParams) => {
    const { open, disabled } = params;

    const [triggerElement, setTriggerElement] = useForwardElement();

    const triggerId = shallowRef('');
    const generatedTriggerId = `vean-accordion-trigger-${useId()}`;

    const initTriggerId = () => {
      if (triggerId.value) return;
      triggerId.value = generatedTriggerId;
    };

    const dataDisabled = computed(() => (disabled.value ? '' : undefined));
    const dataState = computed<DisclosureState>(() => getDisclosureState(open.value));

    return {
      ...params,
      triggerElement,
      setTriggerElement,
      triggerId,
      initTriggerId,
      dataDisabled,
      dataState
    };
  }
);

export const [provideAccordionUi, useAccordionUi] = useUiContext<AccordionUiSlot>('AccordionUi', ui => {
  const collapsibleUi = computed(() => ({
    root: ui.value?.item,
    trigger: ui.value?.trigger,
    content: ui.value?.content
  }));

  provideCollapsibleUi(collapsibleUi);

  return ui;
});
