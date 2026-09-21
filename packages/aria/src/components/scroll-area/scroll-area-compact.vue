<script setup lang="ts">
import { useOmitProps } from '../../composables';
import ScrollAreaCorner from './scroll-area-corner.vue';
import ScrollAreaRoot from './scroll-area-root.vue';
import ScrollAreaScrollbar from './scroll-area-scrollbar.vue';
import ScrollAreaThumb from './scroll-area-thumb.vue';
import ScrollAreaViewport from './scroll-area-viewport.vue';
import type { ScrollAreaCompactProps, ScrollAreaCompactSlots } from './types';

defineOptions({
  name: 'ScrollAreaCompact'
});

const props = defineProps<ScrollAreaCompactProps>();

defineSlots<ScrollAreaCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'viewportProps',
  'verticalScrollbarProps',
  'horizontalScrollbarProps',
  'thumbProps',
  'cornerProps'
]);
</script>

<template>
  <ScrollAreaRoot v-bind="forwardedProps">
    <ScrollAreaViewport v-bind="viewportProps">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar orientation="vertical" v-bind="verticalScrollbarProps">
      <ScrollAreaThumb v-bind="thumbProps" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar orientation="horizontal" v-bind="horizontalScrollbarProps">
      <ScrollAreaThumb v-bind="thumbProps" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner v-bind="cornerProps" />
  </ScrollAreaRoot>
</template>
