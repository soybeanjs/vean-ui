<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { MenubarCompact, provideMenubarUi } from '@vean/aria/menubar';
import { keysOf } from '@vean/aria/shared';
import type { DefinedValue } from '@vean/aria/types';
import { menubarVariants } from '@/styles/menubar';
import { provideMenuUi } from '../menu/context';
import type { MenubarProps, MenubarEmits, MenubarSlots } from './types';

defineOptions({
  name: 'SMenubar'
});

const props = defineProps<MenubarProps<T>>();

const emit = defineEmits<MenubarEmits<T>>();

const slots = defineSlots<MenubarSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'indicatorPosition']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(key => key !== 'trigger' && key !== 'more-trigger'));

const ui = computed(() =>
  menubarVariants({ size: props.size, collapsible: props.collapsible }, props.ui, {
    root: props.class
  })
);

provideMenubarUi(ui);
provideMenuUi(() => props);
</script>

<template>
  <MenubarCompact v-bind="forwardedProps" v-on="listeners">
    <template #trigger="{ item }">
      <slot name="trigger" :item="item" />
    </template>
    <template #more-trigger>
      <slot name="more-trigger" />
    </template>
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </MenubarCompact>
</template>
