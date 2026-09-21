<script setup lang="ts">
import { computed } from 'vue';
import { useRovingFocusGroupItem } from '../../composables';
import { Primitive } from '../primitive';
import { useTabsRootContext, useTabsUi } from './context';
import type { TabsTriggerProps } from './types';

defineOptions({
  name: 'TabsTrigger'
});

const props = withDefaults(defineProps<TabsTriggerProps>(), {
  as: 'button',
  disabled: false
});

const { modelValue, orientation, changeModelValue, activationMode, getId } = useTabsRootContext('TabsTrigger');

const cls = useTabsUi('trigger');

const { contentId, triggerId, existContentId } = getId(props.value);

const isSelected = computed(() => props.value === modelValue.value);
const tag = computed(() => (props.as === 'button' ? 'button' : undefined));

const { itemProps, setItemElement } = useRovingFocusGroupItem({
  focusable: computed(() => !props.disabled),
  active: isSelected
});

const ariaControls = computed(() => (existContentId.value ? contentId.value : undefined));

const onMouseDown = (event: MouseEvent) => {
  if (!props.disabled && event.ctrlKey === false) {
    // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
    // but not when the control key is pressed (avoiding MacOS right click)
    changeModelValue(props.value);
  } else {
    // prevent focus to avoid accidental activation
    event.preventDefault();
  }
};

const onKeyDown = () => {
  if (!props.disabled) {
    changeModelValue(props.value);
  }
};

const onFocus = () => {
  if (isSelected.value || props.disabled) return;

  if (activationMode.value !== 'manual') {
    changeModelValue(props.value);
  }
};
</script>

<template>
  <Primitive
    v-bind="itemProps"
    :id="triggerId"
    :ref="setItemElement"
    :as="as"
    :as-child="asChild"
    data-vean-tabs-trigger
    :class="cls"
    :aria-controls="ariaControls"
    :aria-selected="isSelected ? 'true' : 'false'"
    :data-disabled="disabled ? '' : undefined"
    :data-orientation="orientation"
    :data-selected="isSelected"
    role="tab"
    :type="tag"
    @mousedown.left="onMouseDown"
    @keydown.enter.space="onKeyDown"
    @focus="onFocus"
  >
    <slot :selected="isSelected" />
  </Primitive>
</template>
