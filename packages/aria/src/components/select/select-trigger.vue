<script setup lang="ts">
import { computed } from 'vue';
import { useForwardElement, useTypeahead } from '../../composables';
import { PopperAnchor } from '../popper';
import { Primitive } from '../primitive';
import { OPEN_KEYS, shouldShowPlaceholder } from './shared';
import { useCollectionContext, useSelectRootContext, useSelectUi } from './context';
import type { SelectTriggerProps } from './types';

defineOptions({
  name: 'SelectTrigger'
});

const props = withDefaults(defineProps<SelectTriggerProps>(), {
  as: 'button'
});

const {
  open,
  dataState,
  modelValue,
  disabled,
  required,
  contentId,
  initContentId,
  onTriggerElementChange,
  onOpenChange,
  setTriggerPointerDownPosition
} = useSelectRootContext('SelectTrigger');
const [_, setTriggerElement] = useForwardElement(onTriggerElementChange);

const { getOrderedItems } = useCollectionContext('SelectTrigger');
const { search, handleTypeaheadSearch, resetTypeahead } = useTypeahead();

const cls = useSelectUi('trigger');

const isDisabled = computed(() => disabled.value || props.disabled);
const dataPlaceholder = computed(() => (shouldShowPlaceholder(modelValue.value) ? '' : undefined));
const tag = computed(() => (props.as === 'button' ? 'button' : undefined));

const onOpen = () => {
  if (!isDisabled.value) {
    onOpenChange(true);
    // reset typeahead when we open
    resetTypeahead();
  }
};

const onPointerOpen = (event: PointerEvent) => {
  onOpen();

  const { clientX, clientY } = event;

  // Recorded in viewport coordinates: opening the content locks the body scroll, which zeroes
  // `window.scrollY` while the press is still in flight. Page coordinates would then differ from
  // the release position by the whole scroll offset and read as a drag.
  setTriggerPointerDownPosition({
    x: Math.round(clientX),
    y: Math.round(clientY)
  });
};

const onClick = (event: MouseEvent) => {
  if (open.value) return;
  // Whilst browsers generally have no issue focusing the trigger when clicking
  // on a label, Safari seems to struggle with the fact that there's no `onClick`.
  // We force `focus` in this case. Note: this doesn't create any other side-effect
  // because we are preventing default in `onPointerDown` so effectively
  // this only runs for a label 'click'
  const target = event.currentTarget as HTMLElement | null;
  target?.focus();
};

const onPointerDown = (event: PointerEvent) => {
  // Prevent opening on touch down.
  // https://github.com/unovue/reka-ui/issues/804
  if (event.pointerType === 'touch') {
    event.preventDefault();
    return;
  }

  // prevent implicit pointer capture
  // https://www.w3.org/TR/pointerevents3/#implicit-pointer-capture
  const target = event.target as HTMLElement;
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }

  // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
  // but not when the control key is pressed (avoiding MacOS right click)
  if (event.button === 0 && event.ctrlKey === false) {
    onPointerOpen(event);
    // prevent trigger from stealing focus from the active item after opening.
    event.preventDefault();
  }
};

const onPointerUp = (event: PointerEvent) => {
  // Only open on pointer up when using touch devices
  // https://github.com/unovue/reka-ui/issues/804
  if (event.pointerType === 'touch') {
    onPointerOpen(event);
  }
};

const onKeyDown = (event: KeyboardEvent) => {
  const isTypingAhead = search.value !== '';
  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
  if (!isModifierKey && event.key.length === 1) if (isTypingAhead && event.key === ' ') return;

  const items = getOrderedItems();

  handleTypeaheadSearch(event.key, items);
  if (OPEN_KEYS.includes(event.key)) {
    onOpen();
    event.preventDefault();
  }
};

initContentId();
</script>

<template>
  <PopperAnchor as-child :reference="reference">
    <Primitive
      :ref="setTriggerElement"
      :as="as"
      :as-child="asChild"
      data-vean-select-trigger
      :class="cls"
      :aria-controls="contentId"
      :aria-expanded="open || false"
      :aria-required="required"
      aria-autocomplete="none"
      :disabled="isDisabled"
      :data-state="dataState"
      :data-disabled="isDisabled ? '' : undefined"
      :data-placeholder="dataPlaceholder"
      role="combobox"
      :type="tag"
      @click="onClick"
      @pointerdown="onPointerDown"
      @pointerup.prevent="onPointerUp"
      @keydown="onKeyDown"
    >
      <slot />
    </Primitive>
  </PopperAnchor>
</template>
