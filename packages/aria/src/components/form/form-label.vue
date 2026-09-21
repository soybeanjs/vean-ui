<script setup lang="ts">
import { computed } from 'vue';
import { Label } from '../label';
import { mergeClasses } from './shared';
import { useFormFieldContext, useFormUi, useFormFieldUi } from './context';
import type { FormLabelProps } from './types';

defineOptions({
  name: 'FormLabel'
});

defineProps<FormLabelProps>();

const { formFieldId } = useFormFieldContext('FormLabel');

const formCls = useFormUi('label');
const fieldCls = useFormFieldUi('label');

const cls = computed(() => mergeClasses(formCls.value, fieldCls.value));
</script>

<template>
  <Label data-vean-form-label :for="formFieldId" :class="cls">
    <slot />
  </Label>
</template>
