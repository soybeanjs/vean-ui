<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SInputNumber, SSwitch, SVirtualizer, SVirtualizerItem } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  height: number;
  itemCount: number;
  horizontal: boolean;
  dynamic: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  height: 240,
  itemCount: 1000,
  horizontal: false,
  dynamic: false
};

const height = shallowRef(DEFAULTS.height);
const itemCount = shallowRef(DEFAULTS.itemCount);
const horizontal = shallowRef(DEFAULTS.horizontal);
const dynamic = shallowRef(DEFAULTS.dynamic);

const reset = (): void => {
  height.value = DEFAULTS.height;
  itemCount.value = DEFAULTS.itemCount;
  horizontal.value = DEFAULTS.horizontal;
  dynamic.value = DEFAULTS.dynamic;
};

/** 每个条目带一个随机高度，动态模式下用它撑起真实内容高度，供 `dynamic` 测量。 */
interface VirtualizerItemData {
  value: string;
  title: string;
  size: number;
}

const items = computed<VirtualizerItemData[]>(() =>
  Array.from({ length: itemCount.value }, (_, index) => ({
    value: `item-${index}`,
    title: `item-${index}`,
    size: Math.round(Math.random() * 50) + 20
  }))
);

/** 水平虚拟化开关走 `options.horizontal`，并给一个 100px 的宽度估算。 */
const options = computed(() => (horizontal.value ? { horizontal: true, estimateSize: () => 100 } : undefined));

const itemClass = computed(() => (horizontal.value ? 'px-2 py-1 border-r' : 'px-2 py-1 border-b'));

const getItemStyle = (item: VirtualizerItemData): Record<string, string> | undefined =>
  dynamic.value && !horizontal.value ? { height: `${item.size}px` } : undefined;
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="height">
        <SInputNumber
          v-model="height"
          :min="60"
          :max="480"
          :step="20"
          :control-props="{ 'aria-label': 'Height' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="itemCount">
        <SInputNumber
          v-model="itemCount"
          :min="0"
          :max="10000"
          :step="100"
          :control-props="{ 'aria-label': 'Item count' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="horizontal">
        <div class="h-8 flex items-center">
          <SSwitch v-model="horizontal" :control-props="{ 'aria-label': 'Horizontal' }" />
        </div>
      </FieldItem>
      <FieldItem label="dynamic">
        <div class="h-8 flex items-center">
          <SSwitch v-model="dynamic" :control-props="{ 'aria-label': 'Dynamic' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="w-80 border rounded-md">
      <SVirtualizer :items="items" :height="height" :options="options" :dynamic="dynamic">
        <template #item="{ virtualItem, item }">
          <SVirtualizerItem :data="virtualItem" :class="itemClass" :style="getItemStyle(item)">
            {{ item.title }}
          </SVirtualizerItem>
        </template>
      </SVirtualizer>
    </div>
  </div>
</template>
