<script setup lang="ts">
import { computed } from 'vue';
import { formatChannelValue, getChannelName } from '../../shared';
import { useForwardElement } from '../../composables';
import { Primitive } from '../primitive';
import { convertValueToPercentage } from './shared';
import { useColorAreaRootContext, useColorAreaUi } from './context';
import type { ColorAreaThumbProps } from './types';

defineOptions({
  name: 'ColorAreaThumb'
});

withDefaults(defineProps<ColorAreaThumbProps>(), {
  as: 'span'
});

const { setThumbElement, xChannel, yChannel, xValue, yValue, xRange, yRange, disabled } =
  useColorAreaRootContext('ColorAreaThumb');

const [_, setThumbElementRef] = useForwardElement(el => {
  setThumbElement(el);
});

const cls = useColorAreaUi('thumb');

const resolvedXChannel = computed(() => xChannel.value ?? 'saturation');
const resolvedYChannel = computed(() => yChannel.value ?? 'lightness');

const xPercent = computed(() => convertValueToPercentage(xValue.value, xRange.value.min, xRange.value.max));
const yPercent = computed(() => convertValueToPercentage(yValue.value, yRange.value.min, yRange.value.max));
const ariaLabel = computed(
  () => `${getChannelName(resolvedXChannel.value)}, ${getChannelName(resolvedYChannel.value)}`
);
const ariaValueText = computed(
  () =>
    `${getChannelName(resolvedXChannel.value)} ${formatChannelValue(resolvedXChannel.value, xValue.value)}, ${getChannelName(resolvedYChannel.value)} ${formatChannelValue(resolvedYChannel.value, yValue.value)}`
);
</script>

<template>
  <Primitive
    :ref="setThumbElementRef"
    :as="as"
    :as-child="asChild"
    data-vean-color-area-thumb
    :class="cls"
    role="slider"
    :tabindex="disabled ? undefined : 0"
    :aria-label="ariaLabel"
    aria-roledescription="Color thumb"
    :aria-valuemin="xRange.min"
    :aria-valuemax="xRange.max"
    :aria-valuenow="xValue"
    :aria-valuetext="ariaValueText"
    aria-orientation="horizontal"
    :data-disabled="disabled ? '' : undefined"
    :style="{
      position: 'absolute',
      left: `${xPercent}%`,
      top: `${100 - yPercent}%`,
      transform: 'translate(-50%, -50%)',
      touchAction: 'none'
    }"
  >
    <slot />
  </Primitive>
</template>
