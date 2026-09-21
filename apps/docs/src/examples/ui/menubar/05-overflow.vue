<script setup lang="ts">
import { ref } from 'vue';
import { SMenubar } from '@vean/ui';
import type { MenuOptionData } from '@vean/ui';

const collapsible = ref(true);

const items: MenuOptionData<string>[] = [
  {
    value: 'file',
    label: 'File',
    children: [{ value: 'new-tab', label: 'New Tab' }]
  },
  {
    value: 'edit',
    label: 'Edit',
    children: [{ value: 'undo', label: 'Undo' }]
  },
  {
    value: 'view',
    label: 'View',
    children: [{ value: 'reload', label: 'Reload' }]
  },
  {
    value: 'window',
    label: 'Window',
    children: [{ value: 'minimize', label: 'Minimize' }]
  },
  {
    value: 'help',
    label: 'Help',
    children: [{ value: 'docs', label: 'Documentation' }]
  },
  {
    value: 'settings',
    label: 'Settings',
    children: [{ value: 'preferences', label: 'Preferences' }]
  },
  {
    value: 'account',
    label: 'Account',
    children: [{ value: 'profile', label: 'Profile' }]
  },
  {
    value: 'billing',
    label: 'Billing',
    children: [{ value: 'invoices', label: 'Invoices' }]
  },
  {
    value: 'support',
    label: 'Support',
    children: [{ value: 'contact', label: 'Contact Us' }]
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-muted-foreground">
        <span>Collapsible</span>
        <button
          class="cursor-pointer rounded-sm px-1.5 py-0.5 text-sm transition"
          :class="collapsible ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'"
          @click="collapsible = !collapsible"
        >
          {{ collapsible ? 'on' : 'off' }}
        </button>
      </div>
      <div class="max-w-105">
        <SMenubar :collapsible="collapsible" :items="items" />
      </div>
    </div>
  </div>
</template>
