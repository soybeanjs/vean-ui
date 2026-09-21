<script setup lang="ts">
import { computed, normalizeClass } from 'vue';
import { useMutationObserver } from '@vueuse/core';
import { useForwardElement } from '../../composables';
import { useWatermarkCompactContext, useWatermarkRootContext, useWatermarkUi } from './context';
import type { WatermarkOverlayProps } from './types';

defineOptions({
  name: 'WatermarkOverlay'
});

defineProps<WatermarkOverlayProps>();

const cls = useWatermarkUi('overlay');
const compactContext = useWatermarkCompactContext();
const { overlayStyle, defense } = useWatermarkRootContext('WatermarkOverlay');

const [overlayElement, setOverlayElement] = useForwardElement<HTMLDivElement>();

const normalizedClass = computed(() => normalizeClass(cls.value));
const expectedBackgroundImage = computed(() => overlayStyle.value?.backgroundImage ?? '');

function isOverlayCompromised() {
  const overlay = overlayElement.value;

  if (!overlay || !overlayStyle.value) {
    return false;
  }

  if (!overlay.hasAttribute('data-vean-watermark-overlay')) {
    return true;
  }

  if (overlay.getAttribute('aria-hidden') !== 'true') {
    return true;
  }

  if (overlay.hasAttribute('hidden')) {
    return true;
  }

  if (overlay.className !== normalizedClass.value) {
    return true;
  }

  if (overlay.style.backgroundImage !== expectedBackgroundImage.value) {
    return true;
  }

  return overlay.style.length !== (expectedBackgroundImage.value ? 1 : 0);
}

useMutationObserver(
  overlayElement,
  () => {
    if (!defense.value || !overlayStyle.value) {
      return;
    }

    if (isOverlayCompromised()) {
      compactContext?.repairOverlay();
    }
  },
  {
    attributes: true,
    attributeFilter: ['aria-hidden', 'class', 'data-vean-watermark-overlay', 'hidden', 'style']
  }
);
</script>

<template>
  <div
    v-if="overlayStyle"
    :ref="setOverlayElement"
    data-vean-watermark-overlay
    :class="cls"
    :style="overlayStyle"
    aria-hidden="true"
  />
</template>
