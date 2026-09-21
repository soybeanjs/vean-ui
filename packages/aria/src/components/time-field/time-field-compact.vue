<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import TimeFieldInput from './time-field-input.vue';
import TimeFieldRoot from './time-field-root.vue';
import type { TimeFieldCompactProps, TimeFieldCompactEmits, TimeFieldCompactSlots } from './types';

defineOptions({
  name: 'TimeFieldCompact'
});

const props = defineProps<TimeFieldCompactProps>();

const emit = defineEmits<TimeFieldCompactEmits>();

defineSlots<TimeFieldCompactSlots>();

const forwardedProps = useOmitProps(props, ['inputProps']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <TimeFieldRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <slot name="leading" />
    <TimeFieldInput
      v-for="(segment, index) in slotProps.segments"
      :key="`${segment.part}-${index}`"
      :part="segment.part"
      v-bind="inputProps"
    >
      {{ segment.value }}
    </TimeFieldInput>
    <slot name="trailing" />
  </TimeFieldRoot>
</template>
