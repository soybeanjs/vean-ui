<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { getDisclosureState } from '../../shared';
import { useForwardElement, useRovingFocusGroupItem } from '../../composables';
import type { VNodeRef } from '../../types';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import Link from '../link/link.vue';
import type { LinkProps } from '../link/types';
import {
  findActivePath,
  focusFirstLevelPaneItem,
  hasVisibleChildren,
  isFirstLevelBackwardExpandKey,
  isFirstLevelExpandKey,
  isFirstLevelForwardExpandKey
} from './shared';
import { useSplitNavRootContext, useSplitNavUi } from './context';
import type { FirstLevelItemProps } from './types';

defineOptions({
  name: 'SplitNavFirstLevelItem'
});

const props = defineProps<FirstLevelItemProps>();

const {
  dir,
  items,
  mode,
  modelValue,
  openPath,
  railItemElements,
  horizontalMountedId,
  verticalMountedId,
  onItemActivate
} = useSplitNavRootContext('SplitNavFirstLevelItem');

const ui = useSplitNavUi();

// Register this rail item so panes (possibly teleported away) can hand focus
// back to it without querying the document across other instances.
const [, setRegisteredItemElement] = useForwardElement<HTMLElement>(element => {
  railItemElements.set(props.item.value, element);
});

onBeforeUnmount(() => {
  railItemElements.delete(props.item.value);
});

const isLink = computed(() => Boolean(props.item.to || props.item.href));

const isBranch = computed(() => hasVisibleChildren(props.item));

const isSelected = computed(() => !isBranch.value && modelValue.value === props.item.value);

const isOpen = computed(() => isBranch.value && openPath.value.includes(props.item.value));

const hasChildSelected = computed(() => {
  if (!isBranch.value || modelValue.value === props.item.value) {
    return false;
  }

  return findActivePath(items.value, modelValue.value).includes(props.item.value);
});

const dataState = computed(() => getDisclosureState(isOpen.value));

const ariaCurrent = computed(() => (isSelected.value ? 'page' : undefined));

const ariaExpanded = computed(() => (isBranch.value ? isOpen.value : undefined));

// Roving focus item as a hook: exposes the collection item + roving-focus data attributes
// (alongside `data-vean-split-nav-first-level-item`) merged into the button bindings.
const { itemProps, setItemElement: setRovingItemElement } = useRovingFocusGroupItem({
  tabStopId: computed(() => props.item.value),
  focusable: computed(() => !props.item.disabled),
  active: computed(() => isSelected.value || isOpen.value)
});

function setItemElement(nodeRef: VNodeRef) {
  setRegisteredItemElement(nodeRef);
  setRovingItemElement(nodeRef);
}

// Focus this instance's rail item by value, resolving through the registry.
function focusRailItem(value?: string) {
  if (!value) return;

  railItemElements.get(value)?.focus();
}

const linkProps = computed<LinkProps>(() => {
  if (!isLink.value) {
    return {};
  }

  const { disabled, to, href, target, external } = props.item;

  return {
    disabled,
    to,
    href,
    target,
    external
  };
});

function activate(event?: Event) {
  if (props.item.disabled) {
    return;
  }

  onItemActivate(props.item.value, event);
}

function handleClick(event: Event) {
  activate(event);
}

function handleKeyDown(event: KeyboardEvent) {
  if (props.item.disabled) {
    return;
  }

  const isActivateKey = event.key === 'Enter' || event.key === ' ';
  const isExpandKey = isBranch.value && isFirstLevelExpandKey(event.key, props.orientation);
  // The vertical backward key is handled for leaves as well: a nested rail
  // always releases the focus to its parent rail.
  const isBackwardKey =
    props.orientation === 'vertical' && isFirstLevelBackwardExpandKey(event.key, props.orientation, dir.value);

  if (!isActivateKey && !isExpandKey && !isBackwardKey) {
    return;
  }

  // On an already-open branch, the forward expand key moves focus to the first
  // item of the open pane instead of re-activating the branch.
  const isForwardExpandKey =
    isExpandKey && isOpen.value && isFirstLevelForwardExpandKey(event.key, props.orientation, dir.value);

  if (isForwardExpandKey) {
    event.preventDefault();
    focusFirstLevelPaneItem({
      itemElement: event.currentTarget as HTMLElement,
      orientation: props.orientation,
      mode: mode.value,
      horizontalMountedId: horizontalMountedId.value,
      verticalMountedId: verticalMountedId.value
    });

    return;
  }

  // The backward key never activates: on a nested rail any item hands focus
  // back to the parent rail item that owns this pane, while a top-level rail
  // keeps the focus in place.
  if (isBackwardKey) {
    const element = event.currentTarget as HTMLElement;
    const pane = element.closest('[data-vean-split-nav-dual-vertical]');
    const isNestedRail = Boolean(pane && !pane.hasAttribute('data-vean-split-nav-root'));

    if (isNestedRail) {
      event.preventDefault();
      focusRailItem(openPath.value[0]);
    }

    return;
  }

  if (!isLink.value || event.key === ' ' || isExpandKey) {
    event.preventDefault();
  }

  activate(event);
}
</script>

<template>
  <Button
    :ref="setItemElement"
    v-bind="itemProps"
    data-vean-split-nav-first-level-item
    :class="ui.firstLevelItem"
    :as-child="isLink"
    :disabled="item.disabled"
    role="menuitem"
    :data-state="dataState"
    :data-selected="isSelected"
    :data-orientation="orientation"
    :data-disabled="item.disabled ? '' : undefined"
    :data-value="item.value"
    :data-child-selected="hasChildSelected ? '' : undefined"
    :aria-current="ariaCurrent"
    :aria-expanded="ariaExpanded"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <Link v-if="isLink" v-bind="linkProps">
      <slot :item="item" :selected="isSelected" :open="isOpen">
        <Icon v-if="item.icon" :icon="item.icon" :class="ui.firstLevelItemIcon" :aria-hidden="true" />
        <span :class="ui.firstLevelItemLabel">{{ item.label }}</span>
      </slot>
    </Link>
    <template v-else>
      <slot :item="item" :selected="isSelected" :open="isOpen">
        <Icon v-if="item.icon" :icon="item.icon" :class="ui.firstLevelItemIcon" :aria-hidden="true" />
        <span :class="ui.firstLevelItemLabel">{{ item.label }}</span>
      </slot>
    </template>
  </Button>
</template>
