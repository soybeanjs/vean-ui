<script setup lang="ts">
import { useSelectGroupContext, useSelectUi } from './context';
import type { SelectGroupLabelProps } from './types';

defineOptions({
  name: 'SelectGroupLabel'
});

defineProps<SelectGroupLabelProps>();

const { labelId } = useSelectGroupContext('SelectGroupLabel');

const cls = useSelectUi('groupLabel');
</script>

<template>
  <div :id="labelId" data-vean-select-group-label :class="cls">
    <slot />
  </div>
</template>
