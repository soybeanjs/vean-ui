<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import ColorFieldInput from './color-field-input.vue';
import ColorFieldRoot from './color-field-root.vue';
import type { ColorFieldCompactProps, ColorFieldCompactEmits } from './types';

defineOptions({
  name: 'ColorFieldCompact',
  inheritAttrs: false
});

const props = defineProps<ColorFieldCompactProps>();

const emit = defineEmits<ColorFieldCompactEmits>();

const forwardedProps = useOmitProps(props, ['inputProps']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <ColorFieldRoot v-bind="forwardedProps" v-on="listeners">
    <ColorFieldInput v-bind="inputProps" />
  </ColorFieldRoot>
</template>
