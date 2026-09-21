<script setup lang="ts">
import { shallowRef } from 'vue';
import { useOmitProps } from '../../composables';
import { provideWatermarkCompactContext } from './context';
import type { WatermarkCompactProps } from './types';
import WatermarkOverlay from './watermark-overlay.vue';
import WatermarkRoot from './watermark-root.vue';

defineOptions({
  name: 'WatermarkCompact'
});

const props = defineProps<WatermarkCompactProps>();

const forwardedProps = useOmitProps(props, ['overlayProps']);
const overlayRenderKey = shallowRef(0);

function repairOverlay() {
  overlayRenderKey.value += 1;
}

provideWatermarkCompactContext({
  overlayRenderKey,
  repairOverlay
});
</script>

<template>
  <WatermarkRoot v-bind="forwardedProps">
    <slot />
    <WatermarkOverlay :key="overlayRenderKey" v-bind="overlayProps" />
  </WatermarkRoot>
</template>
