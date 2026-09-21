<script setup lang="ts">
import { computed } from 'vue';
import { FEEDBACK_SCHEMES, PALETTE_LEVELS, resolveColorRef } from '@vean/theme';
import type { FeedbackScheme, FeedbackSchemeKey, PaletteLevel } from '@vean/theme';
import SSelect from '../select/select.vue';
import type { SelectOptionData } from '../select/types';
import ColorDecorator from './color-decorator.vue';
import { useThemeCustomizerLocale } from './use-locale';

const palette = defineModel<FeedbackSchemeKey>({
  required: true
});

const { resolveOption } = useThemeCustomizerLocale();

const schemes = FEEDBACK_SCHEMES as Record<string, FeedbackScheme>;

/** map a scheme's status colors onto palette levels for the swatch decorator. */
function createColors(value: Record<string, string>) {
  const colors: Partial<Record<PaletteLevel, string>> = {};

  Object.values(value).forEach((color, index) => {
    const level = PALETTE_LEVELS[index];

    if (level !== undefined) {
      colors[level] = resolveColorRef(color, 'hsl');
    }
  });

  return colors;
}

const decorateLevels = Object.keys(schemes.classic.light).map((_, index) => PALETTE_LEVELS[index]);

const currentColors = computed(() => createColors(schemes[palette.value]?.light ?? {}));

const allColors = Object.fromEntries(
  Object.entries(schemes).map(([key, scheme]) => [key, createColors(scheme.light)])
) as Record<FeedbackSchemeKey, Partial<Record<PaletteLevel, string>>>;

const items = computed<SelectOptionData<FeedbackSchemeKey>[]>(() =>
  Object.keys(schemes).map(key => ({
    label: resolveOption('feedback', key),
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
      <ColorDecorator :colors="allColors[item.value]" :levels="decorateLevels" />
    </template>
  </SSelect>
</template>
