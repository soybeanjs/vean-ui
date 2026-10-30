<script setup lang="ts">
import { computed } from 'vue';
import type { ThemeModePreference } from '@vean/theme';
import { useThemeLocale } from '../_shared/locale';
import SButtonIcon from '../button/button-icon.vue';
import { useTheme } from '../config-provider/use-theme';
import type { ThemeModeToggleProps } from './types';

defineOptions({
  name: 'SThemeModeToggle'
});

const props = withDefaults(defineProps<ThemeModeToggleProps>(), {
  size: 'md',
  color: 'accent',
  variant: 'ghost',
  shape: 'square'
});

const { mode, setMode } = useTheme('ThemeModeToggle');

const messages = useThemeLocale();

/** Cycle order matches the option order of `SThemeModeSelect` / `SThemeModeSegment`. */
const CYCLE: ThemeModePreference[] = ['auto', 'light', 'dark'];

const ICONS: Record<ThemeModePreference, string> = {
  auto: 'lucide:monitor',
  light: 'lucide:sun',
  dark: 'lucide:moon'
};

const icon = computed(() => ICONS[mode.value]);

/** The preference the next click pins. */
const nextMode = computed<ThemeModePreference>(() => CYCLE[(CYCLE.indexOf(mode.value) + 1) % CYCLE.length]);

/**
 * The label names the *current* preference, so the control is self-describing;
 * it is also the tooltip.
 */
const label = computed(
  () => props.ariaLabel ?? `${messages.value.sections.scheme}: ${messages.value.options.mode[mode.value]}`
);

const onClick = (): void => {
  setMode(nextMode.value);
};
</script>

<template>
  <SButtonIcon
    :icon="icon"
    :size="size"
    :color="color"
    :variant="variant"
    :shape="shape"
    :aria-label="label"
    :title="label"
    @click="onClick"
  />
</template>
