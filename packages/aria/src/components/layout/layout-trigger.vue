<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { useLayoutRootContext, useLayoutUi } from './context';
import type { LayoutTriggerProps } from './types';

defineOptions({
  name: 'LayoutTrigger'
});

const props = defineProps<LayoutTriggerProps>();
const { open, mobileOpen, isMobile, toggleSidebar } = useLayoutRootContext('LayoutTrigger');
const messages = useLocaleMessages();

const cls = useLayoutUi('trigger');

/**
 * The open state of whichever sidebar the current mode renders.
 *
 * The drawer and the inline sidebar are two states of the same control, so the
 * trigger reports — and its slot exposes — the one that applies now.
 */
const expanded = computed(() => Boolean(isMobile.value ? mobileOpen.value : open.value));
</script>

<template>
  <Button
    v-bind="props"
    data-vean-layout-trigger
    :class="cls"
    :aria-label="messages.layout.toggleSidebar"
    :aria-expanded="expanded"
    data-sidebar="trigger"
    @click="toggleSidebar"
  >
    <slot :open="expanded">
      <Icon :icon="expanded ? 'lucide:panel-right' : 'lucide:panel-left'" />
    </slot>
  </Button>
</template>
