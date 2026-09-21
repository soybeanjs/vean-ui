<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, SButtonIcon, SInput, SSelect, SSheet, SSwitch } from '@vean/ui';
import type { SelectOptionData, Side, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  side: Side;
  size: ThemeSize;
  modal: boolean;
  showClose: boolean;
  showFullscreen: boolean;
  title: string;
  description: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  side: 'right',
  size: 'md',
  modal: true,
  showClose: true,
  showFullscreen: true,
  title: 'Drawer Title',
  description: 'Drawer Description'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SIDE_KEYS: readonly Side[] = ['left', 'right', 'top', 'bottom'];

const sideItems: SelectOptionData<Side>[] = toOptions(SIDE_KEYS);

const side = shallowRef(DEFAULTS.side);
const size = shallowRef(DEFAULTS.size);
const modal = shallowRef(DEFAULTS.modal);
const showClose = shallowRef(DEFAULTS.showClose);
const showFullscreen = shallowRef(DEFAULTS.showFullscreen);
const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);

const items = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);

const reset = (): void => {
  side.value = DEFAULTS.side;
  size.value = DEFAULTS.size;
  modal.value = DEFAULTS.modal;
  showClose.value = DEFAULTS.showClose;
  showFullscreen.value = DEFAULTS.showFullscreen;
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="side">
        <SSelect v-model="side" :items="sideItems" :trigger-props="{ 'aria-label': 'Side' }" class="w-30" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" placeholder="Drawer title" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" placeholder="Drawer description" />
      </FieldItem>
      <FieldItem label="modal">
        <div class="h-8 flex items-center">
          <SSwitch v-model="modal" :control-props="{ 'aria-label': 'Modal' }" />
        </div>
      </FieldItem>
      <FieldItem label="showClose">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showClose" :control-props="{ 'aria-label': 'Show close' }" />
        </div>
      </FieldItem>
      <FieldItem label="showFullscreen">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showFullscreen" :control-props="{ 'aria-label': 'Show fullscreen' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SSheet
      class="max-w-2xl"
      :side="side"
      :size="size"
      :modal="modal"
      :show-close="showClose"
      :show-fullscreen="showFullscreen"
      :title="title"
      :description="description"
    >
      <template #trigger>
        <SButton variant="pure">Open Sheet</SButton>
      </template>
      <div v-for="item in items" :key="item" class="h-10">{{ item }}</div>

      <template #footer="{ close }">
        <SButton @click="close">Confirm</SButton>
      </template>
    </SSheet>
  </div>
</template>
