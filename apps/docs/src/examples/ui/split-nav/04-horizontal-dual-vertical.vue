<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SSplitNav } from '@vean/ui';
import { splitNavItems } from './data';

const active = shallowRef('vean-ui');
const collapsed = shallowRef(false);

function handleToggleCollapsed() {
  collapsed.value = !collapsed.value;
}
</script>

<template>
  <div class="relative flex h-110 w-fit flex-col border rounded-md bg-sidebar">
    <SButtonIcon
      icon="lucide:panel-left"
      aria-label="Toggle tree pane"
      class="absolute end-2 top-2 z-2"
      @click="handleToggleCollapsed"
    />
    <SSplitNav v-model="active" v-model:collapsed="collapsed" mode="horizontal-dual-vertical" :items="splitNavItems" />
  </div>
</template>
