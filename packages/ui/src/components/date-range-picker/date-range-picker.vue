<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { DateRangePickerCompact, provideDateRangePickerUi } from '@vean/aria/date-range-picker';
import { dateRangePickerVariants } from '@/styles/date-range-picker';
import CalendarRange from '../calendar-range/calendar-range.vue';
import type { DateRangePickerProps, DateRangePickerEmits, DateRangePickerSlots } from './types';

defineOptions({
  name: 'SDateRangePicker'
});

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  open: undefined
});

const emit = defineEmits<DateRangePickerEmits>();

defineSlots<DateRangePickerSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'calendarRangeUi']);

const listeners = useForwardListeners(emit);

const ui = computed(() => dateRangePickerVariants({ size: props.size }, props.ui, { root: props.class }));

provideDateRangePickerUi(ui);
</script>

<template>
  <DateRangePickerCompact v-bind="forwardedProps" v-on="listeners">
    <template #leading>
      <slot name="leading" />
    </template>
    <template #separator>
      <slot name="separator" />
    </template>
    <template #default="{ calendarRangeProps, close, onUpdateModelValue, onUpdatePlaceholder }">
      <CalendarRange
        v-bind="calendarRangeProps"
        :size="size"
        :ui="calendarRangeUi"
        @update:model-value="
          value => {
            onUpdateModelValue(value);
            if (value.start && value.end) {
              close();
            }
          }
        "
        @update:placeholder="onUpdatePlaceholder"
      />
    </template>
  </DateRangePickerCompact>
</template>
