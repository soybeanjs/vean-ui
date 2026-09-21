<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { useEditableRootContext, useEditableUi } from './context';
import type { EditableSubmitTriggerProps } from './types';

defineOptions({
  name: 'EditableSubmitTrigger'
});

const props = defineProps<EditableSubmitTriggerProps>();

const attrs = useAttrs();

const { dataReadonly, dataState, disabled, readonly, isEditing, submit } =
  useEditableRootContext('EditableSubmitTrigger');

const cls = useEditableUi('submitTrigger');
const messages = useLocaleMessages();

const triggerDisabled = computed(() => disabled.value || readonly.value);

const ariaLabel = computed(() => {
  if (attrs['aria-labelledby']) {
    return undefined;
  }

  return (attrs['aria-label'] as string) || messages.value.editable.submit;
});

function onClick() {
  submit();
}
</script>

<template>
  <Button
    v-bind="props"
    data-vean-editable-submit-trigger
    :class="cls"
    :aria-label="ariaLabel"
    :data-readonly="dataReadonly"
    :data-state="dataState"
    :disabled="triggerDisabled"
    :hidden="!isEditing"
    @click="onClick"
  >
    <slot>{{ messages.editable.submit }}</slot>
  </Button>
</template>
