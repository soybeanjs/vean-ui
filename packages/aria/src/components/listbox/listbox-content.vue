<script setup lang="ts">
import { computed } from 'vue';
import { refAutoReset } from '@vueuse/core';
import { useForwardElement } from '../../composables';
import { useCollectionContext, useListboxRootContext, useListboxUi } from './context';
import type { ListboxContentProps } from './types';

defineOptions({
  name: 'ListboxContent'
});

defineProps<ListboxContentProps>();

const {
  orientation,
  focusable,
  highlightedElement,
  isMultiple,
  onEnter,
  onKeydownNavigation,
  onKeydownEnter,
  onKeydownTypeahead
} = useListboxRootContext('ListboxContent');
const { onContainerElementChange } = useCollectionContext('ListboxContent');
const [_, setContentElement] = useForwardElement(el => {
  onContainerElementChange(el);
});

const cls = useListboxUi('content');

const isClickFocus = refAutoReset(false, 10);

const tabindex = computed(() => {
  if (!focusable.value) return '-1';

  return highlightedElement.value ? '-1' : '0';
});

const onFocus = (event: FocusEvent) => {
  if (isClickFocus.value) return;
  onEnter(event);
};

const onKeydownNav = (event: KeyboardEvent) => {
  if (orientation.value === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    return;
  }

  if (orientation.value === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
    return;
  }

  event.preventDefault();

  if (!focusable.value) return;
  onKeydownNavigation(event);
};

const onMousedown = () => {
  isClickFocus.value = true;
};
</script>

<template>
  <div
    :ref="setContentElement"
    data-vean-listbox-content
    :class="cls"
    role="listbox"
    :tabindex="tabindex"
    :aria-orientation="orientation"
    :aria-multiselectable="isMultiple"
    :data-orientation="orientation"
    @mousedown.left="onMousedown"
    @focus="onFocus"
    @keydown.down.up.left.right.home.end="onKeydownNav"
    @keydown.enter="onKeydownEnter"
    @keydown="onKeydownTypeahead"
  >
    <slot />
  </div>
</template>
