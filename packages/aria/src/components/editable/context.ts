import { computed } from 'vue';
import { useDirection } from '../config-provider/context';
import { useContext, useForwardElement, useUiContext } from '../../composables';
import type { EditableRootContextParams, EditableUiSlot, EditableViewState } from './types';

export const [provideEditableRootContext, useEditableRootContext] = useContext(
  'EditableRoot',
  (params: EditableRootContextParams) => {
    const { isEditing, disabled, readonly } = params;

    const dir = useDirection(() => params.dir.value);
    const [inputElement, setInputElement] = useForwardElement<HTMLInputElement>();

    const dataDisabled = computed(() => (disabled.value ? '' : undefined));
    const dataReadonly = computed(() => (readonly.value ? '' : undefined));
    const dataState = computed<EditableViewState>(() => (isEditing.value ? 'edit' : 'preview'));

    return {
      ...params,
      dir,
      inputElement,
      setInputElement,
      dataDisabled,
      dataReadonly,
      dataState
    };
  }
);

export const [provideEditableUi, useEditableUi] = useUiContext<EditableUiSlot>('EditableUi');
