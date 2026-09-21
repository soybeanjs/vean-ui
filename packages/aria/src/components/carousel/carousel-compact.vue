<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { useOmitProps } from '../../composables';
import type { DefinedValue } from '../../types';
import CarouselContainer from './carousel-container.vue';
import CarouselContent from './carousel-content.vue';
import CarouselControl from './carousel-control.vue';
import CarouselItem from './carousel-item.vue';
import CarouselNavigation from './carousel-navigation.vue';
import CarouselNext from './carousel-next.vue';
import CarouselPrevious from './carousel-previous.vue';
import CarouselRoot from './carousel-root.vue';
import type { CarouselCompactProps, CarouselCompactEmits, CarouselCompactSlots } from './types';

defineOptions({
  name: 'CarouselCompact'
});

const props = defineProps<CarouselCompactProps<T>>();

const emit = defineEmits<CarouselCompactEmits>();

defineSlots<CarouselCompactSlots<T>>();

const forwardedProps = useOmitProps(props, [
  'slides',
  'contentProps',
  'containerProps',
  'itemProps',
  'controlProps',
  'navigationProps',
  'previousProps',
  'nextProps'
]);
</script>

<template>
  <CarouselRoot v-slot="slotProps" v-bind="forwardedProps" @init="emit('init', $event)">
    <CarouselContent v-bind="contentProps">
      <CarouselContainer v-bind="containerProps">
        <CarouselItem v-for="(slide, index) in slides" :key="index" v-bind="itemProps">
          <slot
            name="item"
            v-bind="slotProps"
            :slide="slide"
            :index="index"
            :selected="index === slotProps.selectedIndex"
          />
        </CarouselItem>
      </CarouselContainer>
    </CarouselContent>
    <CarouselControl v-bind="controlProps">
      <CarouselNavigation v-bind="navigationProps">
        <CarouselPrevious v-bind="previousProps">
          <slot name="previous" v-bind="slotProps" />
        </CarouselPrevious>
        <CarouselNext v-bind="nextProps">
          <slot name="next" v-bind="slotProps" />
        </CarouselNext>
      </CarouselNavigation>
      <slot name="control" v-bind="slotProps" />
    </CarouselControl>
  </CarouselRoot>
</template>
