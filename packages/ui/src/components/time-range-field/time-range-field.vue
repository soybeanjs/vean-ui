<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { TimeRangeFieldCompact, provideTimeRangeFieldUi } from '@vean/aria/time-range-field';
import { timeRangeFieldVariants } from '@/styles/time-range-field';
import type { TimeRangeFieldProps, TimeRangeFieldEmits, TimeRangeFieldSlots } from './types';

defineOptions({
  name: 'STimeRangeField'
});

const props = defineProps<TimeRangeFieldProps>();

const emit = defineEmits<TimeRangeFieldEmits>();

const slots = defineSlots<TimeRangeFieldSlots>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => timeRangeFieldVariants({ size: props.size }, props.ui, { root: props.class }));

provideTimeRangeFieldUi(ui);
</script>

<template>
  <TimeRangeFieldCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]>
      <slot :name="slotName" />
    </template>
  </TimeRangeFieldCompact>
</template>
