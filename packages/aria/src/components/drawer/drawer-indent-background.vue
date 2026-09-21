<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useForwardElement } from '../../composables';
import { DRAWER_CSS_VARS } from './shared';
import { useDrawerRootContext } from './context';
import type { DrawerIndentBackgroundProps } from './types';

defineOptions({
  name: 'DrawerIndentBackground'
});

defineProps<DrawerIndentBackgroundProps>();

const { isOpen, swipeProgress } = useDrawerRootContext('DrawerIndentBackground');

const [elementRef, setElementRef] = useForwardElement();

watchEffect(() => {
  const element = elementRef.value;

  if (!element) return;

  element.style.setProperty(DRAWER_CSS_VARS.swipeProgress, String(swipeProgress.value));
});

const active = computed(() => isOpen.value);
</script>

<template>
  <div
    :ref="setElementRef"
    data-vean-drawer-indent-background
    :data-active="active ? 'true' : undefined"
    aria-hidden="true"
  />
</template>
