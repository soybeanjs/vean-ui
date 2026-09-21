<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { CSSProperties } from 'vue';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import type { AspectRatioProps } from './types';

defineOptions({
  name: 'AspectRatio',
  inheritAttrs: false
});

const props = withDefaults(defineProps<AspectRatioProps>(), {
  ratio: 1
});

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['ratio'], attrs);

const aspect = computed(() => (1 / props.ratio) * 100);

const style = computed<CSSProperties>(() => ({
  paddingBottom: `${aspect.value}%`
}));
</script>

<template>
  <div data-vean-aspect-ratio-wrapper style="position: relative; width: 100%" :style="style">
    <Primitive v-bind="forwardedProps" data-vean-aspect-ratio style="position: absolute; inset: 0px">
      <slot :aspect="aspect" />
    </Primitive>
  </div>
</template>
