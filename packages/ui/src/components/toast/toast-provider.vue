<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { ToastProvider, provideToastUi } from '@vean/aria/toast';
import { toastVariants } from '@/styles/toast';
import type { ToastProviderProps } from './types';

defineOptions({
  name: 'SToastProvider'
});

const props = withDefaults(defineProps<ToastProviderProps>(), {
  showIcon: true,
  showClose: true
});

const forwardedProps = useOmitProps(props, ['size', 'ui']);

const ui = computed(() =>
  toastVariants(
    {
      size: props.size
    },
    props.ui
  )
);

provideToastUi(ui);
</script>

<template>
  <ToastProvider v-bind="forwardedProps">
    <slot />
  </ToastProvider>
</template>
