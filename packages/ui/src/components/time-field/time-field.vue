<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { TimeFieldCompact, provideTimeFieldUi } from '@vean/aria/time-field';
import { dateFieldVariants } from '@/styles/date-field';
import type { TimeFieldProps, TimeFieldEmits, TimeFieldSlots } from './types';

defineOptions({
  name: 'STimeField'
});

const props = defineProps<TimeFieldProps>();

const emit = defineEmits<TimeFieldEmits>();

defineSlots<TimeFieldSlots>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const ui = computed(() => dateFieldVariants({ size: props.size }, props.ui, { root: props.class }));

provideTimeFieldUi(ui);
</script>

<template>
  <TimeFieldCompact v-bind="forwardedProps" v-on="listeners">
    <template #leading>
      <slot name="leading" />
    </template>
    <template #trailing>
      <slot name="trailing" />
    </template>
  </TimeFieldCompact>
</template>
