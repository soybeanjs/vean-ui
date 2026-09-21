<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { PopoverCompact, providePopoverUi } from '@vean/aria/popover';
import { keysOf } from '@vean/aria/shared';
import { popoverVariants } from '@/styles/popover';
import type { PopoverProps, PopoverEmits, PopoverSlots } from './types';

defineOptions({
  name: 'SPopover'
});

const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  defaultOpen: false,
  showArrow: true
});

const emit = defineEmits<PopoverEmits>();

const slots = defineSlots<PopoverSlots>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => popoverVariants({ size: props.size }, props.ui, { popup: props.class }));

providePopoverUi(ui);
</script>

<template>
  <PopoverCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <!-- @vue-expect-error ignore slot type error -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </PopoverCompact>
</template>
