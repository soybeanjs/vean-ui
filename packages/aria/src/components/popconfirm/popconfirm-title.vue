<script setup lang="ts">
import { usePopconfirmUi } from './context';
import type { PopconfirmTitleProps } from './types';

defineOptions({
  name: 'PopconfirmTitle'
});

defineProps<PopconfirmTitleProps>();

const cls = usePopconfirmUi('title');
</script>

<template>
  <h3 data-vean-popconfirm-title :class="cls">
    <slot />
  </h3>
</template>
