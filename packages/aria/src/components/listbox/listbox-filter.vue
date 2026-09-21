<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, watchSyncEffect } from 'vue';
import { useForwardElement, useOmitProps } from '../../composables';
import { InputControl, InputRoot } from '../input';
import { useListboxRootContext } from './context';
import type { ListboxFilterProps, ListboxFilterEmits } from './types';

defineOptions({
  name: 'ListboxFilter'
});

const props = defineProps<ListboxFilterProps>();

const emit = defineEmits<ListboxFilterEmits>();

const forwardedProps = useOmitProps(props, ['inputRef', 'controlProps']);

const {
  disabled: rootDisabled,
  focusable,
  highlightedElement,
  highlightFirstItem,
  onKeydownNavigation,
  onKeydownEnter
} = useListboxRootContext('ListboxFilter');

const [filterElement, setFilterElement] = useForwardElement(el => props.inputRef?.(el as HTMLInputElement));

const disabled = computed(() => props.disabled || rootDisabled.value || false);

const activedescendant = shallowRef<string>();

const onInput = () => {
  highlightFirstItem();
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    onKeydownEnter(event);
    return;
  }

  onKeydownNavigation(event);
};

watchSyncEffect(() => {
  activedescendant.value = highlightedElement.value?.id;
});

onMounted(() => {
  focusable.value = false;

  setTimeout(() => {
    if (props.autofocus) {
      filterElement.value?.focus();
    }
  }, 1);
});

onUnmounted(() => {
  focusable.value = true;
});
</script>

<template>
  <InputRoot
    v-slot="{ clear }"
    data-vean-listbox-filter
    v-bind="forwardedProps"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot name="leading" :clear="clear" />
    <InputControl
      v-bind="controlProps"
      :ref="setFilterElement"
      :aria-activedescendant="activedescendant"
      :disabled="disabled"
      type="text"
      @keydown.enter.down.up.home.end.prevent="onKeydown"
      @input="onInput"
    />
    <slot name="trailing" :clear="clear" />
  </InputRoot>
</template>
