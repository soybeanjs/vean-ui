<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import type { DateValue } from '@vean/aria/date';
import { DatePickerCompact, provideDatePickerUi } from '@vean/aria/date-picker';
import { datePickerVariants } from '@/styles/date-picker';
import Calendar from '../calendar/calendar.vue';
import type { DatePickerProps, DatePickerEmits, DatePickerSlots } from './types';

defineOptions({
  name: 'SDatePicker'
});

const props = withDefaults(defineProps<DatePickerProps>(), {
  open: undefined
});

const emit = defineEmits<DatePickerEmits>();

defineSlots<DatePickerSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'calendarUi']);

const listeners = useForwardListeners(emit);

const ui = computed(() => datePickerVariants({ size: props.size }, props.ui, { root: props.class }));

provideDatePickerUi(ui);

const handleSelect = (value: DateValue | undefined, close: () => void) => {
  if (value) {
    emit('update:modelValue', value);
    close();
  }
};
</script>

<template>
  <DatePickerCompact v-bind="forwardedProps" v-on="listeners">
    <template #leading>
      <slot name="leading" />
    </template>
    <template #default="{ calendarProps, close, onUpdatePlaceholder }">
      <Calendar
        v-bind="calendarProps"
        :size="size"
        :ui="calendarUi"
        @update:model-value="handleSelect($event, close)"
        @update:placeholder="onUpdatePlaceholder"
      />
    </template>
  </DatePickerCompact>
</template>
