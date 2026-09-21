<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import AvatarFallback from './avatar-fallback.vue';
import AvatarImage from './avatar-image.vue';
import AvatarRoot from './avatar-root.vue';
import type { AvatarCompactProps, AvatarCompactEmits, AvatarCompactSlots } from './types';

defineOptions({
  name: 'AvatarCompact'
});

const props = defineProps<AvatarCompactProps>();

const emit = defineEmits<AvatarCompactEmits>();

defineSlots<AvatarCompactSlots>();

const forwardedProps = useOmitProps(props, ['fallbackLabel', 'imageProps', 'fallbackProps', 'delayMs']);

const imageProps = computed(() => ({
  ...props.imageProps,
  src: props.src ?? props.imageProps?.src,
  alt: props.imageProps?.alt ?? props.fallbackLabel
}));

const fallbackProps = computed(() => ({
  ...props.fallbackProps,
  delayMs: props.delayMs ?? props.fallbackProps?.delayMs
}));
</script>

<template>
  <AvatarRoot v-bind="forwardedProps">
    <slot>
      <slot name="image">
        <AvatarImage v-bind="imageProps" @loading-status-change="emit('loadingStatusChange', $event)" />
      </slot>
      <AvatarFallback v-bind="fallbackProps">
        <slot name="fallback">{{ fallbackLabel }}</slot>
      </AvatarFallback>
    </slot>
  </AvatarRoot>
</template>
