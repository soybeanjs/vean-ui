<script setup lang="ts">
import { computed } from 'vue';
import { useCascaderRootContext, useCascaderUi } from './context';
import type { CascaderTagsProps } from './types';

defineOptions({
  name: 'CascaderTags'
});

defineProps<CascaderTagsProps>();

const { multiple, selectedNodes, removeNode } = useCascaderRootContext('CascaderTags');

const cls = useCascaderUi('tag');

const hasSelection = computed(() => Boolean(multiple.value) && selectedNodes.value.length > 0);
</script>

<template>
  <template v-if="hasSelection">
    <span v-for="node in selectedNodes" :key="node.uid" data-vean-cascader-tag :class="cls">
      <slot name="tag" :node="node" :remove="removeNode">
        <span>{{ node.label }}</span>
      </slot>
    </span>
  </template>
  <slot v-else name="value" />
</template>
