<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SClipboard, SInput, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { ClipboardShape, ClipboardVariant, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  value: string;
  copyText: string;
  color: ThemeColor;
  size: ThemeSize;
  variant: ClipboardVariant;
  shape: ClipboardShape;
  onlyIcon: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  value: 'pnpm add @vean/ui',
  copyText: 'Copy install command',
  color: 'accent',
  size: 'md',
  variant: 'soft',
  shape: 'auto',
  onlyIcon: false,
  disabled: false
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
const SIZE_KEYS: readonly ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const VARIANT_KEYS: readonly ClipboardVariant[] = [
  'solid',
  'plain',
  'outline',
  'dashed',
  'soft',
  'ghost',
  'link',
  'pure'
];
const SHAPE_KEYS: readonly ClipboardShape[] = ['auto', 'rounded', 'square', 'circle'];

const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const sizeItems: SelectOptionData<ThemeSize>[] = toOptions(SIZE_KEYS);
const variantItems: SelectOptionData<ClipboardVariant>[] = toOptions(VARIANT_KEYS);
const shapeItems: SelectOptionData<ClipboardShape>[] = toOptions(SHAPE_KEYS);

const theme = useTheme('ClipboardCustomizer');

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
const copyText = shallowRef(DEFAULTS.copyText);
const color = shallowRef(DEFAULTS.color);
const size = shallowRef(DEFAULTS.size);
const variant = shallowRef(DEFAULTS.variant);
const shape = shallowRef(DEFAULTS.shape);
const onlyIcon = shallowRef(DEFAULTS.onlyIcon);
const disabled = shallowRef(DEFAULTS.disabled);

/** 图标形态没有文本位，回落到无障碍名，避免复制动作读不出语义。 */
const copyAriaLabel = 'Copy value';

const reset = (): void => {
  value.value = DEFAULTS.value;
  copyText.value = DEFAULTS.copyText;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  variant.value = DEFAULTS.variant;
  shape.value = DEFAULTS.shape;
  onlyIcon.value = DEFAULTS.onlyIcon;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="value">
        <SInput v-model="value" aria-label="Value" placeholder="Value to copy" />
      </FieldItem>
      <FieldItem label="copyText">
        <SInput v-model="copyText" aria-label="Copy text" placeholder="Copy text" />
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
        <SSelect v-model="size" :items="sizeItems" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-30" />
      </FieldItem>
      <FieldItem label="shape">
        <SSelect v-model="shape" :items="shapeItems" :trigger-props="{ 'aria-label': 'Shape' }" class="w-30" />
      </FieldItem>
      <FieldItem label="onlyIcon">
        <div class="h-8 flex items-center">
          <SSwitch v-model="onlyIcon" :control-props="{ 'aria-label': 'Only icon' }" />
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
    <SClipboard
      :value="value"
      :color="color"
      :size="size"
      :variant="variant"
      :shape="shape"
      :copy-text="onlyIcon ? undefined : copyText"
      :aria-label="copyAriaLabel"
      :only-icon="onlyIcon"
      :disabled="disabled"
      class="w-fit"
    />
  </div>
</template>
