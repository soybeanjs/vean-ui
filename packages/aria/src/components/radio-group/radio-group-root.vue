<script setup lang="ts" generic="T extends DefinedWithBooleanValue">
import { computed } from 'vue';
import { isFormControl, toContext } from '../../shared';
import { useControllableState, useForwardElement, useRovingFocusGroup } from '../../composables';
import type { DefinedWithBooleanValue, VNodeRef } from '../../types';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideRadioGroupRootContext, useRadioGroupUi } from './context';
import type { RadioGroupRootProps, RadioGroupRootEmits } from './types';

defineOptions({
  name: 'RadioGroupRoot'
});

const props = withDefaults(defineProps<RadioGroupRootProps<T>>(), {
  modelValue: undefined,
  disabled: false,
  required: false,
  orientation: undefined,
  loop: true
});

const emit = defineEmits<RadioGroupRootEmits<T>>();

const cls = useRadioGroupUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? null
);

const { setContainerElement, groupProps } = useRovingFocusGroup({
  ...toContext(props, ['orientation', 'dir', 'loop']),
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

const [rootElement, setRootElement] = useForwardElement();

const formControl = computed(() => isFormControl(rootElement.value));

provideRadioGroupRootContext({
  ...toContext(props, ['disabled', 'orientation', 'dir', 'loop', 'name', 'required']),
  modelValue
});

function setRootRef(nodeRef: VNodeRef) {
  setRootElement(nodeRef);
  setContainerElement(nodeRef);
}
</script>

<template>
  <div
    v-bind="groupProps"
    :ref="setRootRef"
    data-vean-radio-group-root
    :class="cls"
    role="radiogroup"
    :data-disabled="disabled ? '' : undefined"
    :aria-orientation="orientation"
    :aria-required="required"
  >
    <slot :model-value="modelValue" />

    <VisuallyHiddenInput
      v-if="formControl && name"
      :required="required"
      :disabled="disabled"
      :value="modelValue"
      :name="name"
    />
  </div>
</template>
