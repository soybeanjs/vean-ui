<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { SPageTabs } from '@vean/ui';
import type { PageTabsDragEvent, PageTabsState, PageTabsOptionData, PageTabsContextMenuOptionData } from '@vean/ui';

const modelValue = ref('home');

const items: Ref<PageTabsOptionData[]> = ref([
  {
    value: 'home',
    label: 'Home',
    icon: 'lucide:house',
    pinned: true,
    draggable: false,
    hidePinnedIcon: true
  },
  { value: 'manage', label: 'Manage', icon: 'lucide:settings', pinned: true },
  { value: 'profile', label: 'Profile', icon: 'lucide:user' },
  { value: 'doc', label: 'Doc', icon: 'lucide:file-text' },
  { value: 'about', label: 'About', icon: 'lucide:info' }
]);

const menuFactory = (tab: PageTabsOptionData, state: PageTabsState) => {
  const {
    closable,
    close,
    pin,
    unpin,
    leftClosable,
    closeLeft,
    rightClosable,
    closeRight,
    otherClosable,
    closeOther,
    allClosable,
    closeAll
  } = state;

  const menus: PageTabsContextMenuOptionData[] = [
    {
      label: 'Close',
      value: 'close',
      icon: 'lucide:x',
      disabled: !closable,
      action: close
    }
  ];

  if (tab.pinned) {
    menus.push({
      label: 'Unpin',
      value: 'unpin',
      icon: 'lucide:pin-off',
      action: unpin
    });
  } else {
    menus.push({
      label: 'Pin',
      value: 'pin',
      icon: 'lucide:pin',
      action: pin
    });
  }

  menus.push(
    {
      label: 'Close Left',
      value: 'closeLeft',
      icon: 'lucide:arrow-left-to-line',
      disabled: !leftClosable,
      action: closeLeft
    },
    {
      label: 'Close Right',
      value: 'closeRight',
      icon: 'lucide:arrow-right-to-line',
      disabled: !rightClosable,
      action: closeRight
    },
    {
      label: 'Close Others',
      value: 'closeOther',
      icon: 'lucide:fold-horizontal',
      disabled: !otherClosable,
      action: closeOther
    },
    {
      label: 'Close All',
      value: 'closeAll',
      icon: 'lucide:arrow-right-left',
      disabled: !allClosable,
      action: closeAll
    }
  );

  return menus;
};

const logs = ref<string[]>([]);

const handleDragStart = (tab: PageTabsDragEvent<PageTabsOptionData>) => {
  logs.value.unshift(`drag start: ${tab.item.label} @ ${tab.index}`);
};

const handleDragMove = (tab: PageTabsDragEvent<PageTabsOptionData>) => {
  if (logs.value.length) {
    logs.value[0] = `dragging: ${tab.item.label} → ${tab.index}`;
  }
};

const handleDragEnd = (tab: PageTabsDragEvent<PageTabsOptionData>) => {
  logs.value.unshift(`drag end: ${tab.item.label} @ ${tab.index}`);
};
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <SPageTabs
      v-model="modelValue"
      v-model:items="items"
      draggable
      :menu-factory="menuFactory"
      class="h-12 px-2 border rounded-sm"
      @tab-drag-start="handleDragStart"
      @tab-drag-move="handleDragMove"
      @tab-drag-end="handleDragEnd"
    />
    <p class="mt-4 text-xs text-muted-foreground">
      Drag tabs to reorder them within their own zone: pinned tabs reorder among themselves at the front, and unpinned
      tabs cannot be dragged past the pinned group — they halt at the boundary. The first tab sets
      <code>draggable: false</code>
      , so it is locked in place and no other tab can be dropped before it.
    </p>
    <ul v-if="logs.length" class="mt-2 space-y-1">
      <li v-for="(log, index) in logs" :key="index" class="text-xs">{{ log }}</li>
    </ul>
  </div>
</template>
