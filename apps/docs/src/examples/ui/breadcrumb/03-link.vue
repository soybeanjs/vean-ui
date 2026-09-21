<script setup lang="ts">
import { SBreadcrumb } from '@vean/ui';
import type { BreadcrumbOptionData } from '@vean/ui';

const items = [
  {
    label: 'Home',
    icon: 'lucide:home'
  },
  {
    label: 'Vue',
    href: 'https://vuejs.org'
  },
  {
    label: 'VeanUI',
    href: 'https://veanui.com'
  }
] satisfies BreadcrumbOptionData[];
</script>

<template>
  <div class="flex justify-center w-full">
    <SBreadcrumb class="max-w-2xl" :items="items" />
  </div>
</template>
