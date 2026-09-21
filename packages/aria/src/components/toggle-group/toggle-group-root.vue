<script setup lang="ts" generic="M extends boolean = false, T extends DefinedValue = string">
import { computed } from 'vue';
import { isFormControl, toContext } from '../../shared';
import { useForwardElement, useRovingFocusGroup, useSelection } from '../../composables';
import type { DefinedValue, VNodeRef } from '../../types';
import { Primitive } from '../primitive';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideToggleGroupRootContext, useToggleGroupUi } from './context';
import type { ToggleGroupRootProps, ToggleGroupRootEmits } from './types';

defineOptions({
  name: 'ToggleGroupRoot'
});

const props = withDefaults(defineProps<ToggleGroupRootProps<M, T>>(), {
  modelValue: undefined,
  rovingFocus: true,
  disabled: false,
  orientation: 'horizontal',
  loop: true,
  clearable: true
});

const emit = defineEmits<ToggleGroupRootEmits<M, T>>();

const cls = useToggleGroupUi('root');

const [groupElement, setGroupElement] = useForwardElement();

const { modelValue, onModelValueChange, isValueSelected, isMultiple } = useSelection<M, T>(props, value =>
  emit('update:modelValue', value)
);

const formControl = computed(() => isFormControl(groupElement.value));

// `rovingFocus` is static per instance: when disabled (e.g. inside a Toolbar, which owns
// navigation), skip the roving context entirely so nested items fall through to the
// outer roving group instead of registering with this one.
const roving = props.rovingFocus
  ? useRovingFocusGroup({
      ...toContext(props, ['loop', 'dir', 'orientation']),
      currentTabStopId: computed(() => undefined),
      defaultCurrentTabStopId: computed(() => undefined),
      preventScrollOnEntryFocus: computed(() => false)
    })
  : null;

const groupBindings = computed(() => roving?.groupProps.value);

const onValueChange = (value: DefinedValue) => {
  onModelValueChange(value as T);
};

const isSelected = (value: DefinedValue) => {
  return isValueSelected(value as T);
};

provideToggleGroupRootContext({
  ...toContext(props, ['disabled', 'rovingFocus', 'orientation', 'dir', 'loop', 'name', 'required']),
  modelValue,
  onModelValueChange: onValueChange,
  isValueSelected: isSelected,
  isMultiple
});

function setGroupRef(nodeRef: VNodeRef) {
  setGroupElement(nodeRef);
  roving?.setContainerElement(nodeRef);
}
</script>

<template>
  <Primitive
    v-bind="groupBindings"
    :ref="setGroupRef"
    :as="as"
    :as-child="asChild"
    data-vean-toggle-group-root
    :class="cls"
    role="group"
    :data-disabled="disabled ? '' : undefined"
    :data-orientation="orientation"
  >
    <slot :model-value="modelValue" />

    <VisuallyHiddenInput
      v-if="formControl && name"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
    />
  </Primitive>
</template>
