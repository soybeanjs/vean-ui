<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import {
  formatColor,
  getAreaBackgroundStyle,
  getChannelRange,
  getChannelValue,
  hasVisibleChromaticity,
  setChannelValues,
  toColorObject,
  isFormControl,
  toContext
} from '../../shared';
import { useControllableState, useForwardElement } from '../../composables';
import type { ColorValue } from '../../types';
import { Primitive } from '../primitive';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideColorAreaRootContext, useColorAreaUi } from './context';
import type { ColorAreaRootProps, ColorAreaRootEmits } from './types';

defineOptions({
  name: 'ColorAreaRoot'
});

const props = withDefaults(defineProps<ColorAreaRootProps>(), {
  modelValue: undefined,
  defaultValue: '#ff0000',
  colorSpace: 'hsl',
  format: 'hex',
  xChannel: 'saturation',
  yChannel: 'lightness',
  disabled: false
});

const emit = defineEmits<ColorAreaRootEmits>();

const [rootElement, setRootElement] = useForwardElement();

const cls = useColorAreaUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', typeof value === 'string' ? value : formatColor(value, props.format));
  },
  props.defaultValue
);

const color = computed(() => toColorObject(modelValue.value, props.colorSpace));
const xRange = computed(() => getChannelRange(props.xChannel));
const yRange = computed(() => getChannelRange(props.yChannel));
const xValue = shallowRef(getChannelValue(color.value, props.xChannel, props.colorSpace));
const yValue = shallowRef(getChannelValue(color.value, props.yChannel, props.colorSpace));
const hueValue = shallowRef(getChannelValue(color.value, 'hue', props.colorSpace));
const formControl = computed(() => isFormControl(rootElement.value));
const areaStyle = computed(() => getAreaBackgroundStyle(color.value, props.xChannel, props.yChannel, props.colorSpace));
const thumbElement = shallowRef<HTMLElement>();

function syncFromColor() {
  xValue.value = getChannelValue(color.value, props.xChannel, props.colorSpace);
  yValue.value = getChannelValue(color.value, props.yChannel, props.colorSpace);

  if (hasVisibleChromaticity(color.value, props.colorSpace)) {
    hueValue.value = getChannelValue(color.value, 'hue', props.colorSpace);
  }
}

function emitColor(nextColor: ColorValue) {
  const formatted = formatColor(nextColor, props.format);

  modelValue.value = formatted;
  emit('update:color', toColorObject(nextColor, props.colorSpace));
  emit('change', formatted);
}

function updateValues(x: number, y: number) {
  const nextX = Math.min(xRange.value.max, Math.max(xRange.value.min, x));
  const nextY = Math.min(yRange.value.max, Math.max(yRange.value.min, y));

  xValue.value = nextX;
  yValue.value = nextY;

  const values = [
    { channel: props.xChannel, value: nextX },
    { channel: props.yChannel, value: nextY }
  ];

  if (props.xChannel !== 'hue' && props.yChannel !== 'hue') {
    values.push({ channel: 'hue', value: hueValue.value });
  }

  emitColor(setChannelValues(color.value, values, props.colorSpace));
}

function commitValues() {
  emit('changeEnd', formatColor(color.value, props.format));
}

watch(color, syncFromColor, { immediate: true });

provideColorAreaRootContext({
  color,
  xValue,
  yValue,
  xRange,
  yRange,
  areaStyle,
  thumbElement,
  setThumbElement(element) {
    if (thumbElement.value === element) {
      return;
    }

    thumbElement.value = element;
  },
  updateValues,
  commitValues,
  ...toContext(props, ['colorSpace', 'format', 'xChannel', 'yChannel', 'disabled'])
});
</script>

<template>
  <Primitive
    :ref="setRootElement"
    :as="as"
    :as-child="asChild"
    data-vean-color-area-root
    :class="cls"
    role="group"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-disabled="disabled ? '' : undefined"
  >
    <slot />

    <VisuallyHiddenInput v-if="formControl && xName" type="text" :value="xValue" :name="xName" :disabled="disabled" />
    <VisuallyHiddenInput v-if="formControl && yName" type="text" :value="yValue" :name="yName" :disabled="disabled" />
  </Primitive>
</template>
