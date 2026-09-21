<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDateField } from '../../date';
import { Primitive } from '../primitive';
import { useTimeFieldRootContext, useTimeFieldUi } from './context';
import type { TimeFieldInputProps } from './types';

defineOptions({
  name: 'TimeFieldInput'
});

const props = withDefaults(defineProps<TimeFieldInputProps>(), {
  as: 'span'
});

const cls = useTimeFieldUi('input');
const {
  disabled,
  readonly,
  placeholder,
  hourCycle,
  step,
  segmentValues,
  formatter,
  focusNext,
  modelValue,
  isInvalid,
  setFocusedElement
} = useTimeFieldRootContext('TimeFieldInput');

const hasLeftFocus = ref(true);
const lastKeyZero = ref(false);

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
  focusNext,
  modelValue
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
    v-bind="attributes"
    :as="as"
    :as-child="asChild"
    data-vean-time-field-input
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
