<script setup lang="ts" generic="T extends DefinedValue = string">
import { computed } from 'vue';
import { useOmitProps, useRovingFocusGroupItem } from '../../composables';
import type { DefinedValue } from '../../types';
import Button from '../button/button.vue';
import { Primitive } from '../primitive';
import { useToggleGroupRootContext, useToggleGroupUi } from './context';
import type { ToggleGroupItemProps } from './types';

defineOptions({
  name: 'ToggleGroupItem'
});

const props = defineProps<ToggleGroupItemProps<T>>();

const cls = useToggleGroupUi('item');

const {
  disabled: rootDisabled,
  rovingFocus,
  orientation,
  isValueSelected,
  onModelValueChange
} = useToggleGroupRootContext('ToggleGroupItem');

const disabled = computed(() => rootDisabled.value || props.disabled);
const pressed = computed(() => isValueSelected(props.value));

// `rovingFocus` is static per instance: when disabled, no roving context is provided by
// the root, so the item must not consume one (it would throw or bind to an outer group).
const roving = rovingFocus.value
  ? useRovingFocusGroupItem({
      focusable: computed(() => !disabled.value),
      active: pressed
    })
  : null;

const forwardedProps = useOmitProps(props, ['value']);

const itemBindings = computed(() => {
  if (!rovingFocus.value || !roving) return forwardedProps.value;

  return { ...forwardedProps.value, ...roving.itemProps.value };
});

const dataState = computed(() => (pressed.value ? 'on' : 'off'));

const onClick = () => {
  onModelValueChange(props.value);
};
</script>

<template>
  <component
    :is="rovingFocus ? Primitive : Button"
    :ref="roving?.setItemElement"
    v-bind="itemBindings"
    :as="rovingFocus ? Button : props.as"
    data-vean-toggle-group-item
    :class="cls"
    :aria-pressed="pressed ? 'true' : 'false'"
    :data-state="dataState"
    :data-orientation="orientation"
    :disabled="disabled"
    @click="onClick"
  >
    <slot :pressed="pressed" :disabled="disabled" />
  </component>
</template>
