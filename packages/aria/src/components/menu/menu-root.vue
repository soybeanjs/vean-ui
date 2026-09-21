<script setup lang="ts">
import { toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useIsUsingKeyboard } from '../../composables';
import { PopperRoot } from '../popper';
import { provideMenuContext, provideMenuRootContext } from './context';
import type { MenuRootProps, MenuRootEmits } from './types';

defineOptions({
  name: 'MenuRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<MenuRootProps>(), {
  open: undefined,
  modal: true
});

const emit = defineEmits<MenuRootEmits>();

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const dir = useDirection(() => props.dir);

const isUsingKeyboard = useIsUsingKeyboard();

const onClose = () => {
  open.value = false;
};

provideMenuContext({
  dir,
  open,
  isRoot: true
});

function onUpdateOpen(value: boolean) {
  open.value = value;
  emit('update:open', value);
}

provideMenuRootContext({
  ...toContext(props, ['modal']),
  dir,
  onClose,
  isUsingKeyboard
});
</script>

<template>
  <PopperRoot :dir="dir" :modal="modal" :open="open" :default-open="defaultOpen" @update:open="onUpdateOpen">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopperRoot>
</template>
