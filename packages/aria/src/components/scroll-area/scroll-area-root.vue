<script setup lang="ts">
import { shallowRef, useAttrs } from 'vue';
import { toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useExposedElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { provideScrollAreaRootContext, useScrollAreaUi } from './context';
import type { ScrollAreaOrientation, ScrollAreaRootProps } from './types';

defineOptions({
  name: 'ScrollAreaRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ScrollAreaRootProps>(), {
  type: 'hover',
  scrollHideDelay: 600
});

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['dir', 'scrollHideDelay', 'type'], attrs);

const cls = useScrollAreaUi('root');
const dir = useDirection(() => props.dir);

const [rootElement, setRootElement] = useExposedElement();

const isHovering = shallowRef(false);
const viewportElement = shallowRef<HTMLElement>();
const contentElement = shallowRef<HTMLElement>();
const scrollbarXEnabled = shallowRef(false);
const scrollbarYEnabled = shallowRef(false);
const scrollbarXVisible = shallowRef(false);
const scrollbarYVisible = shallowRef(false);
const scrollbarXSize = shallowRef(0);
const scrollbarYSize = shallowRef(0);

function onScrollbarEnabledChange(orientation: ScrollAreaOrientation, enabled: boolean) {
  if (orientation === 'horizontal') {
    scrollbarXEnabled.value = enabled;
    return;
  }

  scrollbarYEnabled.value = enabled;
}

function onScrollbarVisibleChange(orientation: ScrollAreaOrientation, visible: boolean) {
  if (orientation === 'horizontal') {
    scrollbarXVisible.value = visible;
    return;
  }

  scrollbarYVisible.value = visible;
}

function onScrollbarSizeChange(orientation: ScrollAreaOrientation, size: number) {
  if (orientation === 'horizontal') {
    scrollbarXSize.value = size;
    return;
  }

  scrollbarYSize.value = size;
}

provideScrollAreaRootContext({
  dir,
  isHovering,
  rootElement,
  viewportElement,
  contentElement,
  scrollbarXEnabled,
  scrollbarYEnabled,
  scrollbarXVisible,
  scrollbarYVisible,
  scrollbarXSize,
  scrollbarYSize,
  onViewportChange: element => {
    viewportElement.value = element;
  },
  onContentChange: element => {
    contentElement.value = element;
  },
  onScrollbarEnabledChange,
  onScrollbarVisibleChange,
  onScrollbarSizeChange,
  ...toContext(props, ['scrollHideDelay', 'type'])
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :ref="setRootElement"
    :as="as"
    :as-child="asChild"
    data-vean-scroll-area-root
    :class="cls"
    :dir="dir"
    @pointerenter="isHovering = true"
    @pointerleave="isHovering = false"
  >
    <slot />
  </Primitive>
</template>
