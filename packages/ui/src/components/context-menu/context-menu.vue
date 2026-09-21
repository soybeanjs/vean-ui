<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { ContextMenuCompact } from '@vean/aria/context-menu';
import { keysOf } from '@vean/aria/shared';
import type { DefinedValue } from '@vean/aria/types';
import { provideMenuUi } from '../menu/context';
import type { ContextMenuProps, ContextMenuEmits, ContextMenuSlots } from './types';

defineOptions({
  name: 'SContextMenu'
});

const props = withDefaults(defineProps<ContextMenuProps<T>>(), {
  modal: true
});

const emit = defineEmits<ContextMenuEmits<T>>();

const slots = defineSlots<ContextMenuSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(key => key !== 'trigger'));

provideMenuUi(() => props);
</script>

<template>
  <ContextMenuCompact v-bind="forwardedProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </ContextMenuCompact>
</template>
