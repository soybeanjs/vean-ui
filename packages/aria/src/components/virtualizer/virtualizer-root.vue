<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { toContext } from '../../shared';
import { useExposedElement } from '../../composables';
import { Primitive } from '../primitive';
import { getVirtualizerPadding } from './shared';
import { provideVirtualizerContext } from './context';
import type { VirtualizerRootProps } from './types';

defineOptions({
  name: 'VirtualizerRoot'
});

const props = defineProps<VirtualizerRootProps<T>>();

const [rootElement, setRootElement] = useExposedElement();

const padding = computed(() => getVirtualizerPadding(rootElement.value));

const virtualizer = useVirtualizer(
  computed(() => ({
    estimateSize: () => 28,
    ...props.options,
    count: props.items.length,
    scrollPaddingStart: padding.value.start,
    scrollPaddingEnd: padding.value.end,
    getScrollElement: () => rootElement.value ?? null
  }))
);

const virtualItems = computed(() => virtualizer.value.getVirtualItems());

const totalSize = computed(() => virtualizer.value.getTotalSize());

const height = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height));

const style = computed(() => `height:${height.value};overflow:auto;`);

const isHorizontal = computed(() => props.options?.horizontal ?? false);

const contentStyle = computed(() => {
  let s = `position:relative;`;

  if (isHorizontal.value) {
    s += `width:${totalSize.value}px;height:100%;`;
  } else {
    s += `width:100%;height:${totalSize.value}px;`;
  }

  return s;
});

provideVirtualizerContext({
  virtualizer,
  virtualItems,
  contentStyle,
  isHorizontal,
  totalSize,
  ...toContext(props, ['dynamic'])
});
</script>

<template>
  <Primitive :ref="setRootElement" :as="as" :as-child="asChild" data-vean-virtualizer-root :style="style" tabindex="-1">
    <slot :virtual-items="virtualItems" :total-size="totalSize" :items="items" />
  </Primitive>
</template>
