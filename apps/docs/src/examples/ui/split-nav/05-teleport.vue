<script setup lang="ts">
import { ref } from 'vue';
import { SSplitNav } from '@vean/ui';
import { splitNavItems } from './data';

const active = ref('');
</script>

<template>
  <div class="flex h-110 flex-col gap-3">
    <header id="split-nav-header" class="flex h-12 shrink-0 items-center gap-2 border rounded-md bg-background px-3">
      <span class="text-sm font-medium">Header mount</span>
    </header>
    <div class="flex min-h-0 flex-1 gap-3">
      <aside id="split-nav-sider" class="min-w-56 flex flex-col shrink-0 border rounded-md bg-background">
        <span class="flex h-full items-center justify-center text-sm text-muted-foreground">Sider mount</span>
      </aside>
      <main class="flex min-h-0 flex-1 items-center justify-center border rounded-md">
        <span class="text-sm text-muted-foreground">Content area</span>
      </main>
    </div>
    <SSplitNav
      v-model="active"
      mode="horizontal-vertical"
      :items="splitNavItems"
      horizontal-mounted-id="split-nav-header"
      vertical-mounted-id="split-nav-sider"
    />
  </div>
</template>
