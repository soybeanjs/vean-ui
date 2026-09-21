<script setup lang="ts">
import { FormError } from '@vean/aria/form';
import type { FormErrorProps } from '@vean/aria/form';
import { collapseMotion } from '@vean/aria/shared';

defineOptions({
  name: 'FormErrorMotion'
});

interface Props {
  /**
   * Error message.
   */
  error?: string;
  /**
   * Properties forwarded to the error element.
   */
  errorProps?: FormErrorProps;
}

defineProps<Props>();

// Height-collapsing enter/leave for the error message; disabled in test
// environments where CSS transitions cannot run.
const errorMotion = collapseMotion();
</script>

<template>
  <Transition v-bind="errorMotion">
    <FormError v-if="error" v-bind="errorProps">{{ error }}</FormError>
  </Transition>
</template>
