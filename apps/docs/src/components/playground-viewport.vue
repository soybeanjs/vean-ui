<script setup lang="ts">
import { computed } from 'vue';
import { provideViewportContext } from '@vean/aria/composables';
import { playgroundDeviceMetas, playgroundPreviewFrame } from '~/constants/playground';
import type { PlaygroundDevice } from '~/constants/playground';

interface Props {
  /** Device of the example this frame renders. */
  device: PlaygroundDevice;
}

const props = defineProps<Props>();

const meta = computed(() => playgroundDeviceMetas[props.device]);

/**
 * The frame is a simulated viewport.
 *
 * Publishing the device here — instead of asking every example to read a media
 * query of its own — is what lets `isMobile`-aware components (`SLayout`,
 * `SAppShell`) follow the switcher: they resolve `prop > provided viewport >
 * real viewport`, and this is the provided one. Scoping it to the frame keeps the
 * decision per example card; anything outside the frame is untouched.
 */
provideViewportContext({
  isMobile: computed(() => meta.value.viewport)
});
</script>

<template>
  <div :class="[playgroundPreviewFrame, meta.frame]">
    <slot />
  </div>
</template>
