<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { CSSProperties } from 'vue';
import { DialogRoot, DialogPortal, DialogOverlay, DialogPopup } from '../dialog';
import { layoutCssVars } from './shared';
import { useLayoutRootContext, useLayoutUi } from './context';
import type { LayoutMobileProps } from './types';

defineOptions({
  name: 'LayoutMobile',
  inheritAttrs: false
});

defineProps<LayoutMobileProps>();

const attrs = useAttrs();

const { mobileOpen, mobileSidebarWidth, headerHeightRem, onMobileOpenChange } = useLayoutRootContext('LayoutMobile');

const ui = useLayoutUi();

const style = computed<CSSProperties>(() => {
  return {
    [layoutCssVars.sidebarWidth]: `${mobileSidebarWidth.value}rem`,
    // The drawer is teleported out of the root, so the root's own declarations do
    // not reach this subtree: re-publish the geometry the sidebar content reads.
    [layoutCssVars.headerHeight]: `${headerHeightRem.value}rem`
  };
});
</script>

<template>
  <DialogRoot :open="mobileOpen" @update:open="onMobileOpenChange">
    <DialogPortal>
      <DialogOverlay :class="ui.mobileOverlay" />
      <DialogPopup data-vean-layout-mobile :class="ui.mobileDrawer" :style="style">
        <div v-bind="attrs" :class="ui.mobile" data-sidebar="sidebar" data-mobile>
          <slot />
        </div>
      </DialogPopup>
    </DialogPortal>
  </DialogRoot>
</template>
