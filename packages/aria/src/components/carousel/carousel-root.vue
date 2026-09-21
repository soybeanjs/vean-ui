<script setup lang="ts">
import { computed, shallowRef, watch, watchEffect, onWatcherCleanup, useAttrs } from 'vue';
import { useDirection } from '../config-provider/context';
import { useForwardElement } from '../../composables';
import { useLocaleMessages } from '../../locale';
import { provideCarouselRootContext, useCarouselUi } from './context';
import { useEmblaCarousel } from './hooks';
import type {
  CarouselRootProps,
  CarouselRootEmits,
  CarouselRootSlots,
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType
} from './types';

defineOptions({
  name: 'CarouselRoot'
});

const props = withDefaults(defineProps<CarouselRootProps>(), {
  orientation: 'horizontal'
});

const emit = defineEmits<CarouselRootEmits>();

defineSlots<CarouselRootSlots>();

const attrs = useAttrs();

const cls = useCarouselUi('root');

const [carouselRef, setCarouselRef] = useForwardElement();

const emblaOptions = shallowRef<EmblaOptionsType>({});
const emblaPlugins = shallowRef<EmblaPluginType[]>([]);
const carousel = useEmblaCarousel(carouselRef, emblaOptions, emblaPlugins);

const dir = useDirection(() => props.dir);

const messages = useLocaleMessages();

const ariaLabel = computed(() => {
  if (attrs['aria-labelledby']) {
    return undefined;
  }

  const label = attrs['aria-label'];
  return typeof label === 'string' && label.trim() ? label : messages.value.carousel.ariaLabel;
});
const resolvedTabindex = computed(() => props.tabindex ?? 0);
const canScrollNext = shallowRef(false);
const canScrollPrev = shallowRef(false);
const selectedIndex = shallowRef(0);
const scrollSnaps = shallowRef<number[]>([]);
const progress = shallowRef(0);

function updateScrollState(api?: EmblaCarouselType) {
  canScrollNext.value = api?.canScrollNext() ?? false;
  canScrollPrev.value = api?.canScrollPrev() ?? false;
  selectedIndex.value = api?.selectedScrollSnap() ?? 0;
  scrollSnaps.value = api?.scrollSnapList() ?? [];
  progress.value = getProgressValue();
}

function getProgressValue() {
  if (scrollSnaps.value.length <= 1) return 0;

  return (selectedIndex.value / (scrollSnaps.value.length - 1)) * 100;
}

function scrollNext() {
  carousel.value?.scrollNext();
}

function scrollPrev() {
  carousel.value?.scrollPrev();
}

function scrollTo(index: number, jump?: boolean) {
  carousel.value?.scrollTo(index, jump);
}

function onKeydown(event: KeyboardEvent) {
  if (event.target !== event.currentTarget) {
    return;
  }

  const previousKey = props.orientation === 'vertical' ? 'ArrowUp' : dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const nextKey = props.orientation === 'vertical' ? 'ArrowDown' : dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

  if (event.key === previousKey) {
    event.preventDefault();
    scrollPrev();
    return;
  }

  if (event.key === nextKey) {
    event.preventDefault();
    scrollNext();
  }
}

watchEffect(() => {
  emblaOptions.value = {
    ...props.options,
    axis: props.orientation === 'horizontal' ? 'x' : 'y',
    direction: dir.value
  };
});

watchEffect(() => {
  emblaPlugins.value = props.plugins ?? [];
});

watch(
  carousel,
  api => {
    updateScrollState(api);

    if (!api) return;

    const onSelect = (emblaApi: EmblaCarouselType) => {
      updateScrollState(emblaApi);
    };
    const onReInit = (emblaApi: EmblaCarouselType) => {
      updateScrollState(emblaApi);
    };

    api.on('select', onSelect);
    api.on('reInit', onReInit);

    emit('init', api);

    onWatcherCleanup(() => {
      api.off('select', onSelect);
      api.off('reInit', onReInit);
    });
  },
  { immediate: true }
);

provideCarouselRootContext({
  carousel,
  canScrollNext,
  canScrollPrev,
  selectedIndex,
  scrollSnaps,
  progress,
  setCarouselRef,
  scrollNext,
  scrollPrev,
  scrollTo
});

defineExpose({
  carousel,
  scrollNext,
  scrollPrev,
  scrollTo
});
</script>

<template>
  <div
    data-vean-carousel-root
    :class="cls"
    :dir="dir"
    :data-orientation="orientation"
    :aria-label="ariaLabel"
    :tabindex="resolvedTabindex"
    role="region"
    aria-roledescription="carousel"
    @keydown="onKeydown"
  >
    <slot
      :carousel="carousel"
      :can-scroll-next="canScrollNext"
      :can-scroll-prev="canScrollPrev"
      :selected-index="selectedIndex"
      :scroll-snaps="scrollSnaps"
      :progress="progress"
      :scroll-next="scrollNext"
      :scroll-prev="scrollPrev"
      :scroll-to="scrollTo"
    />
  </div>
</template>
