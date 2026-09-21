<script setup lang="ts">
import { computed } from 'vue';
import { mergeClasses } from './shared';
import { useFormFieldContext, useFormUi, useFormFieldUi } from './context';
import type { FormErrorProps } from './types';

defineOptions({
  name: 'FormError'
});

defineProps<FormErrorProps>();

const { formErrorId } = useFormFieldContext('FormError');

const formCls = useFormUi('error');
const fieldCls = useFormFieldUi('error');

const cls = computed(() => mergeClasses(formCls.value, fieldCls.value));
</script>

<template>
  <p :id="formErrorId" data-vean-form-error :class="cls">
    <slot />
  </p>
</template>
