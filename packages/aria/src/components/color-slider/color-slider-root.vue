<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import {
  areColorsEqual,
  formatColor,
  getChannelObjectSpace,
  getChannelRange,
  getChannelValue,
  hasVisibleChromaticity,
  setChannelValue,
  toColorObject,
  snapValueToStep,
  toContext
} from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState } from '../../composables';
import type { ColorValue } from '../../types';
import { SliderRoot } from '../slider';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideColorSliderRootContext, useColorSliderUi } from './context';
import type { ColorSliderRootProps, ColorSliderRootEmits } from './types';

defineOptions({
  name: 'ColorSliderRoot'
});

const props = withDefaults(defineProps<ColorSliderRootProps>(), {
  modelValue: undefined,
  defaultValue: '#000000',
  colorSpace: 'hsl',
  format: 'hex',
  orientation: 'horizontal',
  disabled: false,
  inverted: false,
  step: undefined
});

const emit = defineEmits<ColorSliderRootEmits>();

const cls = useColorSliderUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', typeof value === 'string' ? value : formatColor(value, props.format));
  },
  props.defaultValue
);

const dir = useDirection(() => props.dir);
const channelSpace = computed(() => getChannelObjectSpace(props.channel, props.colorSpace));
const lastEmittedFormattedValue = shallowRef<string>();
const currentColor = shallowRef<ColorValue>(props.modelValue ?? props.defaultValue);
const internalColor = shallowRef(resolveColorValue(currentColor.value));
const range = computed(() => getChannelRange(props.channel));
const step = computed(() => props.step ?? range.value.step);
const channelValue = computed(() => getChannelValue(internalColor.value, props.channel, props.colorSpace));
const color = computed({
  get: () => internalColor.value,
  set: nextColor => {
    const normalized = toColorObject(nextColor, channelSpace.value);
    const formatted = formatColor(nextColor, props.format);

    internalColor.value = normalized;
    currentColor.value = nextColor;
    lastEmittedFormattedValue.value = formatted;
    modelValue.value = formatted;
    emit('update:color', normalized);
  }
});
const sliderValue = computed({
  get: () => [snapValueToStep(channelValue.value, range.value.min, range.value.max, step.value)],
  set: nextValue => {
    const nextColor = setChannelValue(color.value, props.channel, nextValue[0] ?? range.value.min, props.colorSpace);
    const formatted = formatColor(nextColor, props.format);

    color.value = nextColor;
    emit('change', formatted);
  }
});

function resolveColorValue(value: string | ColorValue | undefined) {
  return toColorObject(value, channelSpace.value);
}

function syncColorFromModel() {
  const nextColor = resolveColorValue(currentColor.value);

  if (areColorsEqual(nextColor, internalColor.value)) {
    return;
  }

  if (props.channel === 'hue' && !hasVisibleChromaticity(nextColor, props.colorSpace)) {
    internalColor.value = setChannelValue(nextColor, props.channel, channelValue.value, props.colorSpace);
    return;
  }

  internalColor.value = nextColor;
}

function handleValueCommit() {
  emit('changeEnd', formatColor(color.value, props.format));
}

watch(
  () => props.modelValue,
  value => {
    if (value == null) {
      return;
    }

    if (typeof value === 'string' && value === lastEmittedFormattedValue.value) {
      return;
    }

    currentColor.value = value;
    syncColorFromModel();
  },
  { immediate: true }
);

watch(() => [props.channel, props.colorSpace, props.format], syncColorFromModel, {
  immediate: true
});

provideColorSliderRootContext({
  color,
  channelValue,
  range,
  ...toContext(props, ['channel', 'colorSpace', 'format', 'orientation', 'disabled', 'inverted'])
});
</script>

<template>
  <SliderRoot
    v-model="sliderValue"
    :as="as"
    :as-child="asChild"
    data-vean-color-slider-root
    :class="cls"
    :orientation="orientation"
    :dir="dir"
    :disabled="disabled"
    :inverted="inverted"
    :min="range.min"
    :max="range.max"
    :step="step"
    @value-commit="handleValueCommit"
  >
    <slot />

    <VisuallyHiddenInput
      v-if="name"
      type="text"
      :value="formatColor(color, format)"
      :name="name"
      :disabled="disabled"
      :required="required"
    />
  </SliderRoot>
</template>
