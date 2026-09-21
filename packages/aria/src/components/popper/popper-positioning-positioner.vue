<script setup lang="ts">
import { computed, watchPostEffect } from 'vue';
import { useForwardElement } from '../../composables';
import { createPopperPositioningDefaultProps } from './shared';
import { providePopperPositionerContext, usePopperPositioningRootContext, usePopperUi } from './context';
import type { PopperPositioningPositionerProps, PopperPositioningPositionerEmits } from './types';
import { usePopperPositioning } from './use-popper-positioning';

defineOptions({
  name: 'PopperPositioningPositioner'
});

const props = withDefaults(defineProps<PopperPositioningPositionerProps>(), createPopperPositioningDefaultProps());

const emit = defineEmits<PopperPositioningPositionerEmits>();

const cls = usePopperUi('positioner');

const [positionerElement, setPositionerElement] = useForwardElement();
const [arrowElement, setArrowElement] = useForwardElement();
const { anchorElement, popupElement } = usePopperPositioningRootContext('PopperPositioningPositioner');

const referenceElement = computed(() => props.reference ?? anchorElement.value);

const { isPositioned, placedSide, placedAlign, arrowX, arrowY, hideArrow, positionerStyle } = usePopperPositioning({
  props,
  referenceElement,
  positionerElement,
  arrowElement,
  open: () => props.open ?? true,
  popupElement
});

providePopperPositionerContext({
  arrowX,
  arrowY,
  hideArrow,
  placedSide,
  placedAlign,
  isPositioned: computed(() => isPositioned.value),
  setArrowElement
});

watchPostEffect(() => {
  if (isPositioned.value) {
    emit('placed');
  }
});
</script>

<template>
  <div :ref="setPositionerElement" data-vean-popper-positioning-positioner :class="cls" :style="positionerStyle">
    <slot />
  </div>
</template>
