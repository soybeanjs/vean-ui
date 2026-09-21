<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { Toggle } from '@vean/aria/toggle';
import { toggleVariants } from '@/styles/toggle';
import type { ToggleProps, ToggleEmits } from './types';

defineOptions({
  name: 'SToggle'
});

const props = withDefaults(defineProps<ToggleProps>(), {
  modelValue: undefined
});

const emit = defineEmits<ToggleEmits>();

const forwardedProps = useOmitProps(props, ['class', 'color', 'variant', 'size', 'shape']);

const cls = computed(() =>
  toggleVariants(
    {
      color: props.color,
      variant: props.variant,
      size: props.size,
      shape: props.shape
    },
    props.class
  )
);
</script>

<template>
  <Toggle
    v-slot="slotProps"
    v-bind="forwardedProps"
    :class="cls"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot v-bind="slotProps" />
  </Toggle>
</template>
