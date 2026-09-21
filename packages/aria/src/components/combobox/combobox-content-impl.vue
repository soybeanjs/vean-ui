<script setup lang="ts">
import { computed, onMounted, onUnmounted, onWatcherCleanup, ref, useAttrs, watchEffect } from 'vue';
import type { CSSProperties } from 'vue';
import { popperCssVars } from '../popper/shared';
import {
  useBodyScrollLock,
  useDismissableLayer,
  useExposedElement,
  useFocusGuards,
  useFocusScope,
  useHideOthers,
  useOmitProps
} from '../../composables';
import { PopperPositioningPopup, PopperPositioningPositioner } from '../popper';
import { Primitive } from '../primitive';
import { provideComboboxContentContext, useComboboxRootContext } from './context';
import type { ComboboxContentImplProps, ComboboxContentImplEmits } from './types';

defineOptions({
  name: 'ComboboxContentImpl',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ComboboxContentImplProps>(), {
  position: 'popper'
});

const emit = defineEmits<ComboboxContentImplEmits>();

const attrs = useAttrs();

const {
  dir,
  contentId,
  open,
  ignoreFilter,
  allItems,
  filterState,
  parentElement,
  inputElement,
  triggerElement,
  onOpenChange,
  onPopupElementChange
} = useComboboxRootContext('ComboboxContentImpl');

const [contentElement, setContentElement] = useExposedElement(onPopupElementChange);

function isEventTargetWithinCombobox(target: EventTarget | null) {
  const rootElement = parentElement.value;
  // The content can be teleported (portal) out of the root, so treat both the root
  // and the popup content as "inside the combobox".
  const popupElement = contentElement.value;
  const isInside = (node: EventTarget | null) =>
    Boolean(rootElement?.contains(node as Node) || popupElement?.contains(node as Node));

  if (isInside(target)) {
    return true;
  }

  // A `<label>` associated (via `for`) with an element inside the combobox forwards its
  // click/focus to that control, so interacting with it should not dismiss the content.
  // Without this, clicking such a label while open dismisses on `pointerdown` and the
  // forwarded click/focus immediately re-opens it.
  const label = target instanceof Element ? target.closest('label') : null;
  const control = label?.control;

  return Boolean(control) && isInside(control as EventTarget);
}

const { pointerEvents, onFocusCapture, onBlurCapture } = useDismissableLayer(contentElement, {
  disableOutsidePointerEvents: () => props.disableOutsidePointerEvents,
  // A closed (still exit-animating) layer must not dismiss the interaction that re-opens it.
  enable: () => open.value,
  onEscapeKeyDown: event => {
    emit('escapeKeyDown', event);
  },
  onPointerDownOutside: event => {
    // if clicking inside the combobox (or a label tied to it), prevent dismiss
    if (isEventTargetWithinCombobox(event.target)) {
      event.preventDefault();
    }

    emit('pointerDownOutside', event);
  },
  onFocusOutside: event => {
    // if focusing inside the combobox (or a label tied to it), prevent dismiss
    if (isEventTargetWithinCombobox(event.target)) {
      event.preventDefault();
    }

    emit('focusOutside', event);
  },
  onInteractOutside: event => {
    emit('interactOutside', event);
  },
  onDismiss: () => {
    onOpenChange(false);
  }
});

const { onKeydown } = useFocusScope(contentElement, {
  trapped: () => props.trapFocus,
  loop: true,
  onOpenAutoFocus: event => {
    emit('openAutoFocus', event);
    event.preventDefault();
  },
  onCloseAutoFocus: event => {
    emit('closeAutoFocus', event);
    event.preventDefault();
  }
});

const position = computed(() => props.position);

const positionerProps = useOmitProps(props, [
  'bodyLock',
  'disableOutsidePointerEvents',
  'forceMount',
  'hideWhenEmpty',
  'popupProps',
  'position',
  'trapFocus',
  // `open` is boolean-cast to `false` when absent; the real open state comes from the
  // root context and is bound explicitly below.
  'open'
]);

const popupProps = computed(() => ({
  ...attrs,
  ...props.popupProps
}));

const isEmpty = computed(() => {
  if (ignoreFilter.value) {
    return allItems.value.size === 0;
  }

  return filterState.value.count === 0;
});

const popupStyle = computed<CSSProperties>(() => ({
  pointerEvents: pointerEvents.value,
  display: props.hideWhenEmpty && isEmpty.value ? 'none' : 'flex',
  flexDirection: 'column',
  outline: 'none',
  ...(position.value === 'popper'
    ? {
        ['--vean-combobox-content-transform-origin']: `var(${popperCssVars.transformOrigin})`,
        ['--vean-combobox-content-available-width']: `var(${popperCssVars.availableWidth})`,
        ['--vean-combobox-content-available-height']: `var(${popperCssVars.availableHeight})`,
        ['--vean-combobox-trigger-width']: `var(${popperCssVars.anchorWidth})`,
        ['--vean-combobox-trigger-height']: `var(${popperCssVars.anchorHeight})`,
        boxSizing: 'border-box'
      }
    : {})
}));

provideComboboxContentContext({
  position
});

useFocusGuards();
useHideOthers(() => [parentElement.value, contentElement.value], open);

watchEffect(() => {
  if (!props.bodyLock) {
    return;
  }

  const cleanup = useBodyScrollLock();

  onWatcherCleanup(cleanup);
});

const isInputWithinContent = ref(false);

onMounted(() => {
  if (inputElement.value && contentElement.value) {
    isInputWithinContent.value = contentElement.value.contains(inputElement.value);

    if (isInputWithinContent.value) {
      inputElement.value.focus();
    }
  }
});

onUnmounted(() => {
  const activeElement = document.activeElement;

  if (isInputWithinContent.value && (!activeElement || activeElement === document.body)) {
    triggerElement.value?.focus();
  }
});
</script>

<template>
  <PopperPositioningPositioner
    v-if="position === 'popper'"
    v-bind="positionerProps"
    :open="open"
    @placed="emit('placed')"
  >
    <PopperPositioningPopup
      :id="contentId"
      :ref="setContentElement"
      v-bind="popupProps"
      data-dismissable-layer
      :data-state="open ? 'open' : 'closed'"
      :data-empty="isEmpty ? '' : undefined"
      :style="popupStyle"
      @focus.capture="onFocusCapture"
      @blur.capture="onBlurCapture"
      @keydown="onKeydown"
    >
      <slot />
    </PopperPositioningPopup>
  </PopperPositioningPositioner>
  <Primitive
    v-else
    :id="contentId"
    :ref="setContentElement"
    v-bind="popupProps"
    as="div"
    data-dismissable-layer
    :dir="dir"
    :data-state="open ? 'open' : 'closed'"
    :data-empty="isEmpty ? '' : undefined"
    :style="popupStyle"
    @focus.capture="onFocusCapture"
    @blur.capture="onBlurCapture"
    @keydown="onKeydown"
  >
    <slot />
  </Primitive>
</template>
