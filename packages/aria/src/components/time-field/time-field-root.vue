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
import { provideTimeFieldRootContext, useTimeFieldUi } from './context';
import type { TimeFieldRootProps, TimeFieldRootEmits, TimeFieldRootSlots } from './types';

defineOptions({
  name: 'TimeFieldRoot'
});

const props = withDefaults(defineProps<TimeFieldRootProps>(), {
  defaultValue: undefined,
  defaultPlaceholder: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  isTimeUnavailable: undefined,
  hideTimeZone: false,
  hourCycle: undefined,
  granularity: undefined,
  step: undefined
});

const emit = defineEmits<TimeFieldRootEmits>();

defineSlots<TimeFieldRootSlots>();

const cls = useTimeFieldUi('root');
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

const defaultTime = getDefaultTime({
  defaultPlaceholder: props.placeholder,
  defaultValue: modelValue.value
});

const placeholder = useControllableState(
  () => props.placeholder,
  value => emit('update:placeholder', value),
  props.defaultPlaceholder ?? cloneDate(defaultTime)
);

const inferredGranularity = computed(() => props.granularity ?? 'minute');
const step = computed(() => normalizeDateStep(props.step));

const isInvalid = computed(() => {
  if (!modelValue.value) {
    return false;
  }

  if (props.isTimeUnavailable?.(modelValue.value)) {
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
    ? { ...syncTimeSegmentValues({ value: modelValue.value, formatter }) }
    : { ...syncTimeSegmentValues({ value: placeholder.value, formatter }) }
);

const segmentContents = computed(
  () =>
    createContent({
      granularity: inferredGranularity.value,
      dateRef: placeholder.value,
      formatter,
      hourCycle: props.hourCycle,
      segmentValues: segmentValues.value,
      locale,
      isTimeValue: true,
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
    placeholder.value = cloneDate(value);
  }
});

watch([modelValue, locale, inferredGranularity], ([value]) => {
  if (!isNullish(value)) {
    segmentValues.value = { ...syncTimeSegmentValues({ value, formatter }) };
    return;
  }

  segmentValues.value = { ...syncTimeSegmentValues({ value: placeholder.value, formatter }) };
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

const inputType = computed(() => getTimeInputType(inferredGranularity.value));
const inputValue = computed(() => normalizeTimeInputValue(modelValue.value, inferredGranularity.value));
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
  moveFocus(event.key === 'ArrowRight' ? 'next' : 'prev');
};

provideTimeFieldRootContext({
  modelValue,
  placeholder,
  isTimeUnavailable: props.isTimeUnavailable,
  isInvalid,
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  formatter,
  hourCycle: props.hourCycle,
  step,
  segmentValues,
  inputType,
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
    data-vean-time-field-root
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
