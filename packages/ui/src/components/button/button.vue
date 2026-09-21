<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@vean/aria/button';
import { useOmitProps } from '@vean/aria/composables';
import { buttonVariants } from '@/styles/button';
import { useButtonGroupContext } from './context';
import type { ButtonProps, ButtonEmits } from './types';

defineOptions({
  name: 'SButton'
});

const props = defineProps<ButtonProps>();

const emit = defineEmits<ButtonEmits>();

const buttonGroupContext = useButtonGroupContext();

const forwardedProps = useOmitProps(props, [
  'class',
  'size',
  'color',
  'variant',
  'shape',
  'shadow',
  'disabled',
  'fitContent'
]);

const cls = computed(() => {
  const { size, color, variant, shape, shadow, fitContent } = buttonGroupContext || {};

  const variants = buttonVariants(
    {
      size: props.size || size?.value,
      color: props.color || color?.value,
      variant: props.variant || variant?.value,
      shape: props.shape || shape?.value,
      shadow: props.shadow || shadow?.value,
      fitContent: props.fitContent || fitContent?.value
    },
    props.class
  );

  return variants;
});

const disabled = computed(() => props.disabled || buttonGroupContext?.disabled.value);
</script>

<template>
  <Button v-bind="forwardedProps" :class="cls" :disabled="disabled" @click="emit('click', $event)">
    <slot name="leading" />
    <slot />
    <slot name="trailing" />
  </Button>
</template>
