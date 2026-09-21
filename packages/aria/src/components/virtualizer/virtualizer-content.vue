<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useVirtualizerContext } from './context';
import type { VirtualizerContentProps } from './types';

defineOptions({
  name: 'VirtualizerContent'
});

defineProps<VirtualizerContentProps>();

const { contentStyle, virtualItems, isVerticalDynamic } = useVirtualizerContext('VirtualizerContent');

const translateY = computed(() => virtualItems.value[0]?.start ?? 0);

const dynamicContentStyle = computed(
  () => `position:absolute;left:0;top:0;width:100%;transform:translateY(${translateY.value}px);`
);
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-virtualizer-content :style="contentStyle">
    <div v-if="isVerticalDynamic" v-bind="dynamicContentProps" :style="dynamicContentStyle">
      <slot />
    </div>
    <slot v-else />
  </Primitive>
</template>
