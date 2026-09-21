<script setup lang="ts">
import { computed } from 'vue';
import { mergeClasses } from './shared';
import { useFormUi, useFormFieldUi } from './context';
import type { FormControlProps } from './types';

defineOptions({
  name: 'FormControl'
});

defineProps<FormControlProps>();

const formCls = useFormUi('control');
const fieldCls = useFormFieldUi('control');

const cls = computed(() => mergeClasses(formCls.value, fieldCls.value));
</script>

<template>
  <div data-vean-form-control :class="cls">
    <slot />
  </div>
</template>
