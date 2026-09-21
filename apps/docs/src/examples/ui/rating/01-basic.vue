<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SInputNumber, SRating, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { DataOrientation, RatingVariant, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  value: number;
  max: number;
  allowHalf: boolean;
  allowClear: boolean;
  readonly: boolean;
  disabled: boolean;
  orientation: DataOrientation;
  color: ThemeColor;
  variant: RatingVariant;
  size: ThemeSize;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  value: 3,
  max: 5,
  allowHalf: false,
  allowClear: false,
  readonly: false,
  disabled: false,
  orientation: 'horizontal',
  color: 'warning',
  variant: 'filled',
  size: 'md'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

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
const VARIANT_KEYS: readonly RatingVariant[] = ['filled', 'outline'];
const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];

const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const variantItems: SelectOptionData<RatingVariant>[] = toOptions(VARIANT_KEYS);
const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);

const theme = useTheme('RatingCustomizer');

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

const value = shallowRef(DEFAULTS.value);
const max = shallowRef(DEFAULTS.max);
const allowHalf = shallowRef(DEFAULTS.allowHalf);
const allowClear = shallowRef(DEFAULTS.allowClear);
const readonly = shallowRef(DEFAULTS.readonly);
const disabled = shallowRef(DEFAULTS.disabled);
const orientation = shallowRef(DEFAULTS.orientation);
const color = shallowRef(DEFAULTS.color);
const variant = shallowRef(DEFAULTS.variant);
const size = shallowRef(DEFAULTS.size);

const reset = (): void => {
  value.value = DEFAULTS.value;
  max.value = DEFAULTS.max;
  allowHalf.value = DEFAULTS.allowHalf;
  allowClear.value = DEFAULTS.allowClear;
  readonly.value = DEFAULTS.readonly;
  disabled.value = DEFAULTS.disabled;
  orientation.value = DEFAULTS.orientation;
  color.value = DEFAULTS.color;
  variant.value = DEFAULTS.variant;
  size.value = DEFAULTS.size;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="value">
        <SInputNumber
          v-model="value"
          :min="0"
          :max="max"
          :step="allowHalf ? 0.5 : 1"
          :control-props="{ 'aria-label': 'Value' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="max">
        <SInputNumber v-model="max" :min="1" :control-props="{ 'aria-label': 'Max' }" class="w-25" />
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
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-30" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-33"
        />
      </FieldItem>
      <FieldItem label="allowHalf">
        <div class="h-8 flex items-center">
          <SSwitch v-model="allowHalf" :control-props="{ 'aria-label': 'Allow half' }" />
        </div>
      </FieldItem>
      <FieldItem label="allowClear">
        <div class="h-8 flex items-center">
          <SSwitch v-model="allowClear" :control-props="{ 'aria-label': 'Allow clear' }" />
        </div>
      </FieldItem>
      <FieldItem label="readonly">
        <div class="h-8 flex items-center">
          <SSwitch v-model="readonly" :control-props="{ 'aria-label': 'Readonly' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="flex-c gap-3">
      <SRating
        v-model="value"
        :max="max"
        :allow-half="allowHalf"
        :allow-clear="allowClear"
        :readonly="readonly"
        :disabled="disabled"
        :orientation="orientation"
        :color="color"
        :variant="variant"
        :size="size"
      />
      <span class="text-sm text-muted-foreground">{{ value }}</span>
    </div>
  </div>
</template>
