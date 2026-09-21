<script setup lang="ts">
import { useOmitProps, useForwardListeners } from '@vean/aria/composables';
import { DropdownMenuWrapperCompact } from '@vean/aria/dropdown-menu';
import { provideMenuUi } from '../menu/context';
import type { DropdownMenuWrapperProps, DropdownMenuWrapperEmits } from './types';

defineOptions({
  name: 'SDropdownMenuWrapper'
});

const props = withDefaults(defineProps<DropdownMenuWrapperProps>(), {
  open: undefined,
  modal: true
});

const emit = defineEmits<DropdownMenuWrapperEmits>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'indicatorPosition']);

const listeners = useForwardListeners(emit);

provideMenuUi(() => props);
</script>

<template>
  <DropdownMenuWrapperCompact v-bind="forwardedProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <slot />
  </DropdownMenuWrapperCompact>
</template>
