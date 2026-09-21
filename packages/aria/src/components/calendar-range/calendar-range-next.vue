<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { useCalendarRangeRootContext, useCalendarRangeUi } from './context';
import type { CalendarRangeNextProps } from './types';

defineOptions({
  name: 'CalendarRangeNext'
});

const props = defineProps<CalendarRangeNextProps>();

const cls = useCalendarRangeUi('next');
const { disabled: rootDisabled, isNextButtonDisabled, nextPage } = useCalendarRangeRootContext('CalendarRangeNext');
const messages = useLocaleMessages();

const disabled = computed(() => rootDisabled.value || isNextButtonDisabled(props.nextPage) || props.disabled);

const buttonProps = useOmitProps(props, ['nextPage']);

const onClick = () => {
  nextPage(props.nextPage);
};
</script>

<template>
  <Button
    v-bind="buttonProps"
    data-vean-calendar-range-next
    :class="cls"
    :disabled="disabled"
    :aria-label="props['aria-label'] ?? messages.calendar.nextPage"
    @click="onClick"
  >
    <slot :disabled="disabled">{{ messages.calendar.nextPage }}</slot>
  </Button>
</template>
