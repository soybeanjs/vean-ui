<script setup lang="ts" generic="T extends AcceptableBooleanValue = AcceptableBooleanValue">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { ContextMenuRadioCompact } from '@vean/aria/context-menu';
import { keysOf } from '@vean/aria/shared';
import type { AcceptableBooleanValue } from '@vean/aria/types';
import { provideMenuUi } from '../menu/context';
import type { ContextMenuRadioProps, ContextMenuRadioEmits, ContextMenuRadioSlots } from './types';

defineOptions({
  name: 'SContextMenuRadio'
});

const props = withDefaults(defineProps<ContextMenuRadioProps<T>>(), {
  modal: true,
  modelValue: undefined
});

const emit = defineEmits<ContextMenuRadioEmits<T>>();

const slots = defineSlots<ContextMenuRadioSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'indicatorPosition']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(key => key !== 'trigger'));

provideMenuUi(() => props);
</script>

<template>
  <ContextMenuRadioCompact v-bind="forwardedProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </ContextMenuRadioCompact>
</template>
