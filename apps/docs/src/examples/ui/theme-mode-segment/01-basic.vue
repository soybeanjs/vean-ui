<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SSelect, SSwitch, SThemeModeSegment } from '@vean/ui';
import type { SegmentShape, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  shape: SegmentShape;
  showLabel: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  shape: 'rounded',
  showLabel: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SHAPE_KEYS: readonly SegmentShape[] = ['square', 'rounded'];

const shapeItems: SelectOptionData<SegmentShape>[] = toOptions(SHAPE_KEYS);

const size = shallowRef(DEFAULTS.size);
const shape = shallowRef(DEFAULTS.shape);
const showLabel = shallowRef(DEFAULTS.showLabel);

const reset = (): void => {
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  showLabel.value = DEFAULTS.showLabel;
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
      <FieldItem label="showLabel">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showLabel" :control-props="{ 'aria-label': 'Show label' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex items-center justify-center w-full gap-4">
    <SThemeModeSegment :size="size" :shape="shape" :show-label="showLabel" />
    <span class="text-sm text-muted-foreground">Auto / Light / Dark</span>
  </div>
</template>
