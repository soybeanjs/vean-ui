<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import { MenuArrow, MenuPortal } from '../menu';
import ContextMenuContent from './context-menu-content.vue';
import ContextMenuRoot from './context-menu-root.vue';
import ContextMenuTrigger from './context-menu-trigger.vue';
import type { ContextMenuWrapperCompactProps, ContextMenuWrapperCompactEmits } from './types';

defineOptions({
  name: 'ContextMenuWrapperCompact'
});

const props = withDefaults(defineProps<ContextMenuWrapperCompactProps>(), {
  modal: true
});

const emit = defineEmits<ContextMenuWrapperCompactEmits>();

const forwardedRootProps = useOmitProps(props, [
  'disabled',
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
    popupProps: props.popupProps ?? props.contentProps?.popupProps
  };
});
</script>

<template>
  <ContextMenuRoot v-bind="forwardedRootProps" @update:open="emit('update:open', $event)">
    <ContextMenuTrigger v-bind="triggerProps">
      <slot name="trigger" />
    </ContextMenuTrigger>
    <MenuPortal v-bind="portalProps">
      <ContextMenuContent v-bind="contentProps" v-on="forwardedListeners">
        <slot />
        <MenuArrow v-if="showArrow" v-bind="arrowProps" />
      </ContextMenuContent>
    </MenuPortal>
  </ContextMenuRoot>
</template>
