<script setup lang="ts">
import { useBreadcrumbUi } from './context';
import type { BreadcrumbEllipsisProps } from './types';

defineOptions({
  name: 'BreadcrumbEllipsis'
});

defineProps<BreadcrumbEllipsisProps>();

const cls = useBreadcrumbUi('ellipsis');
</script>

<template>
  <span data-vean-breadcrumb-ellipsis :class="cls" role="presentation" aria-hidden="true">
    <slot>…</slot>
  </span>
</template>
