<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import { useDateRangeFieldUi } from './context';
import DateRangeFieldInput from './date-range-field-input.vue';
import DateRangeFieldRoot from './date-range-field-root.vue';
import type { DateRangeFieldCompactProps, DateRangeFieldCompactEmits, DateRangeFieldCompactSlots } from './types';

defineOptions({
  name: 'DateRangeFieldCompact'
});

const props = withDefaults(defineProps<DateRangeFieldCompactProps>(), {
  separator: '–'
});

const emit = defineEmits<DateRangeFieldCompactEmits>();

defineSlots<DateRangeFieldCompactSlots>();

const forwardedProps = useOmitProps(props, ['inputProps', 'separator']);

const listeners = useForwardListeners(emit);

const ui = useDateRangeFieldUi();
</script>

<template>
  <DateRangeFieldRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <slot name="leading" />
    <div data-date-range-field-part="start" :class="ui.startRoot">
      <DateRangeFieldInput
        v-for="(segment, index) in slotProps.startSegments"
        :key="`start-${segment.part}-${index}`"
        :part="segment.part"
        type="start"
        v-bind="inputProps"
      >
        {{ segment.value }}
      </DateRangeFieldInput>
    </div>
    <div :class="ui.separator">
      <slot name="separator">{{ separator }}</slot>
    </div>
    <div data-date-range-field-part="end" :class="ui.endRoot">
      <DateRangeFieldInput
        v-for="(segment, index) in slotProps.endSegments"
        :key="`end-${segment.part}-${index}`"
        :part="segment.part"
        type="end"
        v-bind="inputProps"
      >
        {{ segment.value }}
      </DateRangeFieldInput>
    </div>
    <slot name="trailing" />
  </DateRangeFieldRoot>
</template>
