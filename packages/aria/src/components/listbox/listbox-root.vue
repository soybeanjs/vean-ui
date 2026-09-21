<script setup lang="ts" generic="M extends boolean">
import { computed, nextTick, watch } from 'vue';
import { isFormControl, toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useSelection } from '../../composables';
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue';
import { provideListboxRootContext, useListboxUi } from './context';
import type { ListboxRootProps, ListboxRootEmits } from './types';

defineOptions({
  name: 'ListboxRoot'
});

const props = withDefaults(defineProps<ListboxRootProps<M>>(), {
  modelValue: undefined,
  selectionBehavior: 'toggle',
  orientation: 'vertical',
  clearable: true
});

const emit = defineEmits<ListboxRootEmits<M>>();

const cls = useListboxUi('root');

const dir = useDirection(() => props.dir);

const { modelValue, isMultiple, onModelValueChange } = useSelection(props, value => {
  emit('update:modelValue', value);
});

const {
  rootElement,
  setRootElement,
  isUserAction,
  highlightedElement,
  highlightSelected,
  highlightFirstItem,
  highlightItem,
  getItems,
  onLeave,
  onFocusOut
} = provideListboxRootContext({
  ...toContext(props, ['orientation', 'disabled', 'highlightOnHover', 'selectionBehavior']),
  dir,
  modelValue,
  isMultiple,
  onModelValueChange,
  onHighlight(item) {
    emit('highlight', item);
  },
  onEntryFocus(event) {
    emit('entryFocus', event);
  },
  onLeave(event) {
    emit('leave', event);
  }
});
const formControl = computed(() => isFormControl(rootElement.value));

watch(
  modelValue,
  () => {
    if (!isUserAction.value) {
      nextTick(() => {
        highlightSelected();
      });
    }
  },
  { immediate: true, deep: true }
);

defineExpose({
  highlightedElement,
  highlightItem,
  highlightFirstItem,
  highlightSelected,
  getItems
});
</script>

<template>
  <div
    :ref="setRootElement"
    data-vean-listbox-root
    :class="cls"
    :data-disabled="disabled ? '' : undefined"
    :dir="dir"
    @pointerleave="onLeave"
    @focusout="onFocusOut"
  >
    <slot :model-value="modelValue" />

    <VisuallyHiddenInput
      v-if="formControl && name"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
    />
  </div>
</template>
