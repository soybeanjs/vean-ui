<script setup lang="ts">
import { usePopconfirmUi } from './context';
import type { PopconfirmFooterProps } from './types';

defineOptions({
  name: 'PopconfirmFooter'
});

defineProps<PopconfirmFooterProps>();

const cls = usePopconfirmUi('footer');
</script>

<template>
  <div data-vean-popconfirm-footer :class="cls">
    <slot />
  </div>
</template>
