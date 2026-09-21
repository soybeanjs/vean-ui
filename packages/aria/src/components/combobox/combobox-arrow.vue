<script setup lang="ts">
import { computed } from 'vue';
import { PopperArrow } from '../popper';
import { useComboboxContentContext, useComboboxRootContext, useComboboxUi } from './context';
import type { ComboboxArrowProps } from './types';

defineOptions({
  name: 'ComboboxArrow'
});

defineProps<ComboboxArrowProps>();

const cls = useComboboxUi('arrow');

const { open } = useComboboxRootContext('ComboboxArrow');
const { position } = useComboboxContentContext('ComboboxArrow');

const showArrow = computed(() => open.value && position.value === 'popper');
</script>

<template>
  <PopperArrow v-if="showArrow" data-vean-combobox-arrow :class="cls">
    <slot />
  </PopperArrow>
</template>
