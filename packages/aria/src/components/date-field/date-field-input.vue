<script setup lang="ts">
import { computed, ref } from 'vue';
import { toDate, useDateField } from '../../date';
import { makeDateValue } from '../../date/value';
import { Primitive } from '../primitive';
import { useDateFieldRootContext, useDateFieldUi } from './context';
import type { DateFieldInputProps } from './types';

defineOptions({
  name: 'DateFieldInput'
});

const props = withDefaults(defineProps<DateFieldInputProps>(), {
  as: 'span'
});

const cls = useDateFieldUi('input');
const {
  modelValue,
  disabled,
  readonly,
  placeholder,
  hourCycle,
  step,
  segmentValues,
  formatter,
  isInvalid,
  focusNext,
  setFocusedElement
} = useDateFieldRootContext('DateFieldInput');

const hasLeftFocus = ref(true);
const lastKeyZero = ref(false);

// The segment engine operates on plain `Date` instants; the public model value
// keeps the `{ date, time? }` shape whenever time segments are present.
const internalPlaceholder = computed(() => toDate(placeholder.value));
const internalModelValue = computed<Date | undefined>({
  get: () => (modelValue.value ? toDate(modelValue.value) : undefined),
  set: value => {
    if (!value) {
      modelValue.value = undefined;
      return;
    }

    modelValue.value = 'hour' in segmentValues.value ? makeDateValue(value, value) : makeDateValue(value);
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
  focusNext,
  modelValue: internalModelValue
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
      setFocusedElement(event.target as HTMLElement);
    }
  };
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    v-bind="attributes"
    data-vean-date-field-input
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
