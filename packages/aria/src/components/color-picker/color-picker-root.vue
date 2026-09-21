<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { areColorsEqual, formatColor, resolveColorFormat, toColorObject, toContext } from '../../shared';
import { useControllableState } from '../../composables';
import type { ColorFormat, ColorSpace, ColorValue } from '../../types';
import { provideColorPickerRootContext } from './context';
import type { ColorPickerRootProps, ColorPickerRootEmits } from './types';

defineOptions({
  name: 'ColorPickerRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  modelValue: undefined,
  defaultValue: '#000000',
  format: undefined,
  defaultFormat: undefined,
  colorSpace: undefined,
  disabled: false
});

const emit = defineEmits<ColorPickerRootEmits>();

function resolveColorPickerFormat(value?: ColorFormat, fallbackColor?: ColorValue) {
  if (value) {
    return value;
  }

  return resolveColorFormat(fallbackColor, 'hex');
}

const formatValue = useControllableState(
  () => props.format,
  value => {
    emit('update:format', value);
  },
  resolveColorPickerFormat(props.defaultFormat, props.modelValue ?? props.defaultValue)
);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit(
      'update:modelValue',
      typeof value === 'string' ? value : formatColor(value, resolveColorPickerFormat(formatValue.value, value))
    );
  },
  props.defaultValue
);

const lastEmittedFormattedValue = shallowRef<string>();
const currentColor = shallowRef<ColorValue>(props.modelValue ?? props.defaultValue);
const color = computed(() => currentColor.value);
const hexValue = computed(() => formatColor(currentColor.value, 'hex'));
const displayFormat = computed(() => resolveColorPickerFormat(formatValue.value, currentColor.value));
const formattedValue = computed(() => formatColor(currentColor.value, displayFormat.value));
const displayFormatLabel = computed(() => displayFormat.value.toUpperCase());
const areaXChannel = computed(() => (props.colorSpace === 'oklch' ? 'chroma' : 'saturation'));
const areaYChannel = computed(() => (props.colorSpace === 'hsv' ? 'brightness' : 'lightness'));

const areaChannel = computed(
  () =>
    ({
      x: areaXChannel.value,
      y: areaYChannel.value
    }) as const
);

watch(
  () => props.modelValue,
  value => {
    if (value == null) {
      return;
    }

    if (typeof value === 'string' && value === lastEmittedFormattedValue.value) {
      return;
    }

    if (areColorsEqual(value, currentColor.value)) {
      return;
    }

    currentColor.value = value;
  },
  { immediate: true }
);

function setColor(nextColor: ColorValue) {
  const formatted = formatColor(nextColor, displayFormat.value);
  const colorSpace: ColorSpace = props.colorSpace ?? 'hsl';

  currentColor.value = nextColor;
  lastEmittedFormattedValue.value = formatted;
  modelValue.value = formatted;
  emit('update:color', toColorObject(nextColor, colorSpace));
  emit('change', formatted);
}

function setFormat(nextFormat: ColorFormat) {
  if (displayFormat.value === nextFormat) {
    return;
  }

  formatValue.value = nextFormat;
}

provideColorPickerRootContext({
  ...toContext(props, ['name', 'required', 'disabled']),
  color,
  formattedValue,
  hexValue,
  displayFormat
});
</script>

<template>
  <slot
    :color="color"
    :formatted-value="formattedValue"
    :hex-value="hexValue"
    :display-format="displayFormat"
    :display-format-label="displayFormatLabel"
    :area-channel="areaChannel"
    :set-color="setColor"
    :set-format="setFormat"
  />
</template>
