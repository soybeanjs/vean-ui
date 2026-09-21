<script setup lang="ts">
import { computed, nextTick, shallowRef, useAttrs } from 'vue';
import { isMouseEvent } from '../../shared';
import { useOmitProps, useRovingFocusGroupItem } from '../../composables';
import { Primitive } from '../primitive';
import { useMenuContext, useMenuContentContext } from './context';
import type { MenuItemImplProps } from './types';

defineOptions({
  name: 'MenuItemImpl'
});

const props = defineProps<MenuItemImplProps>();

const attrs = useAttrs();

const { open } = useMenuContext('MenuItemImpl');
const { onItemEnter, onItemLeave } = useMenuContentContext('MenuItemImpl');

// Register with the roving focus group collection and expose the collection item + roving-focus
// data attributes (alongside `data-vean-menu-item-impl`) via the returned `itemProps`.
const { setItemElement, itemProps } = useRovingFocusGroupItem({
  itemData: computed(() => ({ textValue: props.textValue })),
  focusable: computed(() => !props.disabled)
});

const forwardedProps = useOmitProps(props, ['disabled', 'textValue']);

const mergedProps = computed(() => ({ ...forwardedProps.value, ...itemProps.value }));

const role = computed(() => (attrs['role'] as string | undefined) ?? 'menuitem');

const isFocused = shallowRef(false);

const onPointerMove = (event: PointerEvent) => {
  if (event.defaultPrevented || !isMouseEvent(event) || !open.value) return;

  if (props.disabled) {
    onItemLeave(event);
    return;
  }

  const defaultPrevented = onItemEnter(event);
  if (defaultPrevented) return;

  const target = event.currentTarget as HTMLElement;
  target?.focus({ preventScroll: true });
};

const onPointerLeave = async (event: PointerEvent) => {
  await nextTick();

  if (event.defaultPrevented || !isMouseEvent(event)) return;

  onItemLeave(event);
};

const onFocus = async (event: FocusEvent) => {
  await nextTick();

  if (event.defaultPrevented || props.disabled) return;

  isFocused.value = true;
};

const onBlur = async (event: FocusEvent) => {
  await nextTick();

  if (event.defaultPrevented) return;

  isFocused.value = false;
};
</script>

<template>
  <Primitive
    v-bind="mergedProps"
    :ref="setItemElement"
    data-vean-menu-item-impl
    :role="role"
    :aria-disabled="disabled || undefined"
    :data-highlighted="isFocused ? '' : undefined"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @focus="onFocus"
    @blur="onBlur"
  >
    <slot />
  </Primitive>
</template>
