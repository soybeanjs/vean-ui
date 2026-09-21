<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue';
import { usePopperRootContext } from '../popper/context';
import { useForwardElement, useRovingFocusGroupItem } from '../../composables';
import Button from '../button/button.vue';
import { MenuAnchor } from '../menu';
import type { PopperTriggerProps } from '../popper/types';
import { usePopperTrigger } from '../popper/use-popper-trigger';
import { isTriggerLink } from './shared';
import { useMenubarCollectionItem, useMenubarMenuContext, useMenubarRootContext, useMenubarUi } from './context';
import type { MenubarTriggerProps } from './types';

defineOptions({
  name: 'MenubarTrigger'
});

const props = defineProps<MenubarTriggerProps>();

const {
  isLinkTriggerHovered,
  modelValue,
  onMenuClose,
  onMenuOpen,
  onMenuToggle,
  setTriggerLink,
  hoverable,
  delayDuration,
  skipDelayDuration
} = useMenubarRootContext('MenubarTrigger');
const {
  value,
  triggerId,
  contentId,
  triggerElement: menuTriggerElement,
  wasKeyboardTriggerOpen,
  open
} = useMenubarMenuContext('MenubarTrigger');

const popperContext = usePopperRootContext('MenubarTrigger');

const cls = useMenubarUi('trigger');

// Register with the root roving focus group (Left/Right navigation across triggers) and expose
// the collection item + roving-focus data attributes (alongside `data-vean-menubar-trigger`)
// via the returned `itemProps`.
const { itemProps, setItemElement: setRovingItemElement } = useRovingFocusGroupItem({
  tabStopId: computed(() => String(value.value)),
  focusable: computed(() => !props.disabled)
});
const { onItemElementChange } = useMenubarCollectionItem(() => ({ value: value.value }));

const [triggerElement, setTriggerElement] = useForwardElement(element => {
  menuTriggerElement.value = element;
  setRovingItemElement(element);
  onItemElementChange(element);
});

const triggerBindings = computed(() => ({ ...props, ...itemProps.value }));

const isFocused = shallowRef(false);
// Whether the open menu was switched to this trigger by the current pointer
// approach (pointerenter). Distinguishes "click confirms a hover switch" from
// "click toggles the menu closed".
const hoverSwitched = shallowRef(false);
const isCurrentTriggerLink = () => isTriggerLink(triggerElement.value);

// All hover timing (open delay, skip-delay window) runs on the shared Popper trigger
// machine; sibling coordination comes from the delay group provided by `MenubarRoot`.
// Link triggers disable the machine — they never open a menu.
const isLink = computed(() => isTriggerLink(triggerElement.value));

const shellTriggerProps: PopperTriggerProps = reactive({
  get trigger() {
    return hoverable.value ? 'hover' : 'click';
  },
  get openDelay() {
    return delayDuration.value;
  },
  closeDelay: 0,
  focusOpenDelay: 0,
  get skipDelayDuration() {
    return skipDelayDuration.value;
  },
  // Menubar triggers never open on focus; keyboard opens are explicit (Enter/Space/ArrowDown).
  openOnFocus: false,
  get disabled() {
    return Boolean(props.disabled) || isLink.value;
  }
});

const { onPointerEnter: onMachinePointerEnter, onPointerLeave: onMachinePointerLeave } = usePopperTrigger(
  shellTriggerProps,
  popperContext,
  { onVirtualPointChange: () => {} }
);

const onPointerDown = (event: PointerEvent) => {
  if (props.disabled || event.button !== 0 || event.ctrlKey) {
    return;
  }

  if (isCurrentTriggerLink()) {
    setTriggerLink();
    return;
  }

  // In hover mode the menu is opened on hover, not on click.
  if (hoverable.value) return;

  const wasOpen = open.value;
  const switchedByHover = hoverSwitched.value;
  hoverSwitched.value = false;

  // Toggle: clicking the trigger of an already-open menu closes it, unless the
  // pointer approach just switched the open menu here (then the click confirms
  // the switch and keeps the menu open).
  if (wasOpen && !switchedByHover) {
    onMenuClose();
    return;
  }

  onMenuOpen(value.value);

  if (!wasOpen) {
    event.preventDefault();
  }
};

const onPointerEnter = (event: PointerEvent) => {
  onMachinePointerEnter(event);

  if (props.disabled) return;

  // Link triggers never open a menu; hovering them closes the open menu so the
  // link can be navigated.
  if (isCurrentTriggerLink()) {
    if (modelValue.value || isLinkTriggerHovered.value) {
      setTriggerLink();
      triggerElement.value?.focus();
    }
    return;
  }

  if (open.value) return;

  if (hoverable.value) {
    // Hover-mode opening runs on the Popper machine; focus the trigger so the
    // roving-focus highlight follows the pointer.
    triggerElement.value?.focus();
  } else if (modelValue.value || isLinkTriggerHovered.value) {
    // Click mode: switching between triggers only happens once a menu is open.
    // Remember that this approach switched the open menu here so the following
    // pointerdown keeps the switched-to menu open instead of toggling it off.
    if (modelValue.value && modelValue.value !== value.value) {
      hoverSwitched.value = true;
    }
    onMenuOpen(value.value);
    triggerElement.value?.focus();
  }
};

const onPointerLeave = (event: PointerEvent) => {
  onMachinePointerLeave(event);
};

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
};

const onKeyDown = (event: KeyboardEvent) => {
  if (props.disabled || isCurrentTriggerLink()) return;

  if (['Enter', ' '].includes(event.key)) {
    onMenuToggle(value.value);
  }

  if (event.key === 'ArrowDown') {
    onMenuOpen(value.value);
  }

  // prevent keydown from scrolling window / first focused item to execute
  // that keydown (inadvertently closing the menu)
  if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
    wasKeyboardTriggerOpen.value = true;
    event.preventDefault();
  }
};
</script>

<template>
  <MenuAnchor as-child>
    <Button
      v-bind="triggerBindings"
      :id="triggerId"
      :ref="setTriggerElement"
      data-vean-menubar-trigger
      :class="cls"
      :aria-controls="open ? contentId : undefined"
      :aria-expanded="open"
      aria-haspopup="menu"
      :data-highlighted="isFocused ? '' : undefined"
      :data-state="open ? 'open' : 'closed'"
      :data-value="value"
      :disabled="disabled"
      role="menuitem"
      @pointerdown="onPointerDown"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
      @keydown.enter.space.arrow-down="onKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <slot />
    </Button>
  </MenuAnchor>
</template>
