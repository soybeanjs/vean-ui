<script setup lang="ts">
import { computed, shallowRef, useAttrs } from 'vue';
import { interpolate, isFormControl } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useForwardElement } from '../../composables';
import { useLocaleMessages } from '../../locale';
import { Primitive } from '../primitive';
import { VisuallyHiddenInput } from '../visually-hidden';
import {
  ARROW_KEYS,
  DEFAULT_RATING_VALUE,
  clampRatingValue,
  getValidRatingMax,
  isRatingBackKey,
  snapRatingToStep
} from './shared';
import { provideRatingRootContext } from './context';
import type { RatingRootProps, RatingRootEmits } from './types';

defineOptions({
  name: 'RatingRoot'
});

const props = withDefaults(defineProps<RatingRootProps>(), {
  modelValue: undefined,
  defaultValue: DEFAULT_RATING_VALUE,
  max: 5,
  allowHalf: false,
  allowClear: false,
  readonly: false,
  disabled: false,
  orientation: 'horizontal',
  dir: undefined
});

const emit = defineEmits<RatingRootEmits>();

const attrs = useAttrs();

const [rootElement, setRootElement] = useForwardElement();
const messages = useLocaleMessages();

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? DEFAULT_RATING_VALUE
);

const dir = useDirection(() => props.dir);
const disabled = computed(() => props.disabled);
const readonly = computed(() => props.readonly);
const allowHalf = computed(() => props.allowHalf);
const allowClear = computed(() => props.allowClear);
const orientation = computed(() => (props.orientation === 'vertical' ? 'vertical' : 'horizontal'));
const max = computed(() => getValidRatingMax(props.max));

const currentModelValue = computed(() =>
  clampRatingValue(snapRatingToStep(modelValue.value ?? 0, allowHalf.value), max.value)
);

const hoverState = shallowRef<number | null>(null);
const hoverValue = computed(() => hoverState.value);

const isHorizontal = computed(() => orientation.value === 'horizontal');

const formControl = computed(() => isFormControl(rootElement.value));

const dataDisabled = computed(() => (disabled.value ? '' : undefined));
const dataReadonly = computed(() => (readonly.value ? '' : undefined));
const ariaReadonly = computed(() => (readonly.value ? true : undefined));
const ariaDisabled = computed(() => (disabled.value ? true : undefined));
const tabindex = computed(() => (disabled.value ? '-1' : '0'));

const ariaValuetext = computed(() => {
  const value = currentModelValue.value;

  if (value === 0) return messages.value.rating.empty;

  return interpolate(messages.value.rating.starN, { count: String(value), max: String(max.value) });
});

const ariaLabel = computed(() => {
  const attrValue = attrs['aria-label'];

  return typeof attrValue === 'string' ? attrValue : messages.value.rating.ariaLabel;
});

function setValue(value: number) {
  if (disabled.value || readonly.value) return;

  const snapped = snapRatingToStep(value, allowHalf.value);
  const clamped = clampRatingValue(snapped, max.value);
  const isClear = allowClear.value && clamped === currentModelValue.value;
  const next = isClear ? 0 : clamped;

  if (next === currentModelValue.value) return;

  modelValue.value = next;
  emit('valueCommit', next);
}

function setHover(value: number) {
  if (disabled.value || readonly.value) return;

  const snapped = snapRatingToStep(value, allowHalf.value);

  hoverState.value = snapped;
  emit('hoverChange', snapped);
}

function clearHover() {
  hoverState.value = null;
  emit('hoverChange', null);
}

function onKeyDown(event: KeyboardEvent) {
  if (disabled.value || readonly.value) return;

  if (event.key === 'Home') {
    event.preventDefault();
    setValue(0);
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    setValue(max.value);
    return;
  }

  if (!ARROW_KEYS.includes(event.key)) return;

  event.preventDefault();

  const step = allowHalf.value ? 0.5 : 1;
  const direction = isRatingBackKey(event.key, dir.value, orientation.value) ? -1 : 1;
  const next = currentModelValue.value + direction * step;

  setValue(next);
}

provideRatingRootContext({
  modelValue,
  currentModelValue,
  hoverValue,
  max,
  allowHalf,
  allowClear,
  readonly,
  disabled,
  dir,
  orientation,
  isHorizontal,
  setValue,
  setHover,
  clearHover
});
</script>

<template>
  <Primitive
    :ref="setRootElement"
    :as="as"
    :as-child="asChild"
    data-vean-rating-root
    :dir="dir"
    :data-disabled="dataDisabled"
    :data-readonly="dataReadonly"
    :data-orientation="orientation"
    role="slider"
    :tabindex="tabindex"
    :aria-valuenow="currentModelValue"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuetext="ariaValuetext"
    :aria-orientation="orientation"
    :aria-readonly="ariaReadonly"
    :aria-disabled="ariaDisabled"
    :aria-label="ariaLabel"
    @keydown="onKeyDown"
    @pointerleave="clearHover"
  >
    <slot :value="currentModelValue" :hover-value="hoverValue" />
    <VisuallyHiddenInput
      v-if="formControl && name"
      type="number"
      :name="name"
      :value="currentModelValue"
      :disabled="disabled"
      :required="required"
    />
  </Primitive>
</template>
