<script setup lang="ts">
import { usePopconfirmUi } from './context';
import type { PopconfirmHeaderProps } from './types';

defineOptions({
  name: 'PopconfirmHeader'
});

defineProps<PopconfirmHeaderProps>();

const cls = usePopconfirmUi('header');
</script>

<template>
  <div data-vean-popconfirm-header :class="cls">
    <slot />
  </div>
</template>
