<script setup lang="ts" generic="T extends BreadcrumbOptionData = BreadcrumbOptionData">
import { computed } from 'vue';
import { BreadcrumbCompact, provideBreadcrumbUi } from '@vean/aria/breadcrumb';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { breadcrumbVariants } from '@/styles/breadcrumb';
import type { BreadcrumbProps, BreadcrumbEmits, BreadcrumbOptionData, BreadcrumbSlots } from './types';

defineOptions({
  name: 'SBreadcrumb'
});

const props = defineProps<BreadcrumbProps<T>>();

const emit = defineEmits<BreadcrumbEmits<T>>();

const slots = defineSlots<BreadcrumbSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => breadcrumbVariants({ size: props.size }, props.ui, { root: props.class }));

provideBreadcrumbUi(ui);
</script>

<template>
  <BreadcrumbCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <!-- @vue-ignore ignore vue slot props type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </BreadcrumbCompact>
</template>
