<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleMessages } from '@vean/aria';
import { CalendarRangeCompact, provideCalendarRangeUi } from '@vean/aria/calendar-range';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { calendarRangeVariants } from '@/styles/calendar-range';
import { miniSizeMap } from '@/theme';
import SSelect from '../select/select.vue';
import type { CalendarRangeProps, CalendarRangeEmits, CalendarRangeSlots } from './types';

defineOptions({
  name: 'SCalendarRange'
});

const props = defineProps<CalendarRangeProps>();

const emit = defineEmits<CalendarRangeEmits>();

const slots = defineSlots<CalendarRangeSlots>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size']);

const listeners = useForwardListeners(emit);

const messages = useLocaleMessages();

const monthTriggerProps = computed(() => ({ 'aria-label': messages.value.calendar.selectMonth }));

const yearTriggerProps = computed(() => ({ 'aria-label': messages.value.calendar.selectYear }));

const slotNames = computed(() => keysOf(slots).filter(name => name !== 'heading'));

const ui = computed(() => calendarRangeVariants({ size: props.size }, props.ui, { root: props.class }));

const miniSize = computed(() => miniSizeMap[props.size || 'md']);

provideCalendarRangeUi(ui);
</script>

<template>
  <CalendarRangeCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <!-- @vue-expect-error ignore slot props type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
    <template v-if="$slots.heading" #heading="slotProps">
      <slot name="heading" v-bind="slotProps" />
    </template>
    <template v-else #heading="{ monthOptions, yearOptions, selectedMonth, selectedYear, onMonthChange, onYearChange }">
      <SSelect
        :size="miniSize"
        :disabled="disabled"
        :clearable="false"
        :items="monthOptions"
        :model-value="selectedMonth"
        :trigger-props="monthTriggerProps"
        :ui="{ trigger: 'w-fit' }"
        @update:model-value="onMonthChange"
      />
      <SSelect
        :size="miniSize"
        :disabled="disabled"
        :clearable="false"
        :items="yearOptions"
        :model-value="selectedYear"
        :trigger-props="yearTriggerProps"
        :ui="{ popup: 'max-h-72', trigger: 'w-fit' }"
        @update:model-value="onYearChange"
      />
    </template>
  </CalendarRangeCompact>
</template>
