<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import { useTimeRangeFieldUi } from './context';
import TimeRangeFieldInput from './time-range-field-input.vue';
import TimeRangeFieldRoot from './time-range-field-root.vue';
import type { TimeRangeFieldCompactProps, TimeRangeFieldCompactEmits, TimeRangeFieldCompactSlots } from './types';

defineOptions({
  name: 'TimeRangeFieldCompact'
});

const props = withDefaults(defineProps<TimeRangeFieldCompactProps>(), {
  separator: '–'
});

const emit = defineEmits<TimeRangeFieldCompactEmits>();

defineSlots<TimeRangeFieldCompactSlots>();

const forwardedProps = useOmitProps(props, ['inputProps', 'separator']);

const listeners = useForwardListeners(emit);

const ui = useTimeRangeFieldUi();
</script>

<template>
  <TimeRangeFieldRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <slot name="leading" />
    <div data-time-range-field-part="start" :class="ui.startRoot">
      <TimeRangeFieldInput
        v-for="(segment, index) in slotProps.startSegments"
        :key="`start-${segment.part}-${index}`"
        :part="segment.part"
        type="start"
        v-bind="inputProps"
      >
        {{ segment.value }}
      </TimeRangeFieldInput>
    </div>
    <div :class="ui.separator">
      <slot name="separator">
        {{ separator }}
      </slot>
    </div>
    <div data-time-range-field-part="end" :class="ui.endRoot">
      <TimeRangeFieldInput
        v-for="(segment, index) in slotProps.endSegments"
        :key="`end-${segment.part}-${index}`"
        :part="segment.part"
        type="end"
        v-bind="inputProps"
      >
        {{ segment.value }}
      </TimeRangeFieldInput>
    </div>
    <slot name="trailing" />
  </TimeRangeFieldRoot>
</template>
