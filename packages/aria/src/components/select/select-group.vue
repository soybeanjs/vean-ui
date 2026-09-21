<script setup lang="ts">
import { provideSelectGroupContext, useSelectUi } from './context';
import type { SelectGroupProps } from './types';

defineOptions({
  name: 'SelectGroup'
});

defineProps<SelectGroupProps>();

const { labelId, initLabelId } = provideSelectGroupContext();

const cls = useSelectUi('group');

initLabelId();
</script>

<template>
  <div data-vean-select-group :class="cls" :aria-labelledby="labelId" role="group">
    <slot />
  </div>
</template>
