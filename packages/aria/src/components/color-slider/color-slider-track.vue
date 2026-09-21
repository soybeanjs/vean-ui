<script setup lang="ts">
import { computed } from 'vue';
import { getSliderBackgroundStyle } from '../../shared';
import { SliderTrack } from '../slider';
import { useColorSliderRootContext, useColorSliderUi } from './context';
import type { ColorSliderTrackProps } from './types';

defineOptions({
  name: 'ColorSliderTrack'
});

defineProps<ColorSliderTrackProps>();

const cls = useColorSliderUi('track');

const { color, channel, colorSpace } = useColorSliderRootContext('ColorSliderTrack');

const backgroundStyle = computed(() => getSliderBackgroundStyle(color.value, channel.value, colorSpace.value));
</script>

<template>
  <SliderTrack :as="as" :as-child="asChild" data-vean-color-slider-track :class="cls" :style="backgroundStyle">
    <slot />
  </SliderTrack>
</template>
