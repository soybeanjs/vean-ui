<script setup lang="ts">
import { useForwardListeners, useOmitProps } from '../../composables';
import ColorAreaArea from './color-area-area.vue';
import ColorAreaRoot from './color-area-root.vue';
import ColorAreaThumb from './color-area-thumb.vue';
import type { ColorAreaCompactProps, ColorAreaCompactEmits } from './types';

defineOptions({
  name: 'ColorAreaCompact'
});

const props = defineProps<ColorAreaCompactProps>();

const emit = defineEmits<ColorAreaCompactEmits>();

const forwardedProps = useOmitProps(props, ['areaProps', 'thumbProps']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <ColorAreaRoot v-bind="forwardedProps" v-on="listeners">
    <ColorAreaArea v-bind="areaProps">
      <ColorAreaThumb v-bind="thumbProps" />
    </ColorAreaArea>
  </ColorAreaRoot>
</template>
