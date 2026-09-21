<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { toContext } from '../../shared';
import { markMenuArrowSwitch } from '../menu/shared';
import { useRovingFocusGroup } from '../../composables';
import type { VNodeRef } from '../../types';
import { Primitive } from '../primitive/primitive';
import { provideTreeNavRootContext, useTreeNavUi } from './context';
import type {
  TreeNavOptionData,
  TreeNavRootProps,
  TreeNavRootEmits,
  TreeNavRootSlots,
  TreeNavTriggerItemData
} from './types';

defineOptions({
  name: 'TreeNavRoot'
});

const props = withDefaults(defineProps<TreeNavRootProps>(), {
  trigger: 'hover'
});

const emit = defineEmits<TreeNavRootEmits>();

defineSlots<TreeNavRootSlots>();

const cls = useTreeNavUi('root');

// Selection ------------------------------------------------------------------

// Roving focus group as a hook: the nav container doubles as the group container
// (single tab stop, ←/→/Home/End roam the entries).
const { setContainerElement, groupProps, getOrderedItems } = useRovingFocusGroup({
  orientation: computed(() => 'horizontal' as const),
  dir: computed(() => props.dir),
  loop: computed(() => false),
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

function setRootRef(nodeRef: VNodeRef) {
  setContainerElement(nodeRef);
}

const innerValue = shallowRef(props.defaultValue);

const isControlled = computed(() => props.modelValue !== undefined);

const selected = computed(() => (isControlled.value ? props.modelValue : innerValue.value));

function handleSelect(item: TreeNavOptionData, event: Event) {
  if (props.disabled || item.disabled) return;

  if (!isControlled.value) innerValue.value = item.value;

  emit('update:modelValue', item.value);
  emit('select', item, event);
}

// Branch popup switching ------------------------------------------------------
//
// Mirrors the menubar keyboard model: while a branch popup is open,
// ArrowLeft/ArrowRight (dir-aware) move between top-level triggers, opening
// the next branch popup or just focusing the next link/leaf.

const openValue = shallowRef<string>();

const openPopupValue = computed(() => openValue.value);

function onBranchOpenChange(value: string, isOpen: boolean) {
  if (isOpen) {
    openValue.value = value;
    return;
  }

  // Ignore stale close events from a popup that has already been replaced.
  if (openValue.value === value) openValue.value = undefined;
}

// Menubar semantics: while a branch popup is open, ←/→ (dir-aware) hand the
// next top-level entry the focus — opening its popup for branches, or just
// focusing the entry for links/leaves (which closes the current popup).
function focusAlongNav(value: string, event: KeyboardEvent) {
  const previousKey = props.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const nextKey = props.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

  if (event.key !== previousKey && event.key !== nextKey) return;

  const items = getOrderedItems();
  const candidateItems = event.key === previousKey ? [...items].reverse() : items;
  const currentIndex = candidateItems.findIndex(item => item.data.value === value);
  const nextItem = candidateItems[currentIndex + 1];

  if (!nextItem) return;

  const { value: nextValue, isBranch } = nextItem.data as unknown as TreeNavTriggerItemData;

  // The next branch popup opens with focus staying on its trigger, so the
  // open-focus watch must skip pulling focus inside.
  if (isBranch) markMenuArrowSwitch();

  openValue.value = isBranch ? nextValue : undefined;
  nextItem.element.focus();
  event.preventDefault();
}

function onPopupArrowNavigation(value: string, event: KeyboardEvent) {
  // Only respond while this entry's popup is open: the popup reports keys from
  // inside its surface.
  if (openValue.value !== value) return;
  // Sub-popup layers handle close keys first (e.g. ArrowLeft closing the sub
  // menu); never act on keys a menu layer has already consumed.
  if (event.defaultPrevented) return;

  const nextKey = props.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const target = event.target as HTMLElement | null;
  // Sub triggers own ArrowRight to expand their own submenus.
  if (event.key === nextKey && target?.hasAttribute?.('data-vean-menu-sub-trigger')) return;

  focusAlongNav(value, event);
}

/**
 * Arrow keys resting on a top-level trigger are intercepted at the root in
 * the capture phase.
 *
 * The roving-focus item binds its own keydown directly on the trigger element
 * (ahead of any forwarded listener) and prevents default while roaming, so
 * bubble-phase handlers on the trigger never observe plain ←/→. Capturing at
 * the root runs before every target listener and restores the menubar model:
 * while a popup is open, arrows on a trigger switch popups instead of
 * roaming focus. Popup surfaces are portaled, so their keys keep the
 * menu-layer priority of `onPopupArrowNavigation`.
 */
function onRootKeydownCapture(event: KeyboardEvent) {
  if (openValue.value === undefined) return;

  const previousKey = props.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const nextKey = props.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  if (event.key !== previousKey && event.key !== nextKey) return;

  // Only keys resting on a top-level trigger participate; every other target
  // (links, leaves) stays with the roving group.
  const target = event.target as HTMLElement | null;
  if (!target?.closest?.('[data-vean-dropdown-menu-trigger]')) return;

  focusAlongNav(openValue.value, event);
}

// Context --------------------------------------------------------------------
//
// Popup and link props are provided as individually reactive entries so the
// primitives can consume exactly what they need.

provideTreeNavRootContext({
  selected,
  onSelect: handleSelect,
  openValue: openPopupValue,
  onBranchOpenChange,
  onPopupArrowNavigation,
  disabled: computed(() => Boolean(props.disabled)),
  linkProps: computed(() => props.linkProps),
  ...toContext(props, [
    'dir',
    'trigger',
    'delayDuration',
    'skipDelayDuration',
    'placement',
    'showArrow',
    'portalProps',
    'popupProps',
    'triggerProps',
    'arrowProps',
    'itemProps',
    'groupLabelProps',
    'shortcutProps',
    'separatorProps',
    'subTriggerProps',
    'subContentProps'
  ])
});
</script>

<!--
 Keyboard model (APG menubar convention): the roving focus group makes the
top level a single tab stop and ←/→/Home/End roam the entries. Opening a
branch popup stays on the explicit keys — Enter/Space and ArrowDown — and
once a popup is open its keys belong to the Menu machinery.
-->
<template>
  <Primitive
    v-bind="groupProps"
    :ref="setRootRef"
    :as="as"
    :as-child="asChild"
    data-vean-tree-nav
    :class="cls"
    @keydown-capture="onRootKeydownCapture"
  >
    <slot />
  </Primitive>
</template>
