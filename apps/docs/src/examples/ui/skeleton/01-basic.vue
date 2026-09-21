<script setup lang="ts">
import { shallowRef } from 'vue';
import { SSkeleton, SSelect, SSwitch } from '@vean/ui';
import type { SelectOptionData, SkeletonShape, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  shape: SkeletonShape;
  animated: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  shape: 'auto',
  animated: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SHAPE_KEYS: readonly SkeletonShape[] = ['auto', 'rounded'];

const shapeItems: SelectOptionData<SkeletonShape>[] = toOptions(SHAPE_KEYS);

const size = shallowRef(DEFAULTS.size);
const shape = shallowRef(DEFAULTS.shape);
const animated = shallowRef(DEFAULTS.animated);

const reset = (): void => {
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  animated.value = DEFAULTS.animated;
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
      <FieldItem label="animated">
        <div class="h-8 flex items-center">
          <SSwitch v-model="animated" :control-props="{ 'aria-label': 'Animated' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SSkeleton :size="size" :shape="shape" :animated="animated" class="w-64 max-w-full" />
  </div>
</template>
