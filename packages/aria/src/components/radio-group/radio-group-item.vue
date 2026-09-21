<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { isFormControl, isNullish, toContext } from '../../shared';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideRadioGroupItemContext, useRadioGroupRootContext, useRadioGroupUi } from './context';
import type { RadioGroupItemProps, RadioGroupItemEmits, RadioSelectEvent } from './types';

defineOptions({
  name: 'RadioGroupItem'
});

const props = defineProps<RadioGroupItemProps>();

const emit = defineEmits<RadioGroupItemEmits>();

const cls = useRadioGroupUi('item');

const rootContext = useRadioGroupRootContext('RadioGroupItem');
const itemElement = useTemplateRef<HTMLDivElement>('itemElement');

const formControl = computed(() => isFormControl(itemElement.value));
const disabled = computed(() => rootContext.disabled.value || props.disabled);
const required = computed(() => rootContext.required.value || props.required);
const checked = computed(
  () => !isNullish(rootContext.modelValue.value) && rootContext.modelValue.value === props.value
);

const { dataState } = provideRadioGroupItemContext({
  ...toContext(props, ['name', 'required', 'value', 'disabled']),
  checked,
  onSelect: (event: RadioSelectEvent) => {
    emit('select', event);
  }
});
</script>

<template>
  <div ref="itemElement" data-vean-radio-group-item :class="cls" :data-state="dataState">
    <slot :checked="checked" />

    <VisuallyHiddenInput
      v-if="formControl && name"
      type="radio"
      tabindex="-1"
      :value="value"
      :checked="checked"
      :name="name"
      :disabled="disabled"
      :required="required"
    />
  </div>
</template>
