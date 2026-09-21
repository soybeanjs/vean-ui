<script setup lang="ts">
import { nextTick, onMounted, shallowRef } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { clamp } from '../../shared';
import { CONTENT_MARGIN } from './shared';
import {
  provideSelectItemAlignedPositionContext,
  useCollectionContext,
  useSelectContentContext,
  useSelectPopupElementContext,
  useSelectRootContext,
  useSelectUi
} from './context';
import type { SelectItemAlignedPositionProps, SelectItemAlignedPositionEmits } from './types';

defineOptions({
  name: 'SelectItemAlignedPosition'
});

defineProps<SelectItemAlignedPositionProps>();

const emit = defineEmits<SelectItemAlignedPositionEmits>();

const cls = useSelectUi('positioner');

const { dir, triggerElement, valueElement } = useSelectRootContext('SelectItemAlignedPosition');
const { viewportElement, selectedItemElement, selectedItemTextElement, focusSelectedItem } =
  useSelectContentContext('SelectItemAlignedPosition');
const { getOrderedElements } = useCollectionContext('SelectItemAlignedPosition');

const positionerElement = shallowRef<HTMLElement>();

const { popupElement } = useSelectPopupElementContext('SelectItemAlignedPosition');

const shouldExpandOnScroll = shallowRef(false);

let shouldReposition = true;

