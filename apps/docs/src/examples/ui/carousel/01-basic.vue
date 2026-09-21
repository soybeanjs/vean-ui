<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SCarousel, SCard, SSelect, SSwitch } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  orientation: DataOrientation;
  floatNav: boolean;
  loop: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  orientation: 'horizontal',
  floatNav: true,
  loop: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);

const size = shallowRef(DEFAULTS.size);
const orientation = shallowRef(DEFAULTS.orientation);
const floatNav = shallowRef(DEFAULTS.floatNav);
const loop = shallowRef(DEFAULTS.loop);

const slides = [1, 2, 3, 4, 5];

/** Embla 的循环滚动走 options，而不是组件 prop。 */
const carouselOptions = computed(() => ({ loop: loop.value }));

/** 垂直滚动的容器是 `h-full`，根节点必须有自己的高度。 */
const carouselClass = computed(() =>
  orientation.value === 'vertical' ? 'mx-auto w-full max-w-60 h-80' : 'mx-auto w-full max-w-60'
);

const reset = (): void => {
  size.value = DEFAULTS.size;
  orientation.value = DEFAULTS.orientation;
  floatNav.value = DEFAULTS.floatNav;
  loop.value = DEFAULTS.loop;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="floatNav">
        <div class="h-8 flex items-center">
          <SSwitch v-model="floatNav" :control-props="{ 'aria-label': 'Float navigation' }" />
        </div>
      </FieldItem>
      <FieldItem label="loop">
        <div class="h-8 flex items-center">
          <SSwitch v-model="loop" :control-props="{ 'aria-label': 'Loop' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SCarousel
      :options="carouselOptions"
      :slides="slides"
      :size="size"
      :orientation="orientation"
      :float-nav="floatNav"
      aria-label="Basic carousel"
      :class="carouselClass"
    >
      <template #item="{ slide }">
        <SCard :ui="{ content: 'aspect-square flex items-center justify-center' }">
          <span class="text-4xl font-semibold">{{ slide }}</span>
        </SCard>
      </template>
    </SCarousel>
  </div>
</template>
