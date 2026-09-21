<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { resolveThemeColors } from '@vean/theme';
import { SAnchor, SButtonIcon, SInputNumber, SSelect, SSwitch, useTheme } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeColor, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';
import { createAnchorItems, createAnchorSections } from './shared';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  orientation: DataOrientation;
  color: ThemeColor;
  size: ThemeSize;
  sticky: boolean;
  offsetTop: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'vertical',
  color: 'primary',
  size: 'md',
  sticky: true,
  offsetTop: 0
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['vertical', 'horizontal'];
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

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const colorItems: SelectOptionData<ThemeColor>[] = toOptions(COLOR_KEYS);

const theme = useTheme('AnchorCustomizer');

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

const orientation = shallowRef(DEFAULTS.orientation);
const color = shallowRef(DEFAULTS.color);
const size = shallowRef(DEFAULTS.size);
const sticky = shallowRef(DEFAULTS.sticky);
const offsetTop = shallowRef(DEFAULTS.offsetTop);

const offsetTopValue = computed(() => offsetTop.value ?? 0);

const items = createAnchorItems();
const sections = createAnchorSections();

const containerRef = shallowRef<HTMLElement>();

const getContainer = (): HTMLElement | Window => containerRef.value ?? window;

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  color.value = DEFAULTS.color;
  size.value = DEFAULTS.size;
  sticky.value = DEFAULTS.sticky;
  offsetTop.value = DEFAULTS.offsetTop;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-30"
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
      <FieldItem label="sticky">
        <div class="h-8 flex items-center">
          <SSwitch v-model="sticky" :control-props="{ 'aria-label': 'Sticky' }" />
        </div>
      </FieldItem>
      <FieldItem label="offsetTop">
        <SInputNumber v-model="offsetTop" :min="0" :control-props="{ 'aria-label': 'Offset top' }" class="w-25" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div ref="containerRef" class="max-h-100 overflow-auto rounded-lg border border-border bg-background p-4">
    <div class="grid items-start gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <SAnchor
        :items="items"
        :get-container="getContainer"
        :orientation="orientation"
        :color="color"
        :size="size"
        :sticky="sticky"
        :offset-top="offsetTopValue"
      />
      <div class="space-y-6">
        <section
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="min-h-100 rounded-lg border border-border/80 bg-card p-4"
        >
          <h4 class="text-base font-medium">{{ section.title }}</h4>
          <p class="mt-2 text-sm text-muted-foreground">
            Scroll the content area to watch the active anchor update automatically.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
