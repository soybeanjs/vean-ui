<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { SelectOptionData, SwitchShape, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  checked: boolean;
  color: ThemeColor;
  size: ThemeSize;
  shape: SwitchShape;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  checked: true,
  color: 'primary',
  size: 'md',
  shape: 'rounded',
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
const SHAPE_KEYS: readonly SwitchShape[] = ['rounded', 'square'];

const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const shapeItems: SelectOptionData<SwitchShape>[] = toOptions(SHAPE_KEYS);

const theme = useTheme('SwitchCustomizer');

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

const checked = shallowRef(DEFAULTS.checked);
const color = shallowRef<ThemeColor>(DEFAULTS.color);
const size = shallowRef<ThemeSize>(DEFAULTS.size);
const shape = shallowRef<SwitchShape>(DEFAULTS.shape);
const disabled = shallowRef(DEFAULTS.disabled);

const reset = (): void => {
  checked.value = DEFAULTS.checked;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  disabled.value = DEFAULTS.disabled;
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
      <FieldItem label="shape">
        <SSelect v-model="shape" :items="shapeItems" :trigger-props="{ 'aria-label': 'Shape' }" class="w-30" />
      </FieldItem>
      <FieldItem label="checked">
        <div class="h-8 flex items-center">
          <SSwitch v-model="checked" :control-props="{ 'aria-label': 'Checked' }" />
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
    <SSwitch v-model="checked" class="max-w-2xl" :color="color" :size="size" :shape="shape" :disabled="disabled" />
  </div>
</template>
