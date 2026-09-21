<script setup lang="ts">
import { SDialog, SDrawer, SDropdownMenu, SPopconfirm, SPopover, SSheet, STooltip, SButton } from '@vean/ui';
import type { MenuOptionData } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewOverlay'
});

const actions: MenuOptionData<string>[] = [
  { label: 'Edit', value: 'edit', icon: 'lucide:pencil' },
  { label: 'Duplicate', value: 'duplicate', icon: 'lucide:copy' },
  { label: 'Delete', value: 'delete', icon: 'lucide:trash-2', separator: true }
];

const overlayTiles = [
  { token: '--popover', class: 'bg-popover text-popover-foreground' },
  { token: '--border', class: 'bg-popover text-muted-foreground border border-border' },
  { token: '--mask', class: 'bg-mask text-popover-foreground' },
  { token: 'shadow-md', class: 'bg-popover text-popover-foreground shadow-md' }
];
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">
      SDialog · SDrawer · SSheet · SDropdownMenu · SPopover · STooltip · SPopconfirm
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <SDialog title="Dialog title" description="Overlay content sits on the popover surface.">
        <template #trigger>
          <SButton variant="pure">Dialog</SButton>
        </template>
        <div class="text-sm text-muted-foreground">Dialog content</div>
      </SDialog>

      <SDrawer title="Drawer title" description="Drawer panels reuse the same tokens.">
        <template #trigger>
          <SButton variant="pure">Drawer</SButton>
        </template>
        <div class="text-sm text-muted-foreground">Drawer content</div>
      </SDrawer>

      <SSheet title="Sheet title" description="Sheets scroll long content.">
        <template #trigger>
          <SButton variant="pure">Sheet</SButton>
        </template>
        <div class="space-y-1 text-sm text-muted-foreground">
          <p v-for="index in 12" :key="index">Row {{ index }}</p>
        </div>
      </SSheet>

      <SDropdownMenu :items="actions">
        <template #trigger>
          <SButton variant="pure">Dropdown</SButton>
        </template>
      </SDropdownMenu>

      <SPopover placement="bottom">
        <template #trigger>
          <SButton variant="pure">Popover</SButton>
        </template>
        <p class="text-sm text-muted-foreground">Popover content</p>
      </SPopover>

      <STooltip>
        <template #trigger>
          <SButton variant="pure">Tooltip</SButton>
        </template>
        <p>Tooltip content</p>
      </STooltip>

      <SPopconfirm title="Delete item?" description="Confirmation popups follow the status roles." type="error">
        <template #trigger>
          <SButton variant="pure">Popconfirm</SButton>
        </template>
      </SPopconfirm>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Popup surface tokens</p>
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-for="tile in overlayTiles"
        :key="tile.token"
        :class="tile.class"
        class="flex h-14 w-44 flex-col justify-center gap-1 rounded-md px-3"
      >
        <span class="font-mono text-2xs">{{ tile.token }}</span>
        <span class="text-sm">Popup</span>
      </div>
    </div>
  </div>
</template>
