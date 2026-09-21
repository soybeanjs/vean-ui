<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { AnchorCompact, provideAnchorUi } from '@vean/aria/anchor';
import { useOmitProps, useForwardListeners } from '@vean/aria/composables';
import { anchorVariants } from '@/styles/anchor';
import type { AnchorProps, AnchorEmits } from './types';

defineOptions({
  name: 'SAnchor'
});

const props = withDefaults(defineProps<AnchorProps>(), {
  offsetTop: 0,
  sticky: true
});

const emit = defineEmits<AnchorEmits>();

const forwardedProps = useOmitProps(props, ['color', 'size', 'ui', 'class', 'sticky']);

const events = useForwardListeners(emit);

const style = computed<CSSProperties>(() => ({
  '--vean-anchor-offset-top': `${props.offsetTop}px`
}));

const ui = computed(() =>
  anchorVariants(
    {
      color: props.color,
      orientation: props.orientation,
      size: props.size,
      sticky: props.sticky
    },
    props.ui,
    { root: props.class }
  )
);

provideAnchorUi(ui);
</script>

<template>
  <AnchorCompact v-bind="forwardedProps" :items="items" :style="style" v-on="events" />
</template>
