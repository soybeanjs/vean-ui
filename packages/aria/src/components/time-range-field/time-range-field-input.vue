<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDateField } from '../../date';
import type { TimeValue } from '../../date';
import { Primitive } from '../primitive';
import { useTimeRangeFieldRootContext, useTimeRangeFieldUi } from './context';
import type { TimeRangeFieldInputProps } from './types';

defineOptions({
  name: 'TimeRangeFieldInput'
});

const props = withDefaults(defineProps<TimeRangeFieldInputProps>(), {
  as: 'span',
  type: 'start'
});

const cls = useTimeRangeFieldUi('input');
const {
  modelValue,
  disabled,
  readonly,
  placeholder,
  hourCycle,
  step,
  startSegmentValues,
  endSegmentValues,
  formatter,
  isInvalid,
  focusNext,
  setFocusedElement
} = useTimeRangeFieldRootContext('TimeRangeFieldInput');

const hasLeftFocus = ref(true);
const lastKeyZero = ref(false);

const segmentValues = computed(() => {
  return props.type === 'start' ? startSegmentValues.value : endSegmentValues.value;
});

const { attributes, handleSegmentClick, handleSegmentFocusOut, handleSegmentKeydown } = useDateField({
  hasLeftFocus,
  lastKeyZero,
  placeholder,
  hourCycle,
  step,
  segmentValues,
  formatter,
  part: props.part,
  disabled,
  readonly,
  focusNext: () => focusNext(props.type),
  modelValue: computed({
    get: () => (props.type === 'start' ? modelValue.value.start : modelValue.value.end) ?? undefined,
    set: (value: TimeValue | undefined) => {
      const next = value ?? null;

      if (props.type === 'start') {
        modelValue.value = { ...modelValue.value, start: next };
      } else {
        modelValue.value = { ...modelValue.value, end: next };
      }
    }
  })
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
    v-bind="attributes"
    :as="as"
    :as-child="asChild"
    data-vean-time-range-field-input
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
