<script setup lang="ts">
import Link from '../link/link.vue';
import { useBreadcrumbUi } from './context';
import type { BreadcrumbLinkProps } from './types';

defineOptions({
  name: 'BreadcrumbLink'
});

const props = defineProps<BreadcrumbLinkProps>();

const cls = useBreadcrumbUi('link');
</script>

<template>
  <Link v-slot="slotProps" v-bind="props" data-vean-breadcrumb-link :class="cls">
    <slot v-bind="slotProps" />
  </Link>
</template>
