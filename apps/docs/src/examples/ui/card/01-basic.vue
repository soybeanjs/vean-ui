<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SCard, SInput, SSwitch } from '@vean/ui';
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
  title: string;
  description: string;
  split: boolean;
  scrollable: boolean;
  open: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  title: 'Title',
  description: 'Card description',
  split: false,
  scrollable: false,
  open: true,
  disabled: false
};

const size = shallowRef(DEFAULTS.size);
const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);
const split = shallowRef(DEFAULTS.split);
const scrollable = shallowRef(DEFAULTS.scrollable);
const open = shallowRef(DEFAULTS.open);
const disabled = shallowRef(DEFAULTS.disabled);

const reset = (): void => {
  size.value = DEFAULTS.size;
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  split.value = DEFAULTS.split;
  scrollable.value = DEFAULTS.scrollable;
  open.value = DEFAULTS.open;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" placeholder="Card title" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" placeholder="Card description" />
      </FieldItem>
      <FieldItem label="split">
        <div class="h-8 flex items-center">
          <SSwitch v-model="split" :control-props="{ 'aria-label': 'Split' }" />
        </div>
      </FieldItem>
      <FieldItem label="scrollable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="scrollable" :control-props="{ 'aria-label': 'Scrollable' }" />
        </div>
      </FieldItem>
      <FieldItem label="open">
        <div class="h-8 flex items-center">
          <SSwitch v-model="open" :control-props="{ 'aria-label': 'Open' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SCard
      v-model:open="open"
      :title="title"
      :description="description"
      :size="size"
      :split="split"
      :scrollable="scrollable"
      :disabled="disabled"
      class="w-100 max-w-full"
    >
      <template #extra>
        <div>extra slot</div>
      </template>
      <div class="text-gray-500 dark:text-neutral-400">Card content</div>
      <template #footer>
        <div>Footer slot</div>
      </template>
    </SCard>
  </div>
</template>
