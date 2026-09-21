<script setup lang="ts" generic="M extends boolean = false">
import { computed } from 'vue';
import { useLocaleMessages } from '@vean/aria';
import { CalendarCompact, provideCalendarUi } from '@vean/aria/calendar';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { calendarVariants } from '@/styles/calendar';
import { miniSizeMap } from '@/theme';
import Icon from '../icon/icon.vue';
import SSelect from '../select/select.vue';
import type { CalendarProps, CalendarEmits, CalendarSlots } from './types';

defineOptions({
  name: 'SCalendar'
});

const props = defineProps<CalendarProps<M>>();

const emit = defineEmits<CalendarEmits<M>>();

defineSlots<CalendarSlots<M>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const messages = useLocaleMessages();

const monthTriggerProps = computed(() => ({ 'aria-label': messages.value.calendar.selectMonth }));

const yearTriggerProps = computed(() => ({ 'aria-label': messages.value.calendar.selectYear }));

const ui = computed(() => calendarVariants({ size: props.size }, props.ui, { root: props.class }));

const miniSize = computed(() => miniSizeMap[props.size || 'md']);

provideCalendarUi(ui);
</script>

<template>
  <CalendarCompact v-bind="forwardedProps" v-on="listeners">
    <template #prev="slotProps">
      <slot name="prev" v-bind="slotProps">
        <Icon icon="lucide:chevron-left" />
      </slot>
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
    <template #next="slotProps">
      <slot name="next" v-bind="slotProps">
        <Icon icon="lucide:chevron-right" />
      </slot>
    </template>
    <template #head-cell="slotProps">
      <slot name="head-cell" v-bind="slotProps">
        {{ slotProps.label }}
      </slot>
    </template>
    <template #day="slotProps">
      <slot name="day" v-bind="slotProps">
        {{ slotProps.dayValue }}
      </slot>
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CalendarCompact>
</template>
