<script setup lang="ts">
import { computed } from 'vue';
import { useControllableState, useOmitProps } from '@vean/aria/composables';
import { badgeVariants } from '@/styles/badge';
import type { BadgeProps, BadgeEmits, BadgeSlots } from './types';

defineOptions({
  name: 'SBadge'
});

const props = withDefaults(defineProps<BadgeProps>(), {
  open: undefined
});

const emit = defineEmits<BadgeEmits>();

defineSlots<BadgeSlots>();

const forwardedProps = useOmitProps(props, [
  'class',
  'color',
  'size',
  'ui',
  'position',
  'open',
  'content',
  'contentProps'
]);

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  true
);

const ui = computed(() =>
  badgeVariants(
    {
      color: props.color,
      size: props.size,
      position: props.position
    },
    props.ui,
    { root: props.class }
  )
);
</script>

<template>
  <div v-bind="forwardedProps" data-vean-badge-root :class="ui.root">
    <slot />
    <span v-if="open" v-bind="contentProps" data-vean-badge-content :class="ui.content">
      <slot name="content">{{ content }}</slot>
    </span>
  </div>
</template>
