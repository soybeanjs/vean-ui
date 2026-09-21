<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import ProgressIndicator from './progress-indicator.vue';
import ProgressRoot from './progress-root.vue';
import type { ProgressCompactProps, ProgressCompactEmits, ProgressCompactSlots } from './types';

defineOptions({
  name: 'ProgressCompact'
});

const props = defineProps<ProgressCompactProps>();

const emit = defineEmits<ProgressCompactEmits>();

defineSlots<ProgressCompactSlots>();

const forwardedProps = useOmitProps(props, ['indicatorProps']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <ProgressRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <ProgressIndicator v-bind="indicatorProps">
      <slot v-bind="slotProps" />
    </ProgressIndicator>
  </ProgressRoot>
</template>
