<script setup lang="ts">
import { provideAvatarRootContext, useAvatarUi } from './context';
import type { AvatarRootProps } from './types';

defineOptions({
  name: 'AvatarRoot'
});

defineProps<AvatarRootProps>();

const cls = useAvatarUi('root');

provideAvatarRootContext();
</script>

<template>
  <span data-vean-avatar-root :class="cls">
    <slot />
  </span>
</template>
