<script setup lang="ts">
import { useCarouselUi } from './context';
import type { CarouselItemProps } from './types';

defineOptions({
  name: 'CarouselItem'
});

defineProps<CarouselItemProps>();

const cls = useCarouselUi('item');
</script>

<template>
  <div data-vean-carousel-item :class="cls" role="group" aria-roledescription="slide">
    <slot />
  </div>
</template>
