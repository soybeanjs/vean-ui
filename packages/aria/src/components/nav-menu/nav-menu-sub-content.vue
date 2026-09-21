<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { getActiveElement, getTabbableCandidates, tryFocusFirst } from '../../shared';
import { providePopperUi, usePopperRootContext } from '../popper/context';
import { useArrowNavigation, useOmitProps } from '../../composables';
import { PopperPopup, PopperPortal, PopperPositioner } from '../popper';
import { useNavMenuRootContext, useNavMenuUi } from './context';
import type { NavMenuSubContentProps } from './types';

defineOptions({
  name: 'NavMenuSubContent',
  inheritAttrs: false
});

const props = withDefaults(defineProps<NavMenuSubContentProps>(), {
  sideOffset: 8
});

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['forceMount', 'sideOffset'], attrs);

const { dir } = useNavMenuRootContext('NavMenuSubContent');

// The nested flyout is its own Popper root; position it against the sub trigger (the
// root's anchor) opening to the reading side (right in LTR, left in RTL).
const popperContext = usePopperRootContext('NavMenuSubContent');
const { open, anchorElement } = popperContext;

const ui = useNavMenuUi();

// Scope the Popper UI slots for this subtree so the nested popup uses the dedicated
// `subContent` style instead of the shared `viewport` style.
providePopperUi(
  computed(() => ({
    positioner: ui.value.positioner,
    popup: ui.value.subContent,
    arrow: ui.value.arrow
  }))
);

const side = computed(() => (dir.value === 'rtl' ? 'left' : 'right'));

const onEscapeKeyDown = (event: KeyboardEvent) => {
  // Escape closes the deepest flyout first and returns focus to its trigger.
  event.preventDefault();
  popperContext.onOpenChange(false, 'dismiss-escape');
  popperContext.triggerElement.value?.focus();
};

const onKeydown = (event: KeyboardEvent) => {
  const content = popperContext.popupElement.value;
  if (!content?.contains(event.target as HTMLElement)) return;

  const closeKey = dir.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  if (event.key === closeKey) {
    popperContext.onOpenChange(false, 'imperative');
    popperContext.triggerElement.value?.focus();
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // Tab moves between focusable candidates; arrow keys navigate them as well.
  const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
  const isTabKey = event.key === 'Tab' && !isMetaKey;
  const candidates = getTabbableCandidates(content);

  if (isTabKey) {
    const focusedElement = getActiveElement();
    const index = candidates.findIndex(candidate => candidate === focusedElement);
    const isMovingBackwards = event.shiftKey;
    const nextCandidates = isMovingBackwards
      ? candidates.slice(0, index).reverse()
      : candidates.slice(index + 1, candidates.length);

    if (tryFocusFirst(nextCandidates)) {
      event.preventDefault();
    }
    return;
  }

  const newSelectedElement = useArrowNavigation(event, getActiveElement() as HTMLElement, undefined, {
    itemsArray: candidates,
    loop: false,
    enableIgnoredElement: true
  });
  newSelectedElement?.focus();
};
</script>

<template>
  <PopperPortal>
    <PopperPositioner
      v-if="open || forceMount"
      v-bind="forwardedProps"
      :reference="anchorElement"
      :side="side"
      align="start"
      :side-offset="sideOffset"
      position-strategy="fixed"
      data-vean-nav-menu-sub-content
      @escape-key-down="onEscapeKeyDown"
    >
      <PopperPopup @keydown="onKeydown">
        <slot />
      </PopperPopup>
    </PopperPositioner>
  </PopperPortal>
</template>
