<script setup lang="ts" generic="T extends AcceptableBooleanValue = AcceptableBooleanValue">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, useOmitProps, usePickProps } from '../../composables';
import type { AcceptableBooleanValue } from '../../types';
import MenuRadioOptions from '../menu/menu-radio-options-compact.vue';
import DropdownMenuWrapper from './dropdown-menu-wrapper-compact.vue';
import type {
  DropdownMenuRadioCompactProps,
  DropdownMenuRadioCompactEmits,
  DropdownMenuRadioCompactSlots
} from './types';

defineOptions({
  name: 'DropdownMenuRadioCompact'
});

const props = withDefaults(defineProps<DropdownMenuRadioCompactProps<T>>(), {
  open: undefined,
  modal: true,
  modelValue: undefined
});

const emit = defineEmits<DropdownMenuRadioCompactEmits<T>>();

const slots = defineSlots<DropdownMenuRadioCompactSlots<T>>();

const propKeys = [
  'defaultOpen',
  'open',
  'dir',
  'modal',
  'trigger',
  'delayDuration',
  'skipDelayDuration',
  'disabled',
  'placement',
  'showArrow',
  'triggerProps',
  'portalProps',
  'contentProps',
  'popupProps',
  'arrowProps'
] satisfies (keyof DropdownMenuRadioCompactProps)[];

const forwardedWrapperProps = usePickProps(props, [...propKeys]);

const forwardedOptionsProps = useOmitProps(props, [...propKeys]);

const forwardedListeners = useForwardListeners(emit);

const slotKeys = computed(() => keysOf(slots).filter(key => key !== 'trigger'));
</script>

<template>
  <DropdownMenuWrapper v-bind="forwardedWrapperProps" v-on="forwardedListeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <MenuRadioOptions v-bind="forwardedOptionsProps" :portal-props="portalProps" v-on="forwardedListeners">
      <template v-for="slotKey in slotKeys" :key="slotKey" #[slotKey]="slotProps">
        <slot :name="slotKey" v-bind="slotProps" />
      </template>
    </MenuRadioOptions>
  </DropdownMenuWrapper>
</template>
