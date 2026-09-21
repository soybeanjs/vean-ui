<script setup lang="ts">
import { computed, onBeforeUnmount, watchEffect } from 'vue';
import type { CSSProperties } from 'vue';
import { useForwardElement, useOmitProps } from '../../composables';
import { usePopperPositionerContext, usePopperRootContext, usePopperUi } from './context';
import type { PopperPopupProps } from './types';

defineOptions({
  name: 'PopperPopup'
});

const props = defineProps<PopperPopupProps>();

const forwardedProps = useOmitProps(props, ['id', 'class']);

const cls = usePopperUi('popup');

const { dataState, isSub, nestingLevel, popupId, triggerElement, triggerId, dir, onPopupElementChange } =
  usePopperRootContext('PopperPopup');
const { placedSide, placedAlign, isPositioned } = usePopperPositionerContext('PopperPopup');
const [_, setPopupElement] = useForwardElement(onPopupElementChange);

const resolvedId = computed(() => props.id ?? popupId.value);
const ariaLabelledby = computed(() => props['aria-labelledby'] ?? (triggerElement.value ? triggerId.value : undefined));

const popupStyle = computed<CSSProperties>(() => {
  return {
    animation: !isPositioned.value ? 'none' : undefined
  };
});

watchEffect(() => {
  if (props.id) {
    popupId.value = props.id;
  }
});

onBeforeUnmount(() => {
  onPopupElementChange(undefined);
});
</script>

<template>
  <div
    v-bind="forwardedProps"
    :id="resolvedId"
    :ref="setPopupElement"
    :class="cls"
    data-vean-popper-popup
    data-dismissable-layer
    :data-popper-sub-popup="isSub ? '' : undefined"
    :data-nesting-level="nestingLevel"
    :data-state="dataState"
    :data-side="placedSide"
    :data-align="placedAlign"
    :aria-labelledby="ariaLabelledby"
    :dir="dir"
    :style="popupStyle"
    tabindex="-1"
  >
    <slot />
  </div>
</template>
