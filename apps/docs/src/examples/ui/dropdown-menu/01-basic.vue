<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import type { Placement } from '@vean/aria/types';
import { SButton, SButtonIcon, SDropdownMenu, SInputNumber, SSelect, SSwitch } from '@vean/ui';
import type { DropdownMenuTriggerType, MenuOptionData, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  trigger: DropdownMenuTriggerType;
  placement: Placement;
  showArrow: boolean;
  disabled: boolean;
  modal: boolean;
  delayDuration: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  trigger: 'click',
  placement: 'bottom-start',
  showArrow: false,
  disabled: false,
  modal: true,
  delayDuration: 150
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const TRIGGER_KEYS: readonly DropdownMenuTriggerType[] = ['click', 'hover'];
const PLACEMENT_KEYS: readonly Placement[] = [
  'top',
  'right',
  'bottom',
  'left',
  'top-start',
  'top-end',
  'right-start',
  'right-end',
  'bottom-start',
  'bottom-end',
  'left-start',
  'left-end'
];

const triggerItems: SelectOptionData<DropdownMenuTriggerType>[] = toOptions(TRIGGER_KEYS);
const placementItems: SelectOptionData<Placement>[] = toOptions(PLACEMENT_KEYS);

const menus: MenuOptionData<string>[] = [
  {
    isGroupLabel: true,
    value: 'myAccount',
    label: 'My Account'
  },
  { value: '01', label: 'Profile', icon: 'lucide:user', shortcut: ['command', 'shift', 'p'] },
  { value: '02', label: 'Billing', icon: 'lucide:credit-card', shortcut: ['command', 'b'] },
  { value: '03', label: 'Settings', icon: 'lucide:settings', shortcut: ['command', 's'] },
  {
    value: '04',
    label: 'Keyboard shortcuts',
    icon: 'lucide:keyboard',
    shortcut: ['command', 'k'],
    separator: true
  },
  { value: '05', label: 'Team', icon: 'lucide:users', shortcut: ['command', 'shift', 't'] },
  {
    value: '06',
    label: 'Invite Users',
    icon: 'lucide:user-plus',
    separator: true,
    children: [
      { value: '0601', label: 'Email', icon: 'lucide:mail', shortcut: ['command', 'shift', 'e'] },
      {
        value: '0602',
        label: 'Facebook',
        icon: 'simple-icons:facebook',
        shortcut: ['command', 'shift', 'f']
      },
      {
        value: '0603',
        label: 'Twitter',
        icon: 'simple-icons:x',
        shortcut: ['command', 'shift', 't'],
        separator: true
      },
      {
        value: '0604',
        label: 'More',
        icon: 'lucide:circle-plus',
        children: [
          {
            value: '060401',
            label: 'Message',
            icon: 'lucide:message-circle',
            shortcut: ['command', 'm']
          }
        ]
      }
    ]
  },
  {
    value: '07',
    label: 'Github',
    icon: 'simple-icons:github',
    href: 'https://github.com'
  },
  { value: '08', label: 'Support', icon: 'lucide:life-buoy' },
  { value: '09', label: 'API', icon: 'lucide:cloud', disabled: true, separator: true },
  { value: '10', label: 'Sign out', icon: 'lucide:log-out', shortcut: ['command', 'shift', 'Q'] }
];

const size = shallowRef(DEFAULTS.size);
const trigger = shallowRef(DEFAULTS.trigger);
const placement = shallowRef(DEFAULTS.placement);
const showArrow = shallowRef(DEFAULTS.showArrow);
const disabled = shallowRef(DEFAULTS.disabled);
const modal = shallowRef(DEFAULTS.modal);
const delayDuration = shallowRef(DEFAULTS.delayDuration);

/** 空输入回落到组件默认值 150（仅 hover 触发生效）。 */
const resolvedDelayDuration = computed(() => delayDuration.value ?? 150);

const reset = (): void => {
  size.value = DEFAULTS.size;
  trigger.value = DEFAULTS.trigger;
  placement.value = DEFAULTS.placement;
  showArrow.value = DEFAULTS.showArrow;
  disabled.value = DEFAULTS.disabled;
  modal.value = DEFAULTS.modal;
  delayDuration.value = DEFAULTS.delayDuration;
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
      <FieldItem label="placement">
        <SSelect
          v-model="placement"
          :items="placementItems"
          :trigger-props="{ 'aria-label': 'Placement' }"
          class="w-35"
        />
      </FieldItem>
      <FieldItem label="delayDuration">
        <SInputNumber
          v-model="delayDuration"
          :min="0"
          :step="50"
          :control-props="{ 'aria-label': 'Delay duration' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="showArrow">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showArrow" :control-props="{ 'aria-label': 'Show arrow' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem label="modal">
        <div class="h-8 flex items-center">
          <SSwitch v-model="modal" :control-props="{ 'aria-label': 'Modal' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SDropdownMenu
      class="max-w-2xl"
      :items="menus"
      :size="size"
      :trigger="trigger"
      :placement="placement"
      :show-arrow="showArrow"
      :disabled="disabled"
      :modal="modal"
      :delay-duration="resolvedDelayDuration"
    >
      <template #trigger>
        <SButton variant="pure">Open Dropdown</SButton>
      </template>
    </SDropdownMenu>
  </div>
</template>
