<script setup lang="ts">
import { useLocaleMessages } from '../../locale';
import { useBreadcrumbUi } from './context';
import type { BreadcrumbRootProps } from './types';

defineOptions({
  name: 'BreadcrumbRoot'
});

defineProps<BreadcrumbRootProps>();

const cls = useBreadcrumbUi('root');
const messages = useLocaleMessages();
</script>

<template>
  <nav data-vean-breadcrumb-root :class="cls" :aria-label="messages.breadcrumb.nav">
    <slot />
  </nav>
</template>
