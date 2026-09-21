<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { ProgressCompact, provideProgressUi } from '@vean/aria/progress';
import { progressVariants } from '@/styles/progress';
import type { ProgressProps, ProgressEmits, ProgressSlots } from './types';

defineOptions({
  name: 'SProgress'
});

const props = defineProps<ProgressProps>();

const emit = defineEmits<ProgressEmits>();

defineSlots<ProgressSlots>();

const forwardedProps = useOmitProps(props, ['class', 'color', 'size', 'ui', 'indicatorProps']);

const listeners = useForwardListeners(emit);

const ui = computed(() => progressVariants({ color: props.color, size: props.size }, props.ui, { root: props.class }));

provideProgressUi(ui);
</script>

<template>
  <ProgressCompact v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <slot v-bind="slotProps" />
  </ProgressCompact>
</template>
