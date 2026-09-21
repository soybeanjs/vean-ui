<script setup lang="ts">
import { computed } from 'vue';
import type { ThemeModePreference } from '@vean/theme';
import { useTheme } from '../config-provider/use-theme';
import SIcon from '../icon/icon.vue';
import SSelect from '../select/select.vue';
import type { SelectOptionData } from '../select/types';
import { useThemeLocale } from '../theme-customizer/locale';
import type { ThemeModeSelectProps } from './types';

defineOptions({
  name: 'SThemeModeSelect'
});

withDefaults(defineProps<ThemeModeSelectProps>(), {
  size: 'md',
  showIcon: true
});

const { mode } = useTheme('ThemeModeSelect');

const messages = useThemeLocale();
const modeMessages = computed(() => messages.value.options.mode);

const items = computed<SelectOptionData<ThemeModePreference>[]>(() => [
  { label: modeMessages.value.auto, value: 'auto' },
  { label: modeMessages.value.light, value: 'light' },
  { label: modeMessages.value.dark, value: 'dark' }
]);

const icons: Record<ThemeModePreference, string> = {
  auto: 'lucide:monitor',
  light: 'lucide:sun',
  dark: 'lucide:moon'
};

const iconOf = (value: ThemeModePreference): string => icons[value];
</script>

<template>
  <SSelect v-model="mode" :items="items" :size="size">
    <template v-if="showIcon" #trigger-leading>
      <SIcon :icon="iconOf(mode)" />
    </template>
    <template v-if="showIcon" #item-leading="{ item }">
      <SIcon :icon="iconOf(item.value)" />
    </template>
  </SSelect>
</template>
