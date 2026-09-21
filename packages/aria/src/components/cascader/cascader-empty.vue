<script setup lang="ts">
import { useCascaderUi } from './context';
import type { CascaderEmptyProps } from './types';

defineOptions({
  name: 'CascaderEmpty'
});

defineProps<CascaderEmptyProps>();

const cls = useCascaderUi('empty');
</script>

<template>
  <div data-vean-cascader-empty :class="cls" role="status">
    <slot />
  </div>
</template>
