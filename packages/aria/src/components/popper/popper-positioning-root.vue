<script setup lang="ts">
import { useDirection } from '../config-provider/context';
import { providePopperPositioningRootContext } from './context';
import type { PopperPositioningRootProps } from './types';

defineOptions({
  name: 'PopperPositioningRoot',
  inheritAttrs: false
});

const props = defineProps<PopperPositioningRootProps>();

const dir = useDirection(() => props.dir);

providePopperPositioningRootContext({ dir });
</script>

<template>
  <slot />
</template>
