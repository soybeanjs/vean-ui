<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { useCalendarRangeRootContext, useCalendarRangeUi } from './context';
import type { CalendarRangePrevProps } from './types';

defineOptions({
  name: 'CalendarRangePrev'
});

const props = defineProps<CalendarRangePrevProps>();

const cls = useCalendarRangeUi('prev');
const { disabled: rootDisabled, isPrevButtonDisabled, prevPage } = useCalendarRangeRootContext('CalendarRangePrev');
const messages = useLocaleMessages();

const disabled = computed(() => rootDisabled.value || isPrevButtonDisabled(props.prevPage) || props.disabled);

const buttonProps = useOmitProps(props, ['prevPage']);

const onClick = () => {
  prevPage(props.prevPage);
};
</script>

<template>
  <Button
    v-bind="buttonProps"
    data-vean-calendar-range-prev
    :class="cls"
    :disabled="disabled"
    :aria-label="props['aria-label'] ?? messages.calendar.prevPage"
    @click="onClick"
  >
    <slot :disabled="disabled">{{ messages.calendar.prevPage }}</slot>
  </Button>
</template>
