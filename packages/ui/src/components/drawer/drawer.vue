<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { DrawerCompact, provideDrawerUi } from '@vean/aria/drawer';
import { keysOf } from '@vean/aria/shared';
import { drawerVariants } from '@/styles/drawer';
import type { DrawerProps, DrawerEmits, DrawerSlots } from './types';

defineOptions({
  name: 'SDrawer'
});

const props = withDefaults(defineProps<DrawerProps>(), {
  open: undefined,
  // Must stay `undefined` — a cast `false` would travel down to `DialogRoot` as a
  // controlled fullscreen value and freeze the state (see headless `DrawerRoot`).
  fullscreen: undefined,
  modal: true,
  dismissible: true,
  showClose: true,
  showConfirm: true
});

const emit = defineEmits<DrawerEmits>();

const slots = defineSlots<DrawerSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => drawerVariants({ size: props.size, side: props.side }, props.ui, { popup: props.class }));

provideDrawerUi(ui);
</script>

<template>
  <DrawerCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DrawerCompact>
</template>
