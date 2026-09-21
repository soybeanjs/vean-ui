<script setup lang="ts">
import { nextTick } from 'vue';
import { SELECTION_KEYS } from '../../constants';
import { useForwardElement } from '../../composables';
import { ITEM_SELECT } from './shared';
import { useMenuContentContext, useMenuRootContext, useMenuUi } from './context';
import MenuItemImpl from './menu-item-impl.vue';
import type { MenuItemProps, MenuItemEmits } from './types';

defineOptions({
  name: 'MenuItem'
});

const props = defineProps<MenuItemProps>();

const emit = defineEmits<MenuItemEmits>();

const [menuItemElement, setMenuItemElement] = useForwardElement();
const { onClose } = useMenuRootContext('MenuItem');
const { searchRef } = useMenuContentContext('MenuItem');

const cls = useMenuUi('item');

let isPointerDownRef = false;

const onSelect = async () => {
  if (props.disabled || !menuItemElement.value) return;

  const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
    bubbles: true,
    cancelable: true
  });
  emit('select', itemSelectEvent);
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
</script>

<template>
  <MenuItemImpl
    v-bind="props"
    :ref="setMenuItemElement"
    data-vean-menu-item
    :class="cls"
    @click="onSelect"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @keydown="onKeyDown"
  >
    <slot />
  </MenuItemImpl>
</template>