function position() {
  if (
    !triggerElement.value ||
    !valueElement.value ||
    !positionerElement.value ||
    !popupElement.value ||
    !viewportElement.value ||
    !selectedItemElement.value ||
    !selectedItemTextElement.value
  )
    return;

  const triggerRect = triggerElement.value.getBoundingClientRect();

  // -----------------------------------------------------------------------------------------
  //  Horizontal positioning
  // -----------------------------------------------------------------------------------------
  const popupRect = popupElement.value.getBoundingClientRect();
  const valueNodeRect = valueElement.value.getBoundingClientRect();
  const itemTextRect = selectedItemTextElement.value.getBoundingClientRect();

  if (dir.value !== 'rtl') {
    const itemTextOffset = itemTextRect.left - popupRect.left;
    const left = valueNodeRect.left - itemTextOffset;
    const leftDelta = triggerRect.left - left;
    const minContentWidth = triggerRect.width + leftDelta;
    const contentWidth = Math.max(minContentWidth, popupRect.width);
    const rightEdge = window.innerWidth - CONTENT_MARGIN;
    const clampedLeft = clamp(left, CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth));

    positionerElement.value.style.minWidth = `${minContentWidth}px`;
    positionerElement.value.style.left = `${clampedLeft}px`;
  } else {
    const itemTextOffset = popupRect.right - itemTextRect.right;
    const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
    const rightDelta = window.innerWidth - triggerRect.right - right;
    const minContentWidth = triggerRect.width + rightDelta;
    const contentWidth = Math.max(minContentWidth, popupRect.width);
    const leftEdge = window.innerWidth - CONTENT_MARGIN;
    const clampedRight = clamp(right, CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth));

    positionerElement.value.style.minWidth = `${minContentWidth}px`;
    positionerElement.value.style.right = `${clampedRight}px`;
  }

  // -----------------------------------------------------------------------------------------
  // Vertical positioning
  // -----------------------------------------------------------------------------------------
  const items = getOrderedElements();
  const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
  const itemsHeight = viewportElement.value.scrollHeight;

  const popupStyles = window.getComputedStyle(popupElement.value);
  const popupBorderTopWidth = Number.parseInt(popupStyles.borderTopWidth, 10);
  const popupPaddingTop = Number.parseInt(popupStyles.paddingTop, 10);
  const popupBorderBottomWidth = Number.parseInt(popupStyles.borderBottomWidth, 10);
  const popupPaddingBottom = Number.parseInt(popupStyles.paddingBottom, 10);

  const fullContentHeight =
    popupBorderTopWidth + popupPaddingTop + itemsHeight + popupPaddingBottom + popupBorderBottomWidth;
  const minContentHeight = Math.min(selectedItemElement.value.offsetHeight * 5, fullContentHeight);

  const viewportStyles = window.getComputedStyle(viewportElement.value);
  const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10);
  const viewportPaddingBottom = Number.parseInt(viewportStyles.paddingBottom, 10);

  const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
  const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;

  const selectedItemHalfHeight = selectedItemElement.value.offsetHeight / 2;
  const itemOffsetMiddle = selectedItemElement.value.offsetTop + selectedItemHalfHeight;
  const contentTopToItemMiddle = popupBorderTopWidth + popupPaddingTop + itemOffsetMiddle;
  const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;

  const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;

  if (willAlignWithoutTopOverflow) {
    const isLastItem = selectedItemElement.value === items[items.length - 1];
    positionerElement.value.style.bottom = `${0}px`;
    const viewportOffsetBottom =
      popupElement.value.clientHeight - viewportElement.value.offsetTop - viewportElement.value.offsetHeight;
    const clampedTriggerMiddleToBottomEdge = Math.max(
      triggerMiddleToBottomEdge,
      selectedItemHalfHeight +
        // viewport might have padding bottom, include it to avoid a scrollable viewport
        (isLastItem ? viewportPaddingBottom : 0) +
        viewportOffsetBottom +
        popupBorderBottomWidth
    );
    const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
    positionerElement.value.style.height = `${height}px`;
  } else {
    const isFirstItem = selectedItemElement.value === items[0];
    positionerElement.value.style.top = `${0}px`;
    const clampedTopEdgeToTriggerMiddle = Math.max(
      topEdgeToTriggerMiddle,
      popupBorderTopWidth +
        viewportElement.value.offsetTop +
        // viewport might have padding top, include it to avoid a scrollable viewport
        (isFirstItem ? viewportPaddingTop : 0) +
        selectedItemHalfHeight
    );
    const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
    positionerElement.value.style.height = `${height}px`;
    viewportElement.value.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewportElement.value.offsetTop;
  }

  positionerElement.value.style.margin = `${CONTENT_MARGIN}px 0`;
  positionerElement.value.style.minHeight = `${minContentHeight}px`;
  positionerElement.value.style.maxHeight = `${availableHeight}px`;
  // -----------------------------------------------------------------------------------------

  emit('placed');

  // we don't want the initial scroll position adjustment to trigger "expand on scroll"
  // so we explicitly turn it on only after they've registered.
  requestAnimationFrame(() => {
    shouldExpandOnScroll.value = true;
  });
}

// copy z-index from popup to positioner
const popupZIndex = shallowRef('');
const getPopupZIndex = () => {
  if (popupElement.value) {
    popupZIndex.value = window.getComputedStyle(popupElement.value).zIndex;
  }
};

// When the viewport becomes scrollable at the top, the scroll up button will mount.
// Because it is part of the normal flow, it will push down the viewport, thus throwing our
// trigger => selectedItem alignment off by the amount the viewport was pushed down.
// We wait for this to happen and then re-run the positioning logic one more time to account for it.
function onScrollButtonChange(node: HTMLElement | undefined) {
  if (!node || !shouldReposition) return;

  position();
  focusSelectedItem();
  shouldReposition = false;
}

provideSelectItemAlignedPositionContext({
  positionerElement,
  shouldExpandOnScroll,
  onScrollButtonChange
});

// Resize and position when trigger element changes
useResizeObserver(triggerElement, () => {
  position();
});

onMounted(async () => {
  await nextTick();
  position();
  getPopupZIndex();
});
</script>

<template>
  <div
    ref="positionerElement"
    data-vean-select-item-aligned-positioner
    :class="cls"
    style="display: flex; flex-direction: column; position: fixed"
    :style="{
      zIndex: popupZIndex
    }"
  >
    <slot />
  </div>
</template>
