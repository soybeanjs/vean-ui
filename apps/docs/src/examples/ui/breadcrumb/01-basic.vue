<script setup lang="ts">
import { shallowRef } from 'vue';
import { SBreadcrumb, SButtonIcon, SSelect, SSwitch } from '@vean/ui';
import type { BreadcrumbOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  ellipsis: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  ellipsis: false
};

const size = shallowRef(DEFAULTS.size);
const ellipsis = shallowRef(DEFAULTS.ellipsis);

const items = [
  {
    label: 'Home',
    value: 'home',
    icon: 'lucide:home'
  },
  {
    label: 'Components',
    value: 'components',
    icon: 'lucide:component'
  },
  {
    label: 'Library',
    value: 'library',
    icon: 'lucide:library'
  },
  {
    label: 'Data',
    value: 'data',
    icon: 'lucide:database'
  },
  {
    label: 'Breadcrumb',
    value: 'breadcrumb',
    icon: 'lucide:folder'
  }
] satisfies BreadcrumbOptionData[];

function handleClick(item: BreadcrumbOptionData) {
  console.log('clicked:', item);
}

const reset = (): void => {
  size.value = DEFAULTS.size;
  ellipsis.value = DEFAULTS.ellipsis;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="ellipsis">
        <div class="h-8 flex items-center">
          <SSwitch v-model="ellipsis" :control-props="{ 'aria-label': 'Ellipsis' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SBreadcrumb
      class="max-w-2xl"
      :items="items"
      :size="size"
      :ellipsis="ellipsis ? true : undefined"
      @click="handleClick"
    />
  </div>
</template>
