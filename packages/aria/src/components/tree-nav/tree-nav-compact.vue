<script setup lang="ts">
import { computed, nextTick, onMounted, shallowRef, useAttrs, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { keysOf, isClient } from '../../shared';
import { useForwardListeners, useForwardElement, useOmitProps } from '../../composables';
import { filterHiddenTreeNavOptions } from './shared';
import TreeNavOptionsCompact from './tree-nav-options-compact.vue';
import TreeNavOverflow from './tree-nav-overflow.vue';
import TreeNavRoot from './tree-nav-root.vue';
import type { TreeNavCompactProps, TreeNavCompactEmits, TreeNavCompactSlots } from './types';

defineOptions({
  name: 'TreeNavCompact',
  inheritAttrs: false
});

const props = defineProps<TreeNavCompactProps>();

const emit = defineEmits<TreeNavCompactEmits>();

const slots = defineSlots<TreeNavCompactSlots>();

// Forwarding -----------------------------------------------------------------

const attrs = useAttrs();

const forwardedRootProps = useOmitProps(props, ['items', 'collapsible', 'moreLabel', 'moreIcon', 'moreProps'], attrs);

const listeners = useForwardListeners(emit);

const optionSlotNames = computed(() => keysOf(slots).filter(key => key !== 'more-trigger'));

// Overflow collapsing --------------------------------------------------------
//
// Mirrors the proven `MenubarCompact` reflow mechanism: when `collapsible` is
// enabled the bar is wrapped in a measurement container; trailing items are
// moved into a "more" popup one at a time against real layout until everything
// fits. Selection state and rendering are delegated to `TreeNavRoot` and
// `TreeNavOptionsCompact`.

const [overflowElement, setOverflowElement] = useForwardElement();

const collapsedCount = shallowRef(0);

// Hidden options are filtered before layout math so the reflow loop counts
// exactly what `TreeNavOptionsCompact` renders.
const items = computed(() => filterHiddenTreeNavOptions(props.items));

const hiddenCount = computed(() => Math.min(collapsedCount.value, items.value.length));
const visibleItems = computed(() => items.value.slice(0, items.value.length - hiddenCount.value));
const moreItems = computed(() => items.value.slice(items.value.length - hiddenCount.value));

let reflowRunning = false;
let reflowQueued = false;

function isOverflowing(container: HTMLElement): boolean {
  const root = container.querySelector('[data-vean-tree-nav]') as HTMLElement | null;

  return root ? root.scrollWidth > container.clientWidth : false;
}

async function reflow() {
  if (!isClient) return;

  if (reflowRunning) {
    reflowQueued = true;
    return;
  }

  reflowRunning = true;

  try {
    const container = overflowElement.value;
    if (!container) return;

    await nextTick();

    // Both walks re-check `collapsible` on every step: a measurement that
    // outlives the prop must not write a collapse state the non-collapsible
    // branch cannot render.

    // Restore items from the "more" menu while they fit again.
    while (props.collapsible && collapsedCount.value > 0) {
      collapsedCount.value -= 1;
      await nextTick();
      if (isOverflowing(container)) {
        collapsedCount.value += 1;
        await nextTick();
        break;
      }
    }

    // Collapse trailing items while the content overflows the container.
    while (props.collapsible && collapsedCount.value < items.value.length && isOverflowing(container)) {
      collapsedCount.value += 1;
      await nextTick();
    }
  } finally {
    reflowRunning = false;
    if (reflowQueued) {
      reflowQueued = false;
      reflow();
    }
  }
}

useResizeObserver(overflowElement, () => {
  if (props.collapsible) {
    reflow();
  }
});

watch(items, () => {
  if (!props.collapsible) return;
  collapsedCount.value = 0;
  reflow();
});

watch(
  () => props.collapsible,
  enabled => {
    // Leaving collapsible mode drops the overflow split entirely: the full list
    // renders again, so the measured count must not survive as stale state and
    // keep a trailing "more" branch alive.
    if (!enabled) {
      collapsedCount.value = 0;
      return;
    }

    reflow();
  }
);

onMounted(() => {
  if (props.collapsible) {
    reflow();
  }
});
</script>

<template>
  <TreeNavOverflow v-if="collapsible" :ref="setOverflowElement">
    <TreeNavRoot v-bind="forwardedRootProps" v-on="listeners">
      <TreeNavOptionsCompact
        :items="visibleItems"
        :more-items="moreItems"
        :more-label="moreLabel"
        :more-icon="moreIcon"
        :more-props="moreProps"
      >
        <template #more-trigger="entry">
          <slot name="more-trigger" :label="entry.label" :icon="entry.icon" />
        </template>
        <template v-for="slotName in optionSlotNames" :key="slotName" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </TreeNavOptionsCompact>
    </TreeNavRoot>
  </TreeNavOverflow>
  <TreeNavRoot v-else v-bind="forwardedRootProps" v-on="listeners">
    <TreeNavOptionsCompact
      :items="visibleItems"
      :more-items="moreItems"
      :more-label="moreLabel"
      :more-icon="moreIcon"
      :more-props="moreProps"
    >
      <template #more-trigger="entry">
        <slot name="more-trigger" :label="entry.label" :icon="entry.icon" />
      </template>
      <template v-for="slotName in optionSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </TreeNavOptionsCompact>
  </TreeNavRoot>
</template>
