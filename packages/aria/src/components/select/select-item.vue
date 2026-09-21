<script setup lang="ts">
import { computed, nextTick, shallowRef } from 'vue';
import {
  getActiveElement,
  getBinaryCheckedState,
  handleAndDispatchCustomEvent,
  isValueEqualOrExist,
  toContext
} from '../../shared';
import { useForwardElement } from '../../composables';
import type { DefinedValue } from '../../types';
import { Primitive } from '../primitive';
import { SELECTION_KEYS, SELECT_EVENT } from './shared';
import {
  provideSelectItemContext,
  useCollectionItem,
  useSelectContentContext,
  useSelectRootContext,
  useSelectUi
} from './context';
import type { SelectItemProps, SelectItemEmits, SelectItemEvent } from './types';

defineOptions({
  name: 'SelectItem'
});

const props = defineProps<SelectItemProps>();

const emit = defineEmits<SelectItemEmits>();

const { modelValue, onModelValueChange, onOpenChange, isMultiple } = useSelectRootContext('SelectItem');

const cls = useSelectUi('item');

const isSelected = computed(() => isValueEqualOrExist(modelValue.value, props.value));

const { textId, textValue, disabled } = provideSelectItemContext({
  ...toContext(props, ['textValue', 'disabled']),
  value: props.value,
  isSelected
});

const { onItemElementChange } = useCollectionItem(() => ({
  textValue: textValue.value
}));

const { onSelectedItemElementChange, onItemElementLeave, search } = useSelectContentContext('SelectItem');
const [_, setItemElement] = useForwardElement(node => {
  onSelectedItemElementChange(node, props.value, props.disabled);
  onItemElementChange(node);
});

const dataState = computed(() => getBinaryCheckedState(isSelected.value));

const isFocused = shallowRef(false);
const onFocus = () => {
  isFocused.value = true;
};
const onBlur = () => {
  isFocused.value = false;
};

async function onCustomSelect(event: PointerEvent | KeyboardEvent) {
  if (event.defaultPrevented) return;

  const eventDetail = { originalEvent: event, value: props.value };
  handleAndDispatchCustomEvent(SELECT_EVENT, onSelect, eventDetail);
}

async function onSelect(event: SelectItemEvent<DefinedValue>) {
  await nextTick();
  emit('select', event);
  if (event.defaultPrevented) return;
  if (disabled.value) return;

  onModelValueChange(props.value);

  if (isMultiple.value) return;

  onOpenChange(false);
}

async function onPointerMove(event: PointerEvent) {
  await nextTick();
  if (event.defaultPrevented) return;
  if (disabled.value) {
    onItemElementLeave();
  } else {
    // even though safari doesn't support this option, it's acceptable
    // as it only means it might scroll a few pixels when using the pointer.
    const target = event.currentTarget as HTMLElement | null;
    target?.focus({ preventScroll: true });
  }
}

async function onPointerLeave(event: PointerEvent) {
  await nextTick();
  if (event.defaultPrevented) return;
  if (event.currentTarget === getActiveElement()) {
    onItemElementLeave();
  }
}

async function onKeyDown(event: KeyboardEvent) {
  await nextTick();
  if (event.defaultPrevented) return;
  const isTypingAhead = search.value !== '';
  if (isTypingAhead && event.key === ' ') return;
  if (SELECTION_KEYS.includes(event.key)) {
    onCustomSelect(event);
  }
  // prevent page scroll if using the space key to select an item
  if (event.key === ' ') {
    event.preventDefault();
  }
}

function onPointerDown(event: PointerEvent) {
  (event.currentTarget as HTMLElement).focus({ preventScroll: true });
}

if (props.value === '') {
  throw new Error(
    'A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.'
  );
}
</script>

<template>
  <Primitive
    :ref="setItemElement"
    data-vean-select-item
    data-vean-collection-item
    :as="as"
    :as-child="asChild"
    :class="cls"
    :aria-disabled="disabled || undefined"
    :data-highlighted="isFocused ? '' : undefined"
    :aria-labelledby="textId"
    :aria-selected="isSelected"
    :data-disabled="disabled ? '' : undefined"
    :data-state="dataState"
    role="option"
    :tabindex="disabled ? undefined : -1"
    @focus="onFocus"
    @blur="onBlur"
    @pointerup="onCustomSelect"
    @pointerdown="onPointerDown"
    @touchend.prevent.stop
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @keydown="onKeyDown"
  >
    <slot />
  </Primitive>
</template>
