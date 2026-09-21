<script setup lang="ts">
import { toContext } from '../../shared';
import { useControllableState } from '../../composables';
import { provideTabsRootContext, useTabsUi } from './context';
import type { TabsRootProps, TabsRootEmits } from './types';

defineOptions({
  name: 'TabsRoot'
});

const props = withDefaults(defineProps<TabsRootProps>(), {
  modelValue: undefined,
  orientation: 'horizontal',
  activationMode: 'automatic',
  unmountOnHide: true,
  loop: true
});

const emit = defineEmits<TabsRootEmits>();

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? null
);

const cls = useTabsUi('root');

const { dir } = provideTabsRootContext({
  ...toContext(props, ['dir', 'loop', 'orientation', 'unmountOnHide', 'activationMode']),
  modelValue
});
</script>

<template>
  <div data-vean-tabs-root :class="cls" :dir="dir" :data-orientation="orientation">
    <slot :model-value="modelValue" />
  </div>
</template>
