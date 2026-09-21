<script setup lang="ts">
import { toContext } from '../../shared';
import { useControllableState, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { provideCollapsibleRootContext, useCollapsibleUi } from './context';
import type { CollapsibleRootProps, CollapsibleRootEmits } from './types';

defineOptions({
  name: 'CollapsibleRoot'
});

const props = withDefaults(defineProps<CollapsibleRootProps>(), {
  open: undefined,
  defaultOpen: false,
  unmountOnHide: true
});

const emit = defineEmits<CollapsibleRootEmits>();

const forwardedProps = useOmitProps(props, ['open', 'defaultOpen', 'disabled', 'unmountOnHide']);

const cls = useCollapsibleUi('root');

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const { dataDisabled, dataState } = provideCollapsibleRootContext({
  open,
  ...toContext(props, ['disabled', 'unmountOnHide'])
});

defineExpose({
  open
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    data-vean-collapsible-root
    :class="cls"
    :data-disabled="dataDisabled"
    :data-state="dataState"
  >
    <slot :open="open" />
  </Primitive>
</template>
