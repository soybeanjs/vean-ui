<script setup lang="ts">
import { computed } from 'vue';
import { useControllableState, useForwardListeners, usePickProps, useOmitProps } from '../../composables';
import type { DateValue } from '../../date';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import DateFieldCompact from '../date-field/date-field-compact.vue';
import PopoverCompact from '../popover/popover-compact.vue';
import type { DatePickerCompactProps, DatePickerCompactEmits, DatePickerCompactSlots } from './types';

defineOptions({
  name: 'DatePickerCompact'
});

const props = withDefaults(defineProps<DatePickerCompactProps>(), {
  open: undefined
});

const emit = defineEmits<DatePickerCompactEmits>();

defineSlots<DatePickerCompactSlots>();

const messages = useLocaleMessages();

const listeners = useForwardListeners(emit);

// The date-picker owns a single internal value shared by both the field and the
// calendar, so that in uncontrolled mode (only `defaultValue`) a calendar selection
// still back-fills the field (and vice versa).
const modelValue = useControllableState<DateValue | undefined, true>(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue,
  true
);

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
      'aria-label': props.popupProps?.['aria-label'] ?? messages.value.datePicker.popupLabel
    }
  })
);

const dateFieldProps = usePickProps(
  props,
  [
    'dir',
    'locale',
    'placeholder',
    'defaultPlaceholder',
    'disabled',
    'readonly',
    'maxValue',
    'minValue',
    'isDateUnavailable',
    'dateFieldProps'
  ],
  () => ({ modelValue: modelValue.value })
);

const triggerProps = computed(() => ({
  ...props.triggerProps,
  asChild: props.triggerProps?.asChild ?? false,
  'aria-label': props.triggerProps?.['aria-label'] ?? messages.value.datePicker.toggle
}));

const calendarProps = useOmitProps(
  props,
  [
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
    'closeProps',
    'modelValue',
    'defaultValue'
  ],
  () => ({ modelValue: modelValue.value })
);

const onUpdateModelValue = (value: DateValue | undefined) => {
  modelValue.value = value;
};

const onUpdatePlaceholder = (placeholder: DateValue) => {
  emit('update:placeholder', placeholder);
};
</script>

<template>
  <DateFieldCompact
    v-bind="dateFieldProps"
    data-vean-date-picker
    @update:model-value="onUpdateModelValue"
    @update:placeholder="emit('update:placeholder', $event)"
  >
    <template #leading>
      <slot name="leading" />
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
            :calendar-props="calendarProps"
            :on-update-model-value="onUpdateModelValue"
            :on-update-placeholder="onUpdatePlaceholder"
          />
        </template>
      </PopoverCompact>
    </template>
  </DateFieldCompact>
</template>
