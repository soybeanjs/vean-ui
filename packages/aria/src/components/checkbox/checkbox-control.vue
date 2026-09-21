<script setup lang="ts">
import { computed, useAttrs, watchEffect } from 'vue';
import { getAriaLabel, isIndeterminate, isNullish, isValueEqualOrExist } from '../../shared';
import { useForwardElement, useRovingFocusGroupItem } from '../../composables';
import type { VNodeRef } from '../../types';
import Button from '../button/button.vue';
import { Primitive } from '../primitive';
import { useCheckboxGroupRootContext, useCheckboxRootContext, useCheckboxUi } from './context';
import type { CheckboxControlProps } from './types';

defineOptions({
  name: 'CheckboxControl'
});

const props = defineProps<CheckboxControlProps>();

const attrs = useAttrs();

const cls = useCheckboxUi('control');

const groupContext = useCheckboxGroupRootContext();

const { modelValue, value, disabled, state, ariaChecked, dataState, required, initControlId } =
  useCheckboxRootContext('CheckboxControl');

const [controlElement, setControlElement] = useForwardElement();

const rovingFocus = computed(() => groupContext?.rovingFocus?.value);

// The roving item hook requires the group context, which only exists when the control is
// rendered inside a `CheckboxGroupRoot`; the condition is stable per instance.
const roving = groupContext
  ? useRovingFocusGroupItem({
      focusable: computed(() => !disabled.value)
    })
  : null;

const controlBindings = computed(() => {
  if (!rovingFocus.value || !roving) return props;

  return { ...props, ...roving.itemProps.value };
});

const ariaLabel = computed(() => getAriaLabel(controlElement.value, props.id, attrs['aria-label'] as string));

const onClick = () => {
  if (groupContext) {
    const modelValueArray = [...(groupContext.modelValue.value || [])];
    if (isValueEqualOrExist(modelValueArray, value.value)) {
      const index = modelValueArray.findIndex(i => i === value.value);
      modelValueArray.splice(index, 1);
    } else if (!isNullish(value.value)) {
      modelValueArray.push(value.value);
    }
    groupContext.modelValue.value = modelValueArray;
  } else {
    modelValue.value = isIndeterminate(modelValue.value) ? true : !modelValue.value;
  }
};

watchEffect(() => {
  if (props.id) {
    initControlId(props.id);
  }
});

function setControlRef(nodeRef: VNodeRef) {
  setControlElement(nodeRef);
  roving?.setItemElement(nodeRef);
}
</script>

<template>
  <component
    :is="rovingFocus ? Primitive : Button"
    :ref="setControlRef"
    v-bind="controlBindings"
    :as="rovingFocus ? Button : props.as"
    data-vean-checkbox-control
    :class="cls"
    role="checkbox"
    :disabled="disabled"
    :aria-checked="ariaChecked"
    :aria-label="ariaLabel"
    :aria-required="required"
    :data-state="dataState"
    @click="onClick"
    @keydown.enter.prevent="onClick"
  >
    <slot :model-value="modelValue" :state="state" />
  </component>
</template>
