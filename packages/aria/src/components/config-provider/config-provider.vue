<script setup lang="ts">
import { shallowReadonly } from 'vue';
import { provideConfigProviderContext } from './context';
import type { ConfigProviderProps } from './types';

defineOptions({
  name: 'ConfigProvider'
});

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  locale: 'en',
  nonce: undefined
});

// Shallow readonly keeps nested sections (e.g. `tooltip` config) assignable to their prop
// types; a deep `readonly` would freeze nested objects into incompatible DeepReadonly shapes.
provideConfigProviderContext(shallowReadonly(props));
</script>

<template>
  <slot />
</template>
