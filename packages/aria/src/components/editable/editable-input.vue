<script setup lang="ts">
import { computed, nextTick, onMounted, useAttrs, watch } from 'vue';
import { getAriaLabel } from '../../shared';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useEditableRootContext, useEditableUi } from './context';
import type { EditableInputProps } from './types';

defineOptions({
  name: 'EditableInput'
});

const props = withDefaults(defineProps<EditableInputProps>(), {
  as: 'input'
});

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['as', 'asChild', 'id']);

const {
  dataDisabled,
  dataReadonly,
  dataState,
  id,
  inputElement,
  inputValue,
  isEditing,
  maxLength,
  placeholder,
  readonly,
  selectOnFocus,
  setInputElement,
  submitMode,
  disabled,
  cancel,
  submit
} = useEditableRootContext('EditableInput');

const cls = useEditableUi('input');

const inputId = computed<string | undefined>(() => {
  return props.id || id.value;
});

const ariaLabel = computed(() => {
  if (attrs['aria-labelledby']) {
    return undefined;
  }

  return getAriaLabel(inputElement.value, inputId.value, attrs['aria-label'] as string);
});

function focusInput() {
  inputElement.value?.focus({ preventScroll: true });

  if (selectOnFocus.value) {
    inputElement.value?.select();
  }
}

function onInput(event: Event) {
  inputValue.value = (event.target as HTMLInputElement).value;
}

function onKeydown(event: KeyboardEvent) {
  if (event.isComposing) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    cancel();
    return;
  }

  const submitOnEnter = submitMode.value === 'enter' || submitMode.value === 'both';

  if (submitOnEnter && event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    submit();
  }
}

watch(isEditing, async value => {
  if (!value) return;

  await nextTick();
  focusInput();
});

onMounted(() => {
  if (!isEditing.value) return;

  focusInput();
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :id="inputId"
    :ref="setInputElement"
    :as="as"
    :as-child="asChild"
    data-vean-editable-input
    :class="cls"
    :aria-label="ariaLabel"
    :data-disabled="dataDisabled"
    :data-readonly="dataReadonly"
    :data-state="dataState"
    :disabled="disabled"
    :hidden="!isEditing"
    :maxlength="maxLength"
    :placeholder="placeholder.edit"
    :readonly="readonly"
    :value="inputValue"
    @input="onInput"
    @keydown="onKeydown"
  >
    <slot />
  </Primitive>
</template>
