<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useEditableRootContext, useEditableUi } from './context';
import type { EditablePreviewProps } from './types';

defineOptions({
  name: 'EditablePreview'
});

const props = withDefaults(defineProps<EditablePreviewProps>(), {
  as: 'span'
});

const {
  activationMode,
  dataDisabled,
  dataReadonly,
  dataState,
  disabled,
  edit,
  isEditing,
  isEmpty,
  modelValue,
  placeholder
} = useEditableRootContext('EditablePreview');

const cls = useEditableUi('preview');

const previewPlaceholder = computed(() => placeholder.value.preview);
const tabindex = computed(() => (disabled.value ? -1 : 0));

function onFocusIn() {
  if (activationMode.value === 'focus') {
    edit();
  }
}

function onDoubleClick() {
  if (activationMode.value === 'dblclick') {
    edit();
  }
}
</script>

<template>
  <Primitive
    v-bind="props"
    data-vean-editable-preview
    :class="cls"
    :data-disabled="dataDisabled"
    :data-placeholder-shown="isEmpty ? '' : undefined"
    :data-readonly="dataReadonly"
    :data-state="dataState"
    :hidden="isEditing"
    :tabindex="tabindex"
    @dblclick="onDoubleClick"
    @focusin="onFocusIn"
  >
    <slot>
      {{ modelValue || previewPlaceholder }}
    </slot>
  </Primitive>
</template>
