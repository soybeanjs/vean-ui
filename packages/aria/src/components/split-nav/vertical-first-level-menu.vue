<script setup lang="ts">
import FirstLevelMenu from './first-level-menu.vue';
import type { SplitNavRootSlots, VerticalFirstLevelMenuProps } from './types';

defineOptions({
  name: 'SplitNavVerticalFirstLevelMenu'
});

defineProps<VerticalFirstLevelMenuProps>();

const slots = defineSlots<Pick<SplitNavRootSlots, 'first-level-item'>>();
</script>

<template>
  <FirstLevelMenu :items="items" orientation="vertical">
    <template v-if="slots['first-level-item']" #first-level-item="slotProps">
      <slot name="first-level-item" v-bind="slotProps" />
    </template>
  </FirstLevelMenu>
</template>
