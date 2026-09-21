<script setup lang="ts">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { toMountedTarget } from './shared';
import { useSplitNavRootContext } from './context';
import { useSplitNavDerived } from './hooks';
import DualVerticalMenu from './dual-vertical-menu.vue';
import HorizontalFirstLevelMenu from './horizontal-first-level-menu.vue';
import type { SplitNavRootSlots } from './types';

defineOptions({
  name: 'SplitNavHorizontalDualVerticalMenu'
});

const slots = defineSlots<SplitNavRootSlots>();

const { horizontalMountedId } = useSplitNavRootContext('SplitNavHorizontalDualVerticalMenu');

const { firstLevelItems, childItems } = useSplitNavDerived();

const horizontalTarget = computed(() => toMountedTarget(horizontalMountedId.value));

const forwardedSlotNames = computed(() => keysOf(slots));
</script>

<template>
  <Teleport defer :to="horizontalTarget" :disabled="!horizontalTarget">
    <HorizontalFirstLevelMenu :items="firstLevelItems">
      <template v-if="slots['first-level-item']" #first-level-item="slotProps">
        <slot name="first-level-item" v-bind="slotProps" />
      </template>
    </HorizontalFirstLevelMenu>
  </Teleport>
  <DualVerticalMenu v-if="childItems.length" :items="childItems">
    <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
      <!-- @vue-expect-error ignore slot type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DualVerticalMenu>
</template>
