<script setup lang="ts">
import { computed, shallowRef, mergeProps } from 'vue';
import { useForwardListeners, usePresence } from '../../composables';
import type { FocusOutsideEvent, HorizontalSide } from '../../types';
import { SUB_CLOSE_KEYS } from './shared';
import { useMenuContext, useMenuRootContext, useMenuSubAttributeContext } from './context';
import MenuContentImpl from './menu-content-impl.vue';
import type { MenuSubContentProps, MenuSubContentEmits } from './types';

defineOptions({
  name: 'MenuSubContent'
});

const props = withDefaults(defineProps<MenuSubContentProps>(), {
  prioritizePosition: true
});

const emit = defineEmits<MenuSubContentEmits>();

const listeners = useForwardListeners(emit);
const { open, popupElement, triggerId, triggerElement, onOpenChange } = useMenuContext('MenuSubContent');
const { dir, isUsingKeyboard, onClose } = useMenuRootContext('MenuSubContent');
const attrContext = useMenuSubAttributeContext();

const mergedProps = computed(() => mergeProps(props, { ...attrContext?.subContent?.value }));

const isPresent = props.forceMount ? shallowRef(true) : usePresence(popupElement, open);

const side = computed<HorizontalSide>(() => {
  return dir.value === 'rtl' ? 'left' : 'right';
});

const onOpenAutoFocus = () => {
  // when opening a submenu, focus content for keyboard users only
  if (isUsingKeyboard.value) {
    popupElement.value?.focus();
  }
};

const focusOutside = (event: FocusOutsideEvent) => {
  if (event.defaultPrevented) return;
  // We prevent closing when the trigger is focused to avoid triggering a re-open animation
  // on pointer interaction.
  if (event.target !== triggerElement.value) {
    onOpenChange(false);
  }
};

const onEscapeKeyDown = (event: KeyboardEvent) => {
  onClose();
  // ensure pressing escape in submenu doesn't escape full screen mode
  event.preventDefault();
};

const onKeyDown = (event: KeyboardEvent) => {
  // Submenu key events bubble through portals. We only care about keys in this menu.
  const isKeyDownInside = (event.currentTarget as HTMLElement)?.contains(event.target as HTMLElement);
  const isCloseKey = SUB_CLOSE_KEYS[dir.value].includes(event.key);
  if (isKeyDownInside && isCloseKey) {
    onOpenChange(false);
    // We focus manually because we prevented it in `onCloseAutoFocus`
    triggerElement.value?.focus();
    // prevent window from scrolling
    event.preventDefault();
  }
};
</script>

<template>
  <MenuContentImpl
    v-if="isPresent"
    data-vean-menu-sub-content
    v-bind="mergedProps"
    :trap-focus="false"
    :aria-labelledby="triggerId"
    align="start"
    :side="side"
    v-on="listeners"
    @open-auto-focus.prevent="onOpenAutoFocus"
    @close-auto-focus.prevent
    @escape-key-down="onEscapeKeyDown"
    @focus-outside="focusOutside"
    @keydown="onKeyDown"
  >
    <slot />
  </MenuContentImpl>
</template>
