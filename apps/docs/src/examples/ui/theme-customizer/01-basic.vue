<script setup lang="ts">
import { shallowRef } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { mobileViewportQuery } from '@vean/aria/shared';
import { SButtonIcon, SPopover, SSelect, SSwitch, SThemeCustomizer } from '@vean/ui';
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
  showActions: boolean;
  persist: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  showActions: true,
  persist: true
};

const isMobile = useMediaQuery(mobileViewportQuery);

const size = shallowRef(DEFAULTS.size);
const showActions = shallowRef(DEFAULTS.showActions);
const persist = shallowRef(DEFAULTS.persist);

const reset = (): void => {
  size.value = DEFAULTS.size;
  showActions.value = DEFAULTS.showActions;
  persist.value = DEFAULTS.persist;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="showActions">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showActions" :control-props="{ 'aria-label': 'Show actions' }" />
        </div>
      </FieldItem>
      <FieldItem label="persist">
        <div class="h-8 flex items-center">
          <SSwitch v-model="persist" :control-props="{ 'aria-label': 'Persist' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SPopover class="max-w-2xl" :modal="false" :placement="isMobile ? 'left' : 'bottom-start'">
      <template #trigger>
        <SButtonIcon icon="lucide:settings-2" size="lg" />
      </template>
      <SThemeCustomizer :size="size" :show-actions="showActions" :persist="persist" />
    </SPopover>
  </div>
</template>
