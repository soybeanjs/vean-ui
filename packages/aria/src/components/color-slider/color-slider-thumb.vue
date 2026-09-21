<script setup lang="ts">
import { computed } from 'vue';
import { formatChannelValue, getChannelName } from '../../shared';
import { SliderThumb } from '../slider';
import { useColorSliderRootContext, useColorSliderUi } from './context';
import type { ColorSliderThumbProps } from './types';

defineOptions({
  name: 'ColorSliderThumb'
});

defineProps<ColorSliderThumbProps>();

const cls = useColorSliderUi('thumb');

const { channel, channelValue } = useColorSliderRootContext('ColorSliderThumb');

const ariaLabel = computed(() => getChannelName(channel.value));
const ariaValueText = computed(() => formatChannelValue(channel.value, channelValue.value));
</script>

<template>
  <SliderThumb
    :as="as"
    :as-child="asChild"
    data-vean-color-slider-thumb
    :class="cls"
    :index="0"
    :aria-label="ariaLabel"
    :aria-valuetext="ariaValueText"
  >
    <slot :channel-name="ariaLabel" :channel-value="channelValue" />
  </SliderThumb>
</template>
