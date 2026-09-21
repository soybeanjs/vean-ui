<script setup lang="ts">
import { shallowRef } from 'vue';
import { SSplitNav } from '@vean/ui';
import { splitNavItems } from './data';

const active = shallowRef('vean-ui');
</script>

<template>
  <div class="flex h-110 w-full flex-row items-start overflow-hidden border rounded-md bg-sidebar">
    <SSplitNav v-model="active" mode="vertical-horizontal" :items="splitNavItems" />
  </div>
</template>
