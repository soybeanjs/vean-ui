<script setup lang="ts">
import { computed } from 'vue';
import { ColorFieldCompact, provideColorFieldUi } from '@vean/aria/color-field';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { colorFieldVariants } from '@/styles/color-field';
import type { ColorFieldProps, ColorFieldEmits } from './types';

defineOptions({
  name: 'SColorField'
});

const props = defineProps<ColorFieldProps>();

const emit = defineEmits<ColorFieldEmits>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const ui = computed(() => colorFieldVariants({ size: props.size }, props.ui, { root: props.class }));

provideColorFieldUi(ui);
</script>

<template>
  <ColorFieldCompact v-bind="forwardedProps" v-on="listeners" />
</template>
