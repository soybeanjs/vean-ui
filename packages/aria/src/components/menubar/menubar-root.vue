<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useForwardElement, useOmitProps, useRovingFocusGroup } from '../../composables';
import type { VNodeRef } from '../../types';
import { providePopperDelayGroup } from '../popper';
import { Primitive } from '../primitive';
import { provideMenubarCollectionContext, provideMenubarRootContext, useMenubarUi } from './context';
import type { MenubarRootProps, MenubarRootEmits } from './types';

defineOptions({
  name: 'MenubarRoot'
});

const props = withDefaults(defineProps<MenubarRootProps>(), {
  loop: false,
  modelValue: undefined,
  trigger: 'click',
  delayDuration: 150,
  skipDelayDuration: 300
});

const emit = defineEmits<MenubarRootEmits>();

const cls = useMenubarUi('root');

const forwardedProps = useOmitProps(props, [
  'class',
  'modelValue',
  'defaultValue',
  'dir',
  'loop',
  'trigger',
  'delayDuration',
  'skipDelayDuration'
]);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? ''
);

const currentTabStopId = shallowRef<string | null>(null);

const dir = useDirection(() => props.dir);

// Sibling menus share one skip-delay window (the FloatingDelayGroup pattern): while a menu is
// open — or within `skipDelayDuration` after the last one closed — hovering another trigger
// opens it instantly instead of after `delayDuration`.
providePopperDelayGroup({
  skipDelayDuration: computed(() => props.skipDelayDuration)
});

provideMenubarRootContext({
  modelValue,
  currentTabStopId,
  ...toContext(props, ['dir', 'loop', 'trigger', 'delayDuration', 'skipDelayDuration'])
});

const { onContainerElementChange } = provideMenubarCollectionContext();

// The root row is a roving focus group: Left/Right (and Home/End) move focus across the
// root triggers; the open content is focused by the kernel menu when it mounts. The group
// shares `currentTabStopId` with the menubar context so opening a menu also re-anchors the
// tab stop onto its trigger.
const { setContainerElement, groupProps } = useRovingFocusGroup({
  orientation: computed(() => 'horizontal' as const),
  dir,
  loop: computed(() => props.loop ?? false),
  currentTabStopId: computed(() => currentTabStopId.value),
  onUpdateCurrentTabStopId: value => {
    currentTabStopId.value = value ?? null;
  },
  defaultCurrentTabStopId: computed(() => ''),
  preventScrollOnEntryFocus: computed(() => false)
});

const [_, setRootElement] = useForwardElement(onContainerElementChange);

function setRootRef(nodeRef: VNodeRef) {
  setContainerElement(nodeRef);
  setRootElement(nodeRef);
}

const rootBindings = computed(() => ({ ...forwardedProps.value, ...groupProps.value }));
</script>

<template>
  <Primitive
    v-bind="rootBindings"
    :ref="setRootRef"
    :as="as"
    :as-child="asChild"
    data-vean-menubar-root
    :class="cls"
    role="menubar"
    :dir="dir"
  >
    <slot :model-value="modelValue" />
  </Primitive>
</template>
