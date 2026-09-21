<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { DropdownMenuCompact } from '@vean/aria/dropdown-menu';
import { keysOf } from '@vean/aria/shared';
import type { DefinedValue } from '@vean/aria/types';
import { provideMenuUi } from '../menu/context';
import type { DropdownMenuProps, DropdownMenuEmits, DropdownMenuSlots } from './types';

defineOptions({
  name: 'SDropdownMenu'
});

const props = withDefaults(defineProps<DropdownMenuProps<T>>(), {
  open: undefined,
  modal: true
});

const emit = defineEmits<DropdownMenuEmits<T>>();

const slots = defineSlots<DropdownMenuSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(key => key !== 'trigger'));

provideMenuUi(() => props);
</script>

<template>
  <DropdownMenuCompact v-bind="forwardedProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DropdownMenuCompact>
</template>
