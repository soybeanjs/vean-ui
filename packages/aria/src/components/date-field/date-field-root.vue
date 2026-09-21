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
import { provideDateFieldRootContext, useDateFieldUi } from './context';
import type { DateFieldRootProps, DateFieldRootEmits, DateFieldRootSlots } from './types';

defineOptions({
  name: 'DateFieldRoot'
});

const props = withDefaults(defineProps<DateFieldRootProps>(), {
  defaultValue: undefined,
  defaultPlaceholder: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  isDateUnavailable: undefined,
  hideTimeZone: false,
  hourCycle: undefined,
  granularity: undefined,
  step: undefined
});

const emit = defineEmits<DateFieldRootEmits>();

defineSlots<DateFieldRootSlots>();

const cls = useDateFieldUi('root');
const [rootElement, setRootElement] = useForwardElement();

const locale = useLocale(() => props.locale);
const dir = useDirection(() => props.dir);
const messages = useLocaleMessages();
const formatter = useDateFormatter(locale.value, {
  hourCycle: normalizeHourCycle(props.hourCycle)
});

const modelValue = useControllableState(
  () => props.modelValue,
  value => emit('update:modelValue', value),
  props.defaultValue,
  true
);

const defaultDate = getDefaultDate({
  defaultPlaceholder: props.placeholder,
  defaultValue: modelValue.value,
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
  if (!modelValue.value) {
    return false;
  }

  if (props.isDateUnavailable?.(toDate(modelValue.value))) {
    return true;
  }

  if (props.minValue && isBefore(modelValue.value, props.minValue)) {
    return true;
  }

  if (props.maxValue && isBefore(props.maxValue, modelValue.value)) {
    return true;
  }

  return false;
});

const segmentValues = shallowRef(
  modelValue.value
    ? { ...syncSegmentValues({ value: modelValue.value, formatter }) }
    : { ...initializeSegmentValues(inferredGranularity.value) }
);

const segmentContents = computed(
  () =>
    createContent({
      granularity: inferredGranularity.value,
      dateRef: toDate(placeholder.value),
      formatter,
      hourCycle: props.hourCycle,
      segmentValues: segmentValues.value,
      locale,
      dateMessages: messages.value.date
    }).arr
);

const segmentElements = shallowRef<HTMLElement[]>([]);
const focusedElement = shallowRef<HTMLElement | null>(null);

const refreshSegmentElements = () => {
  if (!rootElement.value) {
    return;
  }

  segmentElements.value = getSegmentElements(rootElement.value) as HTMLElement[];
};

watch(locale, value => {
  if (formatter.getLocale() !== value) {
    formatter.setLocale(value);
  }

  nextTick(refreshSegmentElements);
});

watch(modelValue, value => {
  if (!isNullish(value) && !isEqualValue(placeholder.value, value)) {
    placeholder.value = cloneDateValue(value);
  }
});

watch([modelValue, locale, inferredGranularity], ([value]) => {
  if (!isNullish(value)) {
    segmentValues.value = { ...syncSegmentValues({ value, formatter }) };
    return;
  }

  // Replace the object even when there is no value: editing mutates the
  // `segmentValues` shallowRef in place, which never invalidates the
  // `segmentContents` computed. A fresh object forces a re-render so cleared
  // segments fall back to their placeholders.
  segmentValues.value = { ...segmentValues.value };
});

const currentSegmentIndex = computed(() => {
  return segmentElements.value.findIndex(
    element =>
      element.getAttribute('data-vean-date-field-segment') ===
      focusedElement.value?.getAttribute('data-vean-date-field-segment')
  );
});

const moveFocus = (direction: 'next' | 'prev') => {
  const sign = dir.value === 'rtl' ? -1 : 1;
  const delta = direction === 'next' ? sign : -sign;
  segmentElements.value[currentSegmentIndex.value + delta]?.focus();
};

const inputType = computed(() => getInputType(inferredGranularity.value));
const inputValue = computed(() =>
  normalizeInputValue(modelValue.value ? toDate(modelValue.value) : undefined, inferredGranularity.value)
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
  moveFocus(event.key === 'ArrowRight' ? 'next' : 'prev');
};

provideDateFieldRootContext({
  ...toContext(props, ['disabled', 'readonly']),
  modelValue,
  placeholder,
  isInvalid,
  formatter,
  hourCycle: props.hourCycle,
  step,
  segmentValues,
  focusNext() {
    moveFocus('next');
  },
  setFocusedElement(element: HTMLElement) {
    focusedElement.value = element;
  }
});

onMounted(refreshSegmentElements);
</script>

<template>
  <Primitive
    :ref="setRootElement"
    :as="as"
    :as-child="asChild"
    data-vean-date-field-root
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="isInvalid ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :dir="dir"
    role="group"
    @keydown="handleRootKeydown"
  >
    <slot :is-invalid="isInvalid" :model-value="modelValue" :segments="segmentContents" />

    <VisuallyHidden
      :id="id"
      as="input"
      feature="focusable"
      :type="inputType"
      tabindex="-1"
      :value="inputValue"
      :name="name"
      :disabled="disabled"
      :required="required"
      :max="inputMaxValue"
      :min="inputMinValue"
      @focus="segmentElements[0]?.focus()"
    />
  </Primitive>
</template>
