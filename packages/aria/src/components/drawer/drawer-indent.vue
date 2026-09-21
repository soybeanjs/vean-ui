<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useForwardElement } from '../../composables';
import { DRAWER_CSS_VARS } from './shared';
import { useDrawerRootContext } from './context';
import type { DrawerIndentProps } from './types';

defineOptions({
  name: 'DrawerIndent'
});

defineProps<DrawerIndentProps>();

const { isOpen, swipeProgress } = useDrawerRootContext('DrawerIndent');

const [elementRef, setElementRef] = useForwardElement();

// The indentation amount is consumer CSS (calc over the progress var); this
// part only reports the live progress and the active state.
watchEffect(() => {
  const element = elementRef.value;

  if (!element) return;

  element.style.setProperty(DRAWER_CSS_VARS.swipeProgress, String(swipeProgress.value));
});

const active = computed(() => isOpen.value);
</script>

<template>
  <div :ref="setElementRef" data-vean-drawer-indent :data-active="active ? 'true' : undefined">
    <slot />
  </div>
</template>
