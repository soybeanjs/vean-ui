<script setup lang="ts">
import { computed, shallowRef, watchEffect } from 'vue';
import { toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { providePopperRootContext } from '../popper/context';
import { useControllableState, useForwardElement } from '../../composables';
import type { PopperOpenChangeReason } from '../popper/types';
import { usePopperNesting } from '../popper/use-popper-nesting';
import { provideCollectionContext, provideNavMenuRootContext, useNavMenuUi } from './context';
import type { NavMenuRootProps, NavMenuRootEmits } from './types';

defineOptions({
  name: 'NavMenuRoot'
});

const props = withDefaults(defineProps<NavMenuRootProps>(), {
  orientation: 'horizontal',
  delayDuration: 200,
  skipDelayDuration: 300
});

const emit = defineEmits<NavMenuRootEmits>();

const cls = useNavMenuUi('root');

const dir = useDirection(() => props.dir);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value!);
  },
  props.defaultValue ?? ''
);

const { rootElement, onRootElementChange, onActiveTriggerElementChange, pendingValue, onItemSelect, onItemDismiss } =
  provideNavMenuRootContext({
    isRoot: true,
    modelValue,
    dir,
    ...toContext(props, [
      'orientation',
      'skipDelayDuration',
      'delayDuration',
      'disableClickTrigger',
      'disableHoverTrigger',
      'disablePointerLeaveClose'
    ])
  });

const { onContainerElementChange, getOrderedElements } = provideCollectionContext();

const [_, setRootElement] = useForwardElement(el => {
  onRootElementChange(el);
  onContainerElementChange(el);
});

// A single shared Popper hover root: `open` mirrors the shared model value, the shared
// viewport is its positioner, and the hover machine opens the value of the most recently
// hovered trigger (`pendingValue` routing replaces per-item roots).
const popperContext = providePopperRootContext({
  open: useControllableState(
    () => modelValue.value !== '',
    isOpen => {
      if (isOpen) onItemSelect(pendingValue.value);
      else onItemDismiss();
    },
    false
  ),
  reason: shallowRef<PopperOpenChangeReason>('imperative'),
  dir,
  modal: computed(() => false),
  disabled: computed(() => false),
  parent: undefined,
  onOpenChange: (isOpen: boolean) => {
    if (isOpen) onItemSelect(pendingValue.value);
    else onItemDismiss();
  }
});

// Configure the shared hover machine once: open delay, skip-delay window and close delay all
// live here. When hover is disabled the machine is click-driven (hover-open is gated by the
// trigger handlers anyway) so the viewport's hover corridor stays off.
usePopperNesting(popperContext);

popperContext.configureTrigger({
  type: props.disableHoverTrigger ? 'click' : 'hover',
  openDelay: props.delayDuration,
  focusOpenDelay: 0,
  closeDelay: props.disablePointerLeaveClose ? 150 : 0,
  skipDelayDuration: props.skipDelayDuration,
  pressOpenDelay: 700,
  openOnFocus: false,
  disabled: false
});

// The whole nav is the shared grace anchor, so leaving a trigger defers to the viewport
// corridor; `disablePointerLeaveClose` skips it (then leaving a trigger closes right away).
watchEffect(() => {
  popperContext.onGraceTriggerElementChange(props.disablePointerLeaveClose ? undefined : rootElement.value);
});

watchEffect(() => {
  if (!modelValue.value) return;

  const activeEl = getOrderedElements().find(el => el.id.includes(modelValue.value!));

  if (activeEl) {
    onActiveTriggerElementChange(activeEl);
  }
});
</script>

<template>
  <nav :ref="setRootElement" data-vean-nav-menu :class="cls" :data-orientation="orientation" :dir="dir">
    <slot :model-value="modelValue" />
  </nav>
</template>
