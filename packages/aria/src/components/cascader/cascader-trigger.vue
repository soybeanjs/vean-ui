<script setup lang="ts">
import { computed } from 'vue';
import { useForwardElement } from '../../composables';
import { PopperAnchor } from '../popper';
import { Primitive } from '../primitive';
import { useCascaderRootContext, useCascaderUi } from './context';
import type { CascaderTriggerProps } from './types';

defineOptions({
  name: 'CascaderTrigger'
});

const props = withDefaults(defineProps<CascaderTriggerProps>(), {
  as: 'div'
});

const {
  open,
  multiple,
  dataState,
  disabled,
  filterable,
  contentId,
  highlightedId,
  onTriggerElementChange,
  onOpenChange,
  handleKeydown
} = useCascaderRootContext('CascaderTrigger');

const [_, setTriggerElement] = useForwardElement(onTriggerElementChange);

const cls = useCascaderUi('trigger');

const isDisabled = computed(() => Boolean(disabled.value) || Boolean(props.disabled));
const isFilterable = computed(() => Boolean(filterable.value));

const onOpen = () => {
  if (!isDisabled.value) {
    onOpenChange(!open.value);
  }
};

const onKeyDown = (event: KeyboardEvent) => {
  if (open.value) {
    // Keyboard navigation while open is handled by the data engine.
    handleKeydown(event);
    return;
  }

  // Opening keys while closed.
  if ([' ', 'Enter', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    onOpenChange(true);
  }
};
</script>

<template>
  <PopperAnchor as-child :reference="reference">
    <Primitive
      :ref="setTriggerElement"
      :as="as"
      :as-child="asChild"
      data-vean-cascader-trigger
      :class="cls"
      :aria-controls="contentId"
      :aria-expanded="open || false"
      aria-haspopup="tree"
      :aria-activedescendant="highlightedId ?? undefined"
      :aria-disabled="isDisabled || undefined"
      :data-multiple="multiple ? '' : undefined"
      :data-state="dataState"
      :data-disabled="isDisabled ? '' : undefined"
      :tabindex="isFilterable ? -1 : isDisabled ? undefined : 0"
      role="combobox"
      @click="onOpen"
      @keydown="onKeyDown"
    >
      <slot />
    </Primitive>
  </PopperAnchor>
</template>
