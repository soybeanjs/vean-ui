<script setup lang="ts">
import { computed, nextTick, onMounted, shallowRef, watch } from 'vue';
import { isNullish, toContext } from '../../shared';
import { useDirection, useLocale } from '../config-provider/context';
import { useControllableState, useForwardElement } from '../../composables';
import {
  createContent,
  getDefaultDate,
  getInputType,
  getSegmentElements,
  hasTime,
  initializeSegmentValues,
  isBefore,
  isEqualValue,
  normalizeDateStep,
  normalizeHourCycle,
  normalizeInputValue,
  syncSegmentValues,
  toDate,
  useDateFormatter
} from '../../date';
import { cloneDateValue } from '../../date/value';
import { useLocaleMessages } from '../../locale';
import { Primitive } from '../primitive';
import { VisuallyHidden } from '../visually-hidden';
import { provideDateRangeFieldRootContext, useDateRangeFieldUi } from './context';
import type { DateRangeFieldRootProps, DateRangeFieldRootEmits, DateRangeFieldRootSlots, DateRangeType } from './types';

defineOptions({
  name: 'DateRangeFieldRoot'
});

const props = withDefaults(defineProps<DateRangeFieldRootProps>(), {
  defaultValue: undefined,
  defaultPlaceholder: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  isDateUnavailable: undefined,
  hideTimeZone: false,
  hourCycle: undefined,
  granularity: undefined,
  step: undefined,
  startName: undefined,
  endName: undefined
});

const emit = defineEmits<DateRangeFieldRootEmits>();

defineSlots<DateRangeFieldRootSlots>();

const cls = useDateRangeFieldUi('root');
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

const defaultDate = getDefaultDate({
  defaultPlaceholder: props.placeholder,
  defaultValue: modelValue.value.start ?? undefined,
  granularity: props.granularity,
  locale: props.locale
});

const placeholder = useControllableState(
  () => props.placeholder,
  value => emit('update:placeholder', value),
  props.defaultPlaceholder ?? cloneDateValue(defaultDate)
);

const step = computed(() => normalizeDateStep(props.step));
const inferredGranularity = computed(() => {
  if (props.granularity) {
    return hasTime(placeholder.value) ? props.granularity : 'day';
  }

  return hasTime(placeholder.value) ? 'minute' : 'day';
});

const isInvalid = computed(() => {
  const { start, end } = modelValue.value;

  if (start && end && isBefore(end, start)) {
    return true;
  }

  if (start) {
    if (props.isDateUnavailable?.(toDate(start))) {
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
    if (props.isDateUnavailable?.(toDate(end))) {
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
    ? { ...syncSegmentValues({ value: modelValue.value.start, formatter }) }
    : { ...initializeSegmentValues(inferredGranularity.value) }
);

const endSegmentValues = shallowRef(
  modelValue.value.end
    ? { ...syncSegmentValues({ value: modelValue.value.end, formatter }) }
    : { ...initializeSegmentValues(inferredGranularity.value) }
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

  const startContainer = rootElement.value.querySelector('[data-date-range-field-part="start"]');
  const endContainer = rootElement.value.querySelector('[data-date-range-field-part="end"]');

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
      placeholder.value = cloneDateValue(value);
    }
  }
);

watch([() => modelValue.value.start, locale, inferredGranularity], ([value]) => {
  if (!isNullish(value)) {
    startSegmentValues.value = { ...syncSegmentValues({ value, formatter }) };
    return;
  }

  // Replace the object even when there is no value: editing mutates the
  // `startSegmentValues` shallowRef in place, which never invalidates the
  // `startSegmentContents` computed. A fresh object forces a re-render so
  // cleared segments fall back to their placeholders.
  startSegmentValues.value = { ...startSegmentValues.value };
});

watch([() => modelValue.value.end, locale, inferredGranularity], ([value]) => {
  if (!isNullish(value)) {
    endSegmentValues.value = { ...syncSegmentValues({ value, formatter }) };
    return;
  }

  // Same as the start watch: unconditionally replace to invalidate the
  // `endSegmentContents` computed when segments are cleared.
  endSegmentValues.value = { ...endSegmentValues.value };
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

const inputType = computed(() => getInputType(inferredGranularity.value));
const startInputValue = computed(() =>
  normalizeInputValue(modelValue.value.start ? toDate(modelValue.value.start) : undefined, inferredGranularity.value)
);
const endInputValue = computed(() =>
  normalizeInputValue(modelValue.value.end ? toDate(modelValue.value.end) : undefined, inferredGranularity.value)
);
const inputMaxValue = computed(() =>
  props.maxValue ? normalizeInputValue(toDate(props.maxValue), inferredGranularity.value) : undefined
);
const inputMinValue = computed(() =>
  props.minValue ? normalizeInputValue(toDate(props.minValue), inferredGranularity.value) : undefined
);

const handleRootKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return;
  }

  event.preventDefault();
  moveFocus(focusedType.value, event.key === 'ArrowRight' ? 'next' : 'prev');
};

provideDateRangeFieldRootContext({
  ...toContext(props, ['disabled', 'readonly']),
  modelValue,
  placeholder,
  isInvalid,
  formatter,
  hourCycle: props.hourCycle,
  step,
  startSegmentValues,
  endSegmentValues,
  focusNext(type: DateRangeType) {
    moveFocus(type, 'next');
  },
  setFocusedElement(element: HTMLElement, type: DateRangeType) {
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
    data-vean-date-range-field-root
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="isInvalid ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :dir="dir"
    role="group"
    @keydown="handleRootKeydown"
  >
    <slot
      :end-segments="endSegmentContents"
      :is-invalid="isInvalid"
      :model-value="modelValue"
      :start-segments="startSegmentContents"
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
