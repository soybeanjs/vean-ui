<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SSelect, SSpinner, useTheme } from '@vean/ui';
import type { SelectOptionData, SpinnerIcon, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * The style recipe ships a `current` color (inherit from surrounding text) that
 * the UI prop type (`ThemeColor`) does not cover and the package does not export,
 * so the customizer tracks it with a local literal union and passes `undefined`
 * to fall back to the component default.
 */
type SpinnerColor = ThemeColor | 'current';

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  color: SpinnerColor;
  size: ThemeSize;
  icon: SpinnerIcon;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  color: 'current',
  size: 'md',
  icon: 'svg-spinners:270-ring'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const COLOR_KEYS: SpinnerColor[] = [
  'current',
  'primary',
  'destructive',
  'success',
  'warning',
  'info',
  'carbon',
  'secondary',
  'accent'
];
const ICON_KEYS: readonly SpinnerIcon[] = [
  'svg-spinners:270-ring',
  'svg-spinners:3-dots-bounce',
  'svg-spinners:blocks-scale',
  'svg-spinners:ring-resize'
];

const colorItems: SelectOptionData<SpinnerColor>[] = toOptions(COLOR_KEYS);
const iconItems: SelectOptionData<SpinnerIcon>[] = toOptions(ICON_KEYS);

const theme = useTheme('SpinnerCustomizer');

/** 角色 → 实际颜色：走引擎自己的解析，SSR 安全，明暗与自定义主题变化时自动刷新；`current` 用继承色占位。 */
const colorValues = computed(() => {
  const colors = resolveThemeColors(theme.theme.value, theme.effectiveMode.value);

  const map = COLOR_KEYS.reduce(
    (acc, key) => {
      if (key !== 'current') {
        acc[key] = colors[key];
      }
      return acc;
    },
    { current: 'currentColor' } as Record<SpinnerColor, string>
  );

  return map;
});

const color = shallowRef<SpinnerColor>(DEFAULTS.color);
const size = shallowRef<ThemeSize>(DEFAULTS.size);
const icon = shallowRef<SpinnerIcon>(DEFAULTS.icon);

const reset = (): void => {
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  icon.value = DEFAULTS.icon;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="color">
        <SSelect v-model="color" :items="colorItems" :trigger-props="{ 'aria-label': 'Color' }" class="w-40">
          <template #trigger-leading>
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: colorValues[color] }"></span>
          </template>
          <template #item-leading="{ item }">
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: colorValues[item.value] }"></span>
          </template>
        </SSelect>
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="icon">
        <SSelect v-model="icon" :items="iconItems" :trigger-props="{ 'aria-label': 'Icon' }" class="w-60" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SSpinner class="max-w-2xl" :color="color === 'current' ? undefined : color" :size="size" :icon="icon" />
  </div>
</template>
