<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { COLLECTION_ITEM_ATTRIBUTE } from '../../constants';
import { getActiveElement, isMouseEvent, tryFocusFirst } from '../../shared';
import { popperCssVars } from '../popper/shared';
import { usePopperRootContext } from '../popper/context';
import {
  useArrowNavigation,
  useForwardElement,
  useForwardListeners,
  useHideOthers,
  useOmitProps,
  useRovingFocusGroup,
  useTypeahead
} from '../../composables';
import type { VNodeRef } from '../../types';
import { PopperPopup, PopperPositioner } from '../popper';
import {
  FIRST_LAST_KEYS,
  LAST_KEYS,
  MENU_POPUP_DATA_ATTRIBUTE,
  consumeMenuArrowSwitch,
  menuCssVars,
  subMenuCssVars
} from './shared';
import { provideMenuContentContext, useMenuContext, useMenuRootContext, useMenuUi } from './context';
import type { MenuContentImplProps, MenuContentImplEmits } from './types';

defineOptions({
  name: 'MenuContentImpl'
});

const props = defineProps<MenuContentImplProps>();

const emit = defineEmits<MenuContentImplEmits>();

const { modal, dir, isUsingKeyboard } = useMenuRootContext('MenuContentImpl');
const { isRoot, open, dataState, popupId, triggerId, dataPopupAttr, initPopupId, onPopupElementChange } =
  useMenuContext('MenuContentImpl');
const popperContext = usePopperRootContext('MenuContentImpl');

const positionerElement = popperContext.positionerElement;
const [popupElement, setPopupElement] = useForwardElement(node => {
  onPopupElementChange(node);
});
const { currentItemId, searchRef, pointerSide } = provideMenuContentContext({
  popupElement
});

const ui = useMenuUi();
const cls = computed(() => (isRoot ? ui.value?.positioner : ui.value?.subPositioner));
const popupCls = computed(() => (isRoot ? ui.value?.popup : ui.value?.subPopup));

const { handleTypeaheadSearch } = useTypeahead();

// Roving focus group as a hook: the popup doubles as the group container and items self-register
// against it. `currentItemId` stays the source of truth so item focus state is shared with the menu
// content context (mirrors the component's `v-model:current-tab-stop-id`).
const { setContainerElement, groupProps, getOrderedItems } = useRovingFocusGroup({
  orientation: computed(() => 'vertical' as const),
  dir,
  loop: computed(() => props.loop ?? false),
  currentTabStopId: computed(() => currentItemId.value),
  defaultCurrentTabStopId: computed(() => ''),
  preventScrollOnEntryFocus: computed(() => false),
  onUpdateCurrentTabStopId: value => {
    currentItemId.value = value ?? null;
  },
  onEntryFocus
});

function setPopupRef(nodeRef: VNodeRef) {
  setContainerElement(nodeRef);
  setPopupElement(nodeRef);
}

const listeners = useForwardListeners<keyof MenuContentImplEmits>(emit);

// The dismiss stack (outside/escape, focus trap, guards, scroll lock, layer dismissal rules —
// a sub layer's outside dismissal closes only itself) lives on the Popper positioner now.
function onOpenAutoFocus(event: Event) {
  emit('openAutoFocus', event);
  // Focus the popup area only and leave `onEntryFocus` in control of focusing the first item.
  event.preventDefault();
}

listeners.openAutoFocus = onOpenAutoFocus;

const forwardedProps = useOmitProps(props, ['trapFocus', 'loop', 'popupProps']);

const popupProps = computed(() => {
  return {
    ...props.popupProps,
    [dataPopupAttr]: ''
  };
});

// `groupProps` (roving focus container bindings incl. listeners) and the menu popup data attribute
// are merged into a single binding set because a Vue element accepts only one `v-bind`.
const popupBindings = computed(() => ({ ...groupProps.value, ...popupProps.value }));

const popupStyle = computed<CSSProperties>(() => {
  const cssVars = isRoot ? menuCssVars : subMenuCssVars;

  return {
    [cssVars.popupTransformOrigin]: `var(${popperCssVars.transformOrigin})`,
    [cssVars.popupAvailableWidth]: `var(${popperCssVars.availableWidth})`,
    [cssVars.popupAvailableHeight]: `var(${popperCssVars.availableHeight})`,
    [cssVars.triggerWidth]: `var(${popperCssVars.anchorWidth})`,
    [cssVars.triggerHeight]: `var(${popperCssVars.anchorHeight})`
  };
});

