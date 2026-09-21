<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import type { AlignSide } from '@vean/aria/types';
import { SButton, SButtonIcon, SDropdownMenuWrapper, SMenuOptions, SSelect, SSwitch } from '@vean/ui';
import type { MenuOptionData, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  indicatorPosition: AlignSide;
  showHidden: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  indicatorPosition: 'start',
  showHidden: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免多份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const INDICATOR_POSITION_KEYS: readonly AlignSide[] = ['start', 'end'];

const indicatorPositionItems: SelectOptionData<AlignSide>[] = toOptions(INDICATOR_POSITION_KEYS);

const size = shallowRef(DEFAULTS.size);
const indicatorPosition = shallowRef(DEFAULTS.indicatorPosition);
const showHidden = shallowRef(DEFAULTS.showHidden);

/** `hidden` 是数据能力：开关只决定「Delete」是否可见，「Internal channel」永远隐藏。 */
const items = computed<MenuOptionData<string>[]>(() => [
  { label: 'My Account', value: 'my-account', isGroupLabel: true },
  { label: 'Profile', value: 'profile', icon: 'lucide:user', shortcut: '⇧⌘P' },
  { label: 'Settings', value: 'settings', icon: 'lucide:settings', shortcut: '⌘S' },
  { label: 'Delete', value: 'delete', icon: 'lucide:trash', hidden: !showHidden.value },
  {
    label: 'Share',
    value: 'share',
    children: [
      { label: 'Email', value: 'email' },
      { label: 'Internal channel', value: 'internal', hidden: true }
    ]
  },
  {
    label: 'Theme',
    value: 'theme',
    children: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' }
    ]
  }
]);

function handleSelect(item: MenuOptionData<string>) {
  console.log('Selected:', item.value);
}

const reset = (): void => {
  size.value = DEFAULTS.size;
  indicatorPosition.value = DEFAULTS.indicatorPosition;
  showHidden.value = DEFAULTS.showHidden;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="indicatorPosition">
        <SSelect
          v-model="indicatorPosition"
          :items="indicatorPositionItems"
          :trigger-props="{ 'aria-label': 'Indicator position' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem label="showHidden">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showHidden" :control-props="{ 'aria-label': 'Show hidden item' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SDropdownMenuWrapper class="max-w-2xl" :size="size" :indicator-position="indicatorPosition">
      <template #trigger>
        <SButton variant="outline">Open Menu</SButton>
      </template>
      <SMenuOptions :items="items" class="w-72" @select="handleSelect" />
    </SDropdownMenuWrapper>
  </div>
</template>
