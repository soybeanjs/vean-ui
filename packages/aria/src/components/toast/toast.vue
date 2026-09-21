<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch, watchEffect, onWatcherCleanup } from 'vue';
import type { CSSProperties } from 'vue';
import { useMounted, useDocumentVisibility, useElementSize } from '@vueuse/core';
import type { Point, SwipeDirection } from '../../types';
import DynamicRender from '../_common/dynamic-render.vue';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import {
  toastCssVars,
  SWIPE_THRESHOLD,
  TIME_BEFORE_UNMOUNT,
  getDefaultSwipeDirections,
  getSwipeAmount,
  setSwipeAmount,
  resetSwipeAmount
} from './shared';
import { useToasterContext, useToastUi } from './context';
import type { ToastProps, ToastEmits, ToastType } from './types';

defineOptions({
  name: 'Toast'
});

const props = defineProps<ToastProps>();

const emit = defineEmits<ToastEmits>();

const {
  dir,
  allToasts,
  allHeights,
  gap,
  duration: contextDuration,
  visibleCounts,
  defaultExpanded,
  swipeDirections,
  interactingPosition,
  expandedPosition,
  showIcon,
  showClose,
  icons,
  toastProps,
  wrapperProps,
  contentProps,
  titleProps,
  descriptionProps,
  iconProps,
  footerProps,
  actionProps,
  cancelProps,
  closeProps
} = useToasterContext('Toast');
const ui = useToastUi();

const toastRef = useTemplateRef('toast');
const wrapperRef = useTemplateRef('wrapper');
const mounted = useMounted();
const { height: wrapperHeight } = useElementSize(wrapperRef);
const documentVisibility = useDocumentVisibility();

const swipeOrientation = shallowRef<'x' | 'y' | null>(null);
const swipeDirection = shallowRef<SwipeDirection | null>(null);
const removed = shallowRef(false);
const swiping = shallowRef(false);
const swipeOut = shallowRef(false);
const swiped = shallowRef(false);
const offsetBeforeRemove = shallowRef(0);
const initialHeight = shallowRef(0);
const remainingTime = shallowRef(props.toast.duration ?? contextDuration.value);
const dragStartTime = shallowRef<Date | null>(null);
const closeTimerStartTime = shallowRef(0);
const lastCloseTimerStartTime = shallowRef(0);
const pointerStart = shallowRef<Point | null>(null);

const toastType = computed<ToastType | undefined>(() => props.toast.type);

const icon = computed(() => {
  if (!showIcon.value) return undefined;

  if (props.toast.icon) {
    return props.toast.icon;
  }

  if (toastType.value && toastType.value !== 'default') {
    return icons.value[toastType.value];
  }

  if (props.toast.promise) {
    return icons.value.loading;
  }

  return undefined;
});

const front = computed(() => props.index === 0);
const visible = computed(() => props.index + 1 <= visibleCounts.value);
const disabled = computed(() => toastType.value === 'loading');
const dismissible = computed(() => props.toast.dismissible !== false);
const heightIndex = computed(() =>
  Math.max(
    allHeights.value[props.position].findIndex(height => height.toastId === props.toast.id),
    0
  )
);

/**
 * The toast-level flag wins over the provider-level default, so a single toast
 * can opt out of the close button that the provider renders everywhere else.
 */
const closeVisible = computed(
  () => (props.toast.showClose ?? showClose.value) && dismissible.value && toastType.value !== 'loading'
);
const duration = computed(() => props.toast.duration ?? contextDuration.value);
const positionCoord = computed(() => {
  const [y, x] = props.position.split('-');
  return { x, y };
});

const toastsHeightBefore = computed(() => {
  return allHeights.value[props.position].reduce((previous, current, reducerIndex) => {
    if (reducerIndex >= heightIndex.value) {
      return previous;
    }

    return previous + current.height;
  }, 0);
});
const offset = computed(() => heightIndex.value * gap.value + toastsHeightBefore.value);

const expanded = computed(() => expandedPosition.value === props.position || (defaultExpanded.value && mounted.value));

const toastStyle = computed<CSSProperties>(() => ({
  [toastCssVars.index]: props.index,
  [toastCssVars.beforeIndex]: props.index,
  [toastCssVars.zIndex]: allToasts.value[props.position].length - props.index,
  [toastCssVars.offset]: `${removed.value ? offsetBeforeRemove.value : offset.value}px`,
  [toastCssVars.initialHeight]: defaultExpanded.value ? 'auto' : `${initialHeight.value}px`
}));

