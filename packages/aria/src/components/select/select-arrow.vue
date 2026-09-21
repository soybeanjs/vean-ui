<script setup lang="ts">
import { computed } from 'vue';
import { PopperArrow } from '../popper';
import { useSelectContentContext } from './context';
import type { SelectArrowProps } from './types';

defineOptions({
  name: 'SelectArrow'
});

defineProps<SelectArrowProps>();

const { position } = useSelectContentContext('SelectArrow');

const showArrow = computed(() => position.value === 'popper');
</script>

<template>
  <PopperArrow v-if="showArrow" data-vean-select-arrow>
    <slot />
  </PopperArrow>
</template>
