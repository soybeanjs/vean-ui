<script setup lang="ts" generic="M extends boolean = false, T extends DefinedValue = string">
import { useForwardListeners, useOmitProps } from '../../composables';
import type { DefinedValue } from '../../types';
import { ToggleGroupRoot } from '../toggle-group';
import { useToolbarRootContext, useToolbarUi } from './context';
import type { ToolbarToggleGroupProps, ToolbarToggleGroupEmits } from './types';

defineOptions({
  name: 'ToolbarToggleGroup'
});

const props = defineProps<ToolbarToggleGroupProps<M, T>>();

const emit = defineEmits<ToolbarToggleGroupEmits<M, T>>();

const { orientation, dir } = useToolbarRootContext('ToolbarToggleGroup');

const cls = useToolbarUi('toggleGroup');

const forwardedProps = useOmitProps(props, ['dir', 'loop', 'rovingFocus']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <ToggleGroupRoot
    v-bind="forwardedProps"
    data-vean-toolbar-toggle-group
    :class="cls"
    :dir="props.dir ?? dir"
    :orientation="props.orientation ?? orientation"
    :roving-focus="false"
    v-on="listeners"
  >
    <slot />
  </ToggleGroupRoot>
</template>
