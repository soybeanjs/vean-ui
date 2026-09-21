<script setup lang="ts">
import { Primitive } from '../primitive';
import type { ButtonGroupProps } from './types';

defineOptions({
  name: 'ButtonGroup'
});

withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal'
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-button-group
    role="group"
    :data-orientation="orientation"
    :dir="dir"
  >
    <slot />
  </Primitive>
</template>
