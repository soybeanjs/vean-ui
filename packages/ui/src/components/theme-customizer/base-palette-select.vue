<script setup lang="ts">
import { computed } from 'vue';
import { NEUTRAL_PALETTES, PALETTE_LEVELS, paletteColor } from '@vean/theme';
import type { PaletteLevel, PaletteKey } from '@vean/theme';
import SSelect from '../select/select.vue';
import type { SelectOptionData } from '../select/types';
import ColorDecorator from './color-decorator.vue';

interface Props {
  decorateLevels?: PaletteLevel[];
}

defineProps<Props>();

const palette = defineModel<PaletteKey>({
  required: true
});

/** the palette swatch colors, resolved from the engine's own palette data. */
const swatchOf = (key: PaletteKey): Record<PaletteLevel, string> =>
  Object.fromEntries(PALETTE_LEVELS.map(level => [level, paletteColor(key, level, 'hsl') ?? ''])) as Record<
    PaletteLevel,
    string
  >;

const currentColors = computed(() => swatchOf(palette.value));

const items = computed<SelectOptionData<PaletteKey>[]>(() =>
  NEUTRAL_PALETTES.map(key => ({
    label: key,
    value: key
  }))
);
</script>

<template>
  <SSelect v-model="palette" :items="items">
    <template #trigger-leading>
      <ColorDecorator :colors="currentColors" :levels="decorateLevels" />
    </template>
    <template #item-leading="{ item }">
      <ColorDecorator :colors="swatchOf(item.value)" :levels="decorateLevels" />
    </template>
  </SSelect>
</template>
