<script setup lang="ts">
import { shallowRef } from 'vue';
import { SSplitNav } from '@vean/ui';
import type { SplitNavOptionData } from '@vean/ui';
import { splitNavItems } from './data';

const active = shallowRef('');

function handleOpen(item: SplitNavOptionData) {
  let firstChild = '';

  let children = item.children ?? [];
  while (children.length > 0) {
    firstChild = children[0].value;
    children = children[0].children ?? [];
  }
  if (firstChild) {
    active.value = firstChild;
  }
}
</script>

<template>
  <div class="h-110 w-fit">
    <SSplitNav
      v-model="active"
      mode="dual-vertical"
      :items="splitNavItems"
      class="bg-sidebar border rounded-md"
      @open="handleOpen"
    />
  </div>
</template>
