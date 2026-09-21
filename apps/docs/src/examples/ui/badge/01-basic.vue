<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SBadge, SButton, SButtonIcon, SInput, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { BadgePosition, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  color: ThemeColor;
  size: ThemeSize;
  position: BadgePosition;
  content: string;
  open: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  color: 'primary',
  size: 'md',
  position: 'top-right',
  content: '99+',
  open: true
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
const POSITION_KEYS: readonly BadgePosition[] = ['top-right', 'bottom-right', 'top-left', 'bottom-left'];

const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);
const sizeItems: SelectOptionData<ThemeSize>[] = toOptions(SIZE_KEYS);
const positionItems: SelectOptionData<BadgePosition>[] = toOptions(POSITION_KEYS);

const theme = useTheme('BadgeCustomizer');

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

const color = shallowRef(DEFAULTS.color);
const size = shallowRef(DEFAULTS.size);
const position = shallowRef(DEFAULTS.position);
const content = shallowRef(DEFAULTS.content);
const open = shallowRef(DEFAULTS.open);

const reset = (): void => {
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  position.value = DEFAULTS.position;
  content.value = DEFAULTS.content;
  open.value = DEFAULTS.open;
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
        <SSelect v-model="size" :items="sizeItems" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="position">
        <SSelect v-model="position" :items="positionItems" :trigger-props="{ 'aria-label': 'Position' }" class="w-35" />
      </FieldItem>
      <FieldItem label="content">
        <SInput v-model="content" aria-label="Content" placeholder="Badge content" />
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
    <SBadge v-model:open="open" class="max-w-2xl" :color="color" :size="size" :position="position" :content="content">
      <SButton variant="pure">Inbox</SButton>
    </SBadge>
  </div>
</template>
