<script setup lang="ts">
import { usePopconfirmUi } from './context';
import type { PopconfirmDescriptionProps } from './types';

defineOptions({
  name: 'PopconfirmDescription'
});

defineProps<PopconfirmDescriptionProps>();

const cls = usePopconfirmUi('description');
</script>

<template>
  <p data-vean-popconfirm-description :class="cls">
    <slot />
  </p>
</template>
