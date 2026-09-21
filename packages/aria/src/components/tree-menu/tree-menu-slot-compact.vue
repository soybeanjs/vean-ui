<script setup lang="ts">
import { computed } from 'vue';
import { omit } from '../../shared';
import Icon from '../_icon/icon.vue';
import { useTreeMenuUi } from './context';
import type { TreeMenuOptionSlotCompactProps } from './types';

defineOptions({
  name: 'TreeMenuSlotCompact'
});

const props = defineProps<TreeMenuOptionSlotCompactProps>();

const ui = useTreeMenuUi();

const hasChildren = computed(() => Boolean(props.item.children?.some(child => !child.hidden)));

// The badge family is UI-only, so the option renders its own badge anatomy. `open` / `contentProps`
// are consumed here instead of being forwarded to the DOM as attributes.
const badgeOpen = computed(() => props.item.badgeProps?.open ?? true);

const badgeRootProps = computed(() => omit(props.item.badgeProps ?? {}, ['open', 'contentProps']));

const badgeContentProps = computed(() => props.item.badgeProps?.contentProps);
</script>

<template>
  <slot name="item-leading" :item="item">
    <Icon v-if="item.icon" :icon="item.icon" :aria-hidden="true" />
  </slot>

  <slot name="item" :item="item">
    <div v-if="item.badge" v-bind="badgeRootProps" data-vean-tree-menu-badge-root :class="ui.badgeRoot">
      <span :class="ui.itemLabel">{{ item.label }}</span>
      <span v-if="badgeOpen" v-bind="badgeContentProps" data-vean-tree-menu-badge-content :class="ui.badgeContent">
        {{ item.badge }}
      </span>
    </div>
    <span v-else :class="ui.itemLabel">{{ item.label }}</span>
  </slot>

  <Icon v-if="showLinkIcon" icon="lucide:arrow-up-right" :class="ui.itemLinkIcon" :aria-hidden="true" />

  <span v-if="item.tag" v-bind="item.tagProps" :class="ui.itemTag">{{ item.tag }}</span>

  <slot name="item-trailing" :item="item" />

  <Icon v-if="hasChildren" icon="lucide:chevron-right" :class="ui.collapsibleIcon" :aria-hidden="true" />
</template>
