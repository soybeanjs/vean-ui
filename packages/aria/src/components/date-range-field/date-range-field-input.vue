<script setup lang="ts">
import { computed, ref } from 'vue';
import { toDate, useDateField } from '../../date';
import { makeDateValue } from '../../date/value';
import { Primitive } from '../primitive';
import { useDateRangeFieldRootContext, useDateRangeFieldUi } from './context';
import type { DateRangeFieldInputProps } from './types';

defineOptions({
  name: 'DateRangeFieldInput'
});

const props = withDefaults(defineProps<DateRangeFieldInputProps>(), {
  as: 'span',
  type: 'start'
});

const cls = useDateRangeFieldUi('input');
const {
  disabled,
  readonly,
  placeholder,
  hourCycle,
  step,
  startSegmentValues,
  endSegmentValues,
  formatter,
  focusNext,
  modelValue,
  isInvalid,
  setFocusedElement
} = useDateRangeFieldRootContext('DateRangeFieldInput');

const hasLeftFocus = ref(true);
const lastKeyZero = ref(false);

const segmentValues = computed(() => {
  return props.type === 'start' ? startSegmentValues.value : endSegmentValues.value;
});

// The segment engine operates on plain `Date` instants; the public range keeps
// the `{ date, time? }` shape whenever time segments are present.
const internalPlaceholder = computed(() => toDate(placeholder.value));
const boundValue = computed<Date | undefined>({
  get: () => {
    const bound = props.type === 'start' ? modelValue.value.start : modelValue.value.end;

    return bound ? toDate(bound) : undefined;
  },
  set: value => {
    const next = value ? ('hour' in segmentValues.value ? makeDateValue(value, value) : makeDateValue(value)) : null;

    if (props.type === 'start') {
      modelValue.value = { ...modelValue.value, start: next };
    } else {
      modelValue.value = { ...modelValue.value, end: next };
    }
  }
});

const { attributes, handleSegmentClick, handleSegmentFocusOut, handleSegmentKeydown } = useDateField({
  hasLeftFocus,
  lastKeyZero,
  placeholder: internalPlaceholder,
  hourCycle,
  step,
  segmentValues,
  formatter,
  part: props.part,
  disabled,
  readonly,
  focusNext: () => focusNext(props.type),
  modelValue: boundValue
});

const contentEditable = computed(() => {
  if (disabled.value || readonly.value) {
    return false;
  }

  return props.part !== 'literal' && props.part !== 'timeZoneName';
});

const listeners = computed(() => {
  if (props.part === 'literal') {
    return {};
  }

  return {
    mousedown: handleSegmentClick,
    keydown: handleSegmentKeydown,
    focusout: () => {
      hasLeftFocus.value = true;
      handleSegmentFocusOut();
    },
    focusin: (event: FocusEvent) => {
      setFocusedElement(event.target as HTMLElement, props.type);
    }
  };
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    v-bind="attributes"
    data-vean-date-range-field-input
    :data-vean-date-field-segment="part"
    :class="cls"
    :aria-disabled="disabled ? true : undefined"
    :aria-invalid="isInvalid ? true : undefined"
    :aria-readonly="readonly || part === 'timeZoneName' ? true : undefined"
    :contenteditable="contentEditable"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="isInvalid ? '' : undefined"
    :data-readonly="readonly || part === 'timeZoneName' ? '' : undefined"
    :data-segment="part"
    v-on="listeners"
  >
    <slot />
  </Primitive>
</template>
