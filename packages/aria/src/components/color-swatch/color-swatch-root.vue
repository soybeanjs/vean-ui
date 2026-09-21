<script setup lang="ts">
import { computed } from 'vue';
import { formatColor, getColorContrast, getColorLabel, toColorObject } from '../../shared';
import { Primitive } from '../primitive';
import { useColorSwatchUi } from './context';
import type { ColorSwatchRootProps, ColorSwatchRootSlots } from './types';

defineOptions({
  name: 'ColorSwatchRoot'
});

const props = defineProps<ColorSwatchRootProps>();

defineSlots<ColorSwatchRootSlots>();

const cls = useColorSwatchUi('root');

const colorString = computed(() => (props.color ? formatColor(props.color, 'rgb') : 'transparent'));
const colorValue = computed(() => toColorObject(props.color, 'rgb'));
const alpha = computed(() => colorValue.value.alpha);
const isNoColor = computed(() => !props.color || alpha.value <= 0);
const label = computed(() => getColorLabel(props.color, props.label));
const colorContrast = computed(() => getColorContrast(props.color));
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-color-swatch-root
    :class="cls"
    role="img"
    :aria-label="label"
    aria-roledescription="color swatch"
    :data-color-contrast="colorContrast"
    :data-no-color="isNoColor ? '' : undefined"
    :style="{
      '--vean-color-swatch-color': colorString,
      '--vean-color-swatch-alpha': String(alpha)
    }"
  >
    <slot :color="colorString" :alpha="alpha" />
  </Primitive>
</template>
