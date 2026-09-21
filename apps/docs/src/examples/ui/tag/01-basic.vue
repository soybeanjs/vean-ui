<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SButtonIcon, SIcon, SInput, SSelect, SSwitch, STag, useTheme } from '@vean/ui';
import type { SelectOptionData, TagShape, TagVariant, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: TagVariant;
  color: ThemeColor;
  size: ThemeSize;
  shape: TagShape;
  closable: boolean;
  text: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  shape: 'auto',
  closable: false,
  text: 'Tag'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly TagVariant[] = ['solid', 'pure', 'outline', 'soft', 'ghost', 'raw'];
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
const SHAPE_KEYS: readonly TagShape[] = ['auto', 'rounded'];

const variantItems: SelectOptionData<TagVariant>[] = toOptions(VARIANT_KEYS);
const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const shapeItems: SelectOptionData<TagShape>[] = toOptions(SHAPE_KEYS);

const theme = useTheme('TagCustomizer');

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
const closable = shallowRef(DEFAULTS.closable);
const text = shallowRef(DEFAULTS.text);

/** 关闭受 `open` 控制：点掉之后预览区给出占位提示，reset 恢复标签。 */
const open = shallowRef(true);

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  closable.value = DEFAULTS.closable;
  text.value = DEFAULTS.text;
  open.value = true;
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
        <SInput v-model="text" aria-label="Text" placeholder="Tag text" />
      </FieldItem>
      <FieldItem label="closable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="closable" :control-props="{ 'aria-label': 'Closable' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex items-center justify-center w-full gap-3">
    <STag
      v-model:open="open"
      class="max-w-2xl"
      :variant="variant"
      :color="color"
      :size="size"
      :shape="shape"
      :closable="closable"
    >
      <template #leading>
        <SIcon icon="lucide:tag" />
      </template>
      {{ text }}
    </STag>
    <span v-if="!open" class="text-sm text-muted-foreground">Tag closed — reset to restore</span>
  </div>
</template>
