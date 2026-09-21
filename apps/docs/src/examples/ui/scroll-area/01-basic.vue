<script setup lang="ts">
import { shallowRef } from 'vue';
import { SInputNumber, SScrollArea, SSelect, SSwitch } from '@vean/ui';
import type { ScrollAreaType, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  type: ScrollAreaType;
  size: ThemeSize;
  scrollHideDelay: number;
  horizontal: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  type: 'auto',
  size: 'md',
  scrollHideDelay: 600,
  horizontal: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const TYPE_KEYS: readonly ScrollAreaType[] = ['auto', 'always', 'hover', 'scroll', 'glimpse'];

const typeItems: SelectOptionData<ScrollAreaType>[] = toOptions(TYPE_KEYS);

const type = shallowRef(DEFAULTS.type);
const size = shallowRef(DEFAULTS.size);
/** 数值控件允许空输入：`SInputNumber` 的模型是 `number | null`，空值回落到默认快照。 */
const scrollHideDelay = shallowRef<number | null>(DEFAULTS.scrollHideDelay);
const horizontal = shallowRef(DEFAULTS.horizontal);

const cards = Array.from({ length: 12 }, (_, index) => `Card ${index + 1}`);
const tags = Array.from({ length: 30 }, (_, index) => `Tag ${index + 1}`);

const reset = (): void => {
  type.value = DEFAULTS.type;
  size.value = DEFAULTS.size;
  scrollHideDelay.value = DEFAULTS.scrollHideDelay;
  horizontal.value = DEFAULTS.horizontal;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="type">
        <SSelect v-model="type" :items="typeItems" :trigger-props="{ 'aria-label': 'Type' }" class="w-30" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="scrollHideDelay">
        <SInputNumber
          v-model="scrollHideDelay"
          :min="0"
          :step="100"
          :control-props="{ 'aria-label': 'Scroll hide delay' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="horizontal">
        <div class="h-8 flex items-center">
          <SSwitch v-model="horizontal" :control-props="{ 'aria-label': 'Horizontal content' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex items-center justify-center w-full">
    <!-- 横向内容让滚动条走水平方向，纵向内容走默认的垂直方向 -->
    <SScrollArea
      v-if="horizontal"
      :type="type"
      :size="size"
      :scroll-hide-delay="scrollHideDelay ?? DEFAULTS.scrollHideDelay"
      class="h-56 w-80 rounded-md border whitespace-nowrap"
    >
      <div class="flex gap-4 p-4 pb-6">
        <div v-for="card in cards" :key="card" class="w-48 shrink-0 rounded-md border p-4">
          <p class="font-medium">{{ card }}</p>
          <p class="mt-2 text-sm text-muted-foreground">Scrollable content</p>
        </div>
      </div>
    </SScrollArea>
    <SScrollArea
      v-else
      :type="type"
      :size="size"
      :scroll-hide-delay="scrollHideDelay ?? DEFAULTS.scrollHideDelay"
      class="h-56 w-80 rounded-md border"
    >
      <div class="p-4 pe-6">
        <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
        <div class="flex-c gap-2">
          <div v-for="tag in tags" :key="tag" class="rounded-sm border px-3 py-2 text-sm">
            {{ tag }}
          </div>
        </div>
      </div>
    </SScrollArea>
  </div>
</template>
