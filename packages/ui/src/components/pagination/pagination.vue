<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps, useForwardListeners } from '@vean/aria/composables';
import { PaginationCompact, providePaginationUi } from '@vean/aria/pagination';
import { keysOf } from '@vean/aria/shared';
import { paginationVariants } from '@/styles/pagination';
import type { PaginationProps, PaginationEmits, PaginationSlots } from './types';

defineOptions({
  name: 'SPagination'
});

const props = withDefaults(defineProps<PaginationProps>(), {
  showFirstOrLast: true
});

const emit = defineEmits<PaginationEmits>();

const slots = defineSlots<PaginationSlots>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size', 'variant', 'shape', 'actionVariant']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  paginationVariants(
    {
      size: props.size,
      variant: props.variant,
      shape: props.shape,
      actionVariant: props.actionVariant
    },
    props.ui,
    { root: props.class }
  )
);

providePaginationUi(ui);
</script>

<template>
  <PaginationCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]>
      <slot :name="slotName" />
    </template>
  </PaginationCompact>
</template>
