<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useVirtualizerContext } from './context';
import type { VirtualizerItemProps } from './types';

defineOptions({
  name: 'VirtualizerItem'
});

const props = defineProps<VirtualizerItemProps>();

const { isHorizontal, dynamic, isVerticalDynamic, totalSize } = useVirtualizerContext('VirtualizerItem');

const translateStart = computed(() => props.data.start ?? 0);

const itemSize = computed(() => props.data.size ?? 0);

const itemStyle = computed(() => {
  if (isVerticalDynamic.value || props.customStyle) return '';

  let style = 'position:absolute;left:0;top:0;';

  if (dynamic.value) {
    style += `height:100%;transform:translateX(${translateStart.value}px);`;

    return style;
  }

  if (isHorizontal.value) {
    style += `width:${itemSize.value}px;height:100%;transform:translateX(${translateStart.value}px);`;
  } else {
    style += `width:100%;height:${itemSize.value}px;transform:translateY(${translateStart.value}px);`;
  }

  return style;
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-virtualizer-item
    :data-index="data.index"
    :aria-setsize="totalSize"
    :aria-posinset="data.index + 1"
    :style="itemStyle"
  >
    <slot />
  </Primitive>
</template>
