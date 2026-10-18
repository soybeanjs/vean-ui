<script setup lang="ts">
import { NEUTRAL_PALETTES } from '@vean/theme';
import ColorDecorator from '../_shared/color-decorator.vue';
import { usePaletteSwatches } from '../_shared/use-palette-swatches';
import { useTheme } from '../config-provider/use-theme';
import SSelect from '../select/select.vue';
import { useThemeCustomizerLocale } from '../theme-customizer/use-locale';
import type { ThemeBaseSelectProps } from './types';

defineOptions({
  name: 'SThemeBaseSelect'
});

const props = withDefaults(defineProps<ThemeBaseSelectProps>(), {
  size: 'md',
  simple: true
});

const { base } = useTheme('ThemeBaseSelect');

const { resolveLabel } = useThemeCustomizerLocale();

const { decorateLevels, overlap, swatchOf, currentColors, items } = usePaletteSwatches({
  keys: NEUTRAL_PALETTES,
  current: base,
  simple: () => props.simple
});
</script>

<template>
  <SSelect v-model="base" :items="items" :size="size" :trigger-props="{ 'aria-label': resolveLabel('base') }">
    <template #trigger-leading>
      <ColorDecorator :colors="currentColors" :levels="decorateLevels" :overlap="overlap" />
    </template>
    <template #item-leading="{ item }">
      <ColorDecorator :colors="swatchOf(item.value)" :levels="decorateLevels" :overlap="overlap" />
    </template>
  </SSelect>
</template>
