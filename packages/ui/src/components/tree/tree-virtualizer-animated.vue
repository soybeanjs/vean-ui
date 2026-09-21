<script setup lang="ts" generic="T extends TreeItemData">
import { computed, watchEffect } from 'vue';
import type { VirtualItem } from '@tanstack/vue-virtual';
import type { FlattenedItem, TreeItemData, TreeMotionState } from '@vean/aria/tree';
import type { MaybeArray } from '@vean/aria/types';
import STreeMotionBlock from './tree-motion-block.vue';

defineOptions({
  name: 'STreeVirtualizerAnimated'
});

interface Props {
  /** Flattened items of the whole tree. */
  flattenItems: FlattenedItem<T>[];
  /** Current virtualized (visible) items. */
  virtualItems: VirtualItem[];
  /** Total size of the virtual scroll content. */
  totalSize: number;
  /** Current selected value. */
  modelValue: MaybeArray<string> | undefined;
  /** Current expanded keys. */
  expanded: string[];
  /** Running expand/collapse motion, if any. */
  motion: TreeMotionState<T> | null;
}

const props = defineProps<Props>();

// Visible items are rendered with "document flow + top and bottom padding": the padding provides scroll height (virtualization is retained, only visible items are rendered), and items stay in normal document flow so dynamic measurement keeps positions stable across expand/collapse.
// While a motion runs the window keeps rendering from the current flattened list; only the animated subtree is swapped for a height-collapsing block, clipped to the visible window so large trees stay O(window) during the animation.
const topSpacer = computed(() => props.virtualItems[0]?.start ?? 0);

const bottomSpacer = computed(() => {
  const items = props.virtualItems;

  return items.length ? Math.max(0, props.totalSize - items[items.length - 1].end) : 0;
});

/**
 * Flat range of the animated subtree inside the current flattened list: for
 * `show` the block items' own positions; for `hide` the virtual positions
 * right after the parent (the children are no longer in the list).
 */
const blockRange = computed(() => {
  const motion = props.motion;

  if (!motion) return null;

  const anchor = motion.type === 'show' ? motion.blockItems[0]?.value : motion.key;
  const start = props.flattenItems.findIndex(item => item.value === anchor) + (motion.type === 'show' ? 0 : 1);

  if (start < 0) return null;

  return { start, end: start + motion.blockItems.length };
});

/**
 * The slice of the animated subtree that intersects the current window, so
 * motion rendering stays bounded on large trees (off-screen block items are
 * never mounted, exactly like the off-screen window items).
 */
const visibleBlockItems = computed(() => {
  const motion = props.motion;
  const range = blockRange.value;

  if (!motion || !range) return [];

  const windowStart = props.virtualItems[0]?.index ?? 0;
  const windowEnd = (props.virtualItems[props.virtualItems.length - 1]?.index ?? -1) + 1;
  const from = Math.max(0, windowStart - range.start);
  const to = Math.max(0, windowEnd - range.start);

  return motion.blockItems.slice(from, to);
});

// A motion whose block falls entirely outside the window has nothing to
// animate — finish it immediately so the tree cannot stay in motion state.
watchEffect(() => {
  if (props.motion && blockRange.value && visibleBlockItems.value.length === 0) {
    props.motion.end();
  }
});

type RenderEntry =
  | { key: string; kind: 'item'; item: FlattenedItem<T>; virtualItem: VirtualItem }
  | { key: string; kind: 'block'; blockItems: FlattenedItem<T>[] };

function windowEntries(): RenderEntry[] {
  const entries: RenderEntry[] = [];

  for (const virtualItem of props.virtualItems) {
    const item = props.flattenItems[virtualItem.index];

    if (item) {
      entries.push({ key: item.value, kind: 'item', item, virtualItem });
    }
  }

  return entries;
}

/**
 * Single keyed render list for both the idle and the motion state. Idle renders
 * the plain window; motion composes the window with the animated subtree block.
 * One list means same-key items patch in place across motion start and end, so
 * click focus is never lost to an element rebuild.
 */
const renderList = computed<RenderEntry[]>(() => {
  const motion = props.motion;

  if (!motion) return windowEntries();

  const range = blockRange.value;

  if (!range) return windowEntries();

  const entries: RenderEntry[] = [];
  let blockRendered = false;

  for (const virtualItem of props.virtualItems) {
    const flat = virtualItem.index;
    const inBlockRange = flat >= range.start && flat < range.end;

    if (motion.type === 'show' && inBlockRange) {
      if (!blockRendered) {
        blockRendered = true;
        entries.push({ key: `motion-${flat}`, kind: 'block', blockItems: visibleBlockItems.value });
      }

      continue;
    }

    const item = props.flattenItems[flat];

    if (!item) continue;

    entries.push({ key: item.value, kind: 'item', item, virtualItem });

    if (motion.type === 'hide' && !blockRendered && item.value === motion.key) {
      blockRendered = true;
      entries.push({
        key: `motion-${flat + 1}`,
        kind: 'block',
        blockItems: visibleBlockItems.value
      });
    }
  }

  return entries;
});

// Motion block items render through the same consumer item slot as virtualized
// items, and that slot expects a virtual item shape (VirtualizerItem reads
// `data.index`). Synthesize one: during dynamic flow it carries no
// positioning, only `data-index`/`aria-posinset`. Collapsed-side snapshot
// items may not exist in the current flattened list, so their index falls
// back to -1 for the brief animation window.
function motionVirtualItem(item: FlattenedItem<T>): VirtualItem {
  return {
    index: props.flattenItems.findIndex(flattenItem => flattenItem.value === item.value),
    key: item.value,
    start: 0,
    end: 0,
    size: 0,
    lane: 0
  };
}
</script>

<template>
  <div
    :style="{
      position: 'relative',
      paddingTop: `${topSpacer}px`,
      paddingBottom: `${bottomSpacer}px`
    }"
  >
    <template v-for="entry in renderList" :key="entry.key">
      <STreeMotionBlock
        v-if="entry.kind === 'block' && motion"
        :type="motion.type"
        :items="entry.blockItems"
        @end="motion.end()"
      >
        <template #item="{ item }">
          <slot
            name="item"
            :item="item"
            :virtual-item="motionVirtualItem(item)"
            :model-value="modelValue"
            :expanded="expanded"
          />
        </template>
      </STreeMotionBlock>
      <slot
        v-else-if="entry.kind === 'item'"
        name="item"
        :item="entry.item"
        :virtual-item="entry.virtualItem"
        :model-value="modelValue"
        :expanded="expanded"
      />
    </template>
  </div>
</template>
