<script setup lang="ts">
import { computed } from 'vue';
import { filterHiddenTreeNodes, keysOf } from '../../shared';
import Icon from '../_icon/icon.vue';
import { PopperSub } from '../popper';
import { useNavMenuUi } from './context';
import NavMenuLink from './nav-menu-link.vue';
import NavMenuSubContent from './nav-menu-sub-content.vue';
import NavMenuSubTrigger from './nav-menu-sub-trigger.vue';
import type {
  NavMenuLinkProps,
  NavMenuSubOptionCompactProps,
  NavMenuSubOptionCompactEmits,
  NavMenuSubOptionCompactSlots,
  NavMenuOptionData
} from './types';

defineOptions({
  name: 'NavMenuSubOptionCompact'
});

const props = defineProps<NavMenuSubOptionCompactProps>();

const emit = defineEmits<NavMenuSubOptionCompactEmits>();

const slots = defineSlots<NavMenuSubOptionCompactSlots>();

const ui = useNavMenuUi();

const slotNames = computed(() => keysOf(slots));

// Children are filtered here too, so using this component standalone and using it
// through the compact list resolve the same leaf/flyout shape.
const children = computed(() => filterHiddenTreeNodes(props.item.children));

function childLinkProps(child: NavMenuOptionData): NavMenuLinkProps {
  return {
    ...props.linkProps,
    sub: true,
    selected: child.selected,
    disabled: child.disabled ?? props.linkProps?.disabled,
    to: child.to,
    href: child.href,
    target: child.target,
    external: child.external
  };
}
</script>

<template>
  <!-- leaf sub item: a plain link -->
  <NavMenuLink v-if="!children.length" v-slot="slotProps" v-bind="linkProps" sub @select="emit('select', $event)">
    <slot name="item" :item="item">
      <slot name="item-leading" :item="item">
        <Icon v-if="item.icon" :icon="item.icon" :class="ui.itemIcon" />
      </slot>
      <div :class="ui.subLinkContent">
        <span :class="ui.subLinkLabel">{{ item.label }}</span>
        <p v-if="item.description" :class="ui.subLinkDescription">{{ item.description }}</p>
      </div>
      <slot name="item-trailing" :item="item" />
      <Icon v-if="slotProps?.isHref" icon="lucide:arrow-up-right" :class="ui.linkIcon" />
    </slot>
  </NavMenuLink>

  <!-- branch sub item: a nested flyout opening to the side -->
  <PopperSub v-else>
    <NavMenuSubTrigger v-bind="subTriggerProps" :disabled="item.disabled">
      <slot name="item" :item="item">
        <slot name="item-leading" :item="item">
          <Icon v-if="item.icon" :icon="item.icon" :class="ui.itemIcon" />
        </slot>
        <div :class="ui.subLinkContent">
          <span :class="ui.subLinkLabel">{{ item.label }}</span>
          <p v-if="item.description" :class="ui.subLinkDescription">{{ item.description }}</p>
        </div>
        <slot name="item-trailing" :item="item" />
        <slot name="item-trigger-icon" :item="item">
          <Icon icon="lucide:chevron-right" :class="ui.subTriggerIcon" />
        </slot>
      </slot>
    </NavMenuSubTrigger>
    <NavMenuSubContent v-bind="subContentProps">
      <ul :class="ui.subList" data-vean-nav-menu-sub-list>
        <NavMenuSubOptionCompact
          v-for="child in children"
          :key="child.value"
          :item="child"
          :link-props="childLinkProps(child)"
          :sub-trigger-props="subTriggerProps"
          :sub-content-props="subContentProps"
          @select="emit('select', $event)"
        >
          <template v-for="slotName in slotNames" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </NavMenuSubOptionCompact>
      </ul>
    </NavMenuSubContent>
  </PopperSub>
</template>
