<script setup lang="ts">
import { computed, onMounted, onUnmounted, useId } from 'vue';
import { useListboxGroupContext, useListboxRootContext } from '../listbox/context';
import { useExposedElement, useOmitProps } from '../../composables';
import type { SelectEvent } from '../../types';
import { ListboxItem } from '../listbox';
import { useComboboxRootContext } from './context';
import type { ComboboxItemProps, ComboboxItemEmits } from './types';

defineOptions({
  name: 'ComboboxItem'
});

const props = defineProps<ComboboxItemProps>();

const emit = defineEmits<ComboboxItemEmits>();

const forwardedProps = useOmitProps(props, ['textValue']);

const { isMultiple } = useListboxRootContext('ComboboxItem');
const {
  disabled: rootDisabled,
  isVirtual,
  ignoreFilter,
  filterSearch,
  filterState,
  allItems,
  allGroups,
  inputElement,
  resetSearchTermOnSelect,
  onOpenChange
} = useComboboxRootContext('ComboboxItem');
const groupContext = useListboxGroupContext();

const itemId = `vean-combobox-item-${useId()}`;

const [itemElement, setItemElement] = useExposedElement();

if (props.value === '') {
  throw new Error('A <ComboboxItem /> must have a value prop that is not an empty string.');
}

const text = computed(() => props.textValue ?? itemElement.value?.textContent?.trim() ?? props.value);

const disabled = computed(() => rootDisabled.value || props.disabled);

const visible = computed(() => {
  if (isVirtual.value || ignoreFilter.value || !filterSearch.value) {
    return true;
  }

  const matched = filterState.value.items.get(itemId);

  if (matched === undefined) {
    return true;
  }

  return matched > 0;
});

const removeGroupItem = () => {
  const groupId = groupContext?.id;

  if (!groupId) {
    return;
  }

  const items = allGroups.value.get(groupId);

  if (!items) {
    return;
  }

  const nextItems = new Set(items);

  nextItems.delete(itemId);

  const nextGroups = new Map(allGroups.value);

  if (!nextItems.size) {
    nextGroups.delete(groupId);
  } else {
    nextGroups.set(groupId, nextItems);
  }

  allGroups.value = nextGroups;
};

const onSelect = (event: SelectEvent<string>) => {
  emit('select', event);

  if (event.defaultPrevented) {
    return;
  }

  if (resetSearchTermOnSelect.value) {
    filterSearch.value = '';
  }

  if (isMultiple.value) {
    inputElement.value?.focus();
    return;
  }

  onOpenChange(false);
};

onMounted(() => {
  const nextItems = new Map(allItems.value);

  nextItems.set(itemId, text.value);
  allItems.value = nextItems;

  const groupId = groupContext?.id;

  if (groupId) {
    const items = allGroups.value.get(groupId) ?? new Set<string>();
    const nextGroupItems = new Set(items);
    const nextGroups = new Map(allGroups.value);

    nextGroupItems.add(itemId);
    nextGroups.set(groupId, nextGroupItems);
    allGroups.value = nextGroups;
  }
});

onUnmounted(() => {
  const nextItems = new Map(allItems.value);

  nextItems.delete(itemId);
  allItems.value = nextItems;
  removeGroupItem();
});
</script>

<template>
  <ListboxItem
    v-if="visible"
    :ref="setItemElement"
    v-bind="forwardedProps"
    data-vean-combobox-item
    :value="value"
    :disabled="disabled"
    @select="onSelect"
  >
    <slot />
  </ListboxItem>
</template>
