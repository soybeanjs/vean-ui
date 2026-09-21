<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { listVariants } from '@/styles/list';
import { provideListUi } from './context';
import type { ListProps } from './types';

defineOptions({
  name: 'SList'
});

const props = defineProps<ListProps>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const ui = computed(() => listVariants({ size: props.size }, props.ui, { root: props.class }));

provideListUi(ui);
</script>

<template>
  <ul v-bind="forwardedProps" data-vean-list-root :class="ui.root">
    <slot />
  </ul>
</template>
