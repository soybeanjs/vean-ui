<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch, watchEffect, onWatcherCleanup, nextTick, useAttrs } from 'vue';
import type { CSSProperties } from 'vue';
import { getElFromTemplateRef, toContext, isClient } from '../../shared';
import { useDirection } from '../config-provider/context';
import type { VNodeRef } from '../../types';
import {
  ALL_TOAST_POSITIONS,
  DEFAULT_POSITION,
  VIEWPORT_OFFSET,
  GAP,
  TOAST_LIFETIME,
  ICONS,
  toasterCssVars,
  isModifierHotkey,
  isToastDismiss,
  resolveOffset
} from './shared';
import { provideToasterContext, useToastUi } from './context';
import { useToastState } from './hooks';
import { ToastState } from './state';
import Toast from './toast.vue';
import type { ToastPosition, ToastT, ToasterProps, ToastHeight } from './types';

defineOptions({
  name: 'Toaster',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ToasterProps>(), {
  position: DEFAULT_POSITION,
  hotkey: () => ['altKey', 'KeyT'],
  visibleCounts: 3,
  duration: TOAST_LIFETIME,
  containerAriaLabel: 'Notifications',
  gap: GAP,
  offset: VIEWPORT_OFFSET
});

const attrs = useAttrs();
const ui = useToastUi();

const dir = useDirection(() => props.dir);

const hotkeyLabel = computed(() => props.hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, ''));
const sectionAriaLabel = computed(() => props.customAriaLabel ?? `${props.containerAriaLabel} ${hotkeyLabel.value}`);

const listRefs: Partial<Record<ToastPosition, HTMLElement | null>> = {};
const setListRef = (position: ToastPosition, nodeRef: VNodeRef) => {
  listRefs[position] = getElFromTemplateRef(nodeRef);
};

const { toasts, allToasts, filtered, heights, allHeights, allPositions, positionZIndex } = useToastState({
  id: () => props.id,
  position: () => props.position
});

const icons = computed(() => ({ ...ICONS, ...props.icons }));

const expandedPosition = shallowRef<ToastPosition | null>(null);
const interactingPosition = shallowRef<ToastPosition | null>(null);
const lastFocusedElement = shallowRef<HTMLElement | null>(null);
const focusWithinPosition = shallowRef<ToastPosition | null>(null);

const toasterStyle = computed<CSSProperties>(() => ({
  [toasterCssVars.gap]: `${props.gap}px`,
  ...resolveOffset(props.offset)
}));

const clearPositionState = (position: ToastPosition) => {
  if (expandedPosition.value === position) {
    expandedPosition.value = null;
  }

  if (interactingPosition.value === position) {
    interactingPosition.value = null;
  }

  if (focusWithinPosition.value === position) {
    focusWithinPosition.value = null;
  }
};

const focusPositionList = (position: ToastPosition) => {
  listRefs[position]?.focus();
};

const updateHeight = (nextHeight: ToastHeight) => {
  const existingHeightIndex = heights.value.findIndex(height => height.toastId === nextHeight.toastId);

  if (existingHeightIndex !== -1) {
    heights.value = heights.value.map(height => (height.toastId === nextHeight.toastId ? nextHeight : height));
    return;
  }

  const firstSamePositionIndex = heights.value.findIndex(height => height.position === nextHeight.position);

  if (firstSamePositionIndex !== -1) {
    heights.value = [
      ...heights.value.slice(0, firstSamePositionIndex),
      nextHeight,
      ...heights.value.slice(firstSamePositionIndex)
    ];
    return;
  }

  heights.value = [nextHeight, ...heights.value];
};

const upsertToast = (nextToast: ToastT) => {
  const indexOfExistingToast = toasts.value.findIndex(toast => toast.id === nextToast.id);

  if (indexOfExistingToast !== -1) {
    const mergedToast = Object.assign({}, toasts.value[indexOfExistingToast] as ToastT, nextToast);

    toasts.value = [
      ...toasts.value.slice(0, indexOfExistingToast),
      mergedToast,
      ...toasts.value.slice(indexOfExistingToast + 1)
    ];
    return;
  }

  toasts.value = [nextToast, ...toasts.value];
};

const removeToast = (toastToRemove: ToastT) => {
  toasts.value = toasts.value.filter(toast => {
    if (toast.id !== toastToRemove.id) {
      return true;
    }

    if (!toast.delete) {
      ToastState.dismiss(toastToRemove.id);
    }

    return false;
  });

  heights.value = heights.value.filter(height => height.toastId !== toastToRemove.id);
};

const handleBlur = (position: ToastPosition, event: FocusEvent) => {
  const currentTarget = event.currentTarget as HTMLElement | null;

  if (
    focusWithinPosition.value === position &&
    currentTarget &&
    !currentTarget.contains(event.relatedTarget as Node | null)
  ) {
    focusWithinPosition.value = null;

    if (expandedPosition.value === position && interactingPosition.value !== position) {
      expandedPosition.value = null;
    }

    if (lastFocusedElement.value) {
      lastFocusedElement.value.focus({ preventScroll: true });
      lastFocusedElement.value = null;
    }
  }
};

