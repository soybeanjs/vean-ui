<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { NavMenuCompact, provideNavMenuUi } from '@vean/aria/nav-menu';
import { keysOf } from '@vean/aria/shared';
import { navMenuVariants } from '@/styles/nav-menu';
import type { NavMenuProps, NavMenuEmits, NavMenuSlots } from './types';

defineOptions({
  name: 'SNavMenu'
});

const props = defineProps<NavMenuProps>();

const emit = defineEmits<NavMenuEmits>();

const slots = defineSlots<NavMenuSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => navMenuVariants({ size: props.size }, props.ui, { root: props.class }));

provideNavMenuUi(ui);
</script>

<template>
  <NavMenuCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </NavMenuCompact>
</template>
