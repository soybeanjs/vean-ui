<script setup lang="ts">
import { computed, useId, watch, useAttrs } from 'vue';
import { useCarouselRootContext, useCarouselUi } from './context';
import type { CarouselContentProps } from './types';

defineOptions({
  name: 'CarouselContent'
});

defineProps<CarouselContentProps>();

const attrs = useAttrs();

const cls = useCarouselUi('content');

const { setCarouselRef, contentId, setContentId } = useCarouselRootContext('CarouselContent');

const defaultId = `vean-carousel-content-${useId()}`;
const resolvedContentId = computed(() => (attrs.id as string) || contentId.value || defaultId);

watch(
  resolvedContentId,
  id => {
    setContentId(id);
  },
  { immediate: true }
);
</script>

<template>
  <div :id="resolvedContentId" :ref="setCarouselRef" data-vean-carousel-content :class="cls">
    <slot />
  </div>
</template>
