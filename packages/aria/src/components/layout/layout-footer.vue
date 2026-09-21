<script setup lang="ts">
import { useLayoutUi, useLayoutRootContext } from './context';
import type { LayoutFooterProps } from './types';

defineOptions({
  name: 'LayoutFooter'
});

defineProps<LayoutFooterProps>();

const cls = useLayoutUi('footer');
const { footerVisible } = useLayoutRootContext('LayoutFooter');
</script>

<template>
  <div v-if="footerVisible" data-vean-layout-footer :class="cls">
    <slot />
  </div>
</template>
