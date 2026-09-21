<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { useForwardElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useScrollAreaRootContext, useScrollAreaUi } from './context';
import type { ScrollAreaViewportProps } from './types';

defineOptions({
  name: 'ScrollAreaViewport'
});

const props = defineProps<ScrollAreaViewportProps>();

const { scrollbarXEnabled, scrollbarYEnabled, onViewportChange, onContentChange } =
  useScrollAreaRootContext('ScrollAreaViewport');

const cls = useScrollAreaUi('viewport');

const forwardedProps = useOmitProps(props, ['nonce', 'as', 'asChild']);
const viewportProps = computed(() => ({
  ...forwardedProps.value,
  tabindex: forwardedProps.value.tabindex ?? 0
}));

const [, setViewportElement] = useForwardElement<HTMLElement>(onViewportChange);
const [, setContentElement] = useForwardElement<HTMLElement>(onContentChange);

const style = computed<CSSProperties>(() => ({
  overflowX: scrollbarXEnabled.value ? 'scroll' : 'hidden',
  overflowY: scrollbarYEnabled.value ? 'scroll' : 'hidden'
}));

const contentStyle = computed<CSSProperties>(() => ({
  minWidth: scrollbarXEnabled.value ? 'fit-content' : undefined
}));
</script>

<template>
  <div :ref="setViewportElement" v-bind="viewportProps" data-vean-scroll-area-viewport :class="cls" :style="style">
    <Primitive :ref="setContentElement" :as="as" :as-child="asChild" :style="contentStyle">
      <slot />
    </Primitive>
  </div>
</template>
