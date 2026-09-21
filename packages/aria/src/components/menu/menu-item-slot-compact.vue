<script setup lang="ts">
import Icon from '../_icon/icon.vue';
import type { IconValue } from '../_icon/types';
import { useMenuUi } from './context';

interface Props {
  icon?: IconValue;
  label: string;
}

defineOptions({
  name: 'MenuItemSlotCompact'
});

defineProps<Props>();

const ui = useMenuUi();

type Slots = {
  indicator?: () => any;
  item?: () => any;
  'item-leading'?: () => any;
  'item-trailing'?: () => any;
  'link-icon'?: () => any;
  'trigger-icon'?: () => any;
  shortcut?: () => any;
};

defineSlots<Slots>();
</script>

<template>
  <slot name="indicator" />
  <slot name="item">
    <slot name="item-leading">
      <Icon v-if="icon" :icon="icon" :class="ui.itemIcon" />
    </slot>
    <span>{{ label }}</span>
    <slot name="link-icon" />
    <slot name="item-trailing" />
    <slot name="trigger-icon" />
    <slot name="shortcut" />
  </slot>
</template>
