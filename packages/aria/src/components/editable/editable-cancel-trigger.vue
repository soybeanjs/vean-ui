<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { useEditableRootContext, useEditableUi } from './context';
import type { EditableCancelTriggerProps } from './types';

defineOptions({
  name: 'EditableCancelTrigger'
});

const props = defineProps<EditableCancelTriggerProps>();

const attrs = useAttrs();

const { dataReadonly, dataState, disabled, readonly, cancel, isEditing } =
  useEditableRootContext('EditableCancelTrigger');

const cls = useEditableUi('cancelTrigger');
const messages = useLocaleMessages();

const triggerDisabled = computed(() => disabled.value || readonly.value);

const ariaLabel = computed(() => {
  if (attrs['aria-labelledby']) {
    return undefined;
  }

  return (attrs['aria-label'] as string) || messages.value.editable.cancel;
});

function onClick() {
  cancel();
}
</script>

<template>
  <Button
    v-bind="props"
    data-vean-editable-cancel-trigger
    :class="cls"
    :aria-label="ariaLabel"
    :data-readonly="dataReadonly"
    :data-state="dataState"
    :disabled="triggerDisabled"
    :hidden="!isEditing"
    @click="onClick"
  >
    <slot>{{ messages.editable.cancel }}</slot>
  </Button>
</template>
