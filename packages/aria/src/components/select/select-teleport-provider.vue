<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { provideSelectContentContext, useSelectRootContext } from './context';
import type { SelectTeleportProviderProps } from './types';

defineOptions({
  name: 'SelectTeleportProvider'
});

const props = defineProps<SelectTeleportProviderProps>();

const { modelValue, isMultiple } = useSelectRootContext('SelectTeleportProvider');

provideSelectContentContext({
  search: shallowRef(''),
  position: computed(() => props.position),
  modelValue,
  isMultiple,
  popupElement: computed(() => props.popupElement)
});
</script>

<template>
  <slot />
</template>
