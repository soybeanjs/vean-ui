<script setup lang="ts">
import { useAttrs } from 'vue';
import { useForwardElement } from '../../composables';
import { CONTENT_MARGIN } from './shared';
import { useSelectContentContext, useSelectItemAlignedPositionContext, useSelectUi } from './context';
import type { SelectViewportProps } from './types';

defineOptions({
  name: 'SelectViewport'
});

defineProps<SelectViewportProps>();

const attrs = useAttrs();

const { onViewportElementChange } = useSelectContentContext('SelectViewport');
const [_, setViewportElement] = useForwardElement(onViewportElementChange);
const alignedPositionContext = useSelectItemAlignedPositionContext();

const cls = useSelectUi('viewport');

/**
 * we use position: 'relative' here on the `viewport` so that when we call `selectedItem.offsetTop` in calculations
 *
 * the offset is relative to the viewport (independent of the scrollUpButton).
 */
const style = 'position:relative;flex:1;overflow:hidden auto;';

let prevScrollTop = 0;

function onScroll(event: Event) {
  const viewport = event.currentTarget as HTMLElement;

  const { positionerElement, shouldExpandOnScroll } = alignedPositionContext ?? {};
  if (!positionerElement?.value || !shouldExpandOnScroll?.value) {
    prevScrollTop = viewport.scrollTop;

    return;
  }

  const scrolledBy = Math.abs(prevScrollTop - viewport.scrollTop);
  if (scrolledBy <= 0) return;

  const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
  const cssMinHeight = Number.parseFloat(positionerElement.value.style.minHeight);
  const cssHeight = Number.parseFloat(positionerElement.value.style.height);
  const prevHeight = Math.max(cssMinHeight, cssHeight);

  if (prevHeight < availableHeight) {
    const nextHeight = prevHeight + scrolledBy;
    const clampedNextHeight = Math.min(availableHeight, nextHeight);
    const heightDiff = nextHeight - clampedNextHeight;

    positionerElement.value.style.height = `${clampedNextHeight}px`;
    if (positionerElement.value.style.bottom === '0px') {
      viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
      // ensure the content stays pinned to the bottom
      positionerElement.value.style.justifyContent = 'flex-end';
    }
  }

  prevScrollTop = viewport.scrollTop;
}
</script>

<template>
  <div
    v-bind="attrs"
    :ref="setViewportElement"
    data-vean-select-viewport
    :class="cls"
    role="presentation"
    :style="style"
    @scroll="onScroll"
  >
    <slot />
  </div>
</template>
