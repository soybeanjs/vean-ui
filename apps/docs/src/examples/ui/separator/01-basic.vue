<script setup lang="ts">
import { shallowRef } from 'vue';
import { SInput, SSelect, SSeparator } from '@vean/ui';
import type { Align, DataOrientation, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。
 * `border` 的字面量联合在 UI 包里未被导出，这里本地声明同形类型。
 */
interface CustomizerState {
  orientation: DataOrientation;
  align: Align;
  border: 'solid' | 'dashed' | 'dotted';
  size: ThemeSize;
  label: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'horizontal',
  align: 'center',
  border: 'solid',
  size: 'md',
  label: 'Separator'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];
const ALIGN_KEYS: readonly Align[] = ['start', 'center', 'end'];
const BORDER_KEYS: readonly CustomizerState['border'][] = ['solid', 'dashed', 'dotted'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const alignItems: SelectOptionData<Align>[] = toOptions(ALIGN_KEYS);
const borderItems: SelectOptionData<CustomizerState['border']>[] = toOptions(BORDER_KEYS);

const orientation = shallowRef(DEFAULTS.orientation);
const align = shallowRef(DEFAULTS.align);
const border = shallowRef(DEFAULTS.border);
const size = shallowRef(DEFAULTS.size);
const label = shallowRef(DEFAULTS.label);

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  align.value = DEFAULTS.align;
  border.value = DEFAULTS.border;
  size.value = DEFAULTS.size;
  label.value = DEFAULTS.label;
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
      <FieldItem label="align">
        <SSelect v-model="align" :items="alignItems" :trigger-props="{ 'aria-label': 'Align' }" class="w-30" />
      </FieldItem>
      <FieldItem label="border">
        <SSelect v-model="border" :items="borderItems" :trigger-props="{ 'aria-label': 'Border' }" class="w-30" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="label">
        <SInput v-model="label" aria-label="Label" placeholder="Separator label" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex items-center justify-center w-full">
    <div v-if="orientation === 'vertical'" class="h-40 flex items-center gap-4 text-sm">
      <span>Blog</span>
      <SSeparator :orientation="orientation" :align="align" :border="border" :size="size" :label="label" />
      <span>Docs</span>
      <SSeparator :orientation="orientation" :align="align" :border="border" :size="size" :label="label" />
      <span>Source</span>
    </div>
    <div v-else class="w-3/4">
      <div class="space-y-1">
        <h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
        <p class="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <SSeparator :orientation="orientation" :align="align" :border="border" :size="size" :label="label" class="my-4" />
      <div class="flex h-5 items-center gap-4 text-sm">
        <div>Blog</div>
        <div>Docs</div>
        <div>Source</div>
      </div>
    </div>
  </div>
</template>
