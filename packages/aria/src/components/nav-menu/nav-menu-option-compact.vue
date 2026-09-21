<script setup lang="ts">
import { computed } from 'vue';
import { filterHiddenTreeNodes, keysOf } from '../../shared';
import Icon from '../_icon/icon.vue';
import { useNavMenuRootContext, useNavMenuUi } from './context';
import NavMenuContent from './nav-menu-content.vue';
import NavMenuItem from './nav-menu-item.vue';
import NavMenuLink from './nav-menu-link.vue';
import NavMenuSubOptionCompact from './nav-menu-sub-option-compact.vue';
import NavMenuTrigger from './nav-menu-trigger.vue';
import type {
  NavMenuLinkProps,
  NavMenuOptionCompactProps,
  NavMenuOptionCompactEmits,
  NavMenuOptionCompactSlots,
  NavMenuOptionData
} from './types';

defineOptions({
  name: 'NavMenuOptionCompact'
});

const props = defineProps<NavMenuOptionCompactProps>();

const emit = defineEmits<NavMenuOptionCompactEmits>();

const slots = defineSlots<NavMenuOptionCompactSlots>();

const ui = useNavMenuUi();

const slotNames = computed(() => keysOf(slots));

const { modelValue, disableHoverTrigger, onItemDismiss } = useNavMenuRootContext('NavMenuOptionCompact');

// A root-level leaf link has no flyout to show: entering it while another menu is open
// (hover-driven) must close that menu, instead of the shared corridor keeping it open.
const onLeafPointerEnter = () => {
  if (disableHoverTrigger.value || !modelValue.value) return;
  onItemDismiss();
};

const isLink = computed(() => Boolean(props.item.to || props.item.href));

// Children are filtered here too, so using this component standalone and using it
// through `NavMenuCompact` resolve the same leaf/flyout shape.
const children = computed(() => filterHiddenTreeNodes(props.item.children));

const linkProps = computed<NavMenuLinkProps>(() =>
  isLink.value
    ? {
        ...props.linkProps,
        selected: props.item.selected,
        disabled: props.item.disabled ?? props.linkProps?.disabled,
        to: props.item.to,
        href: props.item.href,
        target: props.item.target,
        external: props.item.external
      }
    : {}
);

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
  <NavMenuItem v-bind="itemProps" :value="item.value">
    <!-- leaf item: a single link; entering it closes any open menu -->
    <NavMenuLink
      v-if="!children.length"
      v-bind="linkProps"
      @pointerenter="onLeafPointerEnter"
      @select="emit('select', $event)"
    >
      <slot name="item" :item="item">
        <slot name="item-leading" :item="item">
          <Icon v-if="item.icon" :icon="item.icon" :class="ui.itemIcon" />
        </slot>
        <span>{{ item.label }}</span>
        <slot name="item-trailing" :item="item" />
      </slot>
    </NavMenuLink>

    <!-- item with children: trigger + floating content with sub links -->
    <template v-else>
      <NavMenuTrigger v-bind="triggerProps" :disabled="item.disabled" :as-child="isLink">
        <component :is="isLink ? NavMenuLink : 'template'" v-bind="linkProps" @select="emit('select', $event)">
          <slot name="item" :item="item" :is-trigger="true">
            <slot name="item-leading" :item="item">
              <Icon v-if="item.icon" :icon="item.icon" :class="ui.itemIcon" />
            </slot>
            <span>{{ item.label }}</span>
            <slot name="item-trailing" :item="item" />
            <slot name="item-trigger-icon" :item="item">
              <Icon icon="lucide:chevron-down" :class="ui.triggerIcon" />
            </slot>
          </slot>
        </component>
      </NavMenuTrigger>
      <NavMenuContent v-bind="contentProps">
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
      </NavMenuContent>
    </template>
  </NavMenuItem>
</template>
