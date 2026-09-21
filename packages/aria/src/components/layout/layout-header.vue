<script setup lang="ts">
import { useLayoutUi, useLayoutRootContext } from './context';
import type { LayoutHeaderProps } from './types';

defineOptions({
  name: 'LayoutHeader'
});

defineProps<LayoutHeaderProps>();

const cls = useLayoutUi('header');

const { headerVisible } = useLayoutRootContext('LayoutHeader');
</script>

<template>
  <header v-if="headerVisible" data-vean-layout-header :class="cls">
    <slot />
  </header>
</template>
