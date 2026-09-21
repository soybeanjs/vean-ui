<script setup lang="ts" generic="T extends DefinedValue = string">
import { computed } from 'vue';
import { useToggleGroupRootContext } from '../toggle-group/context';
import { useRovingFocusGroupItem } from '../../composables';
import type { DefinedValue } from '../../types';
import { ToggleGroupItem } from '../toggle-group';
import { useToolbarUi } from './context';
import type { ToolbarToggleItemProps } from './types';

defineOptions({
  name: 'ToolbarToggleItem'
});

const props = defineProps<ToolbarToggleItemProps<T>>();

const cls = useToolbarUi('toggleItem');

const { disabled: rootDisabled } = useToggleGroupRootContext('ToolbarToggleItem');

const disabled = computed(() => rootDisabled.value || props.disabled);

const { setItemElement, itemProps } = useRovingFocusGroupItem({
  focusable: computed(() => !disabled.value)
});
</script>

<template>
  <ToggleGroupItem
    :ref="setItemElement"
    v-bind="{ ...props, ...itemProps }"
    data-vean-toolbar-toggle-item
    :class="cls"
    :disabled="disabled"
  >
    <slot />
  </ToggleGroupItem>
</template>
