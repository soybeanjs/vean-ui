<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { CarouselCompact, provideCarouselUi } from '@vean/aria/carousel';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import type { DefinedValue } from '@vean/aria/types';
import { carouselVariants } from '@/styles/carousel';
import type { CarouselProps, CarouselEmits, CarouselSlots } from './types';

defineOptions({
  name: 'SCarousel'
});

const props = defineProps<CarouselProps<T>>();

const emit = defineEmits<CarouselEmits>();

const slots = defineSlots<CarouselSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size', 'floatNav']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(name => name !== 'item'));

const ui = computed(() =>
  carouselVariants(
    {
      size: props.size,
      orientation: props.orientation,
      floatNav: props.floatNav
    },
    props.ui,
    { root: props.class }
  )
);

provideCarouselUi(ui);
</script>

<template>
  <CarouselCompact v-bind="forwardedProps" v-on="listeners">
    <template #item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </CarouselCompact>
</template>
