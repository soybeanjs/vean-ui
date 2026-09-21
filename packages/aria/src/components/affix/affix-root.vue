<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch, onWatcherCleanup } from 'vue';
import { useEventListener, useRafFn, useResizeObserver } from '@vueuse/core';
import { useForwardElement } from '../../composables';
import { getDefaultTarget, getFixedBottom, getFixedTop, getTargetRect, isZeroRect, resolveAffixTarget } from './shared';
import { provideAffixRootContext, useAffixUi } from './context';
import type { AffixRootProps, AffixRootEmits, AffixState } from './types';

defineOptions({
  name: 'AffixRoot'
});

const props = defineProps<AffixRootProps>();

const emit = defineEmits<AffixRootEmits>();

const cls = useAffixUi('root');

const [rootElement, setRootElement] = useForwardElement<HTMLDivElement>();
const affixed = shallowRef(false);
const affixStyle = shallowRef<Record<string, string> | undefined>();
const placeholderStyle = shallowRef<Record<string, string> | undefined>();

const dataState = computed<AffixState>(() => (affixed.value ? 'fixed' : 'static'));

const resolvedTarget = shallowRef(resolveAffixTarget(props.target));

function syncResolvedTarget() {
  resolvedTarget.value = resolveAffixTarget(props.target);
}

const internalOffsetTop = computed(() => {
  if (props.offsetBottom === undefined && props.offsetTop === undefined) {
    return 0;
  }

  return props.offsetTop;
});

function resetPosition() {
  if (!affixed.value) {
    affixStyle.value = undefined;
    placeholderStyle.value = undefined;

    return;
  }

  affixed.value = false;
  affixStyle.value = undefined;
  placeholderStyle.value = undefined;
  emit('change', false);
}

function measurePosition() {
  if (typeof window === 'undefined') {
    return;
  }

  const placeholder = rootElement.value;
  const target = resolvedTarget.value;

  if (!placeholder || !target) {
    resetPosition();

    return;
  }

  const placeholderRect = placeholder.getBoundingClientRect();

  if (isZeroRect(placeholderRect)) {
    resetPosition();

    return;
  }

  const targetRect = getTargetRect(target);
  const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop.value);
  const fixedBottom = getFixedBottom(placeholderRect, targetRect, props.offsetBottom);

  let nextAffixStyle: Record<string, string> | undefined;
  let nextPlaceholderStyle: Record<string, string> | undefined;

  if (fixedTop !== undefined || fixedBottom !== undefined) {
    nextAffixStyle = {
      left: `${placeholderRect.left}px`,
      position: 'fixed',
      width: `${placeholderRect.width}px`
    };

    if (fixedTop !== undefined) {
      nextAffixStyle.top = `${fixedTop}px`;
    }

    if (fixedBottom !== undefined) {
      nextAffixStyle.bottom = `${fixedBottom}px`;
    }

    nextPlaceholderStyle = {
      height: `${placeholderRect.height}px`,
      width: `${placeholderRect.width}px`
    };
  }

  const nextAffixed = Boolean(nextAffixStyle);

  if (affixed.value !== nextAffixed) {
    emit('change', nextAffixed);
  }

  affixed.value = nextAffixed;
  affixStyle.value = nextAffixStyle;
  placeholderStyle.value = nextPlaceholderStyle;
}

const { pause: cancelUpdatePosition, resume: updatePosition } = useRafFn(measurePosition, {
  immediate: false,
  once: true
});

const { contentElement } = provideAffixRootContext({
  affixed,
  affixStyle,
  placeholderStyle,
  dataState,
  updatePosition
});

watch(
  [() => props.target, () => props.offsetTop, () => props.offsetBottom],
  async () => {
    syncResolvedTarget();
    await nextTick();
    updatePosition();
  },
  { immediate: true }
);

watch(
  resolvedTarget,
  target => {
    if (!target) {
      return;
    }

    const stopScrollListener = useEventListener(target, 'scroll', updatePosition);
    const stopTouchStartListener = useEventListener(target, 'touchstart', updatePosition);
    const stopTouchMoveListener = useEventListener(target, 'touchmove', updatePosition);
    const stopTouchEndListener = useEventListener(target, 'touchend', updatePosition);

    onWatcherCleanup(() => {
      stopScrollListener();
      stopTouchStartListener();
      stopTouchMoveListener();
      stopTouchEndListener();
    });
  },
  { immediate: true }
);

useEventListener(getDefaultTarget, 'load', updatePosition);
useEventListener(getDefaultTarget, 'pageshow', updatePosition);
useEventListener(getDefaultTarget, 'resize', updatePosition);
useResizeObserver(rootElement, updatePosition);
useResizeObserver(contentElement, updatePosition);

onMounted(async () => {
  await nextTick();
  syncResolvedTarget();
  updatePosition();
});

onBeforeUnmount(() => {
  cancelUpdatePosition();
});

defineExpose({
  affixed,
  updatePosition
});
</script>

<template>
  <div :ref="setRootElement" data-vean-affix-root :class="cls">
    <slot :affixed="affixed" />
  </div>
</template>
