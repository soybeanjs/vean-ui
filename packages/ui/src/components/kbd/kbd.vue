<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { Kbd } from '@vean/aria/kbd';
import { kbdVariants } from '@/styles/kbd';
import type { KbdProps } from './types';

defineOptions({
  name: 'SKbd'
});

const props = withDefaults(defineProps<KbdProps>(), {
  symbolize: true,
  raised: true
});

const delegatedProps = useOmitProps(props, ['class', 'size', 'variant', 'raised']);

const cls = computed(() =>
  kbdVariants(
    {
      size: props.size,
      variant: props.variant,
      raised: props.raised
    },
    props.class
  )
);
</script>

<template>
  <Kbd v-bind="delegatedProps" :class="cls" />
</template>
