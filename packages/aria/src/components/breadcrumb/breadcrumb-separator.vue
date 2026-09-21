<script setup lang="ts">
import { useBreadcrumbUi } from './context';
import type { BreadcrumbSeparatorProps } from './types';

defineOptions({
  name: 'BreadcrumbSeparator'
});

defineProps<BreadcrumbSeparatorProps>();

const cls = useBreadcrumbUi('separator');
</script>

<template>
  <li data-vean-breadcrumb-separator :class="cls" role="presentation" aria-hidden="true">
    <slot />
  </li>
</template>
