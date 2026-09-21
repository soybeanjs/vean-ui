<script setup lang="ts">
import { computed } from 'vue';
import type { ShallowRef } from 'vue';
import { refAutoReset, useParentElement } from '@vueuse/core';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { MAP_KEY_TO_FOCUS_INTENT } from '../../constants';
import { findValuesBetween, getActiveElement, getNextMatch } from '../../shared';
import type { MaybeArray, NavigationKey } from '../../types';
import { getVirtualizerItems, getVirtualizerPadding, queryCheckedElement } from './shared';
import { useCollectionContext, useListboxRootContext, useListboxUi } from './context';
import type { ListboxVirtualizerProps, ListboxVirtualizerSlots } from './types';

defineOptions({
  name: 'ListboxVirtualizer'
});

const props = defineProps<ListboxVirtualizerProps>();

const slots = defineSlots<ListboxVirtualizerSlots>();

const {
  modelValue,
  isMultiple,
  orientation,
  firstValue,
  isVirtual,
  virtualFocusHook,
  virtualHighlightHook,
  virtualKeydownHook,
  highlightedElement,
  changeHighlight,
  highlightFirstItem
} = useListboxRootContext('ListboxVirtualizer');
isVirtual.value = true;

const cls = useListboxUi('virtualizer');

const { getOrderedItems, getOrderedElements } = useCollectionContext('ListboxVirtualizer');

// Reset `search` 1 second after it was last updated
const search = refAutoReset('', 1000);

const optionsWithMetadata = computed(() => {
  const parseTextContent = (option: string) => {
    if (props.textContent) {
      return props.textContent(option);
    }
    return option?.toString()?.toLowerCase();
  };

  return props.options.map((option, index) => ({
    index,
    textContent: parseTextContent(option)
  }));
});

const parentElement = useParentElement() as ShallowRef<HTMLElement | null>;

const padding = computed(() => getVirtualizerPadding(parentElement.value));

const virtualizer = useVirtualizer(
  computed(() => ({
    scrollPaddingStart: padding.value.start,
    scrollPaddingEnd: padding.value.end,
    count: props.options.length,
    horizontal: orientation.value === 'horizontal',
    overscan: props.overscan ?? 12,
    estimateSize: index => {
      if (typeof props.estimateSize === 'function') {
        return props.estimateSize(index);
      }
      return props.estimateSize ?? 28;
    },
    getScrollElement: () => parentElement.value
  }))
);

const height = computed(() => virtualizer.value.getTotalSize());

const style = computed(() => `position:relative;width:100%;height:${height.value}px;`);

const virtualizedItems = computed(() => getVirtualizerItems(virtualizer.value, props.options, slots.default));

virtualFocusHook.on(event => {
  const index = props.options.findIndex(option => {
    const value = Array.isArray(modelValue.value) ? modelValue.value[0] : modelValue.value;
    return option === value;
  });
  if (index !== -1) {
    event?.preventDefault();

    virtualizer.value.scrollToIndex(index, { align: 'start' });
    requestAnimationFrame(() => {
      const item = queryCheckedElement(parentElement.value);
      if (!item) return;
      changeHighlight(item);
      if (!event) return;

      item.focus();
    });
  } else {
    highlightFirstItem();
  }
});

virtualHighlightHook.on(value => {
  const index = props.options.findIndex(option => {
    return option === value;
  });
  virtualizer.value.scrollToIndex(index, { align: 'start' });
  requestAnimationFrame(() => {
    const item = queryCheckedElement(parentElement.value);
    if (!item) return;
    changeHighlight(item);
  });
});

virtualKeydownHook.on(event => {
  const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
  const isTabKey = event.key === 'Tab' && !isMetaKey;
  if (isTabKey) return;

  let intent = MAP_KEY_TO_FOCUS_INTENT[event.key as NavigationKey];

  // Meta + A, select all feature
  if (isMetaKey && event.key === 'a' && isMultiple.value) {
    event.preventDefault();
    modelValue.value = [...props.options];
    // purposely make the focus to last
    intent = 'last';
  } else if (event.shiftKey && intent) {
    handleMultipleReplace(event, intent);
  }

  if (['first', 'last'].includes(intent)) {
    event.preventDefault();

    const index = intent === 'first' ? 0 : props.options.length - 1;
    virtualizer.value.scrollToIndex(index);
    requestAnimationFrame(() => {
      const elements = getOrderedElements();
      const element = intent === 'first' ? elements[0] : elements[elements.length - 1];
      if (element) {
        changeHighlight(element);
      }
    });
  } else if (!intent && !isMetaKey) {
    search.value += event.key;
    const currentIndex = Number(getActiveElement()?.getAttribute('data-index'));
    const currentMatch = optionsWithMetadata.value[currentIndex]?.textContent;
    const filteredOptions = optionsWithMetadata.value.map(i => i.textContent || '');
    const next = getNextMatch(filteredOptions, search.value, currentMatch);

    const nextMatch = optionsWithMetadata.value.find(option => option.textContent === next);
    if (nextMatch) {
      virtualizer.value.scrollToIndex(nextMatch.index, { align: 'start' });
      requestAnimationFrame(() => {
        const item = parentElement.value?.querySelector(`[data-index="${nextMatch.index}"]`);
        if (item instanceof HTMLElement) {
          changeHighlight(item);
        }
      });
    }
  }
});

function handleMultipleReplace(_event: Event, intent: 'first' | 'last' | 'prev' | 'next') {
  if (!firstValue.value || !isMultiple.value || !Array.isArray(modelValue.value)) return;

  const collection = getOrderedItems();
  const lastValue = collection.find(item => item.element === highlightedElement.value)?.data?.value;
  if (!lastValue) return;

  let value: MaybeArray<string> | null = null;
  switch (intent) {
    case 'prev':
    case 'next': {
      value = findValuesBetween(props.options, firstValue.value, lastValue);
      break;
    }
    case 'first': {
      value = findValuesBetween(props.options, firstValue.value, props.options?.[0]);
      break;
    }
    case 'last': {
      value = findValuesBetween(props.options, firstValue.value, props.options?.[props.options.length - 1]);
      break;
    }
    default:
  }

  modelValue.value = value ?? undefined;
}
</script>

<template>
  <div data-vean-virtualizer :class="cls" :style="style">
    <component :is="is" v-for="{ is, item } in virtualizedItems" :key="item.index" />
  </div>
</template>
