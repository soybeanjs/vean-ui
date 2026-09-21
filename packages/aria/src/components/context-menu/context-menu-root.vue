<script setup lang="ts">
import { ref, watch } from 'vue';
import { toContext } from '../../shared';
import { MenuRoot } from '../menu';
import { provideContextMenuRootContext } from './context';
import type { ContextMenuRootProps, ContextMenuRootEmits } from './types';

defineOptions({
  name: 'ContextMenuRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ContextMenuRootProps>(), {
  modal: true,
  pressOpenDelay: 700
});

const emit = defineEmits<ContextMenuRootEmits>();

const open = ref(false);

watch(open, value => {
  emit('update:open', value);
});

provideContextMenuRootContext(toContext(props, ['pressOpenDelay']));
</script>

<template>
  <MenuRoot v-model:open="open" :dir="dir" :modal="modal">
    <slot :open="open" />
  </MenuRoot>
</template>
