<script setup lang="ts">
import { computed, nextTick, onUnmounted, shallowRef, useAttrs, useId, useTemplateRef } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { createEventHook } from '@vueuse/core';
import { toContext } from '../../shared';
import { provideComboboxRootContext } from '../combobox/context';
import { useDirection } from '../config-provider/context';
import { useControllableState, useOmitProps } from '../../composables';
import { ListboxRoot } from '../listbox';
import { PopperPositioningRoot } from '../popper';
import { provideAutocompleteRootContext } from './context';
import type { AutocompleteRootProps, AutocompleteRootEmits } from './types';

defineOptions({
  name: 'AutocompleteRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<AutocompleteRootProps>(), {
  modelValue: undefined,
  open: undefined,
  defaultOpen: false,
  highlightOnHover: true,
  openOnFocus: false,
  openOnClick: false
});

const emit = defineEmits<AutocompleteRootEmits>();

const attrs = useAttrs();

defineSlots<{
  default?: (props: { open: boolean | undefined; modelValue: string | undefined }) => any;
}>();

const forwardedProps = useOmitProps(
  props,
  ['modelValue', 'defaultValue', 'open', 'defaultOpen', 'openOnClick', 'openOnFocus'],
  attrs
);

const dir = useDirection(() => props.dir);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? ''
);

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const listboxElement = useTemplateRef('listboxElement');
const parentElement = computed(() => {
  return (listboxElement.value as ComponentPublicInstance | null)?.$el as HTMLElement | undefined;
});

const isMultiple = computed(() => false);
const isUserInputted = shallowRef(false);
const isVirtual = shallowRef(false);

const resetSearchTermOnBlur = computed(() => false);
const resetSearchTermOnSelect = computed(() => false);
const ignoreFilter = computed(() => true);

const inputElement = shallowRef<HTMLInputElement>();
const triggerElement = shallowRef<HTMLElement>();
const popupElement = shallowRef<HTMLElement>();
const contentId = shallowRef('');

const highlightedElement = computed(() => listboxElement.value?.highlightedElement ?? undefined);

const resetSearchTerm = createEventHook<undefined>();

const filterSearch = shallowRef('');
const allItems = shallowRef<Map<string, string>>(new Map());
const allGroups = shallowRef<Map<string, Set<string>>>(new Map());
let resetSearchTermTimer: ReturnType<typeof setTimeout> | undefined;

const generatedContentId = `vean-autocomplete-content-${useId()}`;

const initContentId = () => {
  if (contentId.value) return;

  contentId.value = generatedContentId;
};

const filterState = computed<{
  count: number;
  items: Map<string, number>;
  groups: Set<string>;
}>(previous => {
  if (!filterSearch.value || ignoreFilter.value || isVirtual.value) {
    return {
      count: allItems.value.size,
      items: previous?.items ?? new Map(),
      groups: new Set(allGroups.value.keys())
    };
  }

  const keyword = filterSearch.value.trim().toLowerCase();
  const items = new Map<string, number>();
  const groups = new Set<string>();
  let count = 0;

  for (const [id, text] of allItems.value) {
    const matched = text.toLowerCase().includes(keyword) ? 1 : 0;

    items.set(id, matched);

    if (matched) {
      count += 1;
    }
  }

  for (const [groupId, itemIds] of allGroups.value) {
    for (const itemId of itemIds) {
      if ((items.get(itemId) ?? 0) > 0) {
        groups.add(groupId);
        break;
      }
    }
  }

  return {
    count,
    items,
    groups
  };
});

const onOpenChange = async (value: boolean) => {
  if (resetSearchTermTimer) {
    clearTimeout(resetSearchTermTimer);
    resetSearchTermTimer = undefined;
  }

  open.value = value;

  if (value) {
    filterSearch.value = modelValue.value ?? '';
    await nextTick();
    await listboxElement.value?.highlightSelected?.();
    isUserInputted.value = true;
    inputElement.value?.focus();

    return;
  }

  isUserInputted.value = false;
  filterSearch.value = '';

  resetSearchTermTimer = setTimeout(() => {
    if (!value && resetSearchTermOnBlur.value) {
      resetSearchTerm.trigger(undefined);
    }
  }, 1);
};

const onModelValueChange = (value: string) => {
  modelValue.value = value;
};

const resetModelValue = () => {
  modelValue.value = '';
};

onUnmounted(() => {
  if (resetSearchTermTimer) {
    clearTimeout(resetSearchTermTimer);
  }
});

provideComboboxRootContext({
  ...toContext(props, ['disabled', 'openOnClick', 'openOnFocus']),
  dir,
  ignoreFilter,
  resetSearchTermOnBlur,
  resetSearchTermOnSelect,
  isMultiple,
  modelValue,
  onModelValueChange,
  resetModelValue,
  open,
  onOpenChange,
  isUserInputted,
  isVirtual,
  parentElement,
  contentId,
  initContentId,
  inputElement,
  onInputElementChange(node) {
    inputElement.value = node;
  },
  triggerElement,
  onTriggerElementChange(node) {
    triggerElement.value = node;
  },
  popupElement,
  onPopupElementChange(node) {
    popupElement.value = node;
  },
  highlightedElement,
  onResetSearchTerm: resetSearchTerm.on,
  filterSearch,
  allItems,
  allGroups,
  filterState
});
provideAutocompleteRootContext({
  modelValue
});

defineExpose({
  filtered: filterState,
  highlightedElement,
  highlightItem: (value: string) => {
    listboxElement.value?.highlightItem(value);
  },
  highlightFirstItem: () => {
    listboxElement.value?.highlightFirstItem();
  },
  highlightSelected: (event?: Event) => {
    return listboxElement.value?.highlightSelected(event);
  }
});
</script>

<template>
  <PopperPositioningRoot :dir="dir">
    <ListboxRoot
      ref="listboxElement"
      v-bind="forwardedProps"
      :model-value="modelValue"
      :dir="dir"
      :highlight-on-hover="highlightOnHover"
      selection-behavior="replace"
      data-vean-autocomplete-root
      @update:model-value="onModelValueChange(Array.isArray($event) ? ($event[0] ?? '') : ($event ?? ''))"
      @highlight="emit('highlight', $event)"
    >
      <slot :open="open" :model-value="modelValue" />
    </ListboxRoot>
  </PopperPositioningRoot>
</template>
