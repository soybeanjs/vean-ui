<script setup lang="ts">
import { shallowRef } from 'vue';
import { VisuallyHidden } from '@vean/aria';
import { SButtonIcon, SIcon, SInput, SSelect } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  feature: 'focusable' | 'fully-hidden';
  text: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  feature: 'fully-hidden',
  text: 'Save File'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

/**
 * `VisuallyHiddenFeature` 是 headless 组件的类型，UI 包没有 styled 包装，这里用本地字面量联合。
 * `focusable`：内容对屏幕阅读器可见、可聚焦；`fully-hidden`：视觉与交互上完全隐藏。
 */
const FEATURE_KEYS: readonly ('focusable' | 'fully-hidden')[] = ['focusable', 'fully-hidden'];

const featureItems: SelectOptionData<CustomizerState['feature']>[] = toOptions(FEATURE_KEYS);

const feature = shallowRef(DEFAULTS.feature);
const text = shallowRef(DEFAULTS.text);

const reset = (): void => {
  feature.value = DEFAULTS.feature;
  text.value = DEFAULTS.text;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="feature">
        <SSelect v-model="feature" :items="featureItems" :trigger-props="{ 'aria-label': 'Feature' }" class="w-36" />
      </FieldItem>
      <FieldItem label="text">
        <SInput v-model="text" aria-label="Hidden text" placeholder="Accessible label" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <button type="button" class="inline-flex items-center gap-2 rounded-md border px-3 py-2">
      <SIcon icon="lucide:save" />
      <VisuallyHidden :feature="feature">{{ text }}</VisuallyHidden>
    </button>
  </div>
</template>
