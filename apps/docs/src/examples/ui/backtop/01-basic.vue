<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SBacktop, SButtonIcon, SInput, SInputNumber, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { ButtonShadow, ButtonShape, ButtonVariant, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: ButtonVariant;
  color: ThemeColor;
  size: ThemeSize;
  shape: ButtonShape;
  shadow: ButtonShadow;
  fitContent: boolean;
  disabled: boolean;
  icon: string;
  visibilityHeight: number | null;
}

/**
 * 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。
 * `visibilityHeight` 取 80 而不是组件默认的 400：预览容器只有 64 高度，
 * 沿用默认值按钮永远不会出现。
 */
const DEFAULTS: CustomizerState = {
  variant: 'solid',
  color: 'primary',
  size: 'lg',
  shape: 'circle',
  shadow: 'lg',
  fitContent: true,
  disabled: false,
  icon: 'lucide:arrow-up',
  visibilityHeight: 80
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly ButtonVariant[] = ['solid', 'pure', 'plain', 'outline', 'dashed', 'soft', 'ghost', 'link'];
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
const SHAPE_KEYS: readonly ButtonShape[] = ['auto', 'rounded', 'square', 'circle'];
const SHADOW_KEYS: readonly ButtonShadow[] = ['none', 'sm', 'md', 'lg'];

const variantItems: SelectOptionData<ButtonVariant>[] = toOptions(VARIANT_KEYS);
const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const sizeItems: SelectOptionData<ThemeSize>[] = toOptions(SIZE_KEYS);
const shapeItems: SelectOptionData<ButtonShape>[] = toOptions(SHAPE_KEYS);
const shadowItems: SelectOptionData<ButtonShadow>[] = toOptions(SHADOW_KEYS);

const theme = useTheme('BacktopCustomizer');

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
const shadow = shallowRef(DEFAULTS.shadow);
const fitContent = shallowRef(DEFAULTS.fitContent);
const disabled = shallowRef(DEFAULTS.disabled);
const icon = shallowRef(DEFAULTS.icon);
const visibilityHeight = shallowRef(DEFAULTS.visibilityHeight);

/** 清空图标输入即回到组件默认的箭头图标。 */
const iconValue = computed(() => icon.value.trim() || undefined);

const visibilityHeightValue = computed(() => visibilityHeight.value ?? 0);

const scrollTarget = shallowRef<HTMLDivElement | null>(null);

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  shadow.value = DEFAULTS.shadow;
  fitContent.value = DEFAULTS.fitContent;
  disabled.value = DEFAULTS.disabled;
  icon.value = DEFAULTS.icon;
  visibilityHeight.value = DEFAULTS.visibilityHeight;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-25" />
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
      <FieldItem label="shape">
        <SSelect v-model="shape" :items="shapeItems" :trigger-props="{ 'aria-label': 'Shape' }" class="w-30" />
      </FieldItem>
      <FieldItem label="shadow">
        <SSelect v-model="shadow" :items="shadowItems" :trigger-props="{ 'aria-label': 'Shadow' }" class="w-25" />
      </FieldItem>
      <FieldItem label="icon">
        <SInput v-model="icon" aria-label="Icon" placeholder="e.g. lucide:arrow-up" />
      </FieldItem>
      <FieldItem label="visibilityHeight">
        <SInputNumber
          v-model="visibilityHeight"
          :min="0"
          :step="40"
          :control-props="{ 'aria-label': 'Visibility height' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="fitContent">
        <div class="h-8 flex items-center">
          <SSwitch v-model="fitContent" :control-props="{ 'aria-label': 'Fit content' }" />
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

  <div ref="scrollTarget" class="relative h-64 overflow-auto rounded-md border bg-muted/20 p-4">
    <p class="text-sm text-muted-foreground">Scroll inside the container to reveal the Backtop button.</p>
    <div class="h-80" />
    <SBacktop
      :target="scrollTarget ?? undefined"
      :visibility-height="visibilityHeightValue"
      :variant="variant"
      :color="color"
      :size="size"
      :shape="shape"
      :shadow="shadow"
      :fit-content="fitContent"
      :disabled="disabled"
      :icon="iconValue"
      class="absolute bottom-4 end-4"
    />
  </div>
</template>
