<script setup lang="ts">
import { computed, useId } from 'vue';
import { handleAndDispatchCustomEvent } from '../../shared';
import { useOmitProps } from '../../composables';
import type { SelectEvent } from '../../types';
import { Primitive } from '../primitive';
import { provideListboxItemContext, useCollectionItem, useListboxRootContext, useListboxUi } from './context';
import type { ListboxItemProps, ListboxItemEmits } from './types';

defineOptions({
  name: 'ListboxItem'
});

const props = defineProps<ListboxItemProps>();

const emit = defineEmits<ListboxItemEmits>();

const cls = useListboxUi('item');

const {
  modelValue,
  onModelValueChange,
  disabled: rootDisabled,
  focusable,
  highlightOnHover,
  highlightedElement,
  changeHighlight
} = useListboxRootContext('ListboxItem');
const { itemElement, setItemElement } = useCollectionItem({ value: props.value });

const forwardedProps = useOmitProps(props, ['value', 'disabled']);

const id = `vean-listbox-item-${useId()}`;

const disabled = computed(() => rootDisabled.value || props.disabled);
const isHighlighted = computed(() => itemElement.value === highlightedElement.value);
const isSelected = computed(() => {
  if (Array.isArray(modelValue.value)) {
    return modelValue.value.includes(props.value);
  }
  return modelValue.value === props.value;
});

const tabindex = computed(() => {
  if (!focusable.value) return '-1';

  return isHighlighted.value ? '0' : '-1';
});

const handleSelect = async (event: SelectEvent<string>) => {
  emit('select', event);
  if (event?.defaultPrevented) return;
  if (disabled.value || !event) return;
  onModelValueChange(props.value);

  if (!itemElement.value) return;
  changeHighlight(itemElement.value);
};

const onSelectCustomEvent = (ev: PointerEvent) => {
  const eventDetail = { originalEvent: ev, value: props.value };
  handleAndDispatchCustomEvent('listbox.select', handleSelect, eventDetail);
};

const onPointermove = () => {
  if (isHighlighted.value || !itemElement.value) return;

  if (highlightOnHover.value) {
    changeHighlight(itemElement.value, false, false);

    return;
  }

  if (!focusable.value) {
    changeHighlight(itemElement.value, false);
  }
};

provideListboxItemContext({
  isSelected
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :id="id"
    :ref="setItemElement"
    data-vean-listbox-item
    data-vean-collection-item
    :class="cls"
    role="option"
    :tabindex="tabindex"
    :aria-selected="isSelected"
    :disabled="disabled ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-highlighted="isHighlighted ? '' : undefined"
    :data-state="isSelected ? 'checked' : 'unchecked'"
    @click="onSelectCustomEvent"
    @keydown.space.prevent="onSelectCustomEvent"
    @pointermove="onPointermove"
  >
    <slot />
  </Primitive>
</template>
