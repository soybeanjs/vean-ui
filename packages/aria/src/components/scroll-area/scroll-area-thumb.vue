<script setup lang="ts">
import { useAttrs } from 'vue';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useScrollAreaScrollbarContext, useScrollAreaUi } from './context';
import type { ScrollAreaThumbProps } from './types';

defineOptions({
  name: 'ScrollAreaThumb',
  inheritAttrs: false
});

const props = defineProps<ScrollAreaThumbProps>();

const attrs = useAttrs();
const forwardedProps = useOmitProps(props, [], attrs);

const cls = useScrollAreaUi('thumb');
const { dataState, hasOverflow, onThumbPointerDown, onThumbPointerUp, orientation, thumbStyle } =
  useScrollAreaScrollbarContext('ScrollAreaThumb');
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :as="as"
    :as-child="asChild"
    data-vean-scroll-area-thumb
    :class="cls"
    :data-orientation="orientation"
    :data-state="dataState"
    :aria-hidden="true"
    :hidden="hasOverflow ? undefined : ''"
    :style="thumbStyle"
    @pointerdown="onThumbPointerDown"
    @pointerup="onThumbPointerUp"
  >
    <slot />
  </Primitive>
</template>
