<script setup lang="ts">
import { computed, onWatcherCleanup, watchEffect } from 'vue';
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import { isBrowser } from '../../shared';
import { useForwardElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { usePopperRootContext, usePopperUi } from './context';
import type { PopperTriggerProps } from './types';
import { usePopperTrigger } from './use-popper-trigger';

defineOptions({
  name: 'PopperTrigger'
});

const props = withDefaults(defineProps<PopperTriggerProps>(), {
  as: 'button',
  trigger: 'click',
  openOnFocus: undefined,
  ariaMode: 'controls'
});

const forwardedProps = useOmitProps(props, [
  'id',
  'class',
  'trigger',
  'reference',
  'openDelay',
  'closeDelay',
  'skipDelayDuration',
  'pressOpenDelay',
  'openOnFocus',
  'focusVisibleOnly',
  'focusOpenDelay',
  'ariaMode',
  'disabled',
  'type'
]);

const cls = usePopperUi('trigger');
const anchorCls = usePopperUi('anchor');
const context = usePopperRootContext('PopperTrigger');
const {
  open,
  dataState,
  disabled,
  hasCustomAnchor,
  popupId,
  triggerId,
  dir,
  onTriggerElementChange,
  onAnchorElementChange,
  requestPositionerUpdate
} = context;

const [_, setTriggerElement] = useForwardElement(onTriggerElementChange);
const [__, setAnchorElement] = useForwardElement(el => {
  // The trigger element doubles as the anchor unless a custom `PopperAnchor` or an explicit
  // reference takes over.
  if (hasCustomAnchor.value || props.reference || props.trigger === 'contextmenu') return;

  onAnchorElementChange(el);
});

// The Aria `PopperAnchor` used to set the anchor on the same node as the trigger; alias both
// refs so the trigger element doubles as the anchor when there is no custom `PopperAnchor`.
function setTriggerAnchorRef(node: Element | ComponentPublicInstance | null | undefined) {
  setTriggerElement(node as HTMLElement | undefined);
  setAnchorElement(node as HTMLElement | undefined);
}

const {
  reference,
  onBlur,
  onClick,
  onContextMenu,
  onFocus,
  onPointerCancel,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  onPointerUp
} = usePopperTrigger(props, context, { onVirtualPointChange: requestPositionerUpdate });

// When `reference` is a real element, the trigger events live on that element and the inline
// trigger element is not rendered (e.g. `ContextMenuTrigger` wrapping an external area).
const externalReference = computed(() =>
  isBrowser && props.reference instanceof HTMLElement ? props.reference : undefined
);

// Bind only the events a trigger mode can actually act on: click/contextmenu toggling, hover
// enter/leave (the pointer-inside state only feeds the hover close machine), the contextmenu
// touch long-press, and focus-driven opening behind `openOnFocus`. The `never` parameter type
// accepts every concrete DOM event handler signature (contravariance).
type NativeEventHandler = (event: never) => void;

const openOnFocusResolved = computed(() => props.openOnFocus ?? props.trigger === 'hover');

const triggerEvents = computed<Record<string, NativeEventHandler>>(() => {
  const events: Record<string, NativeEventHandler> = {};

  if (props.trigger === 'click') {
    events.click = onTriggerClick;
  }

  if (props.trigger === 'contextmenu') {
    events.contextmenu = onContextMenu;
    events.pointermove = onPointerMove;
    events.pointerdown = onPointerDown;
    events.pointerup = onPointerUp;
    events.pointercancel = onPointerCancel;
  }

  if (props.trigger === 'hover') {
    events.pointerenter = onPointerEnter;
    events.pointerleave = onPointerLeave;
  }

  if (openOnFocusResolved.value) {
    events.focus = onFocus;
    events.blur = onBlur;
    events.pointerdown = onPointerDown;
    events.pointerup = onPointerUp;
    events.pointercancel = onPointerCancel;
  }

  return events;
});

// The modal layer disables body pointer events while open; the contextmenu trigger must stay
// interactive so repeated right-clicks keep reaching it and can reposition the popup.
const triggerStyle = computed<CSSProperties | undefined>(() =>
  props.trigger === 'contextmenu' ? { WebkitTouchCallout: 'none', pointerEvents: 'auto' } : undefined
);

const ariaBindings = computed(() => {
  if (props.ariaMode === 'describedby') {
    return { 'aria-describedby': open.value ? popupId.value : undefined };
  }

  if (props.ariaMode === 'none') {
    return {};
  }

  return {
    'aria-expanded': open.value,
    'aria-controls': open.value ? popupId.value : undefined
  };
});

// A single merged binding: Vue templates do not allow two `v-bind` object expressions on one
// element, and the explicit bindings below must win over forwarded prop values.
const triggerBindings = computed(() => ({ ...forwardedProps.value, ...ariaBindings.value }));

// Button semantics kept inline now that the trigger renders a plain `Primitive` (native disabled
// only on real buttons, `type` default, disabled click interception).
const buttonType = computed(() => (props.as === 'button' && !props.asChild ? (props.type ?? 'button') : undefined));
const nativeDisabled = computed(() => (props.as === 'button' && !props.asChild ? disabled.value : undefined));
const ariaDisabled = computed(() => (disabled.value ? true : undefined));

function onTriggerClick(event: PointerEvent) {
  if (disabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  onClick(event);
}

// Anchor priority: custom `PopperAnchor` > contextmenu virtual point > `reference` prop >
// trigger element (registered by `setTriggerAnchorRef` above). The contextmenu virtual reference
// is a stable object, so this registers once per layer; repeated right-clicks reposition through
// `requestPositionerUpdate` instead of re-registering the anchor.
watchEffect(() => {
  if (hasCustomAnchor.value) return;

  if (props.trigger === 'contextmenu') {
    onAnchorElementChange(reference.value);
  } else if (props.reference) {
    onAnchorElementChange(props.reference);
  }
});

watchEffect(() => {
  const target = externalReference.value;
  if (!target) return;

  onTriggerElementChange(target);
  const events = triggerEvents.value;
  for (const [name, handler] of Object.entries(events)) {
    target.addEventListener(name, handler as EventListener);
  }

  onWatcherCleanup(() => {
    for (const [name, handler] of Object.entries(events)) {
      target.removeEventListener(name, handler as EventListener);
    }
  });
});
</script>

<template>
  <Primitive
    v-if="!externalReference"
    :id="triggerId"
    :ref="setTriggerAnchorRef"
    v-bind="triggerBindings"
    :class="hasCustomAnchor ? cls : [anchorCls, cls]"
    :dir="dir"
    :style="triggerStyle"
    data-vean-popper-trigger
    data-grace-area-trigger
    :data-state="dataState"
    :data-disabled="disabled ? '' : undefined"
    :disabled="nativeDisabled"
    :aria-disabled="ariaDisabled"
    :type="buttonType"
    v-on="triggerEvents"
  >
    <slot />
  </Primitive>
</template>
