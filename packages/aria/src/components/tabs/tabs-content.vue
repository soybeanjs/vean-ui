<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { useForwardElement, usePresence } from '../../composables';
import { useTabsRootContext, useTabsUi } from './context';
import type { TabsContentProps } from './types';

defineOptions({
  name: 'TabsContent'
});

const props = defineProps<TabsContentProps>();

const { modelValue, unmountOnHide, getId, registerContentId, unregisterContentId } = useTabsRootContext('TabsContent');

const [contentElement, setContentElement] = useForwardElement();

const cls = useTabsUi('content');

const { contentId, triggerId } = getId(props.value);

const isSelected = computed(() => props.value === modelValue.value);

const isPresent = props.forceMount ? shallowRef(true) : usePresence(contentElement, isSelected);

const isMountAnimationPreventedRef = shallowRef(isSelected.value);

const style = computed(() => ({
  animationDuration: isMountAnimationPreventedRef.value ? '0s' : undefined
}));

onMounted(() => {
  registerContentId(contentId.value);

  requestAnimationFrame(() => {
    isMountAnimationPreventedRef.value = false;
  });
});

onBeforeUnmount(() => {
  unregisterContentId(contentId.value);
});
</script>

<template>
  <div
    :id="contentId"
    :ref="setContentElement"
    data-vean-tabs-content
    :class="cls"
    :aria-labelledby="triggerId"
    :data-selected="isSelected"
    :hidden="!isPresent"
    role="tabpanel"
    tabindex="0"
    :style="style"
  >
    <slot v-if="!unmountOnHide || isPresent" :selected="isSelected" />
  </div>
</template>
