<script setup lang="ts">
import { onWatcherCleanup, shallowRef, watchEffect } from 'vue';
import { useForwardElement } from '../../composables';
import { useSelectContentContext, useSelectItemAlignedPositionContext, useSelectUi } from './context';
import SelectScrollButtonImpl from './select-scroll-button-impl.vue';
import type { SelectScrollUpButtonProps } from './types';

defineOptions({
  name: 'SelectScrollUpButton'
});

const props = defineProps<SelectScrollUpButtonProps>();

const { selectedItemElement, viewportElement, isPositioned } = useSelectContentContext('SelectScrollUpButton');
const alignedPositionContext = useSelectItemAlignedPositionContext();

const [_, setButtonElement] = useForwardElement(node => {
  alignedPositionContext?.onScrollButtonChange(node);
});

const cls = useSelectUi('scrollUpButton');

const onAutoScroll = () => {
  if (viewportElement.value && selectedItemElement.value) {
    viewportElement.value.scrollTop -= selectedItemElement.value.offsetHeight;
  }
};

const canScrollUp = shallowRef(false);

watchEffect(() => {
  if (!viewportElement.value || !isPositioned.value) return;

  const viewport = viewportElement.value;

  function handleScroll() {
    canScrollUp.value = viewport.scrollTop > 0;
  }
  handleScroll();
  viewport.addEventListener('scroll', handleScroll);

  onWatcherCleanup(() => {
    viewport.removeEventListener('scroll', handleScroll);
  });
});
</script>

<template>
  <SelectScrollButtonImpl
    v-if="canScrollUp"
    :ref="setButtonElement"
    data-vean-select-scroll-up-button
    v-bind="props"
    :class="cls"
    @auto-scroll="onAutoScroll"
  >
    <slot />
  </SelectScrollButtonImpl>
</template>
