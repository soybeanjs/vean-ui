<script setup lang="ts">
import { shallowRef } from 'vue';
import type { AlignSide } from '@vean/aria/types';
import { SButtonIcon, SMenubar, SSelect, SSwitch } from '@vean/ui';
import type { Direction, MenubarTriggerType, MenuOptionData, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  trigger: MenubarTriggerType;
  dir: Direction;
  indicatorPosition: AlignSide;
  showArrow: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  trigger: 'click',
  dir: 'ltr',
  indicatorPosition: 'start',
  showArrow: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免多份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const TRIGGER_KEYS: readonly MenubarTriggerType[] = ['click', 'hover'];
const DIR_KEYS: readonly Direction[] = ['ltr', 'rtl'];
const INDICATOR_POSITION_KEYS: readonly AlignSide[] = ['start', 'end'];

const triggerItems: SelectOptionData<MenubarTriggerType>[] = toOptions(TRIGGER_KEYS);
const dirItems: SelectOptionData<Direction>[] = toOptions(DIR_KEYS);
const indicatorPositionItems: SelectOptionData<AlignSide>[] = toOptions(INDICATOR_POSITION_KEYS);

const items: MenuOptionData<string>[] = [
  {
    value: 'file',
    label: 'File',
    children: [
      { value: 'new-tab', label: 'New Tab', shortcut: '⌘T' },
      { value: 'new-window', label: 'New Window', shortcut: '⌘N', separator: true },
      {
        value: 'share',
        label: 'Share',
        children: [
          { value: 'mail', label: 'Email Link' },
          { value: 'notes', label: 'Notes' }
        ]
      },
      { value: 'print', label: 'Print', shortcut: '⌘P' }
    ]
  },
  {
    value: 'edit',
    label: 'Edit',
    children: [
      { value: 'undo', label: 'Undo', shortcut: '⌘Z' },
      { value: 'redo', label: 'Redo', shortcut: '⇧⌘Z' },
      {
        value: 'find',
        label: 'Find',
        children: [
          { value: 'search-web', label: 'Search the Web' },
          { value: 'find-next', label: 'Find Next' }
        ]
      },
      { value: 'paste', label: 'Paste' }
    ]
  },
  {
    value: 'view',
    label: 'View',
    children: [
      { value: 'reload', label: 'Reload', shortcut: '⌘R' },
      { value: 'fullscreen', label: 'Toggle Fullscreen' },
      { value: 'sidebar', label: 'Hide Sidebar', disabled: true }
    ]
  },
  {
    value: 'github',
    label: 'GitHub',
    href: 'https://github.com/soybeanjs/vean-ui'
  }
];

const size = shallowRef(DEFAULTS.size);
const trigger = shallowRef(DEFAULTS.trigger);
const dir = shallowRef(DEFAULTS.dir);
const indicatorPosition = shallowRef(DEFAULTS.indicatorPosition);
const showArrow = shallowRef(DEFAULTS.showArrow);

const reset = (): void => {
  size.value = DEFAULTS.size;
  trigger.value = DEFAULTS.trigger;
  dir.value = DEFAULTS.dir;
  indicatorPosition.value = DEFAULTS.indicatorPosition;
  showArrow.value = DEFAULTS.showArrow;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="trigger">
        <SSelect v-model="trigger" :items="triggerItems" :trigger-props="{ 'aria-label': 'Trigger' }" class="w-28" />
      </FieldItem>
      <FieldItem label="dir">
        <SSelect v-model="dir" :items="dirItems" :trigger-props="{ 'aria-label': 'Direction' }" class="w-25" />
      </FieldItem>
      <FieldItem label="indicatorPosition">
        <SSelect
          v-model="indicatorPosition"
          :items="indicatorPositionItems"
          :trigger-props="{ 'aria-label': 'Indicator position' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem label="showArrow">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showArrow" :control-props="{ 'aria-label': 'Show arrow' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SMenubar
      class="max-w-2xl"
      :items="items"
      :size="size"
      :trigger="trigger"
      :dir="dir"
      :indicator-position="indicatorPosition"
      :show-arrow="showArrow"
    />
  </div>
</template>
