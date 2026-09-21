<script setup lang="ts">
import { computed, onUnmounted, shallowRef, useAttrs, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { useForwardElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { clamp, getScrollPosition, getScrollSize, getThumbOffset, getThumbSize, setViewportScroll } from './shared';
import { provideScrollAreaScrollbarContext, useScrollAreaRootContext, useScrollAreaUi } from './context';
import type { ScrollAreaOrientation, ScrollAreaScrollbarProps, ScrollAreaState } from './types';

defineOptions({
  name: 'ScrollAreaScrollbar',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ScrollAreaScrollbarProps>(), {
  orientation: 'vertical'
});

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['orientation'], attrs);

const {
  contentElement,
  dir,
  isHovering,
  onScrollbarEnabledChange,
  onScrollbarSizeChange,
  onScrollbarVisibleChange,
  scrollHideDelay,
  type,
  viewportElement
} = useScrollAreaRootContext('ScrollAreaScrollbar');

const cls = useScrollAreaUi('scrollbar');

const [scrollbarElement, setScrollbarElement] = useForwardElement<HTMLElement>();

const isScrolling = shallowRef(false);
const isDragging = shallowRef(false);
const isGlimpseActive = shallowRef(false);
const scrollPosition = shallowRef(0);
const viewportSize = shallowRef(0);
const contentSize = shallowRef(0);
const trackSize = shallowRef(0);
const thumbPointerOffset = shallowRef(0);
const enabledOrientations = shallowRef<ScrollAreaOrientation[]>([]);

let hideTimer: ReturnType<typeof setTimeout> | undefined;

const orientation = computed<ScrollAreaOrientation>(() => props.orientation);
const maxScrollPosition = computed(() => Math.max(contentSize.value - viewportSize.value, 0));
const hasOverflow = computed(() => maxScrollPosition.value > 0 && trackSize.value > 0);
const thumbSize = computed(() => getThumbSize(viewportSize.value, contentSize.value, trackSize.value));
const maxThumbOffset = computed(() => Math.max(trackSize.value - thumbSize.value, 0));
const thumbOffset = computed(() =>
  getThumbOffset(scrollPosition.value, maxScrollPosition.value, maxThumbOffset.value, orientation.value, dir.value)
);

const isVisible = computed(() => {
  if (!hasOverflow.value) {
    return false;
  }

  switch (type.value) {
    case 'always':
    case 'auto':
      return true;
    case 'hover':
      return isHovering.value || isDragging.value;
    case 'scroll':
      return isScrolling.value || isDragging.value;
    case 'glimpse':
      return isGlimpseActive.value || isDragging.value;
    default:
      return false;
  }
});

const dataState = computed<ScrollAreaState>(() => (isVisible.value ? 'visible' : 'hidden'));

const thumbStyle = computed(() => {
  if (orientation.value === 'horizontal') {
    return {
      width: `${thumbSize.value}px`,
      transform: `translate3d(${thumbOffset.value}px, 0, 0)`
    };
  }

  return {
    height: `${thumbSize.value}px`,
    transform: `translate3d(0, ${thumbOffset.value}px, 0)`
  };
});

function clearHideTimer() {
  if (!hideTimer) {
    return;
  }

  clearTimeout(hideTimer);
  hideTimer = undefined;
}

function scheduleHide(key: 'scroll' | 'glimpse') {
  clearHideTimer();

  hideTimer = setTimeout(() => {
    if (key === 'scroll') {
      isScrolling.value = false;
      return;
    }

    isGlimpseActive.value = false;
  }, scrollHideDelay.value);
}

function updateMetrics() {
  const viewport = viewportElement.value;
  const content = contentElement.value;
  const scrollbar = scrollbarElement.value;

  if (!viewport || !content || !scrollbar) {
    return;
  }

  const size = getScrollSize(viewport, content, orientation.value);

  viewportSize.value = size.viewportSize;
  contentSize.value = size.contentSize;
  trackSize.value = orientation.value === 'horizontal' ? scrollbar.clientWidth : scrollbar.clientHeight;
  scrollPosition.value = getScrollPosition(viewport, orientation.value, dir.value);
  onScrollbarSizeChange(orientation.value, trackSize.value);
}

function triggerTransientVisibility() {
  if (type.value === 'scroll') {
    isScrolling.value = true;
    scheduleHide('scroll');
    return;
  }

  if (type.value === 'glimpse') {
    isGlimpseActive.value = true;
    scheduleHide('glimpse');
  }
}

function setViewportPosition(nextThumbOffset: number) {
  const viewport = viewportElement.value;

  if (!viewport || maxThumbOffset.value <= 0 || maxScrollPosition.value <= 0) {
    return;
  }

  const thumbRatio = clamp(nextThumbOffset / maxThumbOffset.value, 0, 1);
  const scrollRatio = orientation.value === 'horizontal' && dir.value === 'rtl' ? 1 - thumbRatio : thumbRatio;
  const nextScrollPosition = scrollRatio * maxScrollPosition.value;

  setViewportScroll(viewport, orientation.value, nextScrollPosition, dir.value);
}

function getPointerPosition(event: PointerEvent) {
  return orientation.value === 'horizontal' ? event.clientX : event.clientY;
}

function handlePointerMove(event: PointerEvent) {
  if (!isDragging.value || !scrollbarElement.value) {
    return;
  }

  const rect = scrollbarElement.value.getBoundingClientRect();
  const origin = orientation.value === 'horizontal' ? rect.left : rect.top;
  const nextOffset = getPointerPosition(event) - origin - thumbPointerOffset.value;

  setViewportPosition(nextOffset);
}

function cleanupDragListeners() {
  if (!isDragging.value) {
    return;
  }

  isDragging.value = false;
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerup', handlePointerUp);
  window.removeEventListener('pointercancel', handlePointerCancel);
  triggerTransientVisibility();
}

function handlePointerUp() {
  cleanupDragListeners();
}

function handlePointerCancel() {
  cleanupDragListeners();
}

function handleTrackPointerDown(event: PointerEvent) {
  if (!scrollbarElement.value || event.button !== 0) {
    return;
  }

  const target = event.target;
  if (target instanceof HTMLElement && target.closest('[data-vean-scroll-area-thumb]')) {
    return;
  }

  const rect = scrollbarElement.value.getBoundingClientRect();
  const origin = orientation.value === 'horizontal' ? rect.left : rect.top;
  const nextOffset = getPointerPosition(event) - origin - thumbSize.value / 2;

  setViewportPosition(nextOffset);
  triggerTransientVisibility();
}

function onThumbPointerDown(event: PointerEvent) {
  if (event.button !== 0) {
    return;
  }

  const thumb = event.currentTarget;
  if (!(thumb instanceof HTMLElement)) {
    return;
  }

  const rect = thumb.getBoundingClientRect();
  thumbPointerOffset.value = getPointerPosition(event) - (orientation.value === 'horizontal' ? rect.left : rect.top);
  isDragging.value = true;
  clearHideTimer();
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerCancel);
}

function onScroll() {
  updateMetrics();
  triggerTransientVisibility();
}

watch(
  () => viewportElement.value,
  (viewport, previousViewport) => {
    previousViewport?.removeEventListener('scroll', onScroll);

    if (!viewport) {
      return;
    }

    viewport.addEventListener('scroll', onScroll, { passive: true });
    updateMetrics();
  },
  { immediate: true }
);

watch(
  isVisible,
  value => {
    onScrollbarVisibleChange(orientation.value, value);
  },
  { immediate: true }
);

watch(
  () => isHovering.value,
  value => {
    if (value && type.value === 'glimpse') {
      triggerTransientVisibility();
    }
  }
);

useResizeObserver(
  computed(() => [viewportElement.value, contentElement.value, scrollbarElement.value].filter(Boolean)),
  updateMetrics
);

provideScrollAreaScrollbarContext({
  orientation,
  dataState,
  hasOverflow,
  thumbStyle,
  onThumbPointerDown,
  onThumbPointerUp: handlePointerUp
});

function updateScrollbarEnabledState(value: ScrollAreaOrientation, enabled: boolean) {
  onScrollbarEnabledChange(value, enabled);

  if (enabled) {
    if (!enabledOrientations.value.includes(value)) {
      enabledOrientations.value = [...enabledOrientations.value, value];
    }

    return;
  }

  enabledOrientations.value = enabledOrientations.value.filter(item => item !== value);
}

watch(
  () => props.orientation,
  (value, oldValue) => {
    if (oldValue && oldValue !== value) {
      updateScrollbarEnabledState(oldValue, false);
    }

    updateScrollbarEnabledState(value, true);
  },
  { immediate: true }
);

onUnmounted(() => {
  cleanupDragListeners();
  clearHideTimer();
  enabledOrientations.value.forEach(value => updateScrollbarEnabledState(value, false));
  onScrollbarVisibleChange(orientation.value, false);
  viewportElement.value?.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :ref="setScrollbarElement"
    :as="as"
    :as-child="asChild"
    data-vean-scroll-area-scrollbar
    :class="cls"
    :data-orientation="orientation"
    :data-state="dataState"
    :aria-hidden="true"
    @pointerdown="handleTrackPointerDown"
  >
    <slot />
  </Primitive>
</template>
