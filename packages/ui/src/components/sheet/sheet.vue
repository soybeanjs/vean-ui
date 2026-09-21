<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { DialogCompact, provideDialogUi } from '@vean/aria/dialog';
import { keysOf } from '@vean/aria/shared';
import { sheetVariants } from '@/styles/sheet';
import type { SheetProps, SheetEmits, SheetSlots } from './types';

defineOptions({
  name: 'SSheet'
});

const props = withDefaults(defineProps<SheetProps>(), {
  open: undefined,
  // `undefined` is load-bearing, not decoration: without an explicit default Vue
  // casts the absent Boolean prop to `false`, and `DialogRoot` would then read
  // `fullscreen` as a *controlled* `false` — the toggle would emit
  // `update:fullscreen` and never change the rendered state. Declaring the
  // default keeps the prop `undefined`, which is what selects the uncontrolled
  // branch. `SDialog` declares the same default for the same reason.
  fullscreen: undefined,
  modal: true,
  showClose: true
});

const emit = defineEmits<SheetEmits>();

const slots = defineSlots<SheetSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => sheetVariants({ size: props.size, side: props.side }, props.ui, { popup: props.class }));

provideDialogUi(ui);
</script>

<template>
  <DialogCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DialogCompact>
</template>
