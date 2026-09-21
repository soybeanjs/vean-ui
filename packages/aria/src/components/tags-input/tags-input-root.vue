<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { isFormControl, removeAt, toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useArrowNavigation, useControllableState, useForwardElement } from '../../composables';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideCollectionContext, provideTagsInputRootContext, useTagsInputUi } from './context';
import type { TagsInputRootProps, TagsInputRootEmits } from './types';

defineOptions({
  name: 'TagsInputRoot'
});

const props = withDefaults(defineProps<TagsInputRootProps>(), {
  modelValue: undefined,
  defaultValue: () => [],
  delimiter: ',',
  max: 0
});

const emit = defineEmits<TagsInputRootEmits>();

const cls = useTagsInputUi('root');

const { getOrderedItems, getOrderedElements, onContainerElementChange } = provideCollectionContext();

const [rootElement, setRootElement] = useForwardElement(onContainerElementChange);

const dir = useDirection(() => props.dir);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? []
);

const selectedElement = shallowRef<HTMLElement>();
const isInvalidInput = shallowRef(false);

const hasValue = computed(() => modelValue.value.length > 0);

const containerId = computed(() => (props.id ? `${props.id}-tags-list` : undefined));

const formControl = computed(() => isFormControl(rootElement.value));

const getItems = () => getOrderedItems();

const getEnabledElements = () => getOrderedElements();

const onClear = () => {
  if (props.disabled) return;

  modelValue.value = [];
  selectedElement.value = undefined;
  isInvalidInput.value = false;
};

const onRemoveValue = (index: number) => {
  if (props.disabled || index < 0) return;

  const items = getItems();
  const item = items[index];
  if (!item) return;

  modelValue.value = removeAt(modelValue.value, index);
  emit('removeTag', item.data.value);
};

const onAddValue = (rawValue: string) => {
  if (props.disabled) {
    return false;
  }

  const value = rawValue.trim();
  if (!value) {
    return false;
  }

  const values = modelValue.value;

  if (props.max > 0 && values.length >= props.max) {
    isInvalidInput.value = true;
    emit('invalid', value);
    return false;
  }

  const isDuplicate = values.some(item => item === value);
  if (!props.duplicate && isDuplicate) {
    isInvalidInput.value = true;
    emit('invalid', value);
    return false;
  }

  isInvalidInput.value = false;
  modelValue.value = [...values, value];
  emit('addTag', value);
  return true;
};

const onInputKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  const target = event.target as HTMLInputElement | null;
  if (!target) return;

  const elements = getEnabledElements();
  if (!elements.length) {
    selectedElement.value = undefined;
    return;
  }

  const lastElement = elements.at(-1);
  const cursorAtStart = target.selectionStart === 0 && target.selectionEnd === 0;
  const isArrowRight =
    (event.key === 'ArrowRight' && dir.value === 'ltr') || (event.key === 'ArrowLeft' && dir.value === 'rtl');
  const isArrowLeft =
    (event.key === 'ArrowLeft' && dir.value === 'ltr') || (event.key === 'ArrowRight' && dir.value === 'rtl');

  switch (event.key) {
    case 'Delete':
    case 'Backspace': {
      if (!cursorAtStart) {
        selectedElement.value = undefined;
        break;
      }

      if (selectedElement.value) {
        const items = getItems();
        const index = items.findIndex(item => item.element === selectedElement.value);
        const nextElement =
          selectedElement.value === lastElement
            ? elements.at(elements.indexOf(selectedElement.value) - 1)
            : elements.at(elements.indexOf(selectedElement.value) + 1);
        onRemoveValue(index);
        selectedElement.value = nextElement;
        event.preventDefault();
      } else if (event.key === 'Backspace') {
        selectedElement.value = lastElement;
        event.preventDefault();
      }
      break;
    }
    case 'Home':
    case 'End':
    case 'ArrowLeft':
    case 'ArrowRight': {
      if (!cursorAtStart) {
        selectedElement.value = undefined;
        break;
      }

      if (isArrowLeft && !selectedElement.value) {
        selectedElement.value = lastElement;
        event.preventDefault();
      } else if (isArrowRight && selectedElement.value === lastElement) {
        selectedElement.value = undefined;
        event.preventDefault();
      } else if (selectedElement.value) {
        const nextElement = useArrowNavigation(event, selectedElement.value, undefined, {
          itemsArray: elements,
          loop: false,
          dir: dir.value
        });

        if (nextElement) {
          selectedElement.value = nextElement;
        }
      }
      break;
    }
    case 'ArrowUp':
    case 'ArrowDown': {
      if (selectedElement.value) {
        event.preventDefault();
      }
      break;
    }
    default: {
      selectedElement.value = undefined;
      break;
    }
  }
};

provideTagsInputRootContext({
  ...toContext(props, [
    'id',
    'autofocus',
    'disabled',
    'maxlength',
    'minlength',
    'pattern',
    'placeholder',
    'readonly',
    'addOnPaste',
    'addOnTab',
    'addOnBlur',
    'delimiter',
    'max'
  ]),
  modelValue,
  selectedElement,
  isInvalidInput,
  dir,
  onAddValue,
  onRemoveValue,
  onInputKeydown,
  onClear,
  getItems,
  displayValue: props.displayValue ?? ((value: string) => value)
});
</script>

<template>
  <div
    :id="containerId"
    :ref="setRootElement"
    data-vean-tags-input-root
    :class="cls"
    role="group"
    :dir="dir"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="isInvalidInput ? '' : undefined"
    :data-has-value="hasValue ? '' : undefined"
  >
    <slot :model-value="modelValue" :clear="onClear" />

    <VisuallyHiddenInput
      v-if="formControl && name"
      :name="name"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
    />
  </div>
</template>
