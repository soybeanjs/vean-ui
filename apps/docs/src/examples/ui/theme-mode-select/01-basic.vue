<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SSelect, SSwitch, SThemeModeSelect } from '@vean/ui';
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
  showIcon: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  showIcon: true
};

const size = shallowRef(DEFAULTS.size);
const showIcon = shallowRef(DEFAULTS.showIcon);

const reset = (): void => {
  size.value = DEFAULTS.size;
  showIcon.value = DEFAULTS.showIcon;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="showIcon">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showIcon" :control-props="{ 'aria-label': 'Show icon' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SThemeModeSelect :size="size" :show-icon="showIcon" class="w-42" />
  </div>
</template>
