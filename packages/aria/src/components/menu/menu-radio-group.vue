<script setup lang="ts" generic="T extends AcceptableBooleanValue">
import { computed } from 'vue';
import { useControllableState } from '../../composables';
import type { AcceptableBooleanValue } from '../../types';
import { Primitive } from '../primitive';
import { provideMenuRadioGroupContext, useMenuUi } from './context';
import type { MenuRadioGroupProps, MenuRadioGroupEmits } from './types';

defineOptions({
  name: 'MenuRadioGroup'
});

const props = defineProps<MenuRadioGroupProps<T>>();

const emit = defineEmits<MenuRadioGroupEmits<T>>();

const cls = useMenuUi('radioGroup');

const modelValue = useControllableState<T | null>(
  () => props.modelValue ?? null,
  value => {
    emit('update:modelValue', value);
  },
  (props.defaultValue ?? null) as Exclude<T, undefined> | null
);

provideMenuRadioGroupContext({
  modelValue,
  disabled: computed(() => props.disabled)
});
</script>

<template>
  <Primitive :as="as" :as-child="asChild" data-vean-menu-radio-group :class="cls" role="group">
    <slot :model-value="modelValue" />
  </Primitive>
</template>
