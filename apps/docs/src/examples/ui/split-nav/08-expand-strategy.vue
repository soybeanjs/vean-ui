<script setup lang="ts">
import { shallowRef } from 'vue';
import { SSelect, SSplitNav } from '@vean/ui';
import type { TreeMenuExpandStrategy } from '@vean/ui';
import { splitNavItems } from './data';

const active = shallowRef('realtime');
const expandStrategy = shallowRef<TreeMenuExpandStrategy>('selected');
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="w-40">
      <SSelect
        v-model="expandStrategy"
        :items="[
          { label: 'keep', value: 'keep' },
          { label: 'selected', value: 'selected' }
        ]"
        :ui="{ trigger: 'w-32' }"
      />
    </div>
    <div class="h-110 w-fit">
      <SSplitNav
        v-model="active"
        mode="dual-vertical"
        :expand-strategy="expandStrategy"
        :items="splitNavItems"
        class="bg-sidebar border rounded-md"
      />
    </div>
  </div>
</template>
