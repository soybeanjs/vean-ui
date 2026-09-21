<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { isFormControl, toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import {
  useControllableState,
  useFocusOutside,
  useForwardElement,
  useOmitProps,
  usePointerdownOutside
} from '../../composables';
import { Primitive } from '../primitive';
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue';
import { provideEditableRootContext, useEditableUi } from './context';
import type { EditableRootProps, EditablePlaceholder, EditableRootEmits } from './types';

defineOptions({
  name: 'EditableRoot'
});

const props = withDefaults(defineProps<EditableRootProps>(), {
  modelValue: undefined,
  disabled: false,
  readonly: false,
  activationMode: 'focus',
  submitMode: 'blur',
  selectOnFocus: false,
  startWithEditMode: false,
  autoResize: false
});

const emit = defineEmits<EditableRootEmits>();

const [rootElement, setRootElement] = useForwardElement();

const cls = useEditableUi('root');

const forwardedProps = useOmitProps(props, [
  'defaultValue',
  'modelValue',
  'placeholder',
  'dir',
  'disabled',
  'readonly',
  'activationMode',
  'selectOnFocus',
  'submitMode',
  'startWithEditMode',
  'maxLength',
  'id',
  'name',
  'required',
  'autoResize'
]);

const dir = useDirection(() => props.dir);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? ''
);

const inputValue = shallowRef(modelValue.value ?? '');
const isEditing = shallowRef(props.startWithEditMode);
const formControl = computed(() => isFormControl(rootElement.value));
const placeholder = computed<EditablePlaceholder>(() => {
  if (typeof props.placeholder === 'string') {
    return {
      edit: props.placeholder,
      preview: props.placeholder
    };
  }

  return props.placeholder ?? {};
});
const currentValue = computed(() => (isEditing.value ? inputValue.value : modelValue.value));
const isEmpty = computed(() => !currentValue.value);

watch(
  modelValue,
  value => {
    // 仅在非编辑态同步：编辑中外部推送（如受控父组件更新）不应覆盖正在输入的内容
    if (!isEditing.value) {
      inputValue.value = value ?? '';
    }
  },
  { immediate: true }
);

function edit() {
  if (props.disabled || props.readonly || isEditing.value) return;

  inputValue.value = modelValue.value ?? '';
  isEditing.value = true;

  emit('update:state', 'edit');
}

function cancel() {
  if (!isEditing.value) return;

  inputValue.value = modelValue.value ?? '';
  isEditing.value = false;

  emit('update:state', 'cancel');
}

function submit() {
  if (!isEditing.value) return;

  const value = inputValue.value ?? '';

  modelValue.value = value;
  isEditing.value = false;

  emit('update:state', 'submit');
  emit('submit', value);
}

function handleDismiss() {
  if (!isEditing.value) return;

  if (props.submitMode === 'blur' || props.submitMode === 'both') {
    submit();
    return;
  }

  cancel();
}

const pointerDownOutside = usePointerdownOutside(
  rootElement,
  () => {
    handleDismiss();
  },
  isEditing
);
const focusOutside = useFocusOutside(
  rootElement,
  () => {
    handleDismiss();
  },
  isEditing
);

const { dataDisabled, dataReadonly, dataState } = provideEditableRootContext({
  ...toContext(props, [
    'id',
    'name',
    'maxLength',
    'disabled',
    'readonly',
    'activationMode',
    'submitMode',
    'selectOnFocus',
    'startWithEditMode',
    'dir',
    'required',
    'autoResize'
  ]),
  modelValue,
  inputValue,
  placeholder,
  isEditing,
  isEmpty,
  edit,
  cancel,
  submit
});

defineExpose({
  edit,
  cancel,
  submit
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :ref="setRootElement"
    data-vean-editable-root
    :class="cls"
    :dir="dir"
    data-dismissable-layer
    :data-disabled="dataDisabled"
    :data-readonly="dataReadonly"
    :data-state="dataState"
    @focus.capture="focusOutside.onFocusCapture"
    @blur.capture="focusOutside.onBlurCapture"
    @pointerdown.capture="pointerDownOutside.onPointerdownCapture"
  >
    <slot
      :model-value="modelValue"
      :input-value="inputValue"
      :is-editing="isEditing"
      :is-empty="isEmpty"
      :edit="edit"
      :cancel="cancel"
      :submit="submit"
    />

    <VisuallyHiddenInput
      v-if="formControl && name"
      type="text"
      :value="modelValue"
      :name="name"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
    />
  </Primitive>
</template>
