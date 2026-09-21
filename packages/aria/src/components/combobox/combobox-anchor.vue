<script setup lang="ts">
import { PopperAnchor } from '../popper';
import type { ComboboxAnchorProps } from './types';

defineOptions({
  name: 'ComboboxAnchor'
});

const props = defineProps<ComboboxAnchorProps>();
</script>

<template>
  <PopperAnchor v-bind="props" data-vean-combobox-anchor>
    <slot />
  </PopperAnchor>
</template>
