<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { popperCssVars } from '../popper/shared';
import { PopperPopup } from '../popper';
import { popoverCssVars } from './shared';
import type { PopoverPopupProps } from './types';

defineOptions({
  name: 'PopoverPopup'
});

const props = defineProps<PopoverPopupProps>();

const cssVarsStyle: CSSProperties = {
  [popoverCssVars.transformOrigin]: `var(${popperCssVars.transformOrigin})`,
  [popoverCssVars.availableWidth]: `var(${popperCssVars.availableWidth})`,
  [popoverCssVars.availableHeight]: `var(${popperCssVars.availableHeight})`,
  [popoverCssVars.anchorWidth]: `var(${popperCssVars.anchorWidth})`,
  [popoverCssVars.anchorHeight]: `var(${popperCssVars.anchorHeight})`
};
</script>

<template>
  <PopperPopup v-bind="props" data-vean-popover-popup role="dialog" :style="cssVarsStyle">
    <slot />
  </PopperPopup>
</template>
