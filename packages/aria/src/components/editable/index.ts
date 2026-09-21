export { default as EditableArea } from './editable-area.vue';
export { default as EditableCancelTrigger } from './editable-cancel-trigger.vue';
export { default as EditableEditTrigger } from './editable-edit-trigger.vue';
export { default as EditableInput } from './editable-input.vue';
export { default as EditablePreview } from './editable-preview.vue';
export { default as EditableRoot } from './editable-root.vue';
export { default as EditableSubmitTrigger } from './editable-submit-trigger.vue';
export { default as EditableCompact } from './editable-compact.vue';

export { provideEditableUi } from './context';

export type {
  EditableActivationMode,
  EditableAreaProps,
  EditableCancelTriggerProps,
  EditableEditTriggerProps,
  EditableEventState,
  EditableInputProps,
  EditablePlaceholder,
  EditablePreviewProps,
  EditableRootEmits,
  EditableRootProps,
  EditableSubmitMode,
  EditableSubmitTriggerProps,
  EditableUi,
  EditableUiSlot,
  EditableViewState,
  EditableCompactProps,
  EditableCompactEmits,
  EditableCompactSlots
} from './types';
