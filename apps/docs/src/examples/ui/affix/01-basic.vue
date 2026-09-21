<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SAffix, SButtonIcon, SInputNumber } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  offsetTop: number | null;
  offsetBottom: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  offsetTop: 12,
  offsetBottom: 16
};

const offsetTop = shallowRef(DEFAULTS.offsetTop);
const offsetBottom = shallowRef(DEFAULTS.offsetBottom);

const offsetTopValue = computed(() => offsetTop.value ?? 0);
const offsetBottomValue = computed(() => offsetBottom.value ?? 0);

const rows = Array.from({ length: 12 }, (_, index) => `Row ${index + 1}`);

const containerRef = shallowRef<HTMLElement>();

const reset = (): void => {
  offsetTop.value = DEFAULTS.offsetTop;
  offsetBottom.value = DEFAULTS.offsetBottom;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="offsetTop">
        <SInputNumber v-model="offsetTop" :min="0" :control-props="{ 'aria-label': 'Offset top' }" class="w-25" />
      </FieldItem>
      <FieldItem label="offsetBottom">
        <SInputNumber v-model="offsetBottom" :min="0" :control-props="{ 'aria-label': 'Offset bottom' }" class="w-25" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div ref="containerRef" class="relative h-72 overflow-y-auto rounded-md border bg-muted/20 p-4">
    <SAffix :target="containerRef" :offset-top="offsetTopValue" :offset-bottom="offsetBottomValue">
      <div class="rounded-md border bg-background px-4 py-3 shadow-sm">
        <span class="text-sm font-medium">Sticky header inside the scroll container</span>
      </div>
    </SAffix>
    <div class="mt-4 flex-c gap-3">
      <div v-for="row in rows" :key="row" class="rounded-md border bg-background px-4 py-3 text-sm">
        {{ row }}
      </div>
    </div>
  </div>
</template>
