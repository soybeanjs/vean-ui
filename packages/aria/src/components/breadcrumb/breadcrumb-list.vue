<script setup lang="ts">
import { useBreadcrumbUi } from './context';
import type { BreadcrumbListProps } from './types';

defineOptions({
  name: 'BreadcrumbList'
});

defineProps<BreadcrumbListProps>();

const cls = useBreadcrumbUi('list');
</script>

<template>
  <ol data-vean-breadcrumb-list :class="cls">
    <slot />
  </ol>
</template>
