<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, SButtonIcon, SEmpty, SInput, SSelect } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  title: string;
  description: string;
  icon: string;
  size: ThemeSize;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  title: 'No projects yet',
  description: 'Create your first project to start organizing work.',
  icon: 'lucide:folder-open',
  size: 'md'
};

const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);
const icon = shallowRef(DEFAULTS.icon);
const size = shallowRef(DEFAULTS.size);

const reset = (): void => {
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  icon.value = DEFAULTS.icon;
  size.value = DEFAULTS.size;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" placeholder="Empty title" class="w-40" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" placeholder="Empty description" class="w-55" />
      </FieldItem>
      <FieldItem label="icon">
        <SInput v-model="icon" aria-label="Icon" placeholder="lucide:inbox" class="w-40" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SEmpty class="min-h-72 max-w-2xl" :title="title" :description="description" :icon="icon" :size="size">
      <SButton>Create project</SButton>
    </SEmpty>
  </div>
</template>
