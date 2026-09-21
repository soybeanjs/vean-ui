<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SColorSwatch, SInput, SSelect } from '@vean/ui';
import type { ColorSwatchShape, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  color: string;
  label: string;
  size: ThemeSize;
  shape: ColorSwatchShape;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  color: '#7c3aed',
  label: '',
  size: 'md',
  shape: 'square'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SHAPE_KEYS: readonly ColorSwatchShape[] = ['square', 'circle'];

const shapeItems: SelectOptionData<ColorSwatchShape>[] = toOptions(SHAPE_KEYS);

const color = shallowRef(DEFAULTS.color);
const label = shallowRef(DEFAULTS.label);
const size = shallowRef(DEFAULTS.size);
const shape = shallowRef(DEFAULTS.shape);

/** 清空颜色即可看到组件的 no-color 形态：透明底 + 棋盘格。 */
const reset = (): void => {
  color.value = DEFAULTS.color;
  label.value = DEFAULTS.label;
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="color">
        <SInput v-model="color" aria-label="Color" placeholder="Any CSS color" />
      </FieldItem>
      <FieldItem label="label">
        <SInput v-model="label" aria-label="Label" placeholder="Swatch label" />
      </FieldItem>
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
    <SColorSwatch class="max-w-2xl" :color="color" :label="label" :size="size" :shape="shape" />
  </div>
</template>
