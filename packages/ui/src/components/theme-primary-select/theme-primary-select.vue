<script setup lang="ts">
import { computed } from 'vue';
import { PALETTE_KEYS, PALETTE_LEVELS, paletteColor } from '@vean/theme';
import type { PaletteLevel, PaletteKey } from '@vean/theme';
import ColorDecorator from '../_shared/color-decorator.vue';
import { useTheme } from '../config-provider/use-theme';
import SSelect from '../select/select.vue';
import type { SelectOptionData } from '../select/types';
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

/** the single swatch level rendered by the minimal form. */
const SIMPLE_LEVEL: PaletteLevel = 500;

/**
 * `undefined` keeps the shared multi-level stack, so the non-simple form stays
 * identical to the theme customizer's primary picker.
 */
const decorateLevels = computed<PaletteLevel[] | undefined>(() => (props.simple ? [SIMPLE_LEVEL] : undefined));

const overlap = computed(() => !props.simple);

/** the palette swatch colors, resolved from the engine's own palette data. */
const swatchOf = (key: PaletteKey): Record<PaletteLevel, string> =>
  Object.fromEntries(PALETTE_LEVELS.map(level => [level, paletteColor(key, level, 'hsl') ?? ''])) as Record<
    PaletteLevel,
    string
  >;

const currentColors = computed(() => swatchOf(primary.value));

const items = computed<SelectOptionData<PaletteKey>[]>(() =>
  PALETTE_KEYS.map(key => ({
    label: key,
    value: key
  }))
);
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
