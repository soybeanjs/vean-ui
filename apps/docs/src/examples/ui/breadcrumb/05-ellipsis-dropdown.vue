<script setup lang="ts">
import { SBreadcrumb, SBreadcrumbEllipsis, SDropdownMenu, SIcon } from '@vean/ui';
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
  },
  {
    label: 'Components2',
    value: 'components2',
    icon: 'lucide:component'
  },
  {
    label: 'Breadcrumb2',
    value: 'breadcrumb2',
    icon: 'lucide:dock'
  }
] satisfies BreadcrumbOptionData[];
</script>

<template>
  <div class="flex justify-center w-full">
    <SBreadcrumb class="max-w-2xl" :items="items" ellipsis>
      <template #ellipsis="{ ellipsisItems }">
        <SDropdownMenu :items="ellipsisItems" :modal="false" trigger="hover">
          <template #trigger>
            <SBreadcrumbEllipsis class="cursor-pointer">
              <SIcon icon="lucide:ellipsis" />
            </SBreadcrumbEllipsis>
          </template>
        </SDropdownMenu>
      </template>
    </SBreadcrumb>
  </div>
</template>
