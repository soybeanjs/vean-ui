<script setup lang="ts">
import { shallowRef } from 'vue';
import { SAspectRatio, SButtonIcon, SSelect } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  ratio: number;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  ratio: 16 / 9
};

const ratioItems: SelectOptionData<number>[] = [
  { label: '16 / 9', value: 16 / 9 },
  { label: '4 / 3', value: 4 / 3 },
  { label: '1 / 1', value: 1 },
  { label: '3 / 4', value: 3 / 4 },
  { label: '9 / 16', value: 9 / 16 }
];

const ratio = shallowRef(DEFAULTS.ratio);

const reset = (): void => {
  ratio.value = DEFAULTS.ratio;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="ratio">
        <SSelect v-model="ratio" :items="ratioItems" :trigger-props="{ 'aria-label': 'Ratio' }" class="w-30" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="w-100 bg-muted lt-md:w-full">
      <SAspectRatio :ratio="ratio">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          class="h-full w-full rounded-md object-cover m-0"
        />
      </SAspectRatio>
    </div>
  </div>
</template>
