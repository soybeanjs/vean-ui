<script setup lang="ts">
import { useLayoutUi } from './context';
import type { LayoutMainProps } from './types';

defineOptions({
  name: 'LayoutMain'
});

defineProps<LayoutMainProps>();

const cls = useLayoutUi('main');
</script>

<template>
  <main data-vean-layout-main :class="cls">
    <slot />
  </main>
</template>
