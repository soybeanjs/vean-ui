<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { formatColor } from '@vean/aria/shared';
import type { ColorChannel, ColorFormat, ColorSpace, ColorValue } from '@vean/aria/types';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SColorSlider, SColorSwatch, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  channel: ColorChannel;
  colorSpace: ColorSpace;
  format: ColorFormat;
  orientation: DataOrientation;
  color: ThemeColor;
  size: ThemeSize;
  disabled: boolean;
  inverted: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  channel: 'hue',
  colorSpace: 'hsl',
  format: 'hex',
  orientation: 'horizontal',
  color: 'primary',
  size: 'md',
  disabled: false,
  inverted: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const CHANNEL_KEYS: readonly ColorChannel[] = [
  'hue',
  'saturation',
  'lightness',
  'brightness',
  'red',
  'green',
  'blue',
  'alpha',
  'chroma'
];
const COLOR_SPACE_KEYS: readonly ColorSpace[] = ['hsl', 'hsv', 'oklch'];
const FORMAT_KEYS: readonly ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch'];
const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];
const COLOR_KEYS: ThemeColor[] = [
  'primary',
  'destructive',
  'success',
  'warning',
  'info',
  'carbon',
  'secondary',
  'accent'
];

const channelItems: SelectOptionData<ColorChannel>[] = toOptions(CHANNEL_KEYS);
const colorSpaceItems = toOptions(COLOR_SPACE_KEYS);
const formatItems = toOptions(FORMAT_KEYS);
const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);

const theme = useTheme('ColorSliderCustomizer');

/** 角色 → 实际颜色：走引擎自己的解析，SSR 安全，明暗与自定义主题变化时自动刷新。 */
const colorValues = computed(() => {
  const colors = resolveThemeColors(theme.theme.value, theme.effectiveMode.value);

  const map = COLOR_KEYS.reduce(
    (acc, key) => {
      acc[key] = colors[key];
      return acc;
    },
    {} as Record<ThemeColor, string>
  );

  return map;
});

// 被编辑的颜色本身不是「怎么渲染」的状态，保持为独立的模型值。
const value = shallowRef<ColorValue>('rgba(236, 72, 153, 0.85)');

const channel = shallowRef(DEFAULTS.channel);
const colorSpace = shallowRef(DEFAULTS.colorSpace);
const format = shallowRef(DEFAULTS.format);
const orientation = shallowRef(DEFAULTS.orientation);
const color = shallowRef(DEFAULTS.color);
const size = shallowRef(DEFAULTS.size);
const disabled = shallowRef(DEFAULTS.disabled);
const inverted = shallowRef(DEFAULTS.inverted);

const colorText = computed(() => formatColor(value.value, 'hex'));

const reset = (): void => {
  channel.value = DEFAULTS.channel;
  colorSpace.value = DEFAULTS.colorSpace;
  format.value = DEFAULTS.format;
  orientation.value = DEFAULTS.orientation;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  disabled.value = DEFAULTS.disabled;
  inverted.value = DEFAULTS.inverted;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="channel">
        <SSelect v-model="channel" :items="channelItems" :trigger-props="{ 'aria-label': 'Channel' }" class="w-33" />
      </FieldItem>
      <FieldItem label="colorSpace">
        <SSelect
          v-model="colorSpace"
          :items="colorSpaceItems"
          :trigger-props="{ 'aria-label': 'Color space' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="format">
        <SSelect v-model="format" :items="formatItems" :trigger-props="{ 'aria-label': 'Format' }" class="w-27" />
      </FieldItem>
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-33"
        />
      </FieldItem>
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
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem label="inverted">
        <div class="h-8 flex items-center">
          <SSwitch v-model="inverted" :control-props="{ 'aria-label': 'Inverted' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="flex flex-col gap-3 w-60 lt-md:w-auto">
      <div class="flex items-center gap-3">
        <SColorSwatch :color="value" />
        <span class="text-sm text-muted-foreground">{{ colorText }}</span>
      </div>
      <SColorSlider
        v-model="value"
        :channel="channel"
        :color-space="colorSpace"
        :format="format"
        :orientation="orientation"
        :color="color"
        :size="size"
        :disabled="disabled"
        :inverted="inverted"
      />
    </div>
  </div>
</template>
