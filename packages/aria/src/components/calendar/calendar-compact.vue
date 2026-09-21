<script setup lang="ts" generic="M extends boolean = false">
import { useForwardListeners, useOmitProps } from '../../composables';
import { getMonthNumber, getYearNumber, toISODateString } from '../../date';
import Icon from '../_icon/icon.vue';
import CalendarCellTrigger from './calendar-cell-trigger.vue';
import CalendarCell from './calendar-cell.vue';
import CalendarGridBody from './calendar-grid-body.vue';
import CalendarGridHead from './calendar-grid-head.vue';
import CalendarGridRow from './calendar-grid-row.vue';
import CalendarGrid from './calendar-grid.vue';
import CalendarHeadCell from './calendar-head-cell.vue';
import CalendarHeader from './calendar-header.vue';
import CalendarHeading from './calendar-heading.vue';
import CalendarNext from './calendar-next.vue';
import CalendarPrev from './calendar-prev.vue';
import CalendarRoot from './calendar-root.vue';
import type { CalendarCompactProps, CalendarCompactEmits, CalendarCompactSlots } from './types';

defineOptions({
  name: 'CalendarCompact'
});

const props = defineProps<CalendarCompactProps<M>>();

const emit = defineEmits<CalendarCompactEmits<M>>();

defineSlots<CalendarCompactSlots<M>>();

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
  <CalendarRoot v-bind="forwardedProps" v-on="listeners">
    <template #default="slotProps">
      <CalendarHeader v-bind="headerProps">
        <CalendarPrev v-bind="prevProps">
          <template #default="compactSlotProps">
            <slot name="prev" :disabled="compactSlotProps.disabled">
              <Icon icon="lucide:chevron-left" />
            </slot>
          </template>
        </CalendarPrev>
        <CalendarHeading v-bind="headingProps">
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
        </CalendarHeading>
        <CalendarNext v-bind="nextProps">
          <template #default="compactSlotProps">
            <slot name="next" :disabled="compactSlotProps.disabled">
              <Icon icon="lucide:chevron-right" />
            </slot>
          </template>
        </CalendarNext>
      </CalendarHeader>

      <CalendarGrid v-for="month in slotProps.grid" :key="toISODateString(month.value)" v-bind="gridProps">
        <CalendarGridHead v-bind="gridHeadProps">
          <CalendarGridRow v-bind="gridRowProps">
            <CalendarHeadCell
              v-for="(weekDay, index) in slotProps.weekDays"
              :key="`${toISODateString(month.value)}-${weekDay}-${index}`"
              v-bind="headCellProps"
            >
              <slot name="head-cell" :date="month.value" :index="index" :label="weekDay">
                {{ weekDay }}
              </slot>
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody v-bind="gridBodyProps">
          <CalendarGridRow
            v-for="(week, weekIndex) in month.rows"
            :key="`${toISODateString(month.value)}-${weekIndex}`"
            v-bind="gridRowProps"
          >
            <CalendarCell
              v-for="dateValue in week"
              :key="toISODateString(dateValue)"
              :date="dateValue"
              v-bind="cellProps"
            >
              <CalendarCellTrigger :day="dateValue" :month="month.value" v-bind="cellTriggerProps">
                <template #default="triggerSlotProps">
                  <slot name="day" v-bind="triggerSlotProps" :day="dateValue" :month="month.value">
                    {{ triggerSlotProps.dayValue }}
                  </slot>
                </template>
              </CalendarCellTrigger>
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>

      <slot :model-value="slotProps.modelValue" />
    </template>
  </CalendarRoot>
</template>
