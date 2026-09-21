<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SAlert, SButtonIcon, SInput, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { AlertVariant, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: AlertVariant;
  color: ThemeColor;
  size: ThemeSize;
  open: boolean;
  closable: boolean;
  title: string;
  description: string;
  icon: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  variant: 'ghost',
  color: 'primary',
  size: 'md',
  open: true,
  closable: false,
  title: 'Info',
  description: 'This is an info alert',
  icon: ''
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly AlertVariant[] = ['solid', 'pure', 'outline', 'soft', 'ghost'];
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

const variantItems: SelectOptionData<AlertVariant>[] = toOptions(VARIANT_KEYS);
const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);

const theme = useTheme('AlertCustomizer');

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
const open = shallowRef(DEFAULTS.open);
const closable = shallowRef(DEFAULTS.closable);
const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);
const icon = shallowRef(DEFAULTS.icon);

/** 清空图标输入即回到组件默认的无图标形态。 */
const iconValue = computed(() => icon.value.trim() || undefined);

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  open.value = DEFAULTS.open;
  closable.value = DEFAULTS.closable;
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  icon.value = DEFAULTS.icon;
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
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" placeholder="Alert title" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" placeholder="Alert description" />
      </FieldItem>
      <FieldItem label="icon">
        <SInput v-model="icon" aria-label="Icon" placeholder="e.g. lucide:terminal" />
      </FieldItem>
      <FieldItem label="closable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="closable" :control-props="{ 'aria-label': 'Closable' }" />
        </div>
      </FieldItem>
      <FieldItem label="open">
        <div class="h-8 flex items-center">
          <SSwitch v-model="open" :control-props="{ 'aria-label': 'Open' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SAlert
      v-model:open="open"
      class="max-w-2xl"
      :variant="variant"
      :color="color"
      :size="size"
      :closable="closable"
      :title="title"
      :description="description"
      :icon="iconValue"
    />
  </div>
</template>
