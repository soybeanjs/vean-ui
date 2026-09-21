<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SIcon, SList, SListItem, SSelect, SSeparator } from '@vean/ui';
import type { SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md'
};

const size = shallowRef(DEFAULTS.size);

const listItems = [
  {
    title: 'Notifications',
    description: 'You have 3 unread messages.',
    leading: 'lucide:bell',
    trailing: 'lucide:chevron-right'
  },
  {
    title: 'Messages',
    description: 'You have 5 new messages.',
    leading: 'lucide:message-circle',
    trailing: 'lucide:chevron-right'
  },
  {
    title: 'Settings',
    description: 'Manage your account settings.',
    leading: 'lucide:settings',
    trailing: 'lucide:chevron-right'
  }
] as const;

const sizeItems: SelectOptionData<ThemeSize>[] = themeSizeOptions;

const reset = (): void => {
  size.value = DEFAULTS.size;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="sizeItems" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SList :size="size" class="w-80 lt-md:w-auto">
      <template v-for="(item, index) in listItems" :key="item.title">
        <SSeparator v-if="index !== 0" />
        <SListItem :title="item.title" :description="item.description">
          <template #leading>
            <SIcon :icon="item.leading" />
          </template>
          <div>This is Content</div>
          <template #trailing>
            <SIcon :icon="item.trailing" />
          </template>
        </SListItem>
      </template>
    </SList>
  </div>
</template>
