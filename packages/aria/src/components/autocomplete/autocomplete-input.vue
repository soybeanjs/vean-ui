<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, shallowRef, useId, watchSyncEffect } from 'vue';
import { useComboboxRootContext } from '../combobox/context';
import { useListboxRootContext } from '../listbox/context';
import { useForwardElement, useOmitProps } from '../../composables';
import { InputControl, InputRoot } from '../input';
import { useAutocompleteRootContext } from './context';
import type { AutocompleteInputProps, AutocompleteInputEmits } from './types';

defineOptions({
  name: 'AutocompleteInput'
});

const props = defineProps<AutocompleteInputProps>();

const emit = defineEmits<AutocompleteInputEmits>();

const forwardedProps = useOmitProps(props, ['inputRef', 'controlProps']);

const {
  disabled: listboxDisabled,
  focusable,
  highlightedElement,
  highlightFirstItem,
  onCompositionEnd,
  onCompositionStart,
  onKeydownEnter,
  onKeydownNavigation
} = useListboxRootContext('AutocompleteInput');

const {
  open,
  contentId,
  inputElement: comboboxInputElement,
  parentElement,
  disabled: comboboxDisabled,
  openOnClick,
  openOnFocus,
  filterSearch,
  isUserInputted,
  onOpenChange,
  onInputElementChange
} = useComboboxRootContext('AutocompleteInput');

const { modelValue } = useAutocompleteRootContext('AutocompleteInput');

const generatedInputId = useId();

const [localInputElement, setLocalInputElement] = useForwardElement(el => {
  const input = el as HTMLInputElement;

  onInputElementChange(input);
  props.inputRef?.(input);
});

const disabled = computed(() => props.disabled || listboxDisabled.value || comboboxDisabled.value || false);
const activedescendant = shallowRef<string>();
const resolvedInputId = computed(
  () => props.id ?? props.controlProps?.id ?? `vean-autocomplete-input-${generatedInputId}`
);

const onUpdateModelValue = (value: string) => {
  modelValue.value = value;
  emit('update:modelValue', value);
};

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  isUserInputted.value = true;

  if (!open.value) {
    onOpenChange(true);

    nextTick(() => {
      if (target.value) {
        filterSearch.value = target.value;
        highlightFirstItem();
      }
    });

    return;
  }

  filterSearch.value = target.value;
};

const onFocus = () => {
  if (!openOnFocus.value || open.value) return;

  onOpenChange(true);
};

const onClick = () => {
  if (!openOnClick.value || open.value) return;

  onOpenChange(true);
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    onKeydownEnter(event);
    return;
  }

  if (!open.value) {
    onOpenChange(true);
    return;
  }

  onKeydownNavigation(event);
};

const onBlur = (event: FocusEvent) => {
  if (!open.value) {
    return;
  }

  const nextFocus = event.relatedTarget as Element | null;

  if (!nextFocus) {
    return;
  }

  const isInsideRoot = parentElement.value?.contains(nextFocus);
  const isInsideContent = document.getElementById(contentId.value)?.contains(nextFocus);

  if (!isInsideRoot && !isInsideContent) {
    onOpenChange(false);
  }
};

watchSyncEffect(() => {
  activedescendant.value = highlightedElement.value?.id;
});

onMounted(() => {
  focusable.value = false;

  setTimeout(() => {
    if (props.autofocus) {
      localInputElement.value?.focus();
    }
  }, 1);
});

onUnmounted(() => {
  focusable.value = true;
  comboboxInputElement.value = undefined;
});
</script>

<template>
  <InputRoot
    v-slot="{ clear }"
    data-vean-autocomplete-input-root
    v-bind="forwardedProps"
    :model-value="modelValue"
    @update:model-value="onUpdateModelValue"
  >
    <slot name="leading" :clear="clear" />
    <InputControl
      v-bind="controlProps"
      :id="resolvedInputId"
      :ref="setLocalInputElement"
      data-vean-autocomplete-input-control
      :aria-activedescendant="activedescendant"
      :aria-controls="contentId"
      :aria-expanded="open || false"
      aria-autocomplete="list"
      autocomplete="off"
      :disabled="disabled"
      role="combobox"
      spellcheck="false"
      type="text"
      @blur="onBlur"
      @click="onClick"
      @compositionend="onCompositionEnd"
      @compositionstart="onCompositionStart"
      @focus="onFocus"
      @input="onInput"
      @keydown.enter.down.up.home.end.prevent="onKeydown"
    />
    <slot name="trailing" :clear="clear" />
  </InputRoot>
</template>
