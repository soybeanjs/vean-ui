<script setup lang="ts">
import { computed } from 'vue';
import { ColorAreaCompact, provideColorAreaUi } from '@vean/aria/color-area';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { colorAreaVariants } from '@/styles/color-area';
import type { ColorAreaProps, ColorAreaEmits } from './types';

defineOptions({
  name: 'SColorArea'
});

const props = defineProps<ColorAreaProps>();

const emit = defineEmits<ColorAreaEmits>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const ui = computed(() => colorAreaVariants({ size: props.size }, props.ui, { root: props.class }));

provideColorAreaUi(ui);
</script>

<template>
  <ColorAreaCompact v-bind="forwardedProps" v-on="listeners" />
</template>
