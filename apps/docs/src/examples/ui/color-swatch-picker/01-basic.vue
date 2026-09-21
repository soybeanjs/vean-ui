<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SColorSwatch, SColorSwatchPicker, SSelect, SSeparator } from '@vean/ui';
import type { ColorSwatchPickerShape, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  shape: ColorSwatchPickerShape;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  shape: 'square'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SHAPE_KEYS: readonly ColorSwatchPickerShape[] = ['square', 'circle'];

const shapeItems: SelectOptionData<ColorSwatchPickerShape>[] = toOptions(SHAPE_KEYS);

const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#0f172a'];

const value = shallowRef(colors[0]);
const size = shallowRef(DEFAULTS.size);
const shape = shallowRef(DEFAULTS.shape);

const reset = (): void => {
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="shape">
        <SSelect v-model="shape" :items="shapeItems" :trigger-props="{ 'aria-label': 'Shape' }" class="w-30" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="w-80 flex-c gap-3">
      <SColorSwatchPicker v-model="value" :colors="colors" :size="size" :shape="shape" />
      <SSeparator />
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <SColorSwatch :color="value" />
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>
