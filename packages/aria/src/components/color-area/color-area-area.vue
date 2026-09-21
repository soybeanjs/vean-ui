<script setup lang="ts">
import { shallowRef } from 'vue';
import { useForwardElement } from '../../composables';
import { Primitive } from '../primitive';
import { createLinearScale } from './shared';
import { useColorAreaRootContext, useColorAreaUi } from './context';
import type { ColorAreaAreaProps } from './types';

defineOptions({
  name: 'ColorAreaArea'
});

defineProps<ColorAreaAreaProps>();

const [areaElement, setAreaElement] = useForwardElement();

const cls = useColorAreaUi('area');

const { xRange, yRange, xValue, yValue, areaStyle, thumbElement, updateValues, commitValues, disabled } =
  useColorAreaRootContext('ColorAreaArea');

const isDragging = shallowRef(false);
const pointerOffset = shallowRef({ x: 0, y: 0 });

function getValuesFromPointer(event: PointerEvent) {
  const rect = areaElement.value?.getBoundingClientRect();

  if (!rect) {
    return null;
  }

  const xScale = createLinearScale([0, rect.width], [xRange.value.min, xRange.value.max]);
  const yScale = createLinearScale([0, rect.height], [yRange.value.max, yRange.value.min]);

  return {
    x: xScale(event.clientX - rect.left - pointerOffset.value.x),
    y: yScale(event.clientY - rect.top - pointerOffset.value.y)
  };
}

function syncPointerOffset(event: PointerEvent) {
  const thumbRect = thumbElement.value?.getBoundingClientRect();
  const target = event.target;

  if (!thumbRect || !(target instanceof Node) || !thumbElement.value?.contains(target)) {
    pointerOffset.value = { x: 0, y: 0 };
    return false;
  }

  pointerOffset.value = {
    x: event.clientX - (thumbRect.left + thumbRect.width / 2),
    y: event.clientY - (thumbRect.top + thumbRect.height / 2)
  };

  return true;
}

function handlePointerDown(event: PointerEvent) {
  if (disabled.value) {
    return;
  }

  const target = event.currentTarget as HTMLElement;

  target.setPointerCapture(event.pointerId);
  event.preventDefault();

  isDragging.value = true;

  const isThumbTarget = syncPointerOffset(event);

  if (isThumbTarget) {
    thumbElement.value?.focus();
    return;
  }

  const nextValues = getValuesFromPointer(event);

  if (!nextValues) {
    return;
  }

  updateValues(nextValues.x, nextValues.y);
  thumbElement.value?.focus();
}

function handlePointerMove(event: PointerEvent) {
  if (!isDragging.value || disabled.value) {
    return;
  }

  const target = event.currentTarget as HTMLElement;

  if (!target.hasPointerCapture(event.pointerId)) {
    return;
  }

  const nextValues = getValuesFromPointer(event);

  if (!nextValues) {
    return;
  }

  updateValues(nextValues.x, nextValues.y);
}

function handlePointerUp(event: PointerEvent) {
  if (!isDragging.value) {
    return;
  }

  const target = event.currentTarget as HTMLElement;

  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }

  isDragging.value = false;
  pointerOffset.value = { x: 0, y: 0 };
  commitValues();
}

function handleKeyDown(event: KeyboardEvent) {
  if (disabled.value) {
    return;
  }

  const stepMultiplier = event.shiftKey ? 10 : 1;
  const xStep = xRange.value.step * stepMultiplier;
  const yStep = yRange.value.step * stepMultiplier;
  let xDelta = 0;
  let yDelta = 0;

  switch (event.key) {
    case 'ArrowLeft':
      xDelta = -xStep;
      break;
    case 'ArrowRight':
      xDelta = xStep;
      break;
    case 'ArrowUp':
      yDelta = yStep;
      break;
    case 'ArrowDown':
      yDelta = -yStep;
      break;
    case 'PageUp':
      yDelta = yStep * 10;
      break;
    case 'PageDown':
      yDelta = -yStep * 10;
      break;
    case 'Home':
      xDelta = -xStep * 10;
      break;
    case 'End':
      xDelta = xStep * 10;
      break;
    default:
      return;
  }

  event.preventDefault();
  updateValues(xValue.value + xDelta, yValue.value + yDelta);
  commitValues();
}
</script>

<template>
  <Primitive
    :ref="setAreaElement"
    :as="as"
    :as-child="asChild"
    data-vean-color-area-area
    :class="cls"
    role="application"
    aria-roledescription="Color picker area"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :style="{ ...areaStyle, touchAction: 'none' }"
    @keydown="handleKeyDown"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
  >
    <slot />
  </Primitive>
</template>
