<script setup lang="ts">
import { computed } from 'vue';
import { useControllableState } from '../../composables';
import { PopperSub } from '../popper';
import { provideMenuContext, useMenuContext } from './context';
import type { MenuSubProps, MenuSubEmits } from './types';

defineOptions({
  name: 'MenuSub',
  inheritAttrs: false
});

const props = withDefaults(defineProps<MenuSubProps>(), {
  open: undefined
});

const emit = defineEmits<MenuSubEmits>();

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const parentContext = useMenuContext('MenuSub');

const dir = computed(() => parentContext.dir.value);

// Parent-close cascading lives on the Popper nesting stack (closeDescendants).
provideMenuContext({
  dir,
  open
});

function onUpdateOpen(value: boolean) {
  open.value = value;
  emit('update:open', value);
}
</script>

<template>
  <PopperSub :open="open" :default-open="defaultOpen" @update:open="onUpdateOpen">
    <slot />
  </PopperSub>
</template>
