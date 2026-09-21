<script setup lang="ts">
import { SBreadcrumb, SBreadcrumbPage, SDropdownMenu } from '@vean/ui';
import type { BreadcrumbOptionData, MenuOptionData } from '@vean/ui';

interface DropdownItem extends BreadcrumbOptionData {
  items?: MenuOptionData[];
}

const dropdownItems: DropdownItem[] = [
  {
    label: 'Home',
    value: 'home',
    icon: 'lucide:home'
  },
  {
    label: 'Dropdown',
    value: 'dropdown',
    items: [
      {
        label: 'Documentation',
        value: 'documentation'
      },
      {
        label: 'Themes',
        value: 'themes'
      },
      {
        label: 'Github',
        value: 'github'
      }
    ]
  },
  {
    label: 'Components',
    value: 'components',
    icon: 'lucide:component'
  },
  {
    label: 'Breadcrumb',
    value: 'breadcrumb',
    icon: 'lucide:dock'
  }
];
</script>

<template>
  <div class="flex justify-center w-full">
    <SBreadcrumb class="max-w-2xl" :items="dropdownItems">
      <template #default="{ item }">
        <SDropdownMenu v-if="item.items" :items="item.items" :modal="false" trigger="hover">
          <template #trigger>
            <SBreadcrumbPage class="cursor-pointer">{{ item.label }}</SBreadcrumbPage>
          </template>
        </SDropdownMenu>
        <SBreadcrumbPage v-else>{{ item.label }}</SBreadcrumbPage>
      </template>
    </SBreadcrumb>
  </div>
</template>
