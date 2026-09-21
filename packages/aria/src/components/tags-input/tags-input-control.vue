<script setup lang="ts">
import { computed, nextTick, ref, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import { useTagsInputRootContext, useTagsInputUi } from './context';
import type { TagsInputControlProps } from './types';

defineOptions({
  name: 'TagsInputControl'
});

defineProps<TagsInputControlProps>();

const attrs = useAttrs();

const cls = useTagsInputUi('control');

const {
  id,
  autofocus,
  disabled,
  maxlength,
  minlength,
  pattern,
  placeholder,
  readonly,
  addOnPaste,
  addOnTab,
  addOnBlur,
  delimiter,
  isInvalidInput,
  onAddValue,
  onInputKeydown,
  selectedElement
} = useTagsInputRootContext('TagsInputControl');

const messages = useLocaleMessages();

const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? messages.value.tagsInput.addTag);

const ariaControls = computed(() => (id.value ? `${id.value}-tags-list` : undefined));

const isDisabled = computed(() => Boolean(attrs['disabled']) || disabled.value);

const isComposing = ref(false);

const handleBlur = (event: FocusEvent) => {
  selectedElement.value = undefined;

  if (!addOnBlur.value) return;

  const target = event.target as HTMLInputElement;
  const relatedTarget = event.relatedTarget as HTMLElement | null;
  const controlledId = target.getAttribute('aria-controls');
  if (controlledId && relatedTarget?.closest(`#${controlledId}`)) {
    return;
  }

  if (!target.value) return;

  const normalizedValue = target.value.trim();
  if (!normalizedValue) {
    target.value = '';
    return;
  }

  const isAdded = onAddValue(normalizedValue);
  if (isAdded) {
    target.value = '';
  }
};

const handleInput = (event: InputEvent) => {
  isInvalidInput.value = false;

  if (event.data === null) return;

  const delimiterValue = delimiter.value ?? ',';
  const matchesDelimiter =
    typeof delimiterValue === 'string' ? delimiterValue === event.data : new RegExp(delimiterValue).test(event.data);

  if (!matchesDelimiter) return;

  const target = event.target as HTMLInputElement;
  target.value = target.value.replace(delimiterValue, '');

  const normalizedValue = target.value.trim();
  if (!normalizedValue) {
    target.value = '';
    return;
  }

  const isAdded = onAddValue(normalizedValue);
  if (isAdded) {
    target.value = '';
  }
};

const handlePaste = (event: ClipboardEvent) => {
  if (!addOnPaste.value) return;

  event.preventDefault();

  const clipboardData = event.clipboardData;
  if (!clipboardData) return;

  const value = clipboardData.getData('text');
  const delimiterValue = delimiter.value ?? ',';
  const values =
    typeof delimiterValue === 'string' ? value.split(delimiterValue) : value.split(new RegExp(delimiterValue));

  values.forEach(item => {
    const normalizedValue = item.trim();
    if (normalizedValue) {
      onAddValue(normalizedValue);
    }
  });
};

const handleCustomKeydown = async (event: KeyboardEvent) => {
  if (isComposing.value || event.defaultPrevented) return;

  await nextTick();

  const target = event.target as HTMLInputElement;
  if (!target.value) return;

  const normalizedValue = target.value.trim();
  if (!normalizedValue) {
    target.value = '';
    event.preventDefault();
    return;
  }

  const isAdded = onAddValue(normalizedValue);
  if (isAdded) {
    target.value = '';
  }

  event.preventDefault();
};

const handleTab = (event: KeyboardEvent) => {
  if (!addOnTab.value) return;

  void handleCustomKeydown(event);
};

const onCompositionStart = () => {
  isComposing.value = true;
};

const onCompositionEnd = () => {
  nextTick(() => {
    isComposing.value = false;
  });
};
</script>

<template>
  <input
    :id="id"
    :class="cls"
    data-vean-tags-input-input
    type="text"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    :autofocus="autofocus"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :minlength="minlength"
    :aria-label="ariaLabel"
    :aria-controls="ariaControls"
    :disabled="isDisabled"
    :pattern="pattern"
    :readonly="readonly"
    :data-invalid="isInvalidInput ? '' : undefined"
    @input="handleInput"
    @keydown.enter="handleCustomKeydown"
    @keydown.tab="handleTab"
    @keydown="onInputKeydown"
    @blur="handleBlur"
    @paste="handlePaste"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
  />
</template>
