<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue';
import { filterHiddenTreeNodes, keysOf } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import type { Placement } from '../../types';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import DropdownMenuCompact from '../dropdown-menu/dropdown-menu-compact.vue';
import Link from '../link/link.vue';
import type { LinkProps } from '../link/types';
import {
  focusCollapsedMenuPopupItem,
  getCollapsedMenuPopupId,
  isCollapsedMenuBackwardKey,
  isCollapsedMenuForwardKey
} from './shared';
import { useTreeMenuRootContext, useTreeMenuUi } from './context';
import TreeMenuButton from './tree-menu-button.vue';
import TreeMenuCollapsible from './tree-menu-collapsible.vue';
import TreeMenuItem from './tree-menu-item.vue';
import TreeMenuSlotCompact from './tree-menu-slot-compact.vue';
import TreeMenuSub from './tree-menu-sub.vue';
import TreeMenuTooltipCompact from './tree-menu-tooltip-compact.vue';
import type { TreeMenuOptionCompactProps, TreeMenuOptionCompactEmits, TreeMenuBaseOptionData } from './types';

defineOptions({
  name: 'TreeMenuOptionCompact'
});

const props = withDefaults(defineProps<TreeMenuOptionCompactProps>(), {
  as: 'li'
});

const emit = defineEmits<TreeMenuOptionCompactEmits>();

type Slots = {
  item: (props: { item: TreeMenuBaseOptionData }) => any;
  leading: (props: { item: TreeMenuBaseOptionData }) => any;
  trailing: (props: { item: TreeMenuBaseOptionData }) => any;
};

const slots = defineSlots<Slots>();

const forwardedOptionProps = useOmitProps(props, ['as', 'item']);

const slotNames = computed(() => keysOf(slots));

const ui = useTreeMenuUi();

const messages = useLocaleMessages();

const { collapsed, modelValue, onModelValueChange } = useTreeMenuRootContext('TreeMenuCompactOption');

const dir = useDirection();

// Children are filtered here as well, so using this component standalone and
// using it through `TreeMenuOptionsCompact` resolve the same branch/leaf shape.
const children = computed(() => filterHiddenTreeNodes(props.item.children));

const hasChildren = computed(() => Boolean(children.value.length));

const hasChildSelected = computed(() => {
  if (modelValue.value === props.item.value) {
    return false;
  }

  return Boolean(props.selectedPaths?.includes(props.item.value));
});

const isLink = computed(() => Boolean(props.item.to || props.item.href));

const linkProps = computed<LinkProps>(() => {
  if (!isLink.value) {
    return {};
  }

  const { disabled, to, href, target, external } = props.item;

  return {
    ...props.linkProps,
    disabled: disabled ?? props.linkProps?.disabled,
    to,
    href,
    target,
    external
  };
});

const showDropdown = computed(() => collapsed.value && hasChildren.value);

// Controls the collapsed popup so the keyboard can open it and track its state.
// The item's `dropdownMenuProps.open` seeds the initial state so a consumer
// forcing the popup open still renders it.
const dropdownOpen = shallowRef(Boolean(props.item.dropdownMenuProps?.open));

// The item button that owns the collapsed popup; keyboard closes restore focus
// to it so the roving focus context survives the teleported popup unmount.
const buttonElement = shallowRef<HTMLElement>();

const tooltip = computed(() => (collapsed.value && !showDropdown.value ? props.item.label : undefined));

const reversedSide = computed<Placement>(() => (props.side === 'left' ? 'right' : 'left'));

const tooltipProps = computed(() => ({
  ...props.item.tooltipProps,
  placement: props.item.tooltipProps?.placement ?? reversedSide.value
}));

const dropdownMenuProps = computed(() => ({
  ...props.item.dropdownMenuProps,
  placement: props.item.dropdownMenuProps?.placement ?? reversedSide.value,
  trigger: props.item.dropdownMenuProps?.trigger ?? 'hover'
}));

const showActions = computed(() => !collapsed.value && Boolean(props.item.actions?.length));

const actionAriaLabel = computed(() => messages.value.treeMenu.openActions.replace('{label}', props.item.label));

const handleActive = () => {
  if (props.item.disabled) return;

  onModelValueChange(props.item.value);
};

const handleDropdownMenuSelect = (item: TreeMenuBaseOptionData) => {
  if (props.item.disabled) return;

  onModelValueChange(item.value);
  emit('selectDropdown', item.value);
};

// Collapsed sidebar: the forward key opens the item's dropdown popup, then
// moves focus to its first menu item once the popup is already open.
const handleButtonKeydown = (event: KeyboardEvent) => {
  buttonElement.value = event.currentTarget as HTMLElement;

  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
  if (!showDropdown.value || !isCollapsedMenuForwardKey(event.key, dir.value)) return;

  event.preventDefault();

  if (!dropdownOpen.value) {
    dropdownOpen.value = true;
    return;
  }

  focusCollapsedMenuPopupItem(event.currentTarget as HTMLElement);
};

