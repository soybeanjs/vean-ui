<script setup lang="ts" generic="M extends boolean = false, T extends DefinedValue = string">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { ToggleGroupRoot, provideToggleGroupUi } from '@vean/aria/toggle-group';
import type { DefinedValue } from '@vean/aria/types';
import { toggleGroupVariants } from '@/styles/toggle-group';
import type { ToggleGroupProps, ToggleGroupEmits } from './types';

defineOptions({
  name: 'SToggleGroup'
});

// Functional defaults must be declared here as well as in the Aria root: without them,
// absent boolean props would be cast to `false` and forwarded as explicit values, overriding
// the Aria defaults (see C42 audit).
const props = withDefaults(defineProps<ToggleGroupProps<M, T>>(), {
  disabled: () => false,
  rovingFocus: () => true,
  orientation: 'horizontal',
  loop: () => true,
  clearable: () => true
});

const emit = defineEmits<ToggleGroupEmits<M, T>>();

const forwardedProps = useOmitProps(props, ['class', 'color', 'size', 'variant', 'ui']);

const listeners = useForwardListeners(emit);

const ui = computed(() =>
  toggleGroupVariants(
    {
      color: props.color,
      size: props.size,
      variant: props.variant,
      orientation: props.orientation
    },
    props.ui,
    { root: props.class }
  )
);

provideToggleGroupUi(ui);
</script>

<template>
  <ToggleGroupRoot v-bind="forwardedProps" v-on="listeners">
    <slot />
  </ToggleGroupRoot>
</template>