const handleFocus = (position: ToastPosition, event: FocusEvent) => {
  const target = event.target as HTMLElement;
  const isNotDismissible = target.dataset.dismissible === 'false';

  if (isNotDismissible) return;

  if (focusWithinPosition.value !== position) {
    focusWithinPosition.value = position;
    lastFocusedElement.value = event.relatedTarget as HTMLElement | null;
  }
};

const handleMouseEnter = (position: ToastPosition) => {
  expandedPosition.value = position;
};

const handleMouseLeave = (position: ToastPosition) => {
  if (
    interactingPosition.value !== position &&
    focusWithinPosition.value !== position &&
    expandedPosition.value === position
  ) {
    expandedPosition.value = null;
  }
};

const handlePointerDown = (position: ToastPosition, event: PointerEvent) => {
  const target = event.target as HTMLElement;

  if (target.dataset.dismissible === 'false') return;

  interactingPosition.value = position;
  expandedPosition.value = position;
};

const handlePointerUp = (position: ToastPosition) => {
  if (interactingPosition.value === position) {
    interactingPosition.value = null;
  }
};

provideToasterContext({
  dir,
  allToasts,
  allHeights,
  interactingPosition,
  expandedPosition,
  icons,
  ...toContext(props, [
    'gap',
    'duration',
    'visibleCounts',
    'defaultExpanded',
    'swipeDirections',
    'showIcon',
    'showClose',
    'toastProps',
    'wrapperProps',
    'contentProps',
    'titleProps',
    'descriptionProps',
    'iconProps',
    'footerProps',
    'actionProps',
    'cancelProps',
    'closeProps'
  ])
});

watchEffect(
  () => {
    const unsubscribe = ToastState.subscribe(toast => {
      if (isToastDismiss(toast)) {
        requestAnimationFrame(() => {
          toasts.value = toasts.value.map(item => (item.id === toast.id ? { ...item, delete: true } : item));
        });
        return;
      }

      nextTick(() => {
        upsertToast(toast);
      });
    });

    onWatcherCleanup(() => {
      unsubscribe();
    });
  },
  { flush: 'post' }
);

watch(
  () => toasts.value.length,
  length => {
    if (length === 0) {
      expandedPosition.value = null;
      interactingPosition.value = null;
      focusWithinPosition.value = null;
    }
  }
);

watch(
  () => filtered.value,
  currentToasts => {
    const existingPositions = new Set(currentToasts.map(toast => (toast.position ?? props.position) as ToastPosition));

    if (expandedPosition.value && !existingPositions.has(expandedPosition.value)) {
      expandedPosition.value = null;
    }

    if (interactingPosition.value && !existingPositions.has(interactingPosition.value)) {
      interactingPosition.value = null;
    }

    if (focusWithinPosition.value && !existingPositions.has(focusWithinPosition.value)) {
      focusWithinPosition.value = null;
    }
  },
  { deep: true }
);

watchEffect(() => {
  if (!isClient) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    const isHotkeyPressed =
      props.hotkey.length > 0 && props.hotkey.every(key => (isModifierHotkey(key) ? event[key] : event.code === key));

    if (isHotkeyPressed) {
      const targetPosition = filtered.value[0]?.position ?? props.position ?? allPositions.value[0];

      expandedPosition.value = targetPosition;
      focusPositionList(targetPosition);
    }

    const isItemActive = Object.values(listRefs).some(
      list => list === document.activeElement || list?.contains(document.activeElement)
    );

    if (event.code === 'Escape' && isItemActive) {
      expandedPosition.value = null;
      focusWithinPosition.value = null;
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  onWatcherCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
});

onBeforeUnmount(() => {
  if (lastFocusedElement.value) {
    lastFocusedElement.value.focus({ preventScroll: true });
    lastFocusedElement.value = null;
    focusWithinPosition.value = null;
  }
});
</script>

<template>
  <section
    data-vean-toaster-container
    :aria-label="sectionAriaLabel"
    tabindex="-1"
    aria-live="polite"
    aria-relevant="additions text"
    aria-atomic="false"
  >
    <ol
      v-for="position in ALL_TOAST_POSITIONS"
      :key="position"
      v-bind="attrs"
      :ref="element => setListRef(position, element)"
      :class="ui.toaster"
      tabindex="-1"
      :dir="dir"
      data-vean-toaster
      :data-y-position="position.split('-')[0]"
      :data-x-position="position.split('-')[1]"
      :style="{
        '--z-index': positionZIndex[position],
        '--front-toast-height': `${allHeights[position][0]?.height ?? 0}px`,
        ...toasterStyle
      }"
      @blur="event => handleBlur(position, event)"
      @focus="event => handleFocus(position, event)"
      @mouseenter="handleMouseEnter(position)"
      @mousemove="handleMouseEnter(position)"
      @mouseleave="handleMouseLeave(position)"
      @dragend="clearPositionState(position)"
      @pointerdown="event => handlePointerDown(position, event)"
      @pointerup="handlePointerUp(position)"
    >
      <Toast
        v-for="(toast, tIndex) in allToasts[position]"
        :key="toast.id"
        :index="tIndex"
        :toast="toast"
        :position="position"
        @update:height="updateHeight"
        @remove="removeToast"
      />
    </ol>
  </section>
  <slot />
</template>
