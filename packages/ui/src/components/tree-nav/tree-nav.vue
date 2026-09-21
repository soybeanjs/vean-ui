<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { TreeNavCompact, provideTreeNavUi } from '@vean/aria/tree-nav';
import { treeNavVariants } from '@/styles/tree-nav';
import { provideMenuUi } from '../menu/context';
import type { TreeNavProps, TreeNavEmits, TreeNavSlots } from './types';

defineOptions({
  name: 'STreeNav'
});

const props = defineProps<TreeNavProps>();

const emit = defineEmits<TreeNavEmits>();

// Forwarded scopes resolve against aria internals; the slot contract is
// the shared `MenuOptionsCompactSlots` + `more-trigger`.
const slots = defineSlots<TreeNavSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(key => key !== 'more-trigger'));

const ui = computed(() => treeNavVariants({ size: props.size }, props.ui, { root: props.class }));

provideTreeNavUi(ui);
provideMenuUi(() => props);
</script>

<template>
  <TreeNavCompact v-bind="forwardedProps" v-on="listeners">
    <template #more-trigger="entry">
      <slot name="more-trigger" :label="entry.label" :icon="entry.icon" />
    </template>
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </TreeNavCompact>
</template>
