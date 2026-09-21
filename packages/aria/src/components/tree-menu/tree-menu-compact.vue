<script setup lang="ts" generic="T extends TreeMenuBaseOptionData = TreeMenuBaseOptionData">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, usePickProps } from '../../composables';
import TreeMenuCompactOptions from './tree-menu-options-compact.vue';
import TreeMenuRoot from './tree-menu-root.vue';
import type { TreeMenuCompactProps, TreeMenuBaseOptionData, TreeMenuCompactEmits, TreeMenuCompactSlots } from './types';

defineOptions({
  name: 'TreeMenuCompact'
});

const props = withDefaults(defineProps<TreeMenuCompactProps<T>>(), {
  side: 'left',
  collapsed: undefined,
  collapsedWidth: 50,
  indent: 16
});

const emit = defineEmits<TreeMenuCompactEmits>();

const slots = defineSlots<TreeMenuCompactSlots<T>>();

const forwardedRootProps = usePickProps(props, [
  'modelValue',
  'defaultValue',
  'expanded',
  'defaultExpanded',
  'expandStrategy',
  'collapsed',
  'defaultCollapsed',
  'collapsedWidth',
  'indent',
  'pxToRem'
]);

const forwardedOptionsProps = usePickProps(props, [
  'side',
  'items',
  'groupRootProps',
  'groupProps',
  'groupLabelProps',
  'showGroupIcon',
  'itemProps',
  'buttonProps',
  'linkProps',
  'collapsibleProps',
  'subProps'
]);

const listeners = useForwardListeners(emit);

const optionSlotNames = computed(() => keysOf(slots).filter(slotName => slotName !== 'top' && slotName !== 'bottom'));
</script>

<template>
  <TreeMenuRoot v-bind="forwardedRootProps" v-on="listeners">
    <slot name="top" />
    <TreeMenuCompactOptions v-bind="forwardedOptionsProps" @select-dropdown="emit('selectDropdown', $event)">
      <template v-for="slotName in optionSlotNames" #[slotName]="slotProps">
        <!-- @vue-expect-error ignore slot type -->
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </TreeMenuCompactOptions>
    <slot name="bottom" />
  </TreeMenuRoot>
</template>
