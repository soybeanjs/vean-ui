<script setup lang="ts">
import { SBreadcrumb } from '@vean/ui';
import type { BreadcrumbOptionData } from '@vean/ui';

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
    label: 'Breadcrumb',
    value: 'breadcrumb',
    icon: 'lucide:folder'
  }
] satisfies BreadcrumbOptionData[];
</script>

<template>
  <div class="flex justify-center w-full">
    <SBreadcrumb class="max-w-2xl" :items="items">
      <template #separator>&nbsp;/&nbsp;</template>
    </SBreadcrumb>
  </div>
</template>
