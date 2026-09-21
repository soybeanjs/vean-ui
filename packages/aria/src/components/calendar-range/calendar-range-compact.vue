<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import { getMonthNumber, getYearNumber, toISODateString } from '../../date';
import Icon from '../_icon/icon.vue';
import CalendarRangeCellTrigger from './calendar-range-cell-trigger.vue';
import CalendarRangeCell from './calendar-range-cell.vue';
import CalendarRangeGridBody from './calendar-range-grid-body.vue';
import CalendarRangeGridHead from './calendar-range-grid-head.vue';
import CalendarRangeGridRow from './calendar-range-grid-row.vue';
import CalendarRangeGrid from './calendar-range-grid.vue';
import CalendarRangeHeadCell from './calendar-range-head-cell.vue';
import CalendarRangeHeader from './calendar-range-header.vue';
import CalendarRangeHeading from './calendar-range-heading.vue';
import CalendarRangeNext from './calendar-range-next.vue';
import CalendarRangePrev from './calendar-range-prev.vue';
import CalendarRangeRoot from './calendar-range-root.vue';
import type { CalendarRangeCompactProps, CalendarRangeCompactEmits, CalendarRangeCompactSlots } from './types';

defineOptions({
  name: 'CalendarRangeCompact'
});

const props = defineProps<CalendarRangeCompactProps>();

const emit = defineEmits<CalendarRangeCompactEmits>();

defineSlots<CalendarRangeCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'headerProps',
  'headingProps',
  'prevProps',
  'nextProps',
  'gridProps',
  'gridHeadProps',
  'gridBodyProps',
  'gridRowProps',
  'headCellProps',
  'cellProps',
  'cellTriggerProps'
]);

const listeners = useForwardListeners(emit);
</script>

<template>
  <CalendarRangeRoot v-bind="forwardedProps" v-on="listeners">
    <template #default="slotProps">
      <CalendarRangeHeader v-bind="headerProps">
        <CalendarRangePrev v-bind="prevProps">
          <template #default="compactSlotProps">
            <slot name="prev" :disabled="compactSlotProps.disabled">
              <Icon icon="lucide:chevron-left" />
            </slot>
          </template>
        </CalendarRangePrev>
        <CalendarRangeHeading v-bind="headingProps">
          <template #default>
            <slot
              name="heading"
              :heading-value="slotProps.headingValue"
              :selected-month="getMonthNumber(slotProps.placeholder)"
              :selected-year="getYearNumber(slotProps.placeholder)"
              :year-options="slotProps.yearOptions"
              :on-year-change="slotProps.onYearChange"
              :month-options="slotProps.monthOptions"
              :on-month-change="slotProps.onMonthChange"
            >
              {{ slotProps.headingValue }}
            </slot>
          </template>
        </CalendarRangeHeading>
        <CalendarRangeNext v-bind="nextProps">
          <template #default="compactSlotProps">
            <slot name="next" :disabled="compactSlotProps.disabled">
              <Icon icon="lucide:chevron-right" />
            </slot>
          </template>
        </CalendarRangeNext>
      </CalendarRangeHeader>
      <CalendarRangeGrid v-for="month in slotProps.grid" :key="toISODateString(month.value)" v-bind="gridProps">
        <CalendarRangeGridHead v-bind="gridHeadProps">
          <CalendarRangeGridRow v-bind="gridRowProps">
            <CalendarRangeHeadCell
              v-for="(weekDay, index) in slotProps.weekDays"
              :key="`${toISODateString(month.value)}-${weekDay}-${index}`"
              v-bind="headCellProps"
            >
              <slot name="head-cell" :date="month.value" :index="index" :label="weekDay">
                {{ weekDay }}
              </slot>
            </CalendarRangeHeadCell>
          </CalendarRangeGridRow>
        </CalendarRangeGridHead>
        <CalendarRangeGridBody v-bind="gridBodyProps">
          <CalendarRangeGridRow
            v-for="(week, weekIndex) in month.rows"
            :key="`${toISODateString(month.value)}-${weekIndex}`"
            v-bind="gridRowProps"
          >
            <CalendarRangeCell
              v-for="dateValue in week"
              :key="toISODateString(dateValue)"
              :date="dateValue"
              v-bind="cellProps"
            >
              <CalendarRangeCellTrigger :day="dateValue" :month="month.value" v-bind="cellTriggerProps">
                <template #default="triggerSlotProps">
                  <slot name="day" :day="dateValue" :month="month.value" v-bind="triggerSlotProps">
                    {{ triggerSlotProps.dayValue }}
                  </slot>
                </template>
              </CalendarRangeCellTrigger>
            </CalendarRangeCell>
          </CalendarRangeGridRow>
        </CalendarRangeGridBody>
      </CalendarRangeGrid>
      <slot :model-value="slotProps.modelValue" />
    </template>
  </CalendarRangeRoot>
</template>
