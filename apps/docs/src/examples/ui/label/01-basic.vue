<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SInput, SLabel, SSelect } from '@vean/ui';
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
  text: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  text: 'Email'
};

const size = shallowRef(DEFAULTS.size);
const text = shallowRef(DEFAULTS.text);

const reset = (): void => {
  size.value = DEFAULTS.size;
  text.value = DEFAULTS.text;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="text">
        <SInput v-model="text" aria-label="Label text" placeholder="Label text" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="grid gap-1.5">
      <SLabel for="label-customizer-email" :size="size">{{ text }}</SLabel>
      <SInput id="label-customizer-email" type="email" placeholder="Email" />
    </div>
  </div>
</template>
