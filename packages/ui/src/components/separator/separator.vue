<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { SeparatorCompact, provideSeparatorUi } from '@vean/aria/separator';
import { separatorVariants } from '@/styles/separator';
import type { SeparatorProps } from './types';

defineOptions({
  name: 'SSeparator'
});

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal'
});

const slots = useSlots();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'align', 'border']);

const ui = computed(() =>
  separatorVariants(
    {
      size: props.size,
      orientation: props.orientation,
      align: props.align,
      border: props.border
    },
    props.ui,
    { root: props.class }
  )
);

provideSeparatorUi(ui);
</script>

<template>
  <SeparatorCompact v-bind="forwardedProps">
    <template v-if="slots.default" #label>
      <slot />
    </template>
  </SeparatorCompact>
</template>
