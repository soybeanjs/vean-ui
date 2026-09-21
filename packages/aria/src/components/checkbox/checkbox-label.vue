<script setup lang="ts">
import { computed } from 'vue';
import { Label } from '../label';
import { useCheckboxRootContext, useCheckboxUi } from './context';
import type { CheckboxLabelProps } from './types';

defineOptions({
  name: 'CheckboxLabel'
});

const props = defineProps<CheckboxLabelProps>();

const cls = useCheckboxUi('label');

const { controlId } = useCheckboxRootContext('CheckboxLabel');

const id = computed(() => props.for || controlId.value);
</script>

<template>
  <Label data-vean-checkbox-label :for="id" :class="cls">
    <slot />
  </Label>
</template>
