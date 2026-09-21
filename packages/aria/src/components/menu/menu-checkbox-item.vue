<script setup lang="ts">
import { computed, nextTick } from 'vue';
import { SELECTION_KEYS } from '../../constants';
import { getCheckedState, isIndeterminate, isNullish, isValueEqualOrExist } from '../../shared';
import { useControllableState, useOmitProps, useForwardElement } from '../../composables';
import type { CheckedState } from '../../types';
import { ITEM_SELECT } from './shared';
import {
  useMenuContentContext,
  useMenuRootContext,
  provideMenuItemIndicatorContext,
  useMenuCheckboxGroupContext,
  useMenuUi
} from './context';
import MenuItemImpl from './menu-item-impl.vue';
import type { MenuCheckboxItemProps, MenuCheckboxItemEmits } from './types';

defineOptions({
  name: 'MenuCheckboxItem'
});

const props = defineProps<MenuCheckboxItemProps>();

const emit = defineEmits<MenuCheckboxItemEmits>();

const forwardedProps = useOmitProps(props, ['modelValue', 'value', 'disabled']);

const [menuItemElement, setMenuItemElement] = useForwardElement();
const { onClose } = useMenuRootContext('MenuItem');
const { searchRef } = useMenuContentContext('MenuItem');

const cls = useMenuUi('checkboxItem');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  false
);

const groupContext = useMenuCheckboxGroupContext();

const disabled = computed(() => groupContext?.disabled.value || props.disabled);

const state = computed<CheckedState>(() => {
  if (!isNullish(groupContext?.modelValue?.value)) {
    return isValueEqualOrExist(groupContext?.modelValue.value, props.value);
  }

  if (isNullish(modelValue.value)) {
    return false;
  }

  return modelValue.value === 'indeterminate' ? 'indeterminate' : modelValue.value;
});

const dataState = computed(() => getCheckedState(state.value));

const ariaChecked = computed(() => (isIndeterminate(state.value) ? 'mixed' : state.value));

const handleSelect = (event: Event) => {
  emit('select', event);

  if (isIndeterminate(modelValue.value)) {
    modelValue.value = true;
    return;
  }

  modelValue.value = !modelValue.value;

  if (props.value) {
    groupContext?.onModelValueChange(props.value);
  }
};

let isPointerDownRef = false;

const onSelect = async () => {
  if (props.disabled || !menuItemElement.value) return;

  const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
    bubbles: true,
    cancelable: true
  });
  handleSelect(itemSelectEvent);
  // let select event finish
  await nextTick();
  if (itemSelectEvent.defaultPrevented) {
    isPointerDownRef = false;
  } else {
    onClose();
  }
};

const onPointerDown = () => {
  isPointerDownRef = true;
};

const onPointerUp = async (event: PointerEvent) => {
  await nextTick();
  if (event.defaultPrevented) return;
  // Pointer down can move to a different menu item which should activate it on pointer up.
  // We dispatch a click for selection to allow composition with click based triggers and to
  // prevent Firefox from getting stuck in text selection mode when the menu closes.
  if (isPointerDownRef) return;
  (event.currentTarget as HTMLElement)?.click();
};

const onKeyDown = async (event: KeyboardEvent) => {
  if (props.disabled) return;

  const isTypingAhead = searchRef.value !== '';
  if (isTypingAhead && event.key === ' ') return;

  if (!SELECTION_KEYS.includes(event.key)) return;
  (event.currentTarget as HTMLElement)?.click();
  /**
   * We prevent default browser behavior for selection keys as they should trigger a selection only:
   *
   * - prevents space from scrolling the page.
   * - if keydown causes focus to move, prevents keydown from firing on the new target.
   */
  event.preventDefault();
};

provideMenuItemIndicatorContext({
  modelValue: state
});
</script>

<template>
  <MenuItemImpl
    v-bind="forwardedProps"
    :ref="setMenuItemElement"
    data-vean-menu-checkbox-item
    :class="cls"
    role="menuitemcheckbox"
    :disabled="disabled"
    :data-state="dataState"
    :aria-checked="ariaChecked"
    @click="onSelect"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @keydown="onKeyDown"
  >
    <slot :model-value="state" />
  </MenuItemImpl>
</template>
