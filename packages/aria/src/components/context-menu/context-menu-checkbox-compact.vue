<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, useOmitProps, usePickProps } from '../../composables';
import type { DefinedValue } from '../../types';
import MenuCheckboxOptions from '../menu/menu-checkbox-options-compact.vue';
import ContextMenuWrapper from './context-menu-wrapper-compact.vue';
import type {
  ContextMenuCheckboxCompactProps,
  ContextMenuCheckboxCompactEmits,
  ContextMenuCheckboxCompactSlots
} from './types';

defineOptions({
  name: 'ContextMenuCheckboxCompact'
});

const props = withDefaults(defineProps<ContextMenuCheckboxCompactProps<T>>(), {
  modal: true,
  modelValue: undefined,
  defaultValue: () => []
});

const emit = defineEmits<ContextMenuCheckboxCompactEmits<T>>();

const slots = defineSlots<ContextMenuCheckboxCompactSlots<T>>();

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
] satisfies (keyof ContextMenuCheckboxCompactProps)[];

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
    <MenuCheckboxOptions v-bind="forwardedOptionsProps" :portal-props="portalProps" v-on="forwardedListeners">
      <template v-for="slotKey in slotKeys" :key="slotKey" #[slotKey]="slotProps">
        <slot :name="slotKey" v-bind="slotProps" />
      </template>
    </MenuCheckboxOptions>
  </ContextMenuWrapper>
</template>
