<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { popperCssVars } from '../popper/shared';
import { PopperPopup } from '../popper';
import { popconfirmCssVars } from './shared';
import type { PopconfirmPopupProps } from './types';

defineOptions({
  name: 'PopconfirmPopup'
});

const props = defineProps<PopconfirmPopupProps>();

const cssVarsStyle: CSSProperties = {
  [popconfirmCssVars.transformOrigin]: `var(${popperCssVars.transformOrigin})`,
  [popconfirmCssVars.availableWidth]: `var(${popperCssVars.availableWidth})`,
  [popconfirmCssVars.availableHeight]: `var(${popperCssVars.availableHeight})`,
  [popconfirmCssVars.anchorWidth]: `var(${popperCssVars.anchorWidth})`,
  [popconfirmCssVars.anchorHeight]: `var(${popperCssVars.anchorHeight})`
};
</script>

<template>
  <PopperPopup v-bind="props" data-vean-popconfirm-popup role="dialog" :style="cssVarsStyle">
    <slot />
  </PopperPopup>
</template>
