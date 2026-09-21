<script setup lang="ts">
import { computed } from 'vue';
import { useTextareaRootContext, useTextareaUi } from './context';
import type { TextareaCounterProps } from './types';

defineOptions({
  name: 'TextareaCounter'
});

defineProps<TextareaCounterProps>();

const { maxlength, count } = useTextareaRootContext('TextareaCounter');

const cls = useTextareaUi('counter');

const countText = computed(() => {
  if (maxlength.value) {
    return `${count.value} / ${maxlength.value}`;
  }
  return `${count.value}`;
});
</script>

<template>
  <div data-vean-textarea-counter :class="cls">
    <slot :count="count" :maxlength="maxlength">{{ countText }}</slot>
  </div>
</template>
