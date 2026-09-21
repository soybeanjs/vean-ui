<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useScrollAreaRootContext, useScrollAreaUi } from './context';
import type { ScrollAreaCornerProps } from './types';

defineOptions({
  name: 'ScrollAreaCorner',
  inheritAttrs: false
});

const props = defineProps<ScrollAreaCornerProps>();

const attrs = useAttrs();
const forwardedProps = useOmitProps(props, [], attrs);

const cls = useScrollAreaUi('corner');
const { scrollbarXSize, scrollbarYSize, scrollbarXVisible, scrollbarYVisible } =
  useScrollAreaRootContext('ScrollAreaCorner');

const isVisible = computed(() => scrollbarXVisible.value && scrollbarYVisible.value);
const style = computed(() => ({
  width: `${scrollbarYSize.value}px`,
  height: `${scrollbarXSize.value}px`
}));
</script>

<template>
  <Primitive
    v-if="isVisible"
    v-bind="forwardedProps"
    :as="as"
    :as-child="asChild"
    data-vean-scroll-area-corner
    :class="cls"
    :aria-hidden="true"
    :style="style"
  >
    <slot />
  </Primitive>
</template>
