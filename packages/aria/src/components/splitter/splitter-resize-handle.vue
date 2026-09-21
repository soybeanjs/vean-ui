<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef } from 'vue';
import { useForwardElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useSplitterGroupContext, useSplitterUi } from './context';
import type { SplitterResizeHandleProps, SplitterResizeHandleEmits } from './types';

defineOptions({
  name: 'SplitterResizeHandle'
});

const props = withDefaults(defineProps<SplitterResizeHandleProps>(), {
  disabled: false,
  tabindex: 0
});

const emit = defineEmits<SplitterResizeHandleEmits>();

const [handleElement, setHandleElement] = useForwardElement();

const cls = useSplitterUi('resizeHandle');

const forwardedProps = useOmitProps(props, ['disabled', 'tabindex']);

const {
  direction,
  dir,
  groupId,
  keyboardResizeBy,
  layout,
  rootElement,
  collapsePanel,
  expandPanel,
  resizePanelPair,
  getPanelRecordByIndex,
  getPanelBounds,
  getGroupSize
} = useSplitterGroupContext('SplitterResizeHandle');

const state = shallowRef<'drag' | 'hover' | 'inactive'>('inactive');
const isFocused = shallowRef(false);
const dragPointerId = shallowRef<number | null>(null);
const lastPointerPosition = shallowRef(0);

const handleIndex = computed(() => {
  if (!rootElement.value || !handleElement.value) {
    return -1;
  }

  const handles = Array.from(
    rootElement.value.querySelectorAll<HTMLElement>(`[data-panel-group-id="${groupId}"][data-splitter-resize-handle]`)
  );

  return handles.findIndex(handle => handle === handleElement.value);
});

const primaryPanel = computed(() => getPanelRecordByIndex(handleIndex.value));
const primaryPanelSize = computed(() => layout.value[handleIndex.value]);
const primaryPanelBounds = computed(() => {
  const panel = primaryPanel.value;

  if (!panel) {
    return undefined;
  }

  return getPanelBounds(panel.id);
});

const ariaValueNow = computed(() => {
  if (primaryPanelSize.value === undefined) {
    return undefined;
  }

  return String(Number(primaryPanelSize.value.toFixed(1)));
});

const ariaValueMin = computed(() => {
  if (!primaryPanelBounds.value) {
    return undefined;
  }

  return String(primaryPanelBounds.value.min);
});

const ariaValueMax = computed(() => {
  if (!primaryPanelBounds.value) {
    return undefined;
  }

  return String(primaryPanelBounds.value.max);
});

const ariaControls = computed(() => primaryPanel.value?.id);

function getPointerPosition(event: PointerEvent) {
  return direction.value === 'vertical' ? event.clientY : event.clientX;
}

function getPointerDelta(event: PointerEvent) {
  const position = getPointerPosition(event);
  const delta = position - lastPointerPosition.value;

  lastPointerPosition.value = position;

  const groupSize = getGroupSize();

  if (groupSize <= 0) {
    return 0;
  }

  let percentDelta = (delta / groupSize) * 100;

  if (direction.value === 'horizontal' && dir.value === 'rtl') {
    percentDelta *= -1;
  }

  return percentDelta;
}

let dragListenersCleanup: (() => void) | null = null;

function stopDragListeners() {
  dragListenersCleanup?.();
  dragListenersCleanup = null;
}

function endDragging(pointerId?: number) {
  if (pointerId !== undefined && dragPointerId.value !== pointerId) {
    return;
  }

  dragPointerId.value = null;
  state.value = 'hover';
  stopDragListeners();
  emit('dragging', false);
}

function startDragging(event: PointerEvent) {
  if (props.disabled || handleIndex.value < 0) {
    return;
  }

  event.preventDefault();

  dragPointerId.value = event.pointerId;
  lastPointerPosition.value = getPointerPosition(event);
  state.value = 'drag';
  emit('dragging', true);

  const ownerDocument = handleElement.value?.ownerDocument;

  if (!ownerDocument) {
    return;
  }

  const handlePointerMove = (pointerEvent: PointerEvent) => {
    if (dragPointerId.value !== pointerEvent.pointerId) {
      return;
    }

    resizePanelPair(handleIndex.value, getPointerDelta(pointerEvent));
  };

  const handlePointerUp = (pointerEvent: PointerEvent) => {
    endDragging(pointerEvent.pointerId);
  };

  ownerDocument.addEventListener('pointermove', handlePointerMove);
  ownerDocument.addEventListener('pointerup', handlePointerUp);
  ownerDocument.addEventListener('pointercancel', handlePointerUp);

  dragListenersCleanup = () => {
    ownerDocument.removeEventListener('pointermove', handlePointerMove);
    ownerDocument.removeEventListener('pointerup', handlePointerUp);
    ownerDocument.removeEventListener('pointercancel', handlePointerUp);
  };
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || handleIndex.value < 0) {
    return;
  }

  const primary = primaryPanel.value;

  if (!primary) {
    return;
  }

  const step = keyboardResizeBy.value ?? 10;
  let delta = 0;

  if (event.key === 'Enter' && primary.collapsible.value) {
    event.preventDefault();

    if (primaryPanelSize.value !== undefined && primaryPanelSize.value <= primary.collapsedSize.value + 0.1) {
      expandPanel(primary.id);
    } else {
      collapsePanel(primary.id);
    }

    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    resizePanelPair(handleIndex.value, (primaryPanelBounds.value?.min ?? 0) - (primaryPanelSize.value ?? 0));
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    resizePanelPair(handleIndex.value, (primaryPanelBounds.value?.max ?? 0) - (primaryPanelSize.value ?? 0));
    return;
  }

  if (direction.value === 'vertical') {
    if (event.key === 'ArrowDown') {
      delta = step;
    }

    if (event.key === 'ArrowUp') {
      delta = -step;
    }
  } else if (dir.value === 'rtl') {
    if (event.key === 'ArrowLeft') {
      delta = step;
    }

    if (event.key === 'ArrowRight') {
      delta = -step;
    }
  } else {
    if (event.key === 'ArrowRight') {
      delta = step;
    }

    if (event.key === 'ArrowLeft') {
      delta = -step;
    }
  }

  if (delta !== 0) {
    event.preventDefault();
    resizePanelPair(handleIndex.value, delta);
  }
}

onBeforeUnmount(() => {
  stopDragListeners();
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :ref="setHandleElement"
    :as="as"
    :as-child="asChild"
    data-vean-splitter-resize-handle
    :class="cls"
    role="separator"
    data-splitter-resize-handle=""
    :tabindex="disabled ? undefined : tabindex"
    :data-panel-group-id="groupId"
    :data-state="state"
    :data-disabled="disabled ? '' : undefined"
    :data-orientation="direction"
    :aria-controls="ariaControls"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-orientation="direction"
    :aria-valuenow="ariaValueNow"
    :aria-valuemin="ariaValueMin"
    :aria-valuemax="ariaValueMax"
    @blur="isFocused = false"
    @focus="isFocused = true"
    @keydown="onKeydown"
    @mouseenter="state = dragPointerId === null ? 'hover' : state"
    @mouseleave="state = dragPointerId === null ? 'inactive' : state"
    @pointerdown="startDragging"
  >
    <slot :active="state === 'drag'" :focused="isFocused" />
  </Primitive>
</template>
