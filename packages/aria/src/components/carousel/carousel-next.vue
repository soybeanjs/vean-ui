<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { VisuallyHidden } from '../visually-hidden';
import { useCarouselRootContext, useCarouselUi } from './context';
import type { CarouselNextProps } from './types';

defineOptions({
  name: 'CarouselNext'
});

const props = defineProps<CarouselNextProps>();

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['disabled']);

const cls = useCarouselUi('next');

const { canScrollNext, contentId, scrollNext } = useCarouselRootContext('CarouselNext');

const messages = useLocaleMessages();

const disabled = computed(() => props.disabled || !canScrollNext.value);
const ariaLabel = computed(() => {
  const label = attrs['aria-label'];
  return typeof label === 'string' && label.trim() ? label : messages.value.carousel.next;
});

const onNext = () => {
  scrollNext();
};
</script>

<template>
  <Button
    v-bind="forwardedProps"
    data-vean-carousel-next
    :class="cls"
    :disabled="disabled"
    :aria-controls="contentId || undefined"
    :aria-label="ariaLabel"
    @click="onNext"
  >
    <slot>
      <Icon icon="lucide:arrow-right" :aria-hidden="true" />
      <VisuallyHidden feature="fully-hidden">{{ messages.carousel.next }}</VisuallyHidden>
    </slot>
  </Button>
</template>
