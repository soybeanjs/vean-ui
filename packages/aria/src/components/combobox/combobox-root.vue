<script setup lang="ts" generic="M extends boolean = false">
import { computed, nextTick, onUnmounted, shallowRef, useId, useTemplateRef, useAttrs } from 'vue';
import type { ComponentPublicInstance, ShallowRef } from 'vue';
import { createEventHook } from '@vueuse/core';
import { toContext, getElFromTemplateRef } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useOmitProps, useSelection } from '../../composables';
import type { MaybeArray } from '../../types';
import { ListboxRoot } from '../listbox';
import { PopperPositioningRoot } from '../popper';
import { provideComboboxRootContext } from './context';
import type { ComboboxRootProps, ComboboxRootEmits } from './types';

defineOptions({
  name: 'ComboboxRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ComboboxRootProps<M>>(), {
  modelValue: undefined,
  open: undefined,
  resetSearchTermOnBlur: true,
  resetSearchTermOnSelect: true,
  openOnFocus: false,
  openOnClick: false,
  highlightOnHover: true
});

const emit = defineEmits<ComboboxRootEmits<M>>();

const attrs = useAttrs();

const forwardedProps = useOmitProps(
  props,
  [
    'modelValue',
    'defaultValue',
    'open',
    'defaultOpen',
    'ignoreFilter',
    'resetSearchTermOnBlur',
    'resetSearchTermOnSelect',
    'openOnFocus',
    'openOnClick'
  ],
  attrs
);

const { modelValue, isMultiple, onModelValueChange, resetModelValue } = useSelection(props, value => {
  emit('update:modelValue', value);
});

const listboxElement = useTemplateRef('listboxElement');
const parentElement = computed(() => getElFromTemplateRef(listboxElement.value as ComponentPublicInstance | null));

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen ?? false
);

const dir = useDirection(() => props.dir);

const isUserInputted = shallowRef(false);
const isVirtual = shallowRef(false);

const contentId = shallowRef('');
const generatedContentId = `vean-combobox-content-${useId()}`;

const initContentId = () => {
  if (contentId.value) {
    return;
  }

  contentId.value = generatedContentId;
};

const inputElement = shallowRef<HTMLInputElement>();
const triggerElement = shallowRef<HTMLElement>();
const popupElement = shallowRef<HTMLElement>();

const highlightedElement = computed(() => listboxElement.value?.highlightedElement);

const resetSearchTerm = createEventHook<undefined>();

const filterSearch = shallowRef('');
const allItems = shallowRef<Map<string, string>>(new Map());
const allGroups = shallowRef<Map<string, Set<string>>>(new Map());
let resetSearchTermTimer: ReturnType<typeof setTimeout> | undefined;

const filterState = computed<{
  count: number;
  items: Map<string, number>;
  groups: Set<string>;
}>(previous => {
  if (!filterSearch.value || props.ignoreFilter || isVirtual.value) {
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
  filterSearch.value = '';

  if (value) {
    await nextTick();
    await listboxElement.value?.highlightSelected?.();

    isUserInputted.value = true;
    inputElement.value?.focus();

    return;
  }

  isUserInputted.value = false;

  resetSearchTermTimer = setTimeout(() => {
    if (!open.value && props.resetSearchTermOnBlur) {
      resetSearchTerm.trigger(undefined);
    }
  }, 1);
};

onUnmounted(() => {
  if (resetSearchTermTimer) {
    clearTimeout(resetSearchTermTimer);
  }
});

provideComboboxRootContext({
  ...toContext(props, [
    'disabled',
    'ignoreFilter',
    'resetSearchTermOnBlur',
    'resetSearchTermOnSelect',
    'openOnFocus',
    'openOnClick'
  ]),
  dir,
  modelValue: modelValue as ShallowRef<MaybeArray<string>>,
  isMultiple,
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
      v-model="modelValue"
      data-vean-combobox-root
      :dir="dir"
      :multiple="multiple"
      :name="name"
      :required="required"
      :disabled="disabled"
      :highlight-on-hover="highlightOnHover"
      @highlight="emit('highlight', $event)"
    >
      <slot :open="open" :model-value="modelValue" />
    </ListboxRoot>
  </PopperPositioningRoot>
</template>