// The popup is teleported, so its key events never bubble back here; a
// capture-phase document listener scopes keyboard closing to the open popup.
// Escape and the backward key close the popup and restore focus to the item
// button, mirroring the expanded state where the backward key collapses a
// branch onto itself.
const handlePopupKeydown = (event: KeyboardEvent) => {
  const button = buttonElement.value;

  if (!button) return;

  const popupId = getCollapsedMenuPopupId(button);
  const target = event.target instanceof Element ? event.target : null;

  if (!popupId || !target?.closest(`[id="${popupId}"]`)) return;
  if (event.key !== 'Escape' && !isCollapsedMenuBackwardKey(event.key, dir.value)) return;

  event.preventDefault();
  dropdownOpen.value = false;
  button.focus();
};

watch(dropdownOpen, open => {
  if (open) {
    document.addEventListener('keydown', handlePopupKeydown, true);
  } else {
    document.removeEventListener('keydown', handlePopupKeydown, true);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handlePopupKeydown, true);
});
</script>

<template>
  <TreeMenuItem v-if="!hasChildren" v-bind="itemProps" :as="as" :value="item.value" :disabled="item.disabled">
    <TreeMenuButton v-if="isLink" v-bind="buttonProps" as-child :disabled="item.disabled">
      <Link v-slot="{ isHref }" v-bind="linkProps">
        <TreeMenuSlotCompact :item="item" :show-link-icon="isHref">
          <template v-for="slotName in slotNames" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </TreeMenuSlotCompact>
      </Link>
    </TreeMenuButton>
    <TreeMenuButton v-else v-bind="buttonProps" :disabled="item.disabled">
      <TreeMenuSlotCompact :item="item">
        <template v-for="slotName in slotNames" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </TreeMenuSlotCompact>
    </TreeMenuButton>
    <DropdownMenuCompact
      v-if="showActions"
      v-bind="item.actionMenuProps"
      :items="item.actions ?? []"
      @select="item.onActionSelect"
    >
      <template #trigger>
        <Button :aria-label="actionAriaLabel" :class="ui.itemAction" :disabled="item.disabled" @click.stop>
          <Icon icon="lucide:ellipsis" :aria-hidden="true" />
        </Button>
      </template>
    </DropdownMenuCompact>
    <TreeMenuTooltipCompact v-if="tooltip" v-bind="tooltipProps" :content="tooltip">
      <template #trigger>
        <Link v-if="isLink" v-bind="linkProps" :class="ui.itemAbsolute" @click="handleActive" />
        <div v-else :class="ui.itemAbsolute" @click="handleActive" />
      </template>
    </TreeMenuTooltipCompact>
  </TreeMenuItem>
  <TreeMenuItem v-else v-bind="itemProps" as-child :value="item.value" :disabled="item.disabled">
    <TreeMenuCollapsible v-bind="collapsibleProps" :as="as" :disabled-collapsible="collapsed">
      <template #trigger>
        <TreeMenuButton
          v-bind="buttonProps"
          :disabled="item.disabled"
          disabled-select
          :data-child-selected="hasChildSelected ? '' : undefined"
          @keydown="handleButtonKeydown"
        >
          <TreeMenuSlotCompact :item="item">
            <template v-for="slotName in slotNames" #[slotName]="slotProps">
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </TreeMenuSlotCompact>
        </TreeMenuButton>
      </template>
      <TreeMenuSub v-bind="subProps">
        <TreeMenuOptionCompact
          v-for="child in children"
          :key="child.value"
          v-bind="forwardedOptionProps"
          :item="child"
          :side="side"
          :selected-paths="selectedPaths"
          @select-dropdown="emit('selectDropdown', $event)"
        >
          <template v-for="slotName in slotNames" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </TreeMenuOptionCompact>
      </TreeMenuSub>
      <template #extra>
        <DropdownMenuCompact
          v-if="showDropdown"
          v-bind="dropdownMenuProps"
          v-model:open="dropdownOpen"
          :items="children"
          :disabled="item.disabled"
          :selected-value="modelValue"
          :data-menu="item.label"
          @select="handleDropdownMenuSelect"
        >
          <template #trigger>
            <div role="button" :aria-label="item.label" :class="ui.itemAbsolute" @click="handleActive" />
          </template>
        </DropdownMenuCompact>
        <DropdownMenuCompact
          v-else-if="showActions"
          v-bind="item.actionMenuProps"
          :items="item.actions ?? []"
          @select="item.onActionSelect"
        >
          <template #trigger>
            <Button :aria-label="actionAriaLabel" :class="ui.itemAction" :disabled="item.disabled" @click.stop>
              <Icon icon="lucide:ellipsis" :aria-hidden="true" />
            </Button>
          </template>
        </DropdownMenuCompact>
      </template>
    </TreeMenuCollapsible>
  </TreeMenuItem>
</template>
