<script setup lang="ts">
import { computed } from 'vue';
import { getCollectionItemElements, getOpenFromSingleOrMultiple, toContext } from '../../shared';
import { useArrowNavigation, useOmitProps } from '../../composables';
import { CollapsibleRoot } from '../collapsible';
import { provideAccordionItemContext, useAccordionRootContext } from './context';
import type { AccordionItemProps } from './types';

defineOptions({
  name: 'AccordionItem'
});

const props = withDefaults(defineProps<AccordionItemProps>(), {
  unmountOnHide: undefined
});

const forwardedProps = useOmitProps(props, ['value']);

const {
  modelValue,
  disabled: rootDisabled,
  isMultiple,
  rootElement,
  orientation,
  dir,
  unmountOnHide: rootUnmountOnHide
} = useAccordionRootContext('AccordionItem');

const open = computed(() => getOpenFromSingleOrMultiple(props.value, modelValue.value, isMultiple.value));
const disabled = computed(() => rootDisabled.value || props.disabled);
const unmountOnHide = computed(() => props.unmountOnHide ?? rootUnmountOnHide.value);

const { dataDisabled, dataState } = provideAccordionItemContext({
  open,
  disabled,
  ...toContext(props, ['value'])
});

const onKeydown = (e: KeyboardEvent) => {
  if (!rootElement.value) return;

  const allCollectionItems = getCollectionItemElements(rootElement.value);
  const target = e.target as HTMLElement;
  const collectionItemIndex = allCollectionItems.findIndex(item => item === target);
  if (collectionItemIndex === -1) return;

  useArrowNavigation(e, target, rootElement.value, {
    arrowKeyOptions: orientation.value,
    dir: dir.value,
    focus: true
  });
};

defineExpose({
  open,
  dataDisabled
});
</script>

<template>
  <CollapsibleRoot
    v-bind="forwardedProps"
    data-vean-accordion-item
    :open="open"
    :disabled="disabled"
    :unmount-on-hide="unmountOnHide"
    :data-disabled="dataDisabled"
    :data-orientation="orientation"
    :data-state="dataState"
    @keydown="onKeydown"
  >
    <slot :open="open" />
  </CollapsibleRoot>
</template>
