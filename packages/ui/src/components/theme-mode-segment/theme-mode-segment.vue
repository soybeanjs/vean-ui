<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import type { ThemeModePreference } from '@vean/theme';
import { useTheme } from '../config-provider/use-theme';
import SIcon from '../icon/icon.vue';
import SSegment from '../segment/segment.vue';
import type { SegmentOptionData } from '../segment/types';
import { useThemeLocale } from '../theme-customizer/locale';
import type { ThemeModeSegmentProps } from './types';

defineOptions({
  name: 'SThemeModeSegment'
});

const props = withDefaults(defineProps<ThemeModeSegmentProps>(), {
  size: 'md',
  shape: 'rounded',
  fill: 'auto',
  enableIndicator: true,
  showLabel: false
});

const { mode } = useTheme('ThemeModeSegment');

const messages = useThemeLocale();
const modeMessages = computed(() => messages.value.options.mode);

const items = computed<SegmentOptionData<ThemeModePreference>[]>(() => [
  { label: modeMessages.value.auto, value: 'auto' },
  { label: modeMessages.value.light, value: 'light' },
  { label: modeMessages.value.dark, value: 'dark' }
]);

/** 除 showLabel 外的属性原样转发给 SSegment(含 class / ui 与形态变体)。 */
const forwardedProps = useOmitProps(props, ['showLabel']);

const icons: Record<ThemeModePreference, string> = {
  auto: 'lucide:monitor',
  light: 'lucide:sun',
  dark: 'lucide:moon'
};

const iconOf = (value: ThemeModePreference): string => icons[value];

/** 图标常驻;标签默认视觉隐藏(保留可访问名称),showLabel 打开时可见。 */
const labelClass = computed(() => (props.showLabel ? undefined : 'sr-only'));
</script>

<template>
  <SSegment v-bind="forwardedProps" v-model="mode" :items="items">
    <template #item="{ label, value }">
      <SIcon :icon="iconOf(value)" />
      <span :class="labelClass">{{ label }}</span>
    </template>
  </SSegment>
</template>