function onEntryFocus(event: Event) {
  emit('entryFocus', event);
  // only focus first item when using keyboard
  if (!isUsingKeyboard.value) {
    event.preventDefault();
  }
}

const onKeyDown = (event: KeyboardEvent) => {
  if (event.defaultPrevented) return;
  // submenu key events bubble through portals. We only care about keys in this menu.
  const target = event.target as HTMLElement;
  const isKeyDownInside = target.closest(`[${MENU_POPUP_DATA_ATTRIBUTE}]`) === event.currentTarget;
  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
  const isCharacterKey = event.key.length === 1;

  const el = useArrowNavigation(event, getActiveElement() as HTMLElement, popupElement.value, {
    loop: props.loop,
    arrowKeyOptions: 'vertical',
    dir: dir.value,
    focus: true,
    attributeName: `[${COLLECTION_ITEM_ATTRIBUTE}]:not([data-disabled])`
  });
  if (el) {
    el.focus();
    return;
  }

  // prevent "Space" taken account into handleTypeahead
  if (event.code === 'Space') return;

  const collectionItems = getOrderedItems();

  if (isKeyDownInside) {
    // menus should not be navigated using the tab key; only trap it for modal
    // menus. Non-modal menus (e.g. dropdown menus) let Tab move focus out
    // naturally (FocusScope handles the actual trapping for modal menus).
    if (event.key === 'Tab' && modal.value) {
      event.preventDefault();
    }
    if (!isModifierKey && isCharacterKey) {
      handleTypeaheadSearch(event.key, collectionItems);
    }
  }

  // focus first/last item based on key pressed
  if (event.target !== popupElement.value) return;
  if (!FIRST_LAST_KEYS.includes(event.key)) return;

  event.preventDefault();
  const candidateNodes = collectionItems.map(item => item.element);
  if (LAST_KEYS.includes(event.key)) {
    candidateNodes.reverse();
  }
  tryFocusFirst(candidateNodes);
};

function onBlur(event: FocusEvent) {
  if (!event) return;

  const { currentTarget, target } = event;

  // clear search buffer when leaving the menu
  if (!(currentTarget as HTMLElement)?.contains(target as HTMLElement)) {
    searchRef.value = '';
  }
}

let lastPointerX = 0;

function onPointerMove(event: PointerEvent) {
  if (!isMouseEvent(event)) return;
  const target = event.target as HTMLElement;
  const pointerXHasChanged = lastPointerX !== event.clientX;

  // We don't use `event.movementX` for this check because Safari will
  // always return `0` on a pointer event.
  if ((event?.currentTarget as HTMLElement)?.contains(target) && pointerXHasChanged) {
    const newSide = event.clientX > lastPointerX ? 'right' : 'left';
    pointerSide.value = newSide;
    lastPointerX = event.clientX;
  }
}

initPopupId();
// Only the root menu hides the background context while modal; submenus stay in-flow.
useHideOthers(positionerElement, () => modal.value && isRoot);

// Focus the popup container on open (submenus: keyboard users only). Non-trapped layers get
// no shell auto-focus event, so the watch covers every layer shape uniformly.
watch(
  open,
  value => {
    if (!value) return;
    if (!isRoot && !isUsingKeyboard.value) return;

    nextTick(() => {
      // Menubar-style switching: focus stays on the trigger that opened us.
      if (consumeMenuArrowSwitch()) return;

      popupElement.value?.focus({ preventScroll: true });
    });
  },
  { immediate: true }
);
</script>

<template>
  <PopperPositioner
    v-bind="forwardedProps"
    :trap-focus="trapFocus"
    data-vean-menu-content-impl
    :class="cls"
    v-on="listeners"
  >
    <PopperPopup
      v-bind="popupBindings"
      :id="popupId"
      :ref="setPopupRef"
      :class="popupCls"
      :aria-labelledby="triggerId"
      aria-orientation="vertical"
      :data-state="dataState"
      :dir="dir"
      role="menu"
      tabindex="-1"
      :style="popupStyle"
      @keydown="onKeyDown"
      @blur="onBlur"
      @pointermove="onPointerMove"
    >
      <slot />
    </PopperPopup>
  </PopperPositioner>
</template>
