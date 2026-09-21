<script setup lang="ts">
import { computed } from 'vue';
import { Clipboard } from '@vean/aria/clipboard';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { clipboardVariants } from '@/styles/clipboard';
import type { ClipboardProps, ClipboardEmits } from './types';

defineOptions({
  name: 'SClipboard'
});

const props = defineProps<ClipboardProps>();

const emit = defineEmits<ClipboardEmits>();

const listeners = useForwardListeners(emit);

const forwardedProps = useOmitProps(props, ['class', 'color', 'size', 'variant', 'shape', 'fitContent']);

const cls = computed(() =>
  clipboardVariants(
    {
      color: props.color,
      size: props.size,
      variant: props.variant,
      shape: props.shape,
      fitContent: props.fitContent
    },
    props.class
  )
);
</script>

<template>
  <Clipboard v-bind="forwardedProps" :class="cls" v-on="listeners">
    <template #leading="slotProps">
      <slot name="leading" v-bind="slotProps" />
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
    <template #trailing="slotProps">
      <slot name="trailing" v-bind="slotProps" />
    </template>
  </Clipboard>
</template>
