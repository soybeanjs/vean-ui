<script setup lang="ts">
import { computed, onWatcherCleanup, watch, watchEffect } from 'vue';
import type { CSSProperties } from 'vue';
import { tryFocusFirst } from '../../shared';
import {
  useBodyScrollLock,
  useDismissableLayer,
  useFocusGuards,
  useFocusScope,
  useForwardElement,
  useHideOthers,
  useOmitProps,
  useTypeahead
} from '../../composables';
import { PopperPositioningPositioner } from '../popper';
import { CONTENT_MARGIN } from './shared';
import {
  provideSelectContentContext,
  useCollectionContext,
  useSelectPopupElementContext,
  useSelectRootContext
} from './context';
import SelectItemAlignedPopup from './select-item-aligned-popup.vue';
import SelectItemAlignedPositioner from './select-item-aligned-positioner.vue';
import SelectPopperPopup from './select-popper-popup.vue';
import type { SelectContentImplProps, SelectContentImplEmits } from './types';

defineOptions({
  name: 'SelectContentImpl'
});

const props = withDefaults(defineProps<SelectContentImplProps>(), {
  align: 'start',
  position: 'popper',
  collisionPadding: CONTENT_MARGIN,
  avoidCollisions: true,
  bodyLock: true,
  disableOutsidePointerEvents: true
});

const emit = defineEmits<SelectContentImplEmits>();

const {
  open,
  onOpenChange,
  dataState,
  modelValue,
  isMultiple,
  dir,
  contentId,
  triggerElement,
  triggerPointerDownPosition,
  resetTriggerPointerDownPosition
} = useSelectRootContext('SelectContentImpl');
const { onPopupElementChange } = useSelectPopupElementContext('SelectContentImpl');

const { onContainerElementChange, getOrderedItems, getOrderedElements } = useCollectionContext('SelectContentImpl');
const [positionerElement, setPositionerElement] = useForwardElement();
const [popupElement, setPopupElement] = useForwardElement(node => {
  onPopupElementChange(node);
  onContainerElementChange(node);
});
const { search, handleTypeaheadSearch } = useTypeahead();

const { pointerEvents, onFocusCapture, onBlurCapture } = useDismissableLayer(positionerElement, {
  disableOutsidePointerEvents: () => props.disableOutsidePointerEvents,
  // The exit animation keeps this content mounted after `open` turns false. A closed layer must not dismiss outside
  // interactions, or the very `pointerdown` that re-opens the select from the trigger closes it again.
  enable: () => Boolean(open.value),
  onEscapeKeyDown: event => {
    emit('escapeKeyDown', event);
  },
  onPointerDownOutside: event => {
    emit('pointerDownOutside', event);
  },
  onFocusOutside: event => {
    event.preventDefault();
  },
  onDismiss: () => {
    onOpenChange(false);
  }
});

const { onKeydown: onFocusScopeKeydown } = useFocusScope(positionerElement, {
  onOpenAutoFocus: event => {
    event.preventDefault();
  },
  onCloseAutoFocus: event => {
    emit('closeAutoFocus', event);
    if (event.defaultPrevented) return;
    triggerElement.value?.focus({ preventScroll: true });
    event.preventDefault();
  }
});

const { isPositioned, focusSelectedItem } = provideSelectContentContext({
  position: computed(() => props.position),
  modelValue,
  isMultiple,
  search,
  popupElement
});

const popperPositionerProps = useOmitProps(props, [
  'position',
  'bodyLock',
  'popupProps',
  'disableOutsidePointerEvents',
  // `open` is boolean-cast to `false` when absent; the real open state comes from the
  // root context and is bound explicitly below.
  'open'
]);

const popupStyle = computed<CSSProperties>(() => ({
  // flex layout so we can place the scroll buttons properly
  display: 'flex',
  flexDirection: 'column',
  // reset the outline by default as the content MAY get focused
  outline: 'none',
  pointerEvents: pointerEvents.value
}));

