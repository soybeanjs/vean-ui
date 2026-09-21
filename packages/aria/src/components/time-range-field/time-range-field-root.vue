<script setup lang="ts">
import { computed, nextTick, onMounted, shallowRef, watch } from 'vue';
import { isNullish } from '../../shared';
import { useDirection, useLocale } from '../config-provider/context';
import { useControllableState, useForwardElement } from '../../composables';
import {
  createContent,
  getDefaultTime,
  getSegmentElements,
  getTimeInputType,
  isBefore,
  isEqualValue,
  normalizeDateStep,
  normalizeHourCycle,
  normalizeTimeInputValue,
  syncTimeSegmentValues,
  useDateFormatter
} from '../../date';
import { cloneDate } from '../../date/value';
import { useLocaleMessages } from '../../locale';
import { Primitive } from '../primitive';
import { VisuallyHidden } from '../visually-hidden';
import { provideTimeRangeFieldRootContext, useTimeRangeFieldUi } from './context';
import type { TimeRangeFieldRootProps, TimeRangeFieldRootEmits, TimeRangeFieldRootSlots } from './types';

defineOptions({
  name: 'TimeRangeFieldRoot'
});

const props = withDefaults(defineProps<TimeRangeFieldRootProps>(), {
  defaultValue: undefined,
  defaultPlaceholder: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  isTimeUnavailable: undefined,
  hideTimeZone: false,
  hourCycle: undefined,
  granularity: undefined,
  step: undefined,
  startName: undefined,
  endName: undefined
});

const emit = defineEmits<TimeRangeFieldRootEmits>();

defineSlots<TimeRangeFieldRootSlots>();

const cls = useTimeRangeFieldUi('root');
const [rootElement, setRootElement] = useForwardElement();

const locale = useLocale(() => props.locale);
const dir = useDirection(() => props.dir);
const messages = useLocaleMessages();
const formatter = useDateFormatter(locale.value, {
  hourCycle: normalizeHourCycle(props.hourCycle)
});

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
    emit('update:startValue', value.start ?? null);
    emit('update:endValue', value.end ?? null);
  },
  props.defaultValue ?? { start: null, end: null }
);

const defaultTime = getDefaultTime({
  defaultPlaceholder: props.placeholder,
  defaultValue: modelValue.value.start ?? undefined
});

const placeholder = useControllableState(
  () => props.placeholder,
  value => emit('update:placeholder', value),
  props.defaultPlaceholder ?? cloneDate(defaultTime)
);

const step = computed(() => normalizeDateStep(props.step));
const inferredGranularity = computed(() => props.granularity ?? 'minute');

const isInvalid = computed(() => {
  const { start, end } = modelValue.value;

  if (start && end && isBefore(end, start)) {
    return true;
  }

  if (start) {
    if (props.isTimeUnavailable?.(start)) {
      return true;
    }

    if (props.minValue && isBefore(start, props.minValue)) {
      return true;
    }

    if (props.maxValue && isBefore(props.maxValue, start)) {
      return true;
    }
  }

  if (end) {
    if (props.isTimeUnavailable?.(end)) {
      return true;
    }

    if (props.minValue && isBefore(end, props.minValue)) {
      return true;
    }

    if (props.maxValue && isBefore(props.maxValue, end)) {
      return true;
    }
  }

  return false;
});

const startSegmentValues = shallowRef(
  modelValue.value.start
    ? { ...syncTimeSegmentValues({ value: modelValue.value.start, formatter }) }
    : { ...syncTimeSegmentValues({ value: placeholder.value, formatter }) }
);

const endSegmentValues = shallowRef(
  modelValue.value.end
    ? { ...syncTimeSegmentValues({ value: modelValue.value.end, formatter }) }
    : { ...syncTimeSegmentValues({ value: placeholder.value, formatter }) }
);

const startSegmentContents = computed(
  () =>
    createContent({
      granularity: inferredGranularity.value,
      dateRef: placeholder.value,
      formatter,
      hourCycle: props.hourCycle,
      segmentValues: startSegmentValues.value,
      locale,
      isTimeValue: true,
      dateMessages: messages.value.date
    }).arr
);

const endSegmentContents = computed(
  () =>
    createContent({
      granularity: inferredGranularity.value,
      dateRef: placeholder.value,
      formatter,
      hourCycle: props.hourCycle,
      segmentValues: endSegmentValues.value,
      locale,
      isTimeValue: true,
      dateMessages: messages.value.date
    }).arr
);

const startSegmentElements = shallowRef<HTMLElement[]>([]);
const endSegmentElements = shallowRef<HTMLElement[]>([]);
const focusedElement = shallowRef<HTMLElement | null>(null);
const focusedType = shallowRef<'start' | 'end'>('start');

const refreshSegmentElements = () => {
  if (!rootElement.value) {
    return;
  }

  const startContainer = rootElement.value.querySelector('[data-time-range-field-part="start"]');
  const endContainer = rootElement.value.querySelector('[data-time-range-field-part="end"]');

  if (startContainer) {
    startSegmentElements.value = getSegmentElements(startContainer as HTMLElement) as HTMLElement[];
  }

  if (endContainer) {
    endSegmentElements.value = getSegmentElements(endContainer as HTMLElement) as HTMLElement[];
  }
};

