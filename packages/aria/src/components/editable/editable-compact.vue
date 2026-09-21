<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { useEditableUi } from './context';
import EditableArea from './editable-area.vue';
import EditableCancelTrigger from './editable-cancel-trigger.vue';
import EditableEditTrigger from './editable-edit-trigger.vue';
import EditableInput from './editable-input.vue';
import EditablePreview from './editable-preview.vue';
import EditableRoot from './editable-root.vue';
import EditableSubmitTrigger from './editable-submit-trigger.vue';
import type { EditableCompactProps, EditableCompactEmits, EditableCompactSlots } from './types';

defineOptions({
  name: 'EditableCompact'
});

const props = defineProps<EditableCompactProps>();

const emit = defineEmits<EditableCompactEmits>();

defineSlots<EditableCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'areaProps',
  'previewProps',
  'inputProps',
  'editTriggerProps',
  'submitTriggerProps',
  'cancelTriggerProps'
]);

const listeners = useForwardListeners(emit);

const ui = useEditableUi();
</script>

<template>
  <EditableRoot v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <slot v-bind="slotProps">
      <EditableArea v-bind="areaProps">
        <slot name="preview" v-bind="slotProps">
          <EditablePreview v-bind="previewProps" />
        </slot>
        <slot name="input" v-bind="slotProps">
          <EditableInput v-bind="inputProps" />
        </slot>
        <div :class="ui.controls">
          <slot name="edit-trigger" v-bind="slotProps">
            <EditableEditTrigger v-if="!slotProps.isEditing" v-bind="editTriggerProps">
              <Icon icon="lucide:pencil-line" :aria-hidden="true" />
            </EditableEditTrigger>
          </slot>
          <slot name="submit-trigger" v-bind="slotProps">
            <EditableSubmitTrigger v-if="slotProps.isEditing" v-bind="submitTriggerProps">
              <Icon icon="lucide:check" :aria-hidden="true" />
            </EditableSubmitTrigger>
          </slot>
          <slot name="cancel-trigger" v-bind="slotProps">
            <EditableCancelTrigger v-if="slotProps.isEditing" v-bind="cancelTriggerProps">
              <Icon icon="lucide:x" :aria-hidden="true" />
            </EditableCancelTrigger>
          </slot>
        </div>
      </EditableArea>
    </slot>
  </EditableRoot>
</template>
