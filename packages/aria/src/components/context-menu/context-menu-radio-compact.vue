<script setup lang="ts" generic="T extends AcceptableBooleanValue = AcceptableBooleanValue">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, useOmitProps, usePickProps } from '../../composables';
import type { AcceptableBooleanValue } from '../../types';
import MenuRadioOptions from '../menu/menu-radio-options-compact.vue';
import ContextMenuWrapper from './context-menu-wrapper-compact.vue';
import type { ContextMenuRadioCompactProps, ContextMenuRadioCompactEmits, ContextMenuRadioCompactSlots } from './types';

defineOptions({
  name: 'ContextMenuRadioCompact'
});

const props = withDefaults(defineProps<ContextMenuRadioCompactProps<T>>(), {
  modal: true,
  modelValue: undefined
});

const emit = defineEmits<ContextMenuRadioCompactEmits<T>>();

const slots = defineSlots<ContextMenuRadioCompactSlots<T>>();

const propKeys = [
  'dir',
  'modal',
  'disabled',
  'showArrow',
  'triggerProps',
  'portalProps',
  'contentProps',
  'popupProps',
  'arrowProps'
] satisfies (keyof ContextMenuRadioCompactProps)[];

const forwardedWrapperProps = usePickProps(props, [...propKeys]);

const forwardedOptionsProps = useOmitProps(props, [...propKeys]);

const forwardedListeners = useForwardListeners(emit);

const slotKeys = computed(() => keysOf(slots).filter(key => key !== 'trigger'));
</script>

<template>
  <ContextMenuWrapper v-bind="forwardedWrapperProps" v-on="forwardedListeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <MenuRadioOptions v-bind="forwardedOptionsProps" :portal-props="portalProps" v-on="forwardedListeners">
      <template v-for="slotKey in slotKeys" :key="slotKey" #[slotKey]="slotProps">
        <slot :name="slotKey" v-bind="slotProps" />
      </template>
    </MenuRadioOptions>
  </ContextMenuWrapper>
</template>
