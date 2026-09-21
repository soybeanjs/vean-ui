<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useElementSize } from '@vueuse/core';
import { useForwardElement } from '../../composables';
import type { Side } from '../../types';
import { Primitive } from '../primitive';
import { getThumbInBoundsOffset } from './shared';
import { useSliderRootContext, useSliderUi } from './context';
import type { SliderThumbProps } from './types';

defineOptions({
  name: 'SliderThumb'
});

const props = defineProps<SliderThumbProps>();

const attrs = useAttrs();

const cls = useSliderUi('thumb');

const {
  currentModelValue,
  disabled,
  orientation,
  min,
  max,
  startEdge,
  isHorizontal,
  thumbAlignment,
  activeThumbIndex,
  getPercentage,
  getThumbLabel,
  setThumbElement,
  beginThumbDrag
} = useSliderRootContext('SliderThumb');

const [thumbElement, setElementRef] = useForwardElement(node => {
  setThumbElement(props.index, node);
});
const { width, height } = useElementSize(thumbElement);

const value = computed(() => currentModelValue.value[props.index]);
const percent = computed(() => getPercentage(value.value ?? min.value));
const label = computed(() => getThumbLabel(props.index));
const ariaLabel = computed(() => {
  const attrValue = attrs['aria-label'];

  return typeof attrValue === 'string' ? attrValue : label.value;
});

function getThumbTransform(horizontal: boolean, edge: Side) {
  if (horizontal) {
    const translateX = edge === 'right' && thumbAlignment.value === 'overflow' ? 'translateX(50%)' : 'translateX(-50%)';

    return `${translateX} translateY(-50%)`;
  }

  const translateY = edge === 'top' && thumbAlignment.value === 'overflow' ? 'translateY(-50%)' : 'translateY(50%)';

  return `translateX(-50%) ${translateY}`;
}

const thumbInBoundsOffset = computed(() => {
  if (thumbAlignment.value === 'overflow') {
    return 0;
  }

  const size = isHorizontal.value ? width.value : height.value;

  if (!size) {
    return 0;
  }

  const direction = isHorizontal.value ? (startEdge.value === 'left' ? 1 : -1) : startEdge.value === 'bottom' ? 1 : -1;

  return getThumbInBoundsOffset(size, percent.value, direction);
});

const style = computed(() => {
  const translate = getThumbTransform(isHorizontal.value, startEdge.value);

  return {
    position: 'absolute',
    ...(isHorizontal.value ? { top: '50%' } : { left: '50%' }),
    [startEdge.value]: `calc(${percent.value}% + ${thumbInBoundsOffset.value}px)`,
    transform: translate
  };
});

function onPointerDown(event: PointerEvent) {
  if (disabled.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  (event.currentTarget as HTMLElement).focus();
  beginThumbDrag(props.index, event);
}

function onFocus() {
  activeThumbIndex.value = props.index;
}
</script>

<template>
  <Primitive
    :ref="setElementRef"
    :as="as"
    :as-child="asChild"
    data-vean-slider-thumb
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
    :data-orientation="orientation"
    :aria-disabled="disabled || undefined"
    :aria-label="ariaLabel"
    :aria-valuenow="value"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-orientation="orientation"
    :tabindex="disabled ? undefined : 0"
    role="slider"
    :style="style"
    @focus="onFocus"
    @pointerdown="onPointerDown"
  >
    <slot />
  </Primitive>
</template>
