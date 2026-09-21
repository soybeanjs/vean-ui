<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import {
  formatChannelValue,
  formatColor,
  getChannelRange,
  getChannelValue,
  isValidColor,
  setChannelValue,
  toColorObject,
  isFormControl,
  toContext
} from '../../shared';
import { useControllableState, useForwardElement } from '../../composables';
import type { ColorValue } from '../../types';
import { Primitive } from '../primitive';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideColorFieldRootContext, useColorFieldUi } from './context';
import type { ColorFieldRootProps, ColorFieldRootEmits } from './types';

defineOptions({
  name: 'ColorFieldRoot'
});

const props = withDefaults(defineProps<ColorFieldRootProps>(), {
  modelValue: undefined,
  defaultValue: '#000000',
  colorSpace: 'hsl',
  format: 'hex',
  disabled: false,
  readonly: false,
  disableWheelChange: false,
  step: undefined
});

const emit = defineEmits<ColorFieldRootEmits>();

const [rootElement, setRootElement] = useForwardElement();

const cls = useColorFieldUi('root');

function resolveColorValue(value: string | ColorValue | undefined) {
  if (props.channel) {
    return toColorObject(value, props.colorSpace);
  }

  return toColorObject(value, 'rgb');
}

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', typeof value === 'string' ? value : formatColor(value, props.format));
  },
  props.defaultValue
);

const color = shallowRef(resolveColorValue(modelValue.value));
const inputValue = shallowRef('');
const isEditing = shallowRef(false);
const formControl = computed(() => isFormControl(rootElement.value));

function syncColor() {
  color.value = resolveColorValue(modelValue.value);

  if (!isEditing.value) {
    if (props.channel) {
      inputValue.value = formatChannelValue(
        props.channel,
        getChannelValue(color.value, props.channel, props.colorSpace)
      );
      return;
    }

    inputValue.value = formatColor(color.value, props.format);
  }
}

function emitColor(nextColor: ColorValue) {
  const formatted = formatColor(nextColor, props.format);

  color.value = resolveColorValue(nextColor);
  modelValue.value = formatted;
  emit('update:color', resolveColorValue(nextColor));
}

function getEffectiveStep() {
  if (props.step != null) {
    return props.step;
  }

  if (props.channel) {
    return getChannelRange(props.channel).step;
  }

  return 1;
}

function updateValue(value: string) {
  isEditing.value = true;
  inputValue.value = value;
}

function addHexValue(delta: number) {
  const rgb = toColorObject(color.value, 'rgb');
  const current = (Math.round(rgb.r) << 16) | (Math.round(rgb.g) << 8) | Math.round(rgb.b);
  const next = Math.min(0xffffff, Math.max(0, current + Math.trunc(delta)));

  emitColor(`#${next.toString(16).padStart(6, '0')}`);
}

function commit() {
  isEditing.value = false;

  if (props.channel) {
    const nextValue = Number.parseFloat(inputValue.value);

    if (!Number.isNaN(nextValue)) {
      emitColor(setChannelValue(color.value, props.channel, nextValue, props.colorSpace));
    }

    inputValue.value = formatChannelValue(props.channel, getChannelValue(color.value, props.channel, props.colorSpace));
    return;
  }

  const trimmed = inputValue.value.trim();

  if (isValidColor(trimmed)) {
    emitColor(trimmed);
  }

  inputValue.value = formatColor(color.value, props.format);
}

function incrementBy(delta: number) {
  if (props.disabled || props.readonly) {
    return;
  }

  if (props.channel) {
    const currentValue = getChannelValue(color.value, props.channel, props.colorSpace);
    emitColor(setChannelValue(color.value, props.channel, currentValue + delta, props.colorSpace));
    inputValue.value = formatChannelValue(props.channel, getChannelValue(color.value, props.channel, props.colorSpace));
    return;
  }

  addHexValue(delta);
  inputValue.value = formatColor(color.value, props.format);
}

function increment() {
  incrementBy(getEffectiveStep());
}

function decrement() {
  incrementBy(-getEffectiveStep());
}

function incrementPage() {
  incrementBy(getEffectiveStep() * 10);
}

function decrementPage() {
  incrementBy(-getEffectiveStep() * 10);
}

function incrementToMax() {
  if (!props.channel) {
    addHexValue(0xffffff);
    inputValue.value = formatColor(color.value, props.format);
    return;
  }

  emitColor(setChannelValue(color.value, props.channel, getChannelRange(props.channel).max, props.colorSpace));
  inputValue.value = formatChannelValue(props.channel, getChannelValue(color.value, props.channel, props.colorSpace));
}

function decrementToMin() {
  if (!props.channel) {
    addHexValue(-0xffffff);
    inputValue.value = formatColor(color.value, props.format);
    return;
  }

  emitColor(setChannelValue(color.value, props.channel, getChannelRange(props.channel).min, props.colorSpace));
  inputValue.value = formatChannelValue(props.channel, getChannelValue(color.value, props.channel, props.colorSpace));
}

function handleWheel(event: WheelEvent) {
  if (props.disableWheelChange || props.disabled || props.readonly) {
    return;
  }

  event.preventDefault();

  if (event.deltaY > 0) {
    decrement();
    return;
  }

  increment();
}

watch(() => [props.modelValue, props.channel, props.colorSpace, props.format], syncColor, {
  immediate: true
});

provideColorFieldRootContext({
  color,
  inputValue,
  updateValue,
  commit,
  increment,
  decrement,
  incrementPage,
  decrementPage,
  incrementToMax,
  decrementToMin,
  handleWheel,
  ...toContext(props, ['channel', 'colorSpace', 'format', 'disabled', 'readonly', 'disableWheelChange', 'placeholder'])
});
</script>

<template>
  <Primitive
    :ref="setRootElement"
    :as="as"
    :as-child="asChild"
    data-vean-color-field-root
    :class="cls"
    role="group"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
  >
    <slot />

    <VisuallyHiddenInput
      v-if="formControl && name"
      type="text"
      :value="formatColor(color, format)"
      :name="name"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
    />
  </Primitive>
</template>
