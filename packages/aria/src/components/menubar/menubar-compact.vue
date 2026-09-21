<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { filterHiddenTreeNodes, keysOf, isClient } from '../../shared';
import { usePickProps, useForwardListeners } from '../../composables';
import type { DefinedValue } from '../../types';
import type { MenuOptionData } from '../menu';
import MenubarMenus from './menubar-menus.vue';
import type { MenubarCompactProps, MenubarCompactEmits, MenubarCompactSlots } from './types';

defineOptions({
  name: 'MenubarCompact'
});

const props = defineProps<MenubarCompactProps<T>>();

const emit = defineEmits<MenubarCompactEmits<T>>();

const slots = defineSlots<MenubarCompactSlots<T>>();

const menuSlotNames = computed(() => keysOf(slots).filter(key => key !== 'trigger' && key !== 'more-trigger'));

const forwardedRootProps = usePickProps(props, [
  'as',
  'modelValue',
  'defaultValue',
  'dir',
  'loop',
  'trigger',
  'delayDuration',
  'skipDelayDuration'
]);

// When collapsible, force the root to render at its natural width so the
// overflow measurement can detect triggers that exceed the container.
const effectiveRootProps = computed(() => ({
  ...forwardedRootProps.value,
  ...(props.collapsible ? { style: { minWidth: 'max-content' } } : {})
}));

const forwardedOptionsProps = usePickProps(props, [
  'items',
  'selectedValue',
  'itemProps',
  'linkProps',
  'groupProps',
  'groupLabelProps',
  'portalProps',
  'subTriggerProps',
  'subContentProps',
  'separatorProps',
  'shortcutProps'
]);

const listeners = useForwardListeners(emit);

const triggerProps = computed(() => {
  return {
    ...props.triggerProps,
    disabled: props.disabled ?? props.triggerProps?.disabled
  };
});

/**
 * Resolve the effective `disabled` for a top-level trigger item.
 *
 * `item.disabled` takes precedence, then the compact-level `disabled` (disables
 * the whole menubar), then `triggerProps.disabled`. The same resolved value is
 * forwarded to the trigger and to the as-child link so the two never disagree
 * when `Slot` merges their props.
 */
const getTriggerProps = (item: MenuOptionData<T>) => {
  const disabled = item.disabled ?? triggerProps.value.disabled;

  return {
    ...props.triggerProps,
    disabled
  };
};

const contentProps = computed(() => {
  return {
    ...props.contentProps,
    popupProps: props.popupProps ?? props.contentProps?.popupProps,
    placement: props.placement ?? props.contentProps?.placement,
    sideOffset: props.contentProps?.sideOffset ?? (props.showArrow ? 0 : 8)
  };
});

// Overflow collapsing --------------------------------------------------------
//
// When `collapsible` is enabled and the menubar content is wider than its
// container, the trailing items merge into a trailing "more" menu so the
// content always fits. The container is a transparent measurement wrapper
// around the menubar root; items are moved in/out of the "more" menu one at a
// time against the real layout so gaps, padding and custom trigger content are
// all accounted for.

const overflowElement = useTemplateRef<HTMLElement>('overflowElement');

const collapsedCount = shallowRef(0);

// Hidden options are filtered before layout math so the reflow loop counts
// exactly what `MenubarMenus` renders.
const items = computed(() => filterHiddenTreeNodes(props.items));

const hiddenCount = computed(() => Math.min(collapsedCount.value, items.value.length));
const visibleItems = computed(() => items.value.slice(0, items.value.length - hiddenCount.value));
const moreItems = computed(() => items.value.slice(items.value.length - hiddenCount.value));

const moreTriggerProps = computed(() => {
  return {
    ...props.moreProps,
    disabled: props.disabled ?? props.moreProps?.disabled
  };
});

let reflowRunning = false;
let reflowQueued = false;

/**
 * The menubar root is sized with `w-fit`, so detect overflow by comparing the
 * root's full content width against the wrapper's available width.
 */
function isOverflowing(container: HTMLElement): boolean {
  const root = container.querySelector('[data-vean-menubar-root]') as HTMLElement | null;

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

watch(
  () => props.items,
  () => {
    if (!props.collapsible) return;
    collapsedCount.value = 0;
    reflow();
  }
);

watch(
  () => props.collapsible,
  enabled => {
    // Leaving collapsible mode drops the overflow split entirely: the full list
    // renders again, so the measured count must not survive as stale state and
    // keep a trailing "more" menu alive.
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
  <template v-if="collapsible">
    <div ref="overflowElement" data-vean-menubar-overflow>
      <MenubarMenus
        :items="visibleItems"
        :more-items="moreItems"
        :root-props="effectiveRootProps"
        :listeners="listeners"
        :options-props="forwardedOptionsProps"
        :link-props="linkProps"
        :content-props="contentProps"
        :portal-props="portalProps"
        :get-trigger-props="getTriggerProps"
        :more-trigger-props="moreTriggerProps"
        :more-label="moreLabel"
        :more-icon="moreIcon"
      >
        <template #trigger="{ item }">
          <slot name="trigger" :item="item" />
        </template>
        <template #more-trigger>
          <slot name="more-trigger" />
        </template>
        <template v-for="slotName in menuSlotNames" :key="slotName" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </MenubarMenus>
    </div>
  </template>
  <template v-else>
    <MenubarMenus
      :items="visibleItems"
      :more-items="moreItems"
      :root-props="effectiveRootProps"
      :listeners="listeners"
      :options-props="forwardedOptionsProps"
      :link-props="linkProps"
      :content-props="contentProps"
      :portal-props="portalProps"
      :get-trigger-props="getTriggerProps"
      :more-trigger-props="moreTriggerProps"
      :more-label="moreLabel"
      :more-icon="moreIcon"
    >
      <template #trigger="{ item }">
        <slot name="trigger" :item="item" />
      </template>
      <template #more-trigger>
        <slot name="more-trigger" />
      </template>
      <template v-for="slotName in menuSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </MenubarMenus>
  </template>
</template>
