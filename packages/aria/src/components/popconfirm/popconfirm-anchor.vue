<script setup lang="ts">
import { PopperAnchor } from '../popper';
import type { PopconfirmAnchorProps } from './types';

defineOptions({
  name: 'PopconfirmAnchor'
});

const props = defineProps<PopconfirmAnchorProps>();
</script>

<template>
  <PopperAnchor v-bind="props" data-vean-popconfirm-anchor>
    <slot />
  </PopperAnchor>
</template>
