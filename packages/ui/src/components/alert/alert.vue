<script setup lang="ts">
import { computed } from 'vue';
import { AlertCompact, provideAlertUi } from '@vean/aria/alert';
import { useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { alertVariants } from '@/styles/alert';
import type { AlertProps, AlertEmits, AlertSlots } from './types';

defineOptions({
  name: 'SAlert'
});

const props = withDefaults(defineProps<AlertProps>(), {
  open: undefined
});

const emit = defineEmits<AlertEmits>();

const slots = defineSlots<AlertSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'color', 'variant', 'ui']);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  alertVariants(
    {
      size: props.size,
      color: props.color,
      variant: props.variant
    },
    props.ui,
    { root: props.class }
  )
);

provideAlertUi(ui);
</script>

<template>
  <AlertCompact v-bind="forwardedProps" @update:open="emit('update:open', $event)">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]>
      <slot :name="slotName" />
    </template>
  </AlertCompact>
</template>
