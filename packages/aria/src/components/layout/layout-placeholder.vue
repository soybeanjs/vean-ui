<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutRootContext, useLayoutUi } from './context';
import type { LayoutPlaceholderProps } from './types';

defineOptions({
  name: 'LayoutPlaceholder',
  inheritAttrs: false
});

const props = defineProps<LayoutPlaceholderProps>();

const cls = useLayoutUi(`${props.type}Placeholder`);

const { fixedTop, headerVisible, tabVisible, footerVisible, fixedFooter } = useLayoutRootContext('LayoutPlaceholder');

const fixed = computed(() => (props.type === 'footer' ? fixedFooter.value : fixedTop.value));

const visible = computed(() => {
  if (props.type === 'header') {
    return headerVisible.value;
  }

  if (props.type === 'tab') {
    return tabVisible.value;
  }

  return footerVisible.value;
});

const dataSoybeanAttr = computed(() => ({ [`data-vean-layout-${props.type}-placeholder`]: '' }));
</script>

<template>
  <div v-if="visible && fixed" :class="cls" v-bind="dataSoybeanAttr"></div>
</template>
