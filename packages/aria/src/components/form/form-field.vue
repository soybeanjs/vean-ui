<script setup lang="ts">
import { computed } from 'vue';
import { mergeClasses } from './shared';
import { provideFormFieldContext, useFormUi, useFormFieldUi } from './context';
import type { FormFieldProps } from './types';

defineOptions({
  name: 'FormField'
});

const props = defineProps<FormFieldProps>();

const fieldType = props.isFieldArray ? 'fieldArray' : 'field';

const formCls = useFormUi(fieldType);
const fieldCls = useFormFieldUi(fieldType);

const cls = computed(() => mergeClasses(formCls.value, fieldCls.value));

const error = computed(() => props.error);

const { formFieldId, ariaDescribedBy, ariaInvalid } = provideFormFieldContext({ error });

const slotProps = computed(() => ({
  formFieldId,
  ariaDescribedBy: ariaDescribedBy.value,
  ariaInvalid: ariaInvalid.value
}));
</script>

<template>
  <div :id="isFieldArray ? formFieldId : undefined" :class="cls" :data-field-type="isFieldArray ? 'array' : 'field'">
    <slot v-bind="slotProps" />
  </div>
</template>
