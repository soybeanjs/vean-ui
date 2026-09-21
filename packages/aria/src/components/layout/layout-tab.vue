<script setup lang="ts">
import { useLayoutUi, useLayoutRootContext } from './context';
import type { LayoutTabProps } from './types';

defineOptions({
  name: 'LayoutTab'
});

defineProps<LayoutTabProps>();

const cls = useLayoutUi('tab');
const { tabVisible } = useLayoutRootContext('LayoutTab');
</script>

<template>
  <div v-if="tabVisible" data-vean-layout-tab :class="cls">
    <slot />
  </div>
</template>
