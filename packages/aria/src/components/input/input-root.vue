<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { isFormControl, toContext } from '../../shared';
import { useControllableState, useForwardElement } from '../../composables';
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue';
import { provideInputRootContext, useInputUi } from './context';
import type { InputRootProps, InputRootEmits } from './types';

defineOptions({
  name: 'InputRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<InputRootProps>(), {
  modelValue: undefined
});

const emit = defineEmits<InputRootEmits>();

const attrs = useAttrs();

const [rootElement, setRootElement] = useForwardElement();

const cls = useInputUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? ''
);

const formControl = computed(() => isFormControl(rootElement.value));

const inputAttrs = computed(() => ({
  ...attrs,
  id: props.id,
  name: props.name,
  required: props.required,
  disabled: props.disabled,
  readonly: props.readonly,
  autofocus: props.autofocus,
  autocomplete: props.autocomplete,
  maxlength: props.maxlength,
  minlength: props.minlength,
  pattern: props.pattern,
  placeholder: props.placeholder,
  type: props.type
}));

const onClear = () => {
  if (props.disabled || props.readonly) {
    return;
  }

  modelValue.value = '';
};

provideInputRootContext({
  ...toContext(props, ['disabled', 'readonly']),
  modelValue,
  onClear,
  inputAttrs
});
</script>

<template>
  <div
    :ref="setRootElement"
    v-bind="rootProps"
    data-vean-input-root
    :class="cls"
    role="group"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
  >
    <slot :model-value="modelValue" :clear="onClear" />

    <VisuallyHiddenInput
      v-if="formControl && name"
      type="text"
      :value="modelValue"
      :name="name"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
    />
  </div>
</template>
