<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { useMagicKeys } from '@vueuse/core';
import { SCommand, SDialog, SKbd } from '@vean/ui';
import type { CommandOptionData } from '@vean/ui';

const keys = useMagicKeys();

const items: CommandOptionData[] = [
  {
    label: 'Suggestions',
    value: 'suggestions',
    separator: true,
    items: [
      {
        label: 'Calendar',
        value: 'calendar',
        icon: 'lucide:calendar'
      },
      {
        label: 'Search Emoji',
        value: 'search-emoji',
        icon: 'lucide:smile'
      },
      {
        label: 'Launch',
        value: 'launch',
        icon: 'lucide:rocket'
      }
    ]
  },
  {
    label: 'Settings',
    value: 'settings',
    separator: true,
    items: [
      {
        label: 'Profile',
        value: 'profile',
        icon: 'lucide:user',
        shortcut: ['command', 'p']
      },
      {
        label: 'Mail',
        value: 'mail',
        icon: 'lucide:mail',
        shortcut: ['command', 'm']
      },
      {
        label: 'Settings',
        value: 'settings',
        icon: 'lucide:settings',
        shortcut: ['command', 's']
      }
    ]
  },
  {
    label: 'Help',
    value: 'help',
    icon: 'lucide:help-circle',
    shortcut: ['command', 'h']
  }
];

const open = shallowRef(false);

const CmdJ = computed(() => keys['Cmd+J']?.value);

function handleOpenChange() {
  open.value = !open.value;
}

watch(CmdJ, v => {
  if (v) {
    handleOpenChange();
  }
});
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <SKbd :value="['command', 'j']" />
    <SDialog v-model:open="open" pure>
      <SCommand
        class="border rounded-lg shadow-md"
        :items="items"
        :input-props="{ placeholder: 'Type a command or search...' }"
        empty-label="No command founded, please try again"
      />
    </SDialog>
  </div>
</template>
