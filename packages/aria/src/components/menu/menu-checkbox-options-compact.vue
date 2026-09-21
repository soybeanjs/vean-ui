<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { filterHiddenTreeNodes } from '../../shared';
import { useOmitProps } from '../../composables';
import type { DefinedValue } from '../../types';
import Icon from '../_icon/icon.vue';
import Kbd from '../kbd/kbd.vue';
import MenuSeparator from '../separator/separator-root.vue';
import { useMenuUi } from './context';
import { useCommonSlotNames } from './hooks';
import MenuCheckboxGroup from './menu-checkbox-group.vue';
import MenuCheckboxItem from './menu-checkbox-item.vue';
import MenuGroupLabel from './menu-group-label.vue';
import MenuItemIndicator from './menu-item-indicator.vue';
import MenuItemSlotCompact from './menu-item-slot-compact.vue';
import type {
  MenuCheckboxOptionsCompactProps,
  MenuCheckboxOptionsCompactEmits,
  MenuCheckboxOptionsCompactSlots
} from './types';

defineOptions({
  name: 'MenuCheckboxOptionsCompact'
});

const props = defineProps<MenuCheckboxOptionsCompactProps<T>>();

const emit = defineEmits<MenuCheckboxOptionsCompactEmits<T>>();

const slots = defineSlots<MenuCheckboxOptionsCompactSlots<T>>();

const forwardedProps = useOmitProps(props, [
  'items',
  'groupLabelProps',
  'checkboxItemProps',
  'indicatorProps',
  'shortcutProps',
  'separatorProps'
]);

const commonSlotNames = useCommonSlotNames(slots);

const filteredItems = computed(() => filterHiddenTreeNodes(props.items));

const ui = useMenuUi();
</script>

<template>
  <MenuCheckboxGroup v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <template v-for="item in filteredItems" :key="item.value">
      <MenuGroupLabel v-if="item.isGroupLabel" v-bind="groupLabelProps">
        <MenuItemSlotCompact :icon="item.icon" :label="item.label">
          <template v-for="slotName in commonSlotNames">
            <slot :name="slotName" v-bind="item" />
          </template>
        </MenuItemSlotCompact>
      </MenuGroupLabel>
      <MenuCheckboxItem
        v-else
        v-bind="checkboxItemProps"
        :value="item.value"
        :disabled="item.disabled ?? checkboxItemProps?.disabled"
        :text-value="item.textValue"
        @select="emit('select', item, $event)"
      >
        <MenuItemSlotCompact :icon="item.icon" :label="item.label">
          <template #indicator>
            <MenuItemIndicator v-bind="indicatorProps">
              <slot name="item-indicator-icon" v-bind="item">
                <Icon icon="lucide:check" />
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
      </MenuCheckboxItem>
      <MenuSeparator v-if="item.separator" v-bind="separatorProps" />
    </template>
  </MenuCheckboxGroup>
</template>
