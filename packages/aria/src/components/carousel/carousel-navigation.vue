<script setup lang="ts">
import { useCarouselUi } from './context';
import type { CarouselNavigationProps } from './types';

defineOptions({
  name: 'CarouselNavigation'
});

defineProps<CarouselNavigationProps>();

const cls = useCarouselUi('navigation');
</script>

<template>
  <div data-vean-carousel-navigation :class="cls">
    <slot />
  </div>
</template>
