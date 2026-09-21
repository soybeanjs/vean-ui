<script setup lang="ts">
import { usePopconfirmUi } from './context';
import type { PopconfirmContentProps } from './types';

defineOptions({
  name: 'PopconfirmContent'
});

defineProps<PopconfirmContentProps>();

const cls = usePopconfirmUi('content');
</script>

<template>
  <div data-vean-popconfirm-content :class="cls">
    <slot />
  </div>
</template>
