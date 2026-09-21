<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, useOmitProps, usePickProps } from '../../composables';
import type { DefinedValue } from '../../types';
import MenuOptions from '../menu/menu-options-compact.vue';
import SContextMenuWrapper from './context-menu-wrapper-compact.vue';
import type { ContextMenuCompactProps, ContextMenuCompactEmits, ContextMenuCompactSlots } from './types';

defineOptions({
  name: 'ContextMenuCompact'
});

const props = withDefaults(defineProps<ContextMenuCompactProps<T>>(), {
  modal: true
});

const emit = defineEmits<ContextMenuCompactEmits<T>>();

const slots = defineSlots<ContextMenuCompactSlots<T>>();

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
] satisfies (keyof ContextMenuCompactProps)[];

const forwardedWrapperProps = usePickProps(props, [...propKeys]);

const forwardedOptionsProps = useOmitProps(props, [...propKeys]);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(key => key !== 'trigger'));
</script>

<template>
  <SContextMenuWrapper v-bind="forwardedWrapperProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <MenuOptions v-bind="forwardedOptionsProps" :portal-props="portalProps" v-on="listeners">
      <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </MenuOptions>
  </SContextMenuWrapper>
</template>
