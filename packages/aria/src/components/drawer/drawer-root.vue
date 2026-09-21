<script setup lang="ts">
import { computed, toRefs, watch } from 'vue';
import { useControllableState } from '../../composables';
import { DialogRoot } from '../dialog';
import { provideDrawerRootContext } from './context';
import type { DrawerRootProps, DrawerRootEmits, DrawerRootSlots } from './types';

defineOptions({
  name: 'DrawerRoot'
});

const props = withDefaults(defineProps<DrawerRootProps>(), {
  open: undefined,
  defaultOpen: undefined,
  // `undefined` is load-bearing: Vue casts an absent Boolean prop to `false`, and
  // the template hands this straight to `DialogRoot`, whose `useControllableState`
  // reads any defined value as *controlled*. Without the explicit default the
  // drawer would pin the fullscreen state to `false` and neither `fullscreen` nor
  // a toggle rendered inside the drawer could ever change it.
  fullscreen: undefined,
  fixed: undefined,
  dismissible: true,
  snapPoint: undefined,
  defaultSnapPoint: undefined,
  snapPoints: undefined,
  snapToSequentialPoints: false,
  swipeDirection: undefined,
  closeThreshold: 0.25,
  nested: false,
  modal: true,
  side: 'bottom',
  handleOnly: false
});

const emit = defineEmits<DrawerRootEmits>();

defineSlots<DrawerRootSlots>();

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen ?? false
);

/**
 * The drawer owns the fullscreen state instead of leaving it to the dialog: the
 * snap machinery in the context has to react to it, and a context consumer sits
 * *below* `DialogRoot`, where the dialog's own uncontrolled state is out of
 * reach. `DialogRoot` is therefore always bound to this value.
 */
const fullscreen = useControllableState(
  () => props.fullscreen,
  value => {
    emit('update:fullscreen', value);
  },
  props.defaultFullscreen ?? false
);

const snapPoints = computed(() => props.snapPoints);

const defaultSnapPoint = computed(() => props.defaultSnapPoint ?? props.snapPoints?.[0] ?? null);

const snapPoint = useControllableState(
  () => props.snapPoint,
  value => {
    emit('update:snapPoint', value);
  },
  defaultSnapPoint.value
);

/**
 * Open-state requests branch on controlled mode: a controlled drawer reports
 * the intent via `update:open` and waits for the parent, an uncontrolled one
 * flips the internal state directly. Shared by the dialog wiring and the
 * swipe area's open gesture, so both respect the same contract.
 */
function requestOpenState(openState: boolean) {
  if (props.open !== undefined) {
    emit('update:open', openState);
    return;
  }

  open.value = openState;
}

/**
 * The same controlled/uncontrolled split for the fullscreen toggle the dialog
 * renders: it asks the drawer root to change, and the root either reports the
 * intent upwards or adopts it.
 */
function requestFullscreenState(fullscreenState: boolean) {
  if (props.fullscreen !== undefined) {
    emit('update:fullscreen', fullscreenState);
    return;
  }

  fullscreen.value = fullscreenState;
}

const emitHandlers = {
  emitDrag: (percentageDragged: number) => emit('drag', percentageDragged),
  emitRelease: (openState: boolean) => emit('release', openState),
  emitClose: () => emit('close'),
  emitOpenChange: requestOpenState,
  emitSnapPointChange: (value: DrawerRootProps['snapPoint']) => {
    emit('update:snapPoint', value ?? null);
  }
};

const { isOpen, closeDrawer } = provideDrawerRootContext({
  ...emitHandlers,
  ...toRefs(props),
  open,
  fullscreen,
  snapPoints,
  snapPoint,
  defaultSnapPoint
});

function handleOpenChange(openState: boolean) {
  requestOpenState(openState);
}

// An uncontrolled fullscreen session must not leak into the next open, matching
// the dialog's own reset. It runs on reopen rather than on close so the exit
// animation keeps the fullscreen surface until the popup unmounts.
watch(isOpen, value => {
  if (value && props.fullscreen === undefined) {
    fullscreen.value = props.defaultFullscreen ?? false;
  }
});
</script>

<template>
  <!--
 The dialog binds the internal `isOpen` mirror: swipe dismissal closes the
       drawer immediately, in uncontrolled mode too, without waiting for a
       parent `update:open` round-trip. 
-->
  <DialogRoot
    :open="isOpen"
    :modal="modal"
    :fullscreen="fullscreen"
    @update:open="handleOpenChange"
    @update:fullscreen="requestFullscreenState"
  >
    <slot :open="isOpen" :close="closeDrawer" />
  </DialogRoot>
</template>