const removeToast = () => {
  removed.value = true;
  offsetBeforeRemove.value = offset.value;

  window.setTimeout(() => {
    emit('remove', props.toast);
  }, TIME_BEFORE_UNMOUNT);
};

const onCloseToast = () => {
  if (disabled.value || !dismissible.value) return;

  removeToast();
  props.toast.onDismiss?.(props.toast);
};

const onPointerDown = (event: PointerEvent) => {
  if (event.button === 2) return;
  if (disabled.value || !dismissible.value) return;

  dragStartTime.value = new Date();
  offsetBeforeRemove.value = offset.value;

  (event.target as HTMLElement).setPointerCapture(event.pointerId);

  if ((event.target as HTMLElement).tagName === 'BUTTON') return;

  swiping.value = true;
  pointerStart.value = { x: event.clientX, y: event.clientY };
};

const onPointerUp = () => {
  if (swipeOut.value || !dismissible.value) return;

  pointerStart.value = null;

  const { x: swipeAmountX, y: swipeAmountY } = getSwipeAmount(toastRef.value);
  const timeTaken = Date.now() - (dragStartTime.value?.getTime() ?? Date.now());
  const swipeAmount = swipeOrientation.value === 'x' ? swipeAmountX : swipeAmountY;
  const velocity = Math.abs(swipeAmount) / Math.max(timeTaken, 1);

  if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
    offsetBeforeRemove.value = offset.value;
    props.toast.onDismiss?.(props.toast);

    if (swipeOrientation.value === 'x') {
      swipeDirection.value = swipeAmountX > 0 ? 'right' : 'left';
    } else {
      swipeDirection.value = swipeAmountY > 0 ? 'down' : 'up';
    }

    removeToast();
    swipeOut.value = true;
    return;
  }

  resetSwipeAmount(toastRef.value);
  swiped.value = false;
  swiping.value = false;
  swipeOrientation.value = null;
};

const onPointerMove = (event: PointerEvent) => {
  if (!pointerStart.value || !dismissible.value) return;

  const isHighlighted = (typeof window !== 'undefined' ? (window.getSelection()?.toString().length ?? 0) : 0) > 0;

  if (isHighlighted) return;

  const yDelta = event.clientY - pointerStart.value.y;
  const xDelta = event.clientX - pointerStart.value.x;
  const swipeDirs = swipeDirections.value ?? getDefaultSwipeDirections(props.position);

  if (!swipeOrientation.value && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
    swipeOrientation.value = Math.abs(xDelta) > Math.abs(yDelta) ? 'x' : 'y';
  }

  const swipeAmount: Point = { x: 0, y: 0 };

  const getDampening = (delta: number) => {
    const factor = Math.abs(delta) / 20;
    return 1 / (1.5 + factor);
  };

  if (swipeOrientation.value === 'y') {
    if (swipeDirs.includes('up') || swipeDirs.includes('down')) {
      if ((swipeDirs.includes('up') && yDelta < 0) || (swipeDirs.includes('down') && yDelta > 0)) {
        swipeAmount.y = yDelta;
      } else {
        const dampenedDelta = yDelta * getDampening(yDelta);
        swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
      }
    }
  } else if (swipeOrientation.value === 'x') {
    if (swipeDirs.includes('left') || swipeDirs.includes('right')) {
      if ((swipeDirs.includes('left') && xDelta < 0) || (swipeDirs.includes('right') && xDelta > 0)) {
        swipeAmount.x = xDelta;
      } else {
        const dampenedDelta = xDelta * getDampening(xDelta);
        swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
      }
    }
  }

  if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
    swiped.value = true;
  }

  setSwipeAmount(toastRef.value, swipeAmount);
};

const onDragEnd = () => {
  swiping.value = false;
  swipeOrientation.value = null;
  pointerStart.value = null;
};

const onAction = (event: MouseEvent) => {
  props.toast.onAction?.(event);
  if (event.defaultPrevented) return;

  removeToast();
};

const onCancel = (event: MouseEvent) => {
  props.toast.onCancel?.(event);
  if (!dismissible.value) return;

  removeToast();
};

function updateMeasuredHeight(height: number) {
  initialHeight.value = height;

  emit('update:height', {
    toastId: props.toast.id,
    height,
    position: props.toast.position ?? props.position
  });
}

function measureHeight() {
  const toastNode = toastRef.value;

  if (!toastNode) return;

  const originalHeight = toastNode.style.height;
  toastNode.style.height = 'auto';
  const height = toastNode.getBoundingClientRect().height;
  toastNode.style.height = originalHeight;

  updateMeasuredHeight(height);
}

