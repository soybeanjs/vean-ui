<script setup lang="ts">
import { computed, ref, watch, watchPostEffect } from 'vue';
import { useMounted, useResizeObserver } from '@vueuse/core';
import { Primitive } from '../primitive';
import { tabsCssVars } from './shared';
import { useTabsRootContext, useTabsUi } from './context';
import type { TabsIndicatorProps } from './types';

defineOptions({
  name: 'TabsIndicator'
});

defineProps<TabsIndicatorProps>();

const { listElement, modelValue, dir, orientation } = useTabsRootContext('TabsIndicator');

const cls = useTabsUi('indicator');

const isMounted = useMounted();

interface IndicatorStyle {
  size: number | null;
  position: number | null;
}

const indicatorStyle = ref<IndicatorStyle>({
  size: null,
  position: null
});

const style = computed(() => {
  return {
    [tabsCssVars.indicatorSize]: `${indicatorStyle.value.size}px`,
    [tabsCssVars.indicatorPosition]: `${indicatorStyle.value.position}px`
  };
});

const tabs = ref<Array<HTMLElement>>([]);

function getHorizontalIndicatorPosition(activeTab: HTMLButtonElement) {
  const list = listElement.value;

  if (!list || dir.value !== 'rtl') {
    return activeTab.offsetLeft;
  }

  return list.clientWidth - activeTab.offsetLeft - activeTab.offsetWidth;
}

function updateIndicatorStyle() {
  const activeTab = listElement.value?.querySelector<HTMLButtonElement>('[role="tab"][data-selected="true"]');

  if (!activeTab) return;

  if (orientation.value === 'horizontal') {
    indicatorStyle.value = {
      size: activeTab.offsetWidth,
      position: getHorizontalIndicatorPosition(activeTab)
    };
  } else {
    indicatorStyle.value = {
      size: activeTab.offsetHeight,
      position: activeTab.offsetTop
    };
  }
}

useResizeObserver(
  computed(() => [listElement.value, ...tabs.value]),
  updateIndicatorStyle
);

watchPostEffect(() => {
  tabs.value = Array.from(listElement.value?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
});

watch(
  () => [modelValue.value, dir.value, listElement.value],
  () => {
    updateIndicatorStyle();
  },
  { immediate: true, flush: 'post' }
);
</script>

<template>
  <Primitive
    v-if="isMounted && typeof indicatorStyle.size === 'number'"
    data-vean-tabs-indicator
    :as="as"
    :as-child="asChild"
    :class="cls"
    :style="style"
  >
    <slot />
  </Primitive>
</template>
