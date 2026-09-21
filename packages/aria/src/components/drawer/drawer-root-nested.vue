<script setup lang="ts">
import { watch } from 'vue';
import { useForwardListeners } from '../../composables';
import { useDrawerRootContext } from './context';
import DrawerRoot from './drawer-root.vue';
import type { DrawerRootProps, DrawerRootEmits } from './types';

defineOptions({
  name: 'DrawerRootNested'
});

const props = withDefaults(defineProps<DrawerRootProps>(), {
  // The whole prop object is forwarded to `DrawerRoot`, so this layer needs the
  // same explicit `undefined`: a cast `false` would make the nested drawer's
  // fullscreen state controlled (see `DrawerRoot`).
  fullscreen: undefined
});

const emit = defineEmits<DrawerRootEmits>();

const listeners = useForwardListeners(emit);

const { onNestedDrag, onNestedOpenChange, onNestedRelease } = useDrawerRootContext('DrawerRootNested');

function onClose() {
  onNestedOpenChange(false);
}

function onDrag(p: number) {
  onNestedDrag(p);
}

function onOpenChange(o: boolean) {
  if (o) onNestedOpenChange(o);
}

// A child opened through a controlled `open` prop never flows through the
// dialog's `update:open`, so the parent scale would stay untouched; watch the
// prop directly to cover that path too.
watch(
  () => props.open,
  value => {
    if (value) onNestedOpenChange(true);
  }
);
</script>

<template>
  <DrawerRoot
    v-slot="slotProps"
    v-bind="props"
    nested
    v-on="listeners"
    @close="onClose"
    @drag="onDrag"
    @release="onNestedRelease"
    @update:open="onOpenChange"
  >
    <slot v-bind="slotProps" />
  </DrawerRoot>
</template>
