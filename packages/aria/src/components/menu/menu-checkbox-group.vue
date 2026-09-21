<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { useControllableState } from '../../composables';
import type { DefinedValue } from '../../types';
import { Primitive } from '../primitive';
import { provideMenuCheckboxGroupContext, useMenuUi } from './context';
import type { MenuCheckboxGroupProps, MenuCheckboxGroupEmits } from './types';

defineOptions({
  name: 'MenuCheckboxGroup'
});

const props = defineProps<MenuCheckboxGroupProps<T>>();

const emit = defineEmits<MenuCheckboxGroupEmits<T>>();

const cls = useMenuUi('checkboxGroup');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? []
);

provideMenuCheckboxGroupContext({
  modelValue,
  disabled: computed(() => props.disabled)
});
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-menu-checkbox-group :class="cls" role="group">
    <slot :model-value="modelValue" />
  </Primitive>
</template>
