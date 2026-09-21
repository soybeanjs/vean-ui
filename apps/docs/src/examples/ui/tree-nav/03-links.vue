<script setup lang="ts">
import { STreeNav } from '@vean/ui';
import type { TreeNavOptionData } from '@vean/ui';

const items: TreeNavOptionData[] = [
  { value: 'home', label: 'Home', to: '/' },
  {
    value: 'github',
    label: 'GitHub',
    href: 'https://github.com/soybeanjs/vean-ui',
    external: true,
    target: '_blank'
  },
  { value: 'twitter', label: 'Twitter', href: 'https://twitter.com/soybeanjs', external: true }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <STreeNav class="max-w-2xl" :items="items" default-value="home" />
  </div>
</template>
