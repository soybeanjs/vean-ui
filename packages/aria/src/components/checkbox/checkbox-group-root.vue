<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { isFormControl, toContext } from '../../shared';
import { useControllableState, useForwardElement, useRovingFocusGroup } from '../../composables';
import type { DefinedValue, VNodeRef } from '../../types';
import { Primitive } from '../primitive';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideCheckboxGroupRootContext, useCheckboxUi } from './context';
import type { CheckboxGroupRootProps, CheckboxGroupRootEmits } from './types';

defineOptions({
  name: 'CheckboxGroupRoot'
});

const props = withDefaults(defineProps<CheckboxGroupRootProps<T>>(), {
  modelValue: undefined,
  rovingFocus: true
});

const emit = defineEmits<CheckboxGroupRootEmits<T>>();

const cls = useCheckboxUi('groupRoot');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? []
);

const { setContainerElement, groupProps } = useRovingFocusGroup({
  ...toContext(props, ['loop', 'dir', 'orientation']),
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

provideCheckboxGroupRootContext({
  ...toContext(props, ['modelValue', 'defaultValue', 'rovingFocus', 'disabled']),
  modelValue
});

const [groupElement, setGroupElement] = useForwardElement();

const formControl = computed(() => isFormControl(groupElement.value));

function setGroupRef(nodeRef: VNodeRef) {
  setGroupElement(nodeRef);
  if (props.rovingFocus) {
    setContainerElement(nodeRef);
  }
}
</script>

<template>
  <Primitive
    v-bind="rovingFocus ? groupProps : undefined"
    :ref="setGroupRef"
    as="div"
    data-vean-checkbox-group-root
    :class="cls"
  >
    <slot />
    <VisuallyHiddenInput v-if="formControl && name" :name="name" :value="modelValue" :required="required" />
  </Primitive>
</template>
