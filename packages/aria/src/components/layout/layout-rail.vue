<script setup lang="ts">
import { useLocaleMessages } from '../../locale';
import { useLayoutRootContext, useLayoutUi } from './context';
import type { LayoutRailProps } from './types';

defineOptions({
  name: 'LayoutRail'
});

defineProps<LayoutRailProps>();

const { toggleSidebar, open } = useLayoutRootContext('LayoutRail');
const messages = useLocaleMessages();

const cls = useLayoutUi('rail');
</script>

<template>
  <button
    :class="cls"
    data-vean-layout-rail
    data-sidebar="rail"
    :aria-label="messages.layout.toggleSidebar"
    :aria-expanded="!!open"
    :tabindex="-1"
    :title="messages.layout.toggleSidebar"
    @click="toggleSidebar"
  >
    <slot />
  </button>
</template>