watch(locale, value => {
  if (formatter.getLocale() !== value) {
    formatter.setLocale(value);
  }

  nextTick(refreshSegmentElements);
});

watch(
  () => modelValue.value.start,
  value => {
    if (!isNullish(value) && !isEqualValue(placeholder.value, value)) {
      placeholder.value = cloneDate(value);
    }
  }
);

watch([() => modelValue.value.start, locale, inferredGranularity], ([value]) => {
  if (!isNullish(value)) {
    startSegmentValues.value = { ...syncTimeSegmentValues({ value, formatter }) };
    return;
  }

  startSegmentValues.value = { ...syncTimeSegmentValues({ value: placeholder.value, formatter }) };
});

watch([() => modelValue.value.end, locale, inferredGranularity], ([value]) => {
  if (!isNullish(value)) {
    endSegmentValues.value = { ...syncTimeSegmentValues({ value, formatter }) };
    return;
  }

  endSegmentValues.value = { ...syncTimeSegmentValues({ value: placeholder.value, formatter }) };
});

const currentSegmentIndex = computed(() => {
  const elements = focusedType.value === 'start' ? startSegmentElements.value : endSegmentElements.value;

  return elements.findIndex(
    element =>
      element.getAttribute('data-vean-date-field-segment') ===
      focusedElement.value?.getAttribute('data-vean-date-field-segment')
  );
});

const moveFocus = (type: 'start' | 'end', direction: 'next' | 'prev') => {
  const sign = dir.value === 'rtl' ? -1 : 1;
  const delta = direction === 'next' ? sign : -sign;
  const elements = type === 'start' ? startSegmentElements.value : endSegmentElements.value;
  const nextIndex = currentSegmentIndex.value + delta;

  if (nextIndex >= 0 && nextIndex < elements.length) {
    elements[nextIndex]?.focus();
  } else if (delta > 0 && type === 'start' && endSegmentElements.value.length > 0) {
    // Exited the end of the start group: ArrowRight in LTR, ArrowLeft in RTL.
    focusedType.value = 'end';
    endSegmentElements.value[0]?.focus();
  } else if (delta < 0 && type === 'end' && startSegmentElements.value.length > 0) {
    // Exited the beginning of the end group: ArrowLeft in LTR, ArrowRight in RTL.
    focusedType.value = 'start';
    startSegmentElements.value[startSegmentElements.value.length - 1]?.focus();
  }
};

const inputType = computed(() => getTimeInputType(inferredGranularity.value));
const startInputValue = computed(() =>
  normalizeTimeInputValue(modelValue.value.start ?? undefined, inferredGranularity.value)
);
const endInputValue = computed(() =>
  normalizeTimeInputValue(modelValue.value.end ?? undefined, inferredGranularity.value)
);
const inputMaxValue = computed(() =>
  props.maxValue ? normalizeTimeInputValue(props.maxValue, inferredGranularity.value) : undefined
);
const inputMinValue = computed(() =>
  props.minValue ? normalizeTimeInputValue(props.minValue, inferredGranularity.value) : undefined
);

const handleRootKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return;
  }

  event.preventDefault();
  moveFocus(focusedType.value, event.key === 'ArrowRight' ? 'next' : 'prev');
};

provideTimeRangeFieldRootContext({
  modelValue,
  placeholder,
  isInvalid,
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  formatter,
  hourCycle: props.hourCycle,
  step,
  startSegmentValues,
  endSegmentValues,
  focusNext(type: 'start' | 'end') {
    moveFocus(type, 'next');
  },
  setFocusedElement(element: HTMLElement, type: 'start' | 'end') {
    focusedElement.value = element;
    focusedType.value = type;
  }
});

onMounted(refreshSegmentElements);
</script>

<template>
  <Primitive
    :ref="setRootElement"
    :as="as"
    :as-child="asChild"
    data-vean-time-range-field-root
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="isInvalid ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :dir="dir"
    role="group"
    @keydown="handleRootKeydown"
  >
    <slot
      :model-value="modelValue"
      :start-segments="startSegmentContents"
      :end-segments="endSegmentContents"
      :is-invalid="isInvalid"
    />

    <VisuallyHidden
      :id="id"
      as="input"
      feature="focusable"
      :type="inputType"
      tabindex="-1"
      :value="startInputValue"
      :name="startName || name"
      :disabled="disabled"
      :required="required"
      :max="inputMaxValue"
      :min="inputMinValue"
      @focus="startSegmentElements[0]?.focus()"
    />
    <VisuallyHidden
      as="input"
      feature="focusable"
      :type="inputType"
      tabindex="-1"
      :value="endInputValue"
      :name="endName"
      :disabled="disabled"
      :required="required"
      :max="inputMaxValue"
      :min="inputMinValue"
      @focus="endSegmentElements[0]?.focus()"
    />
  </Primitive>
</template>
