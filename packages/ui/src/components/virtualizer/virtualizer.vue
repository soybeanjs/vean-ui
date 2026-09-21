<script setup lang="ts" generic="T extends Record<string, any>">
import { useOmitProps } from '@vean/aria/composables';
import { VirtualizerContent, VirtualizerRoot } from '@vean/aria/virtualizer';
import type { VirtualizerProps } from './types';

defineOptions({
  name: 'SVirtualizer'
});

const props = defineProps<VirtualizerProps<T>>();

const forwardedProps = useOmitProps(props, ['contentProps', 'dynamicContentProps']);
</script>

<template>
  <VirtualizerRoot v-slot="{ virtualItems, items }" v-bind="forwardedProps">
    <VirtualizerContent v-bind="contentProps" :dynamic-content-props="dynamicContentProps">
      <slot
        v-for="item in virtualItems"
        name="item"
        :virtual-item="item"
        :index="item.index"
        :item="items[item.index]"
      />
    </VirtualizerContent>
  </VirtualizerRoot>
</template>
