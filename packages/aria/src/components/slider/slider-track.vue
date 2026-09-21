<script setup lang="ts">
import { useForwardElement } from '../../composables';
import { Primitive } from '../primitive';
import { useSliderRootContext, useSliderUi } from './context';
import type { SliderTrackProps } from './types';

defineOptions({
  name: 'SliderTrack'
});

defineProps<SliderTrackProps>();

const cls = useSliderUi('track');

const { disabled, orientation, setTrackElement, beginTrackDrag } = useSliderRootContext('SliderTrack');

const trackElementRef = useForwardElement(node => {
  setTrackElement(node);
});

const setElementRef = trackElementRef[1];

function onPointerDown(event: PointerEvent) {
  if (disabled.value) {
    return;
  }
  event.preventDefault();
  beginTrackDrag(event);
}
</script>

<template>
  <Primitive
    :ref="setElementRef"
    :as="as"
    :as-child="asChild"
    data-vean-slider-track
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
    :data-orientation="orientation"
    @pointerdown="onPointerDown"
  >
    <slot />
  </Primitive>
</template>
