<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { FormFieldBaseCompact, provideFormFieldUi } from '@vean/aria/form';
import { keysOf } from '@vean/aria/shared';
import { formVariants } from '@/styles/form';
import FormErrorMotion from './form-error-motion.vue';
import type { FormFieldBaseProps, FormFieldBaseSlots } from './types';

defineOptions({
  name: 'SFormFieldBase'
});

const props = defineProps<FormFieldBaseProps>();

const slots = defineSlots<FormFieldBaseSlots>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size']);

const slotNames = computed(() => keysOf(slots).filter(name => name !== 'error'));

const ui = computed(() => formVariants({ size: props.size }, props.ui, { field: props.class }));

provideFormFieldUi(ui);
</script>

<template>
  <FormFieldBaseCompact v-bind="forwardedProps">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
    <template #error="errorScope">
      <slot name="error" v-bind="errorScope">
        <FormErrorMotion :error="errorScope.error" :error-props="errorScope.errorProps" />
      </slot>
    </template>
  </FormFieldBaseCompact>
</template>
