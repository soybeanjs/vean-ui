<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SIcon, SInput, SSelect, SSwitch, SToggle, useTheme } from '@vean/ui';
import type { SelectOptionData, ThemeColor, ThemeSize, ToggleShape, ToggleVariant } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: ToggleVariant;
  color: ThemeColor;
  size: ThemeSize;
  shape: ToggleShape;
  disabled: boolean;
  text: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  variant: 'ghost',
  color: 'accent',
  size: 'md',
  shape: 'auto',
  disabled: false,
  text: 'Toggle me'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly ToggleVariant[] = ['outline', 'soft', 'ghost'];
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
const SHAPE_KEYS: readonly ToggleShape[] = ['auto', 'rounded', 'square', 'circle'];

const variantItems: SelectOptionData<ToggleVariant>[] = toOptions(VARIANT_KEYS);
const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const shapeItems: SelectOptionData<ToggleShape>[] = toOptions(SHAPE_KEYS);

const theme = useTheme('ToggleCustomizer');

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

const variant = shallowRef(DEFAULTS.variant);
const color = shallowRef(DEFAULTS.color);
const size = shallowRef(DEFAULTS.size);
const shape = shallowRef(DEFAULTS.shape);
const disabled = shallowRef(DEFAULTS.disabled);
const text = shallowRef(DEFAULTS.text);

/** 方形 / 圆形没有文字位，改渲染图标，避免文字挤在方形框里溢出。 */
const isIconShape = computed(() => shape.value === 'square' || shape.value === 'circle');

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  disabled.value = DEFAULTS.disabled;
  text.value = DEFAULTS.text;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-30" />
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
      <FieldItem label="shape">
        <SSelect v-model="shape" :items="shapeItems" :trigger-props="{ 'aria-label': 'Shape' }" class="w-30" />
      </FieldItem>
      <FieldItem label="text">
        <SInput v-model="text" aria-label="Text" />
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
    <SToggle class="max-w-2xl" :variant="variant" :color="color" :size="size" :shape="shape" :disabled="disabled">
      <SIcon v-if="isIconShape" icon="lucide:rocket" />
      <template v-else>{{ text }}</template>
    </SToggle>
  </div>
</template>
