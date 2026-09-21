<script setup lang="ts">
import { STreeNav } from '@vean/ui';
import type { TreeNavOptionData } from '@vean/ui';

const items: TreeNavOptionData[] = [
  { value: 'guide', label: 'Guide' },
  { value: 'api', label: 'API Reference' },
  { value: 'examples', label: 'Examples' },
  { value: 'themes', label: 'Themes' },
  { value: 'changelog', label: 'Changelog' },
  { value: 'faq', label: 'FAQ' },
  { value: 'discord', label: 'Discord', href: 'https://discord.gg/soybeanjs', external: true }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-100 overflow-hidden rounded-md border p-2">
      <STreeNav :items="items" collapsible size="sm" trigger="click" more-label="More links" />
    </div>
  </div>
</template>
