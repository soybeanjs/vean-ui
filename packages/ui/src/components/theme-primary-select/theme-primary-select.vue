<script setup lang="ts">
import { PALETTE_KEYS } from '@vean/theme';
import ColorDecorator from '../_shared/color-decorator.vue';
import { usePaletteSwatches } from '../_shared/use-palette-swatches';
import { useTheme } from '../config-provider/use-theme';
import SSelect from '../select/select.vue';
import { useThemeCustomizerLocale } from '../theme-customizer/use-locale';
import type { ThemePrimarySelectProps } from './types';

defineOptions({
  name: 'SThemePrimarySelect'
});

const props = withDefaults(defineProps<ThemePrimarySelectProps>(), {
  size: 'md',
  simple: true
});

const { primary } = useTheme('ThemePrimarySelect');

const { resolveLabel } = useThemeCustomizerLocale();

const { decorateLevels, overlap, swatchOf, currentColors, items } = usePaletteSwatches({
  keys: PALETTE_KEYS,
  current: primary,
  simple: () => props.simple
});
</script>

<template>
  <SSelect v-model="primary" :items="items" :size="size" :trigger-props="{ 'aria-label': resolveLabel('primary') }">
    <template #trigger-leading>
      <ColorDecorator :colors="currentColors" :levels="decorateLevels" :overlap="overlap" />
    </template>
    <template #item-leading="{ item }">
      <ColorDecorator :colors="swatchOf(item.value)" :levels="decorateLevels" :overlap="overlap" />
    </template>
  </SSelect>
</template>
