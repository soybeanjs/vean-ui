<script setup lang="ts">
import { computed } from 'vue';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';
import STreeMenuStyledItem from '../tree-menu/tree-menu-styled-item.vue';
import type { AppShellBrandLayout } from './shared';
import type { AppShellBrandSlotProps, AppShellLogoPlacementResolved } from './types';

defineOptions({
  name: 'AppShellBrand'
});

interface Props {
  /** Resolved placement of the region. */
  placement: AppShellLogoPlacementResolved;
  /** Whether the sidebar is collapsed. */
  collapsed: boolean;
  /** Cell geometry of the current mode and sidebar state. */
  layout: AppShellBrandLayout;
  /** Visual size, shared with the menu the brand mirrors. */
  size: ThemeSize;
  /** Class of the region. */
  regionClass: ClassValue;
  /** Class of the mark cell. */
  markClass: ClassValue;
  /** Class of the title cell. */
  titleClass: ClassValue;
}

const props = defineProps<Props>();

interface Slots {
  logo?: (props: AppShellBrandSlotProps) => any;
  title?: (props: AppShellBrandSlotProps) => any;
}

const slots = defineSlots<Slots>();

/** A cell sized to the column it aligns to; `undefined` lets the content size it. */
function toCellStyle(width: number | undefined) {
  return width === undefined ? undefined : { width: `${width}rem` };
}

const slotProps = computed<AppShellBrandSlotProps>(() => ({
  collapsed: props.collapsed,
  placement: props.placement
}));

/**
 * Whether the mark and the title align to the sidebar's columns.
 *
 * Only the rail modes do; everywhere else the two share one row and are sized by
 * their own content.
 */
const aligned = computed(() => props.layout.markWidth !== undefined);

/**
 * A brand rendered in the sidebar.
 *
 * It sits directly above (or below) the menu, so it mirrors a tree-menu item:
 * same row height, padding and folded width. That is what keeps the mark in the
 * menu's icon column — expanded, and above all once the sidebar collapses and the
 * menu items fold to their icon width. A header brand is a header row, not a menu
 * row, so it keeps its own shape.
 */
const inSidebar = computed(() => props.placement !== 'header');

/**
 * Collapsed state the mirrored item folds on.
 *
 * The rail keeps its column while the sidebar folds — the mark stays on it — so
 * only a single-column sidebar folds its brand row together with the menu.
 */
const itemState = computed(() => (props.collapsed && !aligned.value ? 'collapsed' : 'expanded'));

const markStyle = computed(() => toCellStyle(props.layout.markWidth));

const titleStyle = computed(() => toCellStyle(props.layout.titleWidth));

const showTitle = computed(() => Boolean(slots.title) && props.layout.titleVisible);
</script>

<template>
  <div
    :class="[regionClass, inSidebar ? 'group' : undefined]"
    data-vean-app-shell-logo
    :data-placement="placement"
    :data-aligned="aligned ? 'true' : undefined"
    :data-collapsed="collapsed ? 'true' : undefined"
    :data-inset="inSidebar && !aligned ? 'menu' : undefined"
    :data-state="inSidebar ? itemState : undefined"
  >
    <!--
      A single-column sidebar: the brand is one menu row — mark and title in it —
      mirroring the items right below.

      Once folded the row is the item's icon width, and the row's own padding
      leaves a content box narrower than a brand mark usually is: start-aligned, a
      larger mark runs to the row's trailing edge and reads as pushed to the right.
      The row is icon-only there (the title is hidden below the fold), so centering
      puts the mark on the same axis as the folded menu icons.
    -->
    <STreeMenuStyledItem
      v-if="inSidebar && !aligned"
      as="div"
      :size="size"
      :ui="{ button: 'group-data-[state=collapsed]:justify-center' }"
      data-vean-app-shell-logo-mark
      class="w-full min-w-0"
    >
      <slot name="logo" v-bind="slotProps" />
      <span v-if="showTitle" class="truncate" data-vean-app-shell-logo-title>
        <slot name="title" v-bind="slotProps" />
      </span>
    </STreeMenuStyledItem>

    <!--
      A rail sidebar: the mark keeps the rail column and the title the pane one.
      The divider those columns carry belongs to the menu that draws it, so this
      placement does not fake it.
    -->
    <template v-else-if="inSidebar">
      <div :class="markClass" :style="markStyle" data-vean-app-shell-logo-mark>
        <STreeMenuStyledItem as="div" :size="size" :ui="{ button: 'justify-center' }" class="w-full">
          <slot name="logo" v-bind="slotProps" />
        </STreeMenuStyledItem>
      </div>
      <div v-if="showTitle" :class="titleClass" :style="titleStyle" data-vean-app-shell-logo-title>
        <slot name="title" v-bind="slotProps" />
      </div>
    </template>

    <template v-else>
      <div :class="markClass" :style="markStyle" data-vean-app-shell-logo-mark>
        <slot name="logo" v-bind="slotProps" />
      </div>
      <div v-if="showTitle" :class="titleClass" :style="titleStyle" data-vean-app-shell-logo-title>
        <slot name="title" v-bind="slotProps" />
      </div>
    </template>
  </div>
</template>
