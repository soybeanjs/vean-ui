<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { DialogCompact, provideDialogUi } from '@vean/aria/dialog';
import { keysOf } from '@vean/aria/shared';
import { dialogVariants } from '@/styles/dialog';
import type { DialogProps, DialogEmits, DialogSlots } from './types';

defineOptions({
  name: 'SDialog'
});

const props = withDefaults(defineProps<DialogProps>(), {
  open: undefined,
  fullscreen: undefined,
  modal: true,
  showClose: true,
  showFullscreen: false
});

const emit = defineEmits<DialogEmits>();

const slots = defineSlots<DialogSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  dialogVariants(
    {
      size: props.size,
      pure: props.pure
    },
    props.ui,
    { popup: props.class }
  )
);

provideDialogUi(ui);
</script>

<template>
  <DialogCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DialogCompact>
</template>
