<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, useOmitProps, usePickProps } from '../../composables';
import type { DefinedValue } from '../../types';
import MenuCheckboxOptions from '../menu/menu-checkbox-options-compact.vue';
import DropdownMenuWrapper from './dropdown-menu-wrapper-compact.vue';
import type {
  DropdownMenuCheckboxCompactProps,
  DropdownMenuCheckboxCompactEmits,
  DropdownMenuCheckboxCompactSlots
} from './types';

defineOptions({
  name: 'DropdownMenuCheckboxCompact'
});

const props = withDefaults(defineProps<DropdownMenuCheckboxCompactProps<T>>(), {
  open: undefined,
  modal: true,
  modelValue: undefined,
  defaultValue: () => []
});

const emit = defineEmits<DropdownMenuCheckboxCompactEmits<T>>();

const slots = defineSlots<DropdownMenuCheckboxCompactSlots<T>>();

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
] satisfies (keyof DropdownMenuCheckboxCompactProps)[];

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
    <MenuCheckboxOptions v-bind="forwardedOptionsProps" :portal-props="portalProps" v-on="forwardedListeners">
      <template v-for="slotKey in slotKeys" :key="slotKey" #[slotKey]="slotProps">
        <slot :name="slotKey" v-bind="slotProps" />
      </template>
    </MenuCheckboxOptions>
  </DropdownMenuWrapper>
</template>