const onKeyDown = (event: KeyboardEvent) => {
  onFocusScopeKeydown(event);

  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;

  // select should not be navigated using tab key so we prevent it
  if (event.key === 'Tab') event.preventDefault();

  if (!isModifierKey && event.key.length === 1) {
    handleTypeaheadSearch(event.key, getOrderedItems());
  }

  if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    const collectionItems = getOrderedElements();
    let candidateNodes = [...collectionItems];

    if (['ArrowUp', 'End'].includes(event.key)) {
      candidateNodes = candidateNodes.slice().reverse();
    }

    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      const currentElement = event.target as HTMLElement;
      const currentIndex = candidateNodes.indexOf(currentElement);
      candidateNodes = candidateNodes.slice(currentIndex + 1);
    }
    setTimeout(() => {
      tryFocusFirst(candidateNodes);
    });
    event.preventDefault();
  }
};

const onPlaced = () => {
  isPositioned.value = true;
};

useFocusGuards();
useHideOthers(popupElement, open);

watch(isPositioned, () => {
  focusSelectedItem();
});

watchEffect(() => {
  if (!props.bodyLock) return;

  const cleanup = useBodyScrollLock();
  onWatcherCleanup(cleanup);
});

// prevent selecting items on `pointerup` in some cases after opening from `pointerdown`
// and close on `pointerup` outside.
watchEffect(() => {
  if (!popupElement.value) return;
  let pointerMoveDelta = { x: 0, y: 0 };

  const onPointerMove = (event: PointerEvent) => {
    const { x, y } = triggerPointerDownPosition.value ?? { x: 0, y: 0 };

    // Measured in the same viewport space the trigger recorded in (see
    // `setTriggerPointerDownPosition`); the body scroll lock zeroes `window.scrollY` while open, so
    // page coordinates would report the scroll offset as pointer movement.
    pointerMoveDelta = {
      x: Math.abs(Math.round(event.clientX) - x),
      y: Math.abs(Math.round(event.clientY) - y)
    };
  };

  const onPointerUp = (event: PointerEvent) => {
    // Prevent options from being un-tappable on touch devices
    // https://github.com/unovue/reka-ui/issues/804
    if (event.pointerType === 'touch') return;

    // If the pointer hasn't moved by a certain threshold then we prevent selecting item on `pointerup`.
    if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
      event.preventDefault();
    }
    // otherwise, if the event was outside the content, close.
    else if (!popupElement.value?.contains(event.target as HTMLElement)) {
      onOpenChange(false);
    }

    document.removeEventListener('pointermove', onPointerMove);
    resetTriggerPointerDownPosition();
  };

  if (triggerPointerDownPosition.value !== null) {
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp, {
      capture: true,
      once: true
    });
  }

  onWatcherCleanup(() => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp, {
      capture: true
    });
  });
});
</script>

<template>
  <PopperPositioningPositioner
    v-if="position === 'popper'"
    :ref="setPositionerElement"
    v-bind="popperPositionerProps"
    :open="open"
    @focus.capture="onFocusCapture"
    @blur.capture="onBlurCapture"
    @contextmenu.prevent
    @placed="onPlaced"
    @keydown="onKeyDown"
  >
    <SelectPopperPopup
      :id="contentId"
      :ref="setPopupElement"
      v-bind="popupProps"
      data-dismissable-layer
      :data-state="dataState"
      role="listbox"
      tabindex="-1"
      :style="popupStyle"
    >
      <slot />
    </SelectPopperPopup>
  </PopperPositioningPositioner>
  <SelectItemAlignedPositioner
    v-else
    :ref="setPositionerElement"
    @focus.capture="onFocusCapture"
    @blur.capture="onBlurCapture"
    @contextmenu.prevent
    @placed="onPlaced"
    @keydown="onKeyDown"
  >
    <SelectItemAlignedPopup
      :id="contentId"
      :ref="setPopupElement"
      v-bind="popupProps"
      data-dismissable-layer
      :data-state="dataState"
      :dir="dir"
      role="listbox"
      tabindex="-1"
      :style="popupStyle"
    >
      <slot />
    </SelectItemAlignedPopup>
  </SelectItemAlignedPositioner>
</template>
