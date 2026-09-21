<script setup lang="ts">
import { ref } from 'vue';
import { useDrawerRootContext, useDrawerUi } from './context';
import type { DrawerHandleProps } from './types';

defineOptions({
  name: 'DrawerHandle'
});

const props = withDefaults(defineProps<DrawerHandleProps>(), {
  preventCycle: false
});

const cls = useDrawerUi('handle');

const LONG_HANDLE_PRESS_TIMEOUT = 250;
const DOUBLE_TAP_TIMEOUT = 120;

const { swiping, snapPoints, snapPoint, hasSnapPoints, dismissible, closeDrawer, setActiveSnapPoint } =
  useDrawerRootContext('DrawerHandle');

const closeTimeoutId = ref<number | null>(null);
const shouldCancelInteraction = ref(false);

function handleStartCycle() {
  // Stop if this is the second click of a double click
  if (shouldCancelInteraction.value) {
    handleCancelInteraction();
    return;
  }

  window.setTimeout(() => {
    handleCycleSnapPoints();
  }, DOUBLE_TAP_TIMEOUT);
}

function handleCycleSnapPoints() {
  // Prevent accidental taps while resizing drawer
  if (swiping.value || props.preventCycle || shouldCancelInteraction.value) {
    handleCancelInteraction();
    return;
  }

  // Make sure to clear the timeout id if the user releases the handle before the cancel timeout
  handleCancelInteraction();

  // Cycling keys on the *active* flag, not the raw prop: a fullscreen drawer has
  // no snap levels to walk, so a double-tap falls back to the no-snap-point
  // behaviour instead of silently rewriting `snapPoint` with no visible effect.
  if (!hasSnapPoints.value || !snapPoints.value || snapPoints.value.length === 0) {
    if (!dismissible.value) closeDrawer();

    return;
  }

  const isLastSnapPoint = snapPoint.value === snapPoints.value[snapPoints.value.length - 1];

  if (isLastSnapPoint && dismissible.value) {
    closeDrawer();
    return;
  }

  const currentSnapIndex = snapPoints.value.findIndex(point => point === snapPoint.value);

  if (currentSnapIndex === -1) return; // snapPoint not found in snapPoints

  const nextSnapPointIndex = isLastSnapPoint ? 0 : currentSnapIndex + 1;

  setActiveSnapPoint(snapPoints.value[nextSnapPointIndex] ?? null);
}

function handleStartInteraction() {
  closeTimeoutId.value = window.setTimeout(() => {
    // Cancel click interaction on a long press
    shouldCancelInteraction.value = true;
  }, LONG_HANDLE_PRESS_TIMEOUT);
}

function handleCancelInteraction() {
  if (closeTimeoutId.value) window.clearTimeout(closeTimeoutId.value);

  shouldCancelInteraction.value = false;
}

function handlePointerDown() {
  handleStartInteraction();
}
</script>

<template>
  <div
    :class="cls"
    data-vean-handle
    aria-hidden="true"
    @click="handleStartCycle"
    @pointercancel="handleCancelInteraction"
    @pointerdown="handlePointerDown"
  >
    <span data-vean-handle-hit-area="" aria-hidden="true">
      <slot />
    </span>
  </div>
</template>
