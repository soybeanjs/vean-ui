<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { filterHiddenTreeNodes, keysOf } from '../../shared';
import { useForwardListeners, useOmitProps } from '../../composables';
import type { DefinedValue } from '../../types';
import Icon from '../_icon/icon.vue';
import Kbd from '../kbd/kbd.vue';
import Link from '../link/link.vue';
import type { LinkProps } from '../link/types';
import MenuPortal from '../portal/portal.vue';
import MenuSeparator from '../separator/separator-root.vue';
import { useMenuOptionsCompactContext, useMenuUi } from './context';
import { useCommonSlotNames } from './hooks';
import MenuGroupLabel from './menu-group-label.vue';
import MenuGroup from './menu-group.vue';
import MenuItemSlotCompact from './menu-item-slot-compact.vue';
import MenuItem from './menu-item.vue';
import MenuSubContent from './menu-sub-content.vue';
import MenuSubTrigger from './menu-sub-trigger.vue';
import MenuSub from './menu-sub.vue';
import type { MenuOptionCompactProps, MenuOptionCompactEmits, MenuOptionCompactSlots } from './types';

defineOptions({
  name: 'MenuOptionCompact',
  inheritAttrs: false
});

const props = defineProps<MenuOptionCompactProps<T>>();

const emit = defineEmits<MenuOptionCompactEmits<T>>();

const forwardedListeners = useForwardListeners(emit);

const slots = defineSlots<MenuOptionCompactSlots<T>>();

const forwardedItemProps = useOmitProps(props, ['item']);

const slotNames = computed(() => keysOf(slots));

const commonSlotNames = useCommonSlotNames(slots);

const ui = useMenuUi();

const { selectedValue, selectedPaths } = useMenuOptionsCompactContext('MenuOptionCompact');

const isSelected = computed(() => selectedValue.value === props.item.value);

const hasChildSelected = computed(() => selectedPaths.value.includes(props.item.value));

// Children are filtered here too, so using this component standalone and using
// it through `MenuOptionsCompact` resolve the same leaf/submenu shape.
const children = computed(() => filterHiddenTreeNodes(props.item.children));

const linkProps = computed<LinkProps>(() =>
  props.item.to || props.item.href
    ? {
        ...props.linkProps,
        disabled: props.item.disabled ?? props.linkProps?.disabled,
        to: props.item.to,
        href: props.item.href,
        target: props.item.target,
        external: props.item.external
      }
    : {}
);
</script>

<template>
  <MenuGroupLabel v-if="item.isGroupLabel" v-bind="groupLabelProps">
    <MenuItemSlotCompact :icon="item.icon" :label="item.label">
      <template v-for="slotName in commonSlotNames">
        <slot :name="slotName" :item="item" />
      </template>
    </MenuItemSlotCompact>
  </MenuGroupLabel>
  <MenuItem
    v-else-if="item.to || item.href"
    v-bind="itemProps"
    as-child
    :disabled="item.disabled ?? itemProps?.disabled ?? linkProps?.disabled"
    :text-value="item.textValue"
    :data-selected="isSelected"
    @select="emit('select', item, $event)"
  >
    <Link v-slot="{ isHref }" v-bind="linkProps">
      <MenuItemSlotCompact :icon="item.icon" :label="item.label">
        <template v-for="slotName in commonSlotNames">
          <slot :name="slotName" :item="item" />
        </template>
        <template v-if="isHref" #link-icon>
          <slot name="item-link-icon" :item="item">
            <Icon icon="lucide:arrow-up-right" :class="ui.itemLinkIcon" />
          </slot>
        </template>
      </MenuItemSlotCompact>
    </Link>
  </MenuItem>
  <MenuItem
    v-else-if="!children.length"
    v-bind="itemProps"
    :disabled="item.disabled ?? itemProps?.disabled"
    :text-value="item.textValue"
    :data-selected="isSelected"
    @select="emit('select', item, $event)"
  >
    <MenuItemSlotCompact :icon="item.icon" :label="item.label">
      <template v-for="slotName in commonSlotNames">
        <slot :name="slotName" :item="item" />
      </template>
      <template #shortcut>
        <Kbd v-if="item.shortcut" v-bind="shortcutProps" :value="item.shortcut" :class="ui.shortcut" />
      </template>
    </MenuItemSlotCompact>
  </MenuItem>
  <MenuSub v-else v-bind="subProps">
    <MenuSubTrigger
      v-bind="subTriggerProps"
      :disabled="item.disabled ?? subTriggerProps?.disabled"
      :text-value="item.textValue"
      :data-child-selected="hasChildSelected ? '' : undefined"
    >
      <MenuItemSlotCompact :icon="item.icon" :label="item.label">
        <template v-for="slotName in commonSlotNames">
          <slot :name="slotName" :item="item" />
        </template>
        <template #trigger-icon>
          <slot name="item-trigger-icon" :item="item">
            <Icon icon="lucide:chevron-right" :class="ui.subTriggerIcon" />
          </slot>
        </template>
      </MenuItemSlotCompact>
    </MenuSubTrigger>
    <MenuSeparator v-if="item.separator" v-bind="separatorProps" />
    <MenuPortal v-bind="portalProps">
      <MenuSubContent v-bind="subContentProps" v-on="forwardedListeners">
        <MenuGroup v-bind="groupProps">
          <MenuOptionCompact
            v-for="child in children"
            :key="child.value"
            v-bind="forwardedItemProps"
            :item="child"
            v-on="forwardedListeners"
          >
            <template v-for="slotName in slotNames" #[slotName]="slotProps">
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </MenuOptionCompact>
        </MenuGroup>
      </MenuSubContent>
    </MenuPortal>
  </MenuSub>
  <MenuSeparator v-if="item.separator && !children.length" v-bind="separatorProps" />
</template>
