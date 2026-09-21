<script setup lang="ts">
import { computed } from 'vue';
import { toContext } from '../../shared';
import { useControllableState } from '../../composables';
import { MenuRoot } from '../menu';
import { provideDropdownMenuRootContext } from './context';
import type { DropdownMenuRootProps, DropdownMenuRootEmits } from './types';

defineOptions({
  name: 'DropdownMenuRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<DropdownMenuRootProps>(), {
  open: undefined,
  modal: true,
  trigger: 'click',
  delayDuration: 150,
  skipDelayDuration: 300
});

const emit = defineEmits<DropdownMenuRootEmits>();

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const hoverable = computed(() => props.trigger === 'hover');

const modal = computed(() => props.modal && props.trigger !== 'hover');

provideDropdownMenuRootContext({
  ...toContext(props, ['dir', 'trigger', 'delayDuration', 'skipDelayDuration']),
  hoverable,
  modal
});
</script>

<template>
  <MenuRoot v-model:open="open" :default-open="defaultOpen" :dir="dir" :modal="modal">
    <slot :open="open" />
  </MenuRoot>
</template>
