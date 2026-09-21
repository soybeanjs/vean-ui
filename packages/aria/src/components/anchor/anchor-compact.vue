<script setup lang="ts">
import { useOmitProps } from '../../composables';
import AnchorCompactItem from './anchor-item-compact.vue';
import AnchorRoot from './anchor-root.vue';
import type { AnchorCompactProps, AnchorCompactEmits } from './types';

defineOptions({
  name: 'AnchorCompact'
});

const props = defineProps<AnchorCompactProps>();

const emit = defineEmits<AnchorCompactEmits>();

const forwardedProps = useOmitProps(props, ['items', 'linkProps', 'indicatorProps', 'titleProps', 'subProps']);

const handleModelValueChange = (value: string) => {
  emit('update:modelValue', value);
};

const handleActiveChange = (value: string) => {
  emit('activeChange', value);
};

const handleItemSelect = (event: MouseEvent, payload: { href: string }) => {
  emit('itemSelect', event, payload);
};
</script>

<template>
  <AnchorRoot
    v-slot="{ modelValue }"
    v-bind="forwardedProps"
    @active-change="handleActiveChange"
    @item-select="handleItemSelect"
    @update:model-value="handleModelValueChange"
  >
    <AnchorCompactItem
      v-for="item in items"
      :key="item.href"
      :item="item"
      :model-value="modelValue"
      :link-props="linkProps"
      :indicator-props="indicatorProps"
      :title-props="titleProps"
      :sub-props="subProps"
    />
  </AnchorRoot>
</template>
