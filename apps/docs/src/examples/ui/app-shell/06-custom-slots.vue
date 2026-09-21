<script setup lang="ts">
import { ref } from 'vue';
import { SAppShell, SButton, SIcon, STreeMenu } from '@vean/ui';
import type { AppShellMenuUi, AppShellUi, LayoutUi } from '@vean/ui';
import { appShellItems } from './menu';

const active = ref('overview');

// `ui` holds the shell's own nodes; `layoutUi` themes the layout regions it
// renders, and takes precedence over the `layout*` defaults the shell injects.
const ui = {
  header: 'bg-muted/40',
  footer: 'justify-center text-muted-foreground'
} satisfies AppShellUi;

const layoutUi = {
  header: 'border-b border-primary/20 bg-muted/40'
} satisfies Partial<LayoutUi>;

const menuUi = {
  tree: {
    root: 'px-2'
  }
} satisfies AppShellMenuUi;
</script>

<template>
  <div class="h-120 w-full border border-border border-solid rounded-md overflow-hidden">
    <SAppShell v-model="active" mode="sidebar" :items="appShellItems" :ui="ui" :layout-ui="layoutUi" :menu-ui="menuUi">
      <template #logo>
        <SIcon icon="lucide:hexagon" class="size-6 text-primary" />
      </template>
      <template #title>
        <span class="truncate font-semibold">Vean UI</span>
      </template>
      <template #sidebar-start>
        <div class="px-[--sl-spacing] pb-2">
          <SButton icon="lucide:search" size="sm" class="w-full">Search</SButton>
        </div>
      </template>
      <!-- The menu slot replaces the menu instance; the shell still renders the mount targets. -->
      <template #menu="{ collapsed, collapsedWidth }">
        <STreeMenu
          v-model="active"
          side="left"
          expand-strategy="selected"
          :items="appShellItems"
          :collapsed="collapsed"
          :collapsed-width="collapsedWidth"
        />
      </template>
      <template #sidebar-end>
        <div class="flex items-center gap-2 p-[--sl-spacing]">
          <SIcon icon="lucide:user-round" class="size-4.5 shrink-0 text-muted-foreground" />
          <span class="truncate text-xs text-muted-foreground">Soybean</span>
        </div>
      </template>
      <template #header>{{ active }}</template>
      <template #header-end>
        <SIcon icon="lucide:bell" class="size-4.5 text-muted-foreground" />
      </template>
      <template #footer>Custom footer slot</template>
      <div class="p-4">
        <p class="text-muted-foreground">
          `ui`, `layoutUi`, and `menuUi` override classes per region; every region also accepts a slot.
        </p>
      </div>
    </SAppShell>
  </div>
</template>
