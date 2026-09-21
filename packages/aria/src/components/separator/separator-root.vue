<script setup lang="ts">
import { computed } from 'vue';
import type { DataOrientation } from '../../types';
import { useSeparatorUi } from './context';
import type { SeparatorRootProps } from './types';

defineOptions({
  name: 'SeparatorRoot'
});

const props = withDefaults(defineProps<SeparatorRootProps>(), {
  orientation: 'horizontal',
  decorative: false
});

const cls = useSeparatorUi('root');

const ORIENTATIONS: DataOrientation[] = ['horizontal', 'vertical'];

const computedOrientation = computed(() =>
  ORIENTATIONS.includes(props.orientation) ? props.orientation : 'horizontal'
);

// `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical.
// Omit `aria-orientation` when decorative — the element is removed from the a11y tree (`role="none"`).
const ariaOrientation = computed(() =>
  !props.decorative && computedOrientation.value === 'vertical' ? props.orientation : undefined
);
</script>

<template>
  <div
    data-vean-separator-root
    :class="cls"
    :data-orientation="computedOrientation"
    :aria-orientation="ariaOrientation"
    :role="decorative ? 'none' : 'separator'"
  >
    <slot />
  </div>
</template>
