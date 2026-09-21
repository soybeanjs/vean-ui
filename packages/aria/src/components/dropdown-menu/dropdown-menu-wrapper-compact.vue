<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import { MenuArrow, MenuPortal } from '../menu';
import DropdownMenuContent from './dropdown-menu-content.vue';
import DropdownMenuRoot from './dropdown-menu-root.vue';
import DropdownMenuTrigger from './dropdown-menu-trigger.vue';
import type { DropdownMenuWrapperCompactProps, DropdownMenuWrapperCompactEmits } from './types';

defineOptions({
  name: 'DropdownMenuWrapperCompact'
});

const props = withDefaults(defineProps<DropdownMenuWrapperCompactProps>(), {
  open: undefined,
  modal: true
});

const emit = defineEmits<DropdownMenuWrapperCompactEmits>();

const forwardedRootProps = useOmitProps(props, [
  'disabled',
  'placement',
  'showArrow',
  'triggerProps',
  'portalProps',
  'contentProps',
  'popupProps',
  'arrowProps'
]);

const forwardedListeners = useForwardListeners(emit);

const triggerProps = computed(() => {
  return {
    ...props.triggerProps,
    asChild: props.triggerProps?.asChild ?? true,
    disabled: props.disabled ?? props.triggerProps?.disabled
  };
});

const contentProps = computed(() => {
  return {
    ...props.contentProps,
    popupProps: props.popupProps ?? props.contentProps?.popupProps,
    placement: props.placement ?? props.contentProps?.placement,
    sideOffset: props.contentProps?.sideOffset ?? (props.showArrow ? 0 : 8)
  };
});
</script>

<template>
  <DropdownMenuRoot v-bind="forwardedRootProps" @update:open="emit('update:open', $event)">
    <DropdownMenuTrigger v-bind="triggerProps">
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <MenuPortal v-bind="portalProps">
      <DropdownMenuContent v-bind="contentProps" v-on="forwardedListeners">
        <slot />
        <MenuArrow v-if="showArrow" v-bind="arrowProps" />
      </DropdownMenuContent>
    </MenuPortal>
  </DropdownMenuRoot>
</template>
