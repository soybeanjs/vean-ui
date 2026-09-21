<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { ScrollAreaCompact, provideScrollAreaUi } from '@vean/aria/scroll-area';
import { scrollAreaVariants } from '@/styles/scroll-area';
import type { ScrollAreaProps } from './types';

defineOptions({
  name: 'SScrollArea'
});

const props = defineProps<ScrollAreaProps>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size']);

const ui = computed(() => scrollAreaVariants({ size: props.size }, props.ui, { root: props.class }));

provideScrollAreaUi(ui);
</script>

<template>
  <ScrollAreaCompact v-bind="forwardedProps">
    <slot />
  </ScrollAreaCompact>
</template>
