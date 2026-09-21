<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, useOmitProps, usePickProps } from '../../composables';
import type { DefinedValue } from '../../types';
import MenuOptions from '../menu/menu-options-compact.vue';
import DropdownMenuWrapper from './dropdown-menu-wrapper-compact.vue';
import type { DropdownMenuCompactProps, DropdownMenuCompactEmits, DropdownMenuCompactSlots } from './types';

defineOptions({
  name: 'DropdownMenuCompact'
});

const props = withDefaults(defineProps<DropdownMenuCompactProps<T>>(), {
  open: undefined,
  modal: true
});

const emit = defineEmits<DropdownMenuCompactEmits<T>>();

const slots = defineSlots<DropdownMenuCompactSlots<T>>();

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
] satisfies (keyof DropdownMenuCompactProps)[];

const forwardedWrapperProps = usePickProps(props, [...propKeys]);

const forwardedOptionsProps = useOmitProps(props, [...propKeys]);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(key => key !== 'trigger'));
</script>

<template>
  <DropdownMenuWrapper v-bind="forwardedWrapperProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <MenuOptions v-bind="forwardedOptionsProps" :portal-props="portalProps" v-on="listeners">
      <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </MenuOptions>
  </DropdownMenuWrapper>
</template>
