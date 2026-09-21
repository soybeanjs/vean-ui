<script setup lang="ts">
import { onBeforeUnmount, watchEffect } from 'vue';
import { useForwardElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { usePopperPositioningRootContext, usePopperUi } from './context';
import type { PopperAnchorProps } from './types';

defineOptions({
  name: 'PopperAnchor'
});

const props = defineProps<PopperAnchorProps>();

const forwardedProps = useOmitProps(props, ['reference']);

const cls = usePopperUi('anchor');

// Consumes the positioning (thin) context so this anchor works under both the interactive
// shell (whose root dual-provides it) and positioning-only roots.
const { dir, onAnchorElementChange, registerCustomAnchor } = usePopperPositioningRootContext('PopperAnchor');
const unregister = registerCustomAnchor();
const [_, setAnchorElement] = useForwardElement(el => {
  if (props.reference) return;

  onAnchorElementChange(el);
});

watchEffect(() => {
  if (props.reference) {
    onAnchorElementChange(props.reference);
  }
});

onBeforeUnmount(unregister);
</script>

<template>
  <Primitive v-bind="forwardedProps" :ref="setAnchorElement" data-vean-popper-anchor :class="cls" :dir="dir">
    <slot />
  </Primitive>
</template>
