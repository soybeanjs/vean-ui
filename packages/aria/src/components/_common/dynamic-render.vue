<script setup lang="ts">
import { useAttrs } from 'vue';
import type { VNode } from 'vue';

defineOptions({
  name: 'DynamicRender',
  inheritAttrs: false
});

interface Props {
  is?: VNode | string;
}

defineProps<Props>();

const attrs = useAttrs();
</script>

<template>
  <template v-if="typeof is === 'string'">{{ is }}</template>
  <component :is="is" v-else v-bind="attrs" />
</template>
