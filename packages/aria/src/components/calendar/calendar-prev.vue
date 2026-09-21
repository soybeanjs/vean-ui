<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { useCalendarRootContext, useCalendarUi } from './context';
import type { CalendarPrevProps } from './types';

defineOptions({
  name: 'CalendarPrev'
});

const props = defineProps<CalendarPrevProps>();

const cls = useCalendarUi('prev');
const { disabled: rootDisabled, isPrevButtonDisabled, prevPage } = useCalendarRootContext('CalendarPrev');
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
    data-vean-calendar-prev
    :class="cls"
    :disabled="disabled"
    :aria-label="props['aria-label'] ?? messages.calendar.prevPage"
    @click="onClick"
  >
    <slot :disabled="disabled">{{ messages.calendar.prevPage }}</slot>
  </Button>
</template>
