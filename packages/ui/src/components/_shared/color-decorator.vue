<script setup lang="ts">
import { computed } from 'vue';
import type { PaletteColorLevel } from '@soybeanjs/colord/palette';

type DecorateColors = Partial<Record<PaletteColorLevel, string | { hsl: string }>>;

interface Props {
  colors: DecorateColors;
  levels?: PaletteColorLevel[];
  /**
   * Whether adjacent swatches overlap by one step. Turn it off for a single
   * swatch, which would otherwise be pulled left by a negative margin.
   *
   * @default true
   */
  overlap?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  levels: () => [100, 900, 300, 800, 600],
  overlap: true
});

const swatchClass = computed(() => (props.overlap ? 'size-4 -ml-1 rounded-full' : 'size-4 rounded-full'));

const isHslObject = (value?: string | { hsl: string }): value is { hsl: string } => {
  return typeof value === 'object' && 'hsl' in value;
};

const getColorValue = (value?: string | { hsl: string }) => {
  if (isHslObject(value)) {
    return value.hsl;
  }

  return value ?? 'transparent';
};
</script>

<template>
  <div class="flex">
    <div
      v-for="level in levels"
      :key="level"
      :class="swatchClass"
      :style="{
        backgroundColor: getColorValue(colors[level])
      }"
    ></div>
  </div>
</template>
