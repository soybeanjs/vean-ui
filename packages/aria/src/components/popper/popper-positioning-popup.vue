<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import type { CSSProperties } from 'vue';
import { useForwardElement } from '../../composables';
import { usePopperPositionerContext, usePopperPositioningRootContext, usePopperUi } from './context';
import type { PopperPositioningPopupProps } from './types';

defineOptions({
  name: 'PopperPositioningPopup'
});

defineProps<PopperPositioningPopupProps>();

const cls = usePopperUi('popup');

const { dir, onPopupElementChange } = usePopperPositioningRootContext('PopperPositioningPopup');
const { placedSide, placedAlign, isPositioned } = usePopperPositionerContext('PopperPositioningPopup');
const [_, setPopupElement] = useForwardElement(onPopupElementChange);

const popupStyle = computed<CSSProperties>(() => {
  return {
    animation: !isPositioned.value ? 'none' : undefined
  };
});

onBeforeUnmount(() => {
  onPopupElementChange(undefined);
});
</script>

<template>
  <div
    :ref="setPopupElement"
    :class="cls"
    data-vean-popper-positioning-popup
    :data-side="placedSide"
    :data-align="placedAlign"
    :dir="dir"
    :style="popupStyle"
  >
    <slot />
  </div>
</template>
