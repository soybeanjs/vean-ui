<script setup lang="ts">
import { SAvatar, SButton, SInput, SLayout, SProgress, STreeMenu } from '@vean/ui';
import type { TreeMenuOptionData } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewSidebar'
});

const menuItems: TreeMenuOptionData[] = [
  { label: 'Overview', value: 'overview', icon: 'lucide:layout-dashboard' },
  { label: 'Analytics', value: 'analytics', icon: 'lucide:chart-line' },
  {
    label: 'Projects',
    value: 'projects',
    icon: 'lucide:folder',
    children: [
      { label: 'Design system', value: 'design-system' },
      { label: 'Marketing site', value: 'marketing-site' }
    ]
  },
  { label: 'Settings', value: 'settings', icon: 'lucide:settings' }
];

const regionTiles = [
  { token: 'bg-sidebar', class: 'border border-sidebar-border bg-sidebar text-sidebar-foreground' },
  { token: 'bg-sidebar-accent', class: 'bg-sidebar-accent text-sidebar-accent-foreground' },
  { token: 'text-sidebar-primary', class: 'bg-sidebar-primary/10 text-sidebar-primary' },
  { token: 'bg-carbon', class: 'bg-carbon text-carbon-foreground' }
];
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SLayout · STreeMenu — the region skin in place</p>
    <div class="h-80 overflow-hidden border border-border rounded-lg">
      <SLayout
        :default-open="true"
        variant="sidebar"
        size="sm"
        :header-visible="false"
        :tab-visible="false"
        :footer-visible="false"
      >
        <template #sidebar="{ collapsed, collapsedSidebarWidth }">
          <STreeMenu
            :items="menuItems"
            default-value="analytics"
            :collapsed="collapsed"
            :collapsed-width="collapsedSidebarWidth"
            class="p-2"
          />
        </template>

        <div class="space-y-4 p-4">
          <div class="flex items-center gap-3">
            <SInput placeholder="Search" size="sm" class="w-40" />
            <SAvatar size="sm" src="https://img.soybeanjs.dev/logo-vean-ui.svg?v=202609141212" fallback-label="V" />
          </div>
          <SProgress :model-value="68" />
          <div class="flex flex-wrap gap-2">
            <SButton size="sm">Save</SButton>
            <SButton size="sm" variant="outline">Cancel</SButton>
          </div>
        </div>
      </SLayout>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Region tokens — the sidebar mirrors the global roles</p>
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-for="tile in regionTiles"
        :key="tile.token"
        :class="tile.class"
        class="flex h-14 w-40 items-center rounded-md px-3 font-mono text-2xs"
      >
        {{ tile.token }}
      </div>
    </div>
  </div>
</template>
