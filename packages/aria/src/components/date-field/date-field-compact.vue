<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import DateFieldInput from './date-field-input.vue';
import DateFieldRoot from './date-field-root.vue';
import type { DateFieldCompactProps, DateFieldCompactEmits } from './types';

defineOptions({
  name: 'DateFieldCompact'
});

const props = defineProps<DateFieldCompactProps>();

const emit = defineEmits<DateFieldCompactEmits>();

const forwardedProps = useOmitProps(props, ['inputProps']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <DateFieldRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <slot name="leading" />
    <DateFieldInput
      v-for="(segment, index) in slotProps.segments"
      :key="`${segment.part}-${index}`"
      :part="segment.part"
      v-bind="inputProps"
    >
      {{ segment.value }}
    </DateFieldInput>
    <slot name="trailing" />
  </DateFieldRoot>
</template>
