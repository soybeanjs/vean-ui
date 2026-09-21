<script setup lang="ts">
import { computed, onWatcherCleanup, shallowRef, watchEffect } from 'vue';
import { isClient } from '../../shared';
import { useAvatarRootContext, useAvatarUi } from './context';
import type { AvatarFallbackProps } from './types';

defineOptions({
  name: 'AvatarFallback'
});

const props = defineProps<AvatarFallbackProps>();

const cls = useAvatarUi('fallback');

const { imageLoadingStatus } = useAvatarRootContext('AvatarFallback');

const canRender = shallowRef(props.delayMs === undefined);
const visible = computed(() => canRender.value && imageLoadingStatus.value !== 'loaded');

watchEffect(() => {
  if (!props.delayMs || !isClient) return;

  const timerId = window.setTimeout(() => {
    canRender.value = true;
  }, props.delayMs);

  onWatcherCleanup(() => {
    window.clearTimeout(timerId);
  });
});
</script>

<template>
  <span v-if="visible" data-vean-avatar-fallback :class="cls">
    <slot />
  </span>
</template>
