<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SAvatar, SButtonIcon, SInput, SInputNumber, SSelect } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  src: string;
  fallbackLabel: string;
  delayMs: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  src: 'https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212',
  fallbackLabel: 'S',
  delayMs: null
};

const size = shallowRef(DEFAULTS.size);
const src = shallowRef(DEFAULTS.src);
const fallbackLabel = shallowRef(DEFAULTS.fallbackLabel);
const delayMs = shallowRef(DEFAULTS.delayMs);

/** 图片地址清空或无效时回退到文字兜底；延迟未填则保持组件默认（不延迟）。 */
const srcValue = computed(() => src.value.trim() || 'https://broken-image-url.jpg');
const delayMsValue = computed(() => delayMs.value ?? undefined);

const reset = (): void => {
  size.value = DEFAULTS.size;
  src.value = DEFAULTS.src;
  fallbackLabel.value = DEFAULTS.fallbackLabel;
  delayMs.value = DEFAULTS.delayMs;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="src">
        <SInput v-model="src" aria-label="Image source" placeholder="Image URL" class="w-80" />
      </FieldItem>
      <FieldItem label="fallbackLabel">
        <SInput v-model="fallbackLabel" aria-label="Fallback label" placeholder="Fallback label" />
      </FieldItem>
      <FieldItem label="delayMs">
        <SInputNumber
          v-model="delayMs"
          :min="0"
          :step="100"
          :control-props="{ 'aria-label': 'Fallback delay (ms)' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SAvatar class="max-w-2xl" :size="size" :src="srcValue" :fallback-label="fallbackLabel" :delay-ms="delayMsValue" />
  </div>
</template>
