<script setup lang="ts" generic="T extends AcceptableBooleanValue = AcceptableBooleanValue">
import { computed } from 'vue';
import { filterHiddenTreeNodes } from '../../shared';
import { useOmitProps, useForwardListeners } from '../../composables';
import type { AcceptableBooleanValue } from '../../types';
import Icon from '../_icon/icon.vue';
import Kbd from '../kbd/kbd.vue';
import MenuSeparator from '../separator/separator-root.vue';
import { useMenuUi } from './context';
import { useCommonSlotNames } from './hooks';
import MenuGroupLabel from './menu-group-label.vue';
import MenuItemIndicator from './menu-item-indicator.vue';
import MenuItemSlotCompact from './menu-item-slot-compact.vue';
import MenuRadioGroup from './menu-radio-group.vue';
import MenuRadioItem from './menu-radio-item.vue';
import type { MenuRadioOptionsCompactProps, MenuRadioOptionsCompactEmits, MenuRadioOptionsCompactSlots } from './types';

defineOptions({
  name: 'MenuRadioOptionsCompact'
});

const props = defineProps<MenuRadioOptionsCompactProps<T>>();

const emit = defineEmits<MenuRadioOptionsCompactEmits<T>>();

const slots = defineSlots<MenuRadioOptionsCompactSlots<T>>();

const forwardedProps = useOmitProps(props, [
  'items',
  'groupLabelProps',
  'radioItemProps',
  'indicatorProps',
  'shortcutProps',
  'separatorProps'
]);

const listeners = useForwardListeners(emit);

const commonSlotNames = useCommonSlotNames(slots);

const filteredItems = computed(() => filterHiddenTreeNodes(props.items));

const ui = useMenuUi();
</script>

<template>
  <MenuRadioGroup v-bind="forwardedProps" v-on="listeners">
    <template v-for="item in filteredItems" :key="String(item.value)">
      <MenuGroupLabel v-if="item.isGroupLabel" v-bind="groupLabelProps">
        <MenuItemSlotCompact :icon="item.icon" :label="item.label">
          <template v-for="slotName in commonSlotNames">
            <slot :name="slotName" v-bind="item" />
          </template>
        </MenuItemSlotCompact>
      </MenuGroupLabel>
      <MenuRadioItem
        v-else
        v-bind="radioItemProps"
        :value="item.value"
        :disabled="item.disabled ?? radioItemProps?.disabled"
        :text-value="item.textValue"
        @select="emit('select', item, $event)"
      >
        <MenuItemSlotCompact :icon="item.icon" :label="item.label">
          <template #indicator>
            <MenuItemIndicator v-bind="indicatorProps">
              <slot name="item-indicator-icon" v-bind="item">
                <Icon icon="icon-park-outline:dot" />
              </slot>
            </MenuItemIndicator>
          </template>
          <template v-for="slotName in commonSlotNames">
            <slot :name="slotName" v-bind="item" />
          </template>
          <template v-if="item.shortcut" #shortcut>
            <Kbd v-bind="shortcutProps" :value="item.shortcut" :class="ui.shortcut" />
          </template>
        </MenuItemSlotCompact>
      </MenuRadioItem>
      <MenuSeparator v-if="item.separator" v-bind="separatorProps" />
    </template>
  </MenuRadioGroup>
</template>
