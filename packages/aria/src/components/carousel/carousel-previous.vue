<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { VisuallyHidden } from '../visually-hidden';
import { useCarouselRootContext, useCarouselUi } from './context';
import type { CarouselPreviousProps } from './types';

defineOptions({
  name: 'CarouselPrevious'
});

const props = defineProps<CarouselPreviousProps>();

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['disabled']);

const cls = useCarouselUi('previous');

const { canScrollPrev, contentId, scrollPrev } = useCarouselRootContext('CarouselPrevious');

const messages = useLocaleMessages();

const disabled = computed(() => props.disabled || !canScrollPrev.value);
const ariaLabel = computed(() => {
  const label = attrs['aria-label'];
  return typeof label === 'string' && label.trim() ? label : messages.value.carousel.previous;
});

const onPrev = () => {
  scrollPrev();
};
</script>

<template>
  <Button
    v-bind="forwardedProps"
    data-vean-carousel-previous
    :class="cls"
    :disabled="disabled"
    :aria-controls="contentId || undefined"
    :aria-label="ariaLabel"
    @click="onPrev"
  >
    <slot>
      <Icon icon="lucide:arrow-left" :aria-hidden="true" />
      <VisuallyHidden feature="fully-hidden">{{ messages.carousel.previous }}</VisuallyHidden>
    </slot>
  </Button>
</template>
