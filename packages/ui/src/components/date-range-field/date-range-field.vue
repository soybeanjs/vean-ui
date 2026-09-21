<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { DateRangeFieldCompact, provideDateRangeFieldUi } from '@vean/aria/date-range-field';
import { keysOf } from '@vean/aria/shared';
import { dateRangeFieldVariants } from '@/styles/date-range-field';
import type { DateRangeFieldProps, DateRangeFieldEmits, DateRangeFieldSlots } from './types';

defineOptions({
  name: 'SDateRangeField'
});

const props = defineProps<DateRangeFieldProps>();

const emit = defineEmits<DateRangeFieldEmits>();

const slots = defineSlots<DateRangeFieldSlots>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => dateRangeFieldVariants({ size: props.size }, props.ui, { root: props.class }));

provideDateRangeFieldUi(ui);
</script>

<template>
  <DateRangeFieldCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]>
      <slot :name="slotName" />
    </template>
  </DateRangeFieldCompact>
</template>
