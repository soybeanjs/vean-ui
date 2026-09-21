<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useOmitProps } from '../../composables';
import SeparatorLabel from './separator-label.vue';
import SeparatorRoot from './separator-root.vue';
import type { SeparatorCompactProps } from './types';

defineOptions({
  name: 'SeparatorCompact'
});

const props = defineProps<SeparatorCompactProps>();

const slots = useSlots();

const forwardedProps = useOmitProps(props, ['label', 'labelProps']);

const showLabel = computed(() => (slots.label || props.label) && props.orientation !== 'vertical');
</script>

<template>
  <SeparatorRoot v-bind="forwardedProps">
    <SeparatorLabel v-if="showLabel" v-bind="labelProps">
      <slot name="label">{{ label }}</slot>
    </SeparatorLabel>
  </SeparatorRoot>
</template>
