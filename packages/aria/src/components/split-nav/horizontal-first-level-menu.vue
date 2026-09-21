<script setup lang="ts">
import FirstLevelMenu from './first-level-menu.vue';
import type { HorizontalFirstLevelMenuProps, SplitNavRootSlots } from './types';

defineOptions({
  name: 'SplitNavHorizontalFirstLevelMenu'
});

defineProps<HorizontalFirstLevelMenuProps>();

const slots = defineSlots<Pick<SplitNavRootSlots, 'first-level-item'>>();
</script>

<template>
  <FirstLevelMenu :items="items" orientation="horizontal">
    <template v-if="slots['first-level-item']" #first-level-item="slotProps">
      <slot name="first-level-item" v-bind="slotProps" />
    </template>
  </FirstLevelMenu>
</template>
