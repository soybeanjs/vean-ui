<script setup lang="ts">
import { computed, nextTick } from 'vue';
import { SELECTION_KEYS } from '../../constants';
import { getCheckedState, isIndeterminate } from '../../shared';
import { useOmitProps, useForwardElement } from '../../composables';
import { ITEM_SELECT } from './shared';
import {
  provideMenuItemIndicatorContext,
  useMenuRadioGroupContext,
  useMenuContentContext,
  useMenuRootContext,
  useMenuUi
} from './context';
import MenuItemImpl from './menu-item-impl.vue';
import type { MenuRadioItemProps, MenuRadioItemEmits } from './types';

defineOptions({
  name: 'MenuRadioItem'
});

const props = defineProps<MenuRadioItemProps>();

const emit = defineEmits<MenuRadioItemEmits>();

const forwardedProps = useOmitProps(props, ['value', 'disabled']);

const [menuItemElement, setMenuItemElement] = useForwardElement();
const { onClose } = useMenuRootContext('MenuItem');
const { searchRef } = useMenuContentContext('MenuItem');

const cls = useMenuUi('radioItem');

const {
  modelValue: radioGroupModelValue,
  onModelValueChange,
  disabled: radioGroupDisabled
} = useMenuRadioGroupContext('MenuRadioItem');

const modelValue = computed(() => radioGroupModelValue.value === props.value);

const disabled = computed(() => radioGroupDisabled.value || props.disabled);

const ariaChecked = computed(() => (isIndeterminate(modelValue.value) ? 'mixed' : modelValue.value));

const dataState = computed(() => getCheckedState(modelValue.value));

let isPointerDownRef = false;

const onSelect = async () => {
  if (props.disabled || !menuItemElement.value) return;

  const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
    bubbles: true,
    cancelable: true
  });
  emit('select', itemSelectEvent);

  onModelValueChange(props.value);
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
  modelValue
});
</script>

<template>
  <MenuItemImpl
    v-bind="forwardedProps"
    :ref="setMenuItemElement"
    data-vean-menu-radio-item
    :class="cls"
    role="menuitemradio"
    :disabled="disabled"
    :aria-checked="ariaChecked"
    :data-state="dataState"
    @click="onSelect"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @keydown="onKeyDown"
  >
    <slot :model-value="modelValue" />
  </MenuItemImpl>
</template>
