<script setup lang="ts">
import { PopperAnchor } from '../popper';
import type { PopoverAnchorProps } from './types';

defineOptions({
  name: 'PopoverAnchor'
});

const props = defineProps<PopoverAnchorProps>();
</script>

<template>
  <PopperAnchor v-bind="props" data-vean-popover-anchor>
    <slot />
  </PopperAnchor>
</template>
