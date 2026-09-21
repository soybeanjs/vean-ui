<script setup lang="ts">
import { useBreadcrumbUi } from './context';
import type { BreadcrumbItemProps } from './types';

defineOptions({
  name: 'BreadcrumbItem'
});

defineProps<BreadcrumbItemProps>();

const cls = useBreadcrumbUi('item');
</script>

<template>
  <li data-vean-breadcrumb-item :class="cls">
    <slot />
  </li>
</template>
