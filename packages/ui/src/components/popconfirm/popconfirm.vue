<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { PopconfirmCompact, providePopconfirmUi } from '@vean/aria/popconfirm';
import { keysOf } from '@vean/aria/shared';
import { popconfirmVariants } from '@/styles/popconfirm';
import type { PopconfirmProps, PopconfirmEmits, PopconfirmSlots } from './types';

defineOptions({
  name: 'SPopconfirm'
});

const props = withDefaults(defineProps<PopconfirmProps>(), {
  open: undefined,
  showArrow: true,
  showIcon: true,
  showCancel: 'onlyWarning'
});

const emit = defineEmits<PopconfirmEmits>();

const slots = defineSlots<PopconfirmSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = keysOf(slots);

const ui = computed(() => popconfirmVariants({ size: props.size, type: props.type }, props.ui, { popup: props.class }));

providePopconfirmUi(ui);
</script>

<template>
  <PopconfirmCompact v-bind="forwardedProps" :cancel-props="cancelProps" :confirm-props="confirmProps" v-on="listeners">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </PopconfirmCompact>
</template>
