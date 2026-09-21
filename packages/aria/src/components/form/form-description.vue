<script setup lang="ts">
import { computed } from 'vue';
import { mergeClasses } from './shared';
import { useFormFieldContext, useFormUi, useFormFieldUi } from './context';
import type { FormDescriptionProps } from './types';

defineOptions({
  name: 'FormDescription'
});

defineProps<FormDescriptionProps>();

const { formDescriptionId } = useFormFieldContext('FormDescription');

const formCls = useFormUi('description');
const fieldCls = useFormFieldUi('description');

const cls = computed(() => mergeClasses(formCls.value, fieldCls.value));
</script>

<template>
  <p :id="formDescriptionId" data-vean-form-description :class="cls">
    <slot />
  </p>
</template>
