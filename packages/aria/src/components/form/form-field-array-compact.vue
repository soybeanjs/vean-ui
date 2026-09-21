<script setup lang="ts">
import { computed, isRef } from 'vue';
import { keysOf } from '../../shared';
import { useOmitProps } from '../../composables';
import FormFieldBaseCompact from './form-field-base-compact.vue';
import type { FormFieldCompactProps, FormFieldArrayCompactSlots } from './types';
import { useFormSub } from './use-form';

defineOptions({
  name: 'FormFieldArrayCompact'
});

const props = defineProps<FormFieldCompactProps<any, any>>();

const slots = defineSlots<FormFieldArrayCompactSlots<any, any>>();

const { useFieldArray } = useFormSub();

const forwardedProps = useOmitProps(props, ['name', 'validate']);

// Unwrap the Ref branch of `validate` and keep it reactive so runtime rule swaps
// rebind the field validators.
const validateSource = computed(() => (isRef(props.validate) ? props.validate.value : props.validate));

const state = useFieldArray(props.name, { validate: validateSource });

const slotNames = computed(() => keysOf(slots).filter(name => name !== 'error'));

const error = computed(() => state.value.meta.error);
</script>

<template>
  <FormFieldBaseCompact data-vean-form-field-array v-bind="forwardedProps" :error="error" :is-field-array="true">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]>
      <slot :name="slotName" v-bind="state" />
    </template>
    <template v-if="slots.error" #error="errorScope">
      <slot name="error" v-bind="errorScope" />
    </template>
  </FormFieldBaseCompact>
</template>
