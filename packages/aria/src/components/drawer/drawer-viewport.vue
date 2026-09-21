<script setup lang="ts">
import { useDialogRootContext } from '../dialog/context';
import { useDrawerRootContext } from './context';
import type { DrawerViewportProps } from './types';

defineOptions({
  name: 'DrawerViewport'
});

defineProps<DrawerViewportProps>();

const { dataState } = useDialogRootContext('DrawerViewport');

const { hasSnapPoints, snapPointsOffset, swipeDirection, swiping } = useDrawerRootContext('DrawerViewport');
</script>

<template>
  <div
    data-vean-drawer-viewport
    :data-state="dataState"
    :data-vean-drawer-swipe-direction="swipeDirection"
    :data-vean-swiping="swiping ? 'true' : undefined"
    :data-vean-snap-points="hasSnapPoints ? 'true' : 'false'"
    :data-vean-snap-points-offset="snapPointsOffset.length ? snapPointsOffset.join(',') : undefined"
  >
    <slot />
  </div>
</template>