watch(
  duration,
  value => {
    remainingTime.value = value;
  },
  { immediate: true }
);

watch(
  wrapperHeight,
  value => {
    if (mounted.value && value) {
      measureHeight();
    }
  },
  { flush: 'post' }
);

watch(
  () => props.toast.delete,
  shouldDelete => {
    if (shouldDelete) {
      removeToast();
      props.toast.onDismiss?.(props.toast);
    }
  }
);

watchEffect(() => {
  const toast = props.toast;

  if (toast.type === 'loading' || toast.promise || toast.duration === Infinity) return;

  let timeoutId: ReturnType<typeof setTimeout>;

  const pauseTimer = () => {
    if (lastCloseTimerStartTime.value < closeTimerStartTime.value) {
      const elapsedTime = Date.now() - closeTimerStartTime.value;
      remainingTime.value = remainingTime.value - elapsedTime;
    }

    lastCloseTimerStartTime.value = Date.now();
  };

  const startTimer = () => {
    if (remainingTime.value === Infinity) return;

    closeTimerStartTime.value = Date.now();
    timeoutId = setTimeout(() => {
      props.toast.onAutoClose?.(props.toast);
      removeToast();
    }, remainingTime.value);
  };

  if (
    expandedPosition.value === props.position ||
    interactingPosition.value === props.position ||
    documentVisibility.value === 'hidden'
  ) {
    pauseTimer();
  } else {
    startTimer();
  }

  onWatcherCleanup(() => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  });
});
</script>

<template>
  <li
    v-bind="toastProps"
    ref="toast"
    data-vean-toast
    :class="[ui.toast, toast.ui?.toast]"
    :dir="dir"
    tabindex="0"
    :data-rich-color="toast.richColor"
    :data-inverted="toast.inverted"
    :data-mounted="mounted"
    :data-promise="Boolean(toast.promise)"
    :data-swiped="swiped"
    :data-removed="removed"
    :data-visible="visible"
    :data-y-position="positionCoord.y"
    :data-x-position="positionCoord.x"
    :data-index="index"
    :data-front="front"
    :data-swiping="swiping"
    :data-dismissible="dismissible"
    :data-type="toastType"
    :data-swipe-out="swipeOut"
    :data-swipe-direction="swipeDirection"
    :data-expanded="expanded"
    :data-testid="toast.testId"
    :style="toastStyle"
    @dragend="onDragEnd"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointermove="onPointerMove"
  >
    <div ref="wrapper" v-bind="wrapperProps" :class="[ui.wrapper, toast.ui?.wrapper]" data-vean-toast-wrapper>
      <component :is="toast.custom" v-if="toast.custom" />
      <template v-else>
        <h3 v-bind="titleProps" :class="[ui.title, toast.ui?.title]" data-vean-toast-title>
          <Icon v-if="icon" v-bind="iconProps" :icon="icon" :class="[ui.icon, toast.ui?.icon]" />
          <DynamicRender :is="toast.title" />
        </h3>
        <p
          v-if="toast.description"
          v-bind="descriptionProps"
          :class="[ui.description, toast.ui?.description]"
          data-vean-toast-description
        >
          <DynamicRender :is="toast.description" />
        </p>
        <component
          v-bind="contentProps"
          :is="toast.content"
          v-if="toast.content"
          :class="[ui.content, toast.ui?.content]"
          data-vean-toast-content
        />
        <div
          v-if="toast.action || toast.cancel"
          v-bind="footerProps"
          :class="[ui.footer, toast.ui?.footer]"
          data-vean-toast-footer
        >
          <Button
            v-if="toast.cancel"
            v-bind="cancelProps"
            :class="[ui.cancel, toast.ui?.cancel]"
            data-vean-toast-cancel
            @click="onCancel"
          >
            <DynamicRender :is="toast.cancel" />
          </Button>
          <Button
            v-if="toast.action"
            v-bind="actionProps"
            :class="[ui.action, toast.ui?.action]"
            data-vean-toast-action
            @click="onAction"
          >
            <DynamicRender :is="toast.action" />
          </Button>
        </div>
      </template>
    </div>

    <Button
      v-if="closeVisible && icons?.close"
      v-bind="closeProps"
      :class="[ui.close, toast.ui?.close]"
      data-vean-toast-close
      @click="onCloseToast"
    >
      <Icon :icon="icons?.close" />
    </Button>
  </li>
</template>
