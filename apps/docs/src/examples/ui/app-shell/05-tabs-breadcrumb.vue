<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { SAppShell, SButton, SIcon } from '@vean/ui';
import type {
  AppShellProps,
  BreadcrumbOptionData,
  PageTabsContextMenuOptionData,
  PageTabsDragEvent,
  PageTabsOptionData,
  PageTabsState
} from '@vean/ui';
import { appShellItems } from './menu';

// The active menu drives the breadcrumb: the trail down to `vean-ui`, with
// each ancestor opening its children as a dropdown.
const active = ref('vean-ui');

const tabs: Ref<PageTabsOptionData[]> = ref([
  {
    value: 'overview',
    label: 'Overview',
    icon: 'lucide:layout-dashboard',
    pinned: true,
    hidePinnedIcon: true
  },
  {
    value: 'projects',
    label: 'Projects',
    icon: 'lucide:folder-kanban'
  },
  {
    value: 'tasks',
    label: 'Tasks',
    icon: 'lucide:list-todo'
  }
]);

const tabValue = ref('vean-ui');

const lastAction = ref('');

// A host owns the tab collection: the shell only reports what changed.
const tabProps: AppShellProps['tabProps'] = {
  draggable: true,
  menuFactory: (tab: PageTabsOptionData, state: PageTabsState): PageTabsContextMenuOptionData[] => [
    {
      label: 'Close',
      value: 'close',
      icon: 'lucide:x',
      disabled: !state.closable,
      action: state.close
    },
    tab.pinned
      ? { label: 'Unpin', value: 'unpin', icon: 'lucide:pin-off', action: state.unpin }
      : { label: 'Pin', value: 'pin', icon: 'lucide:pin', action: state.pin }
  ]
};

function addTab() {
  const index = tabs.value.length + 1;
  const tab: PageTabsOptionData = {
    value: `tab-${index}`,
    label: `Tab ${index}`,
    icon: 'lucide:file'
  };

  tabs.value = [...tabs.value, tab];
  tabValue.value = tab.value;
}

function handleTabClose(tab: PageTabsOptionData) {
  lastAction.value = `close: ${tab.label}`;
}

function handleTabPin(tab: PageTabsOptionData) {
  lastAction.value = `pin: ${tab.label}`;
}

function handleTabDragEnd(tab: PageTabsDragEvent) {
  lastAction.value = `drag end: ${tab.item.label} @ ${tab.index}`;
}

function handleBreadcrumbClick(item: BreadcrumbOptionData) {
  lastAction.value = `breadcrumb: ${item.label}`;
}
</script>

<template>
  <div class="h-120 w-full border border-border border-solid rounded-md overflow-hidden">
    <SAppShell
      v-model="active"
      v-model:tabs="tabs"
      v-model:tab-value="tabValue"
      mode="sidebar"
      :items="appShellItems"
      :tab-props="tabProps"
      @tab-close="handleTabClose"
      @tab-pin="handleTabPin"
      @tab-drag-end="handleTabDragEnd"
      @breadcrumb-click="handleBreadcrumbClick"
    >
      <template #logo>
        <SIcon icon="lucide:hexagon" class="size-6 text-primary" />
      </template>
      <template #title>
        <span class="truncate font-semibold">Vean UI</span>
      </template>
      <template #header-end>
        <SButton variant="pure" icon="lucide:plus" @click="addTab">Add tab</SButton>
      </template>
      <div class="p-4">
        <p class="text-muted-foreground">Active tab: {{ tabValue }}</p>
        <p class="text-muted-foreground">Last action: {{ lastAction || 'none' }}</p>
      </div>
    </SAppShell>
  </div>
</template>
