<script setup lang="ts">
import { computed, useId } from 'vue';
import { useOmitProps } from '../../composables';
import LayoutContent from './layout-content.vue';
import LayoutFooter from './layout-footer.vue';
import LayoutHeader from './layout-header.vue';
import LayoutMain from './layout-main.vue';
import LayoutPlaceholder from './layout-placeholder.vue';
import LayoutRail from './layout-rail.vue';
import LayoutRoot from './layout-root.vue';
import LayoutSidebar from './layout-sidebar.vue';
import LayoutTab from './layout-tab.vue';
import type { LayoutCompactProps, LayoutCompactEmits, LayoutCompactSlots } from './types';

defineOptions({
  name: 'LayoutCompact'
});

const props = withDefaults(defineProps<LayoutCompactProps>(), {
  open: undefined,
  // Unset on purpose: an absent boolean prop is cast to `false` downstream, which
  // would turn the drawer into a controlled state that never opens.
  mobileOpen: undefined,
  defaultOpen: true,
  sidebarVisible: true,
  headerVisible: true,
  tabVisible: true,
  footerVisible: true,
  fixedTop: true
});

const emit = defineEmits<LayoutCompactEmits>();

defineSlots<LayoutCompactSlots>();

const _scrollIdFallback = useId();
const resolvedScrollId = computed(() => props.scrollId ?? `vean-layout-scroll-${_scrollIdFallback}`);

const forwardedProps = useOmitProps(props, [
  'sidebarProps',
  'railProps',
  'mainProps',
  'headerProps',
  'tabProps',
  'contentProps',
  'footerProps',
  'mobileProps'
]);
</script>

<template>
  <LayoutRoot
    v-slot="slotProps"
    v-bind="forwardedProps"
    @update:open="emit('update:open', $event)"
    @update:mobile-open="emit('update:mobileOpen', $event)"
  >
    <LayoutSidebar v-bind="sidebarProps">
      <slot v-bind="slotProps" name="sidebar" />
      <LayoutRail v-bind="railProps" />
    </LayoutSidebar>
    <LayoutMain v-bind="mainProps" :id="scrollBehavior === 'wrapper' ? resolvedScrollId : undefined">
      <LayoutHeader v-bind="headerProps">
        <slot name="header" />
      </LayoutHeader>
      <LayoutPlaceholder type="header" />
      <LayoutTab v-bind="tabProps">
        <slot name="tab" />
      </LayoutTab>
      <LayoutPlaceholder type="tab" />
      <LayoutContent v-bind="contentProps" :id="scrollBehavior === 'content' ? resolvedScrollId : undefined">
        <slot />
      </LayoutContent>
      <LayoutFooter v-bind="footerProps">
        <slot name="footer" />
      </LayoutFooter>
      <LayoutPlaceholder type="footer" />
    </LayoutMain>
  </LayoutRoot>
</template>
