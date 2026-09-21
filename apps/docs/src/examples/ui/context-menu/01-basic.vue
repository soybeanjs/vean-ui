<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SContextMenu, SInputNumber, SSwitch } from '@vean/ui';
import type { MenuOptionData } from '@vean/ui';
import ContextMenuTrigger from './_trigger.vue';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  disabled: boolean;
  showArrow: boolean;
  pressOpenDelay: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  disabled: false,
  showArrow: false,
  pressOpenDelay: 700
};

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

const disabled = shallowRef(DEFAULTS.disabled);
const showArrow = shallowRef(DEFAULTS.showArrow);
const pressOpenDelay = shallowRef(DEFAULTS.pressOpenDelay);

/** 空输入回落到组件默认值 700。 */
const pressOpenDelayValue = computed(() => pressOpenDelay.value ?? 700);

const reset = (): void => {
  disabled.value = DEFAULTS.disabled;
  showArrow.value = DEFAULTS.showArrow;
  pressOpenDelay.value = DEFAULTS.pressOpenDelay;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem label="showArrow">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showArrow" :control-props="{ 'aria-label': 'Show arrow' }" />
        </div>
      </FieldItem>
      <FieldItem label="pressOpenDelay">
        <SInputNumber
          v-model="pressOpenDelay"
          :min="0"
          :control-props="{ 'aria-label': 'Press open delay' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SContextMenu
      class="max-w-2xl"
      :items="menus"
      :disabled="disabled"
      :show-arrow="showArrow"
      :press-open-delay="pressOpenDelayValue"
    >
      <template #trigger>
        <ContextMenuTrigger />
      </template>
    </SContextMenu>
  </div>
</template>
