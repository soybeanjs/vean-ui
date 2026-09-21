<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, usePickProps, useOmitProps } from '../../composables';
import type { DateRange, DateValue } from '../../date';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import DateRangeFieldCompact from '../date-range-field/date-range-field-compact.vue';
import PopoverCompact from '../popover/popover-compact.vue';
import type { DateRangePickerCompactProps, DateRangePickerCompactEmits, DateRangePickerCompactSlots } from './types';

defineOptions({
  name: 'DateRangePickerCompact'
});

const props = withDefaults(defineProps<DateRangePickerCompactProps>(), {
  open: undefined
});

const emit = defineEmits<DateRangePickerCompactEmits>();

defineSlots<DateRangePickerCompactSlots>();

const messages = useLocaleMessages();

const listeners = useForwardListeners(emit);

const popoverProps = usePickProps(
  props,
  [
    'open',
    'defaultOpen',
    'modal',
    'disabled',
    'placement',
    'showArrow',
    'portalProps',
    'positionerProps',
    'arrowProps',
    'closeProps'
  ],
  () => ({
    popupProps: {
      ...props.popupProps,
      'aria-label': props.popupProps?.['aria-label'] ?? messages.value.dateRangePicker.popupLabel
    }
  })
);

const dateFieldProps = usePickProps(props, [
  'dir',
  'locale',
  'modelValue',
  'defaultValue',
  'placeholder',
  'defaultPlaceholder',
  'disabled',
  'readonly',
  'maxValue',
  'minValue',
  'isDateUnavailable',
  'dateFieldProps'
]);

const triggerProps = computed(() => ({
  ...props.triggerProps,
  asChild: props.triggerProps?.asChild ?? false,
  'aria-label': props.triggerProps?.['aria-label'] ?? messages.value.dateRangePicker.toggle
}));

const calendarProps = useOmitProps(props, [
  'open',
  'defaultOpen',
  'modal',
  'placement',
  'showArrow',
  'dateFieldProps',
  'triggerProps',
  'portalProps',
  'positionerProps',
  'popupProps',
  'arrowProps',
  'closeProps'
]);

const onUpdateModelValue = (value: DateRange) => {
  emit('update:modelValue', value);
};

const onUpdatePlaceholder = (placeholder: DateValue) => {
  emit('update:placeholder', placeholder);
};
</script>

<template>
  <DateRangeFieldCompact
    v-bind="dateFieldProps"
    data-vean-date-range-picker
    @update:model-value="emit('update:modelValue', $event)"
    @update:placeholder="emit('update:placeholder', $event)"
  >
    <template #leading>
      <slot name="leading" />
    </template>
    <template #separator>
      <slot name="separator" />
    </template>
    <template #trailing>
      <PopoverCompact v-bind="popoverProps" :trigger-props="triggerProps" v-on="listeners">
        <template #trigger>
          <Icon icon="lucide:calendar" />
        </template>
        <template #default="{ open, close }">
          <slot
            :open="open"
            :close="close"
            :calendar-range-props="calendarProps"
            :on-update-model-value="onUpdateModelValue"
            :on-update-placeholder="onUpdatePlaceholder"
          />
        </template>
      </PopoverCompact>
    </template>
  </DateRangeFieldCompact>
</template>
