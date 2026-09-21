<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useEditableRootContext, useEditableUi } from './context';
import type { EditableAreaProps } from './types';

defineOptions({
  name: 'EditableArea'
});

const props = defineProps<EditableAreaProps>();

const { autoResize, dataDisabled, dataReadonly, dataState, isEmpty } = useEditableRootContext('EditableArea');

const cls = useEditableUi('area');

const areaStyle = computed(() => (autoResize.value ? { display: 'inline-grid' } : undefined));
</script>

<template>
  <Primitive
    v-bind="props"
    data-vean-editable-area
    :class="cls"
    :data-disabled="dataDisabled"
    :data-empty="isEmpty ? '' : undefined"
    :data-placeholder-shown="isEmpty ? '' : undefined"
    :data-readonly="dataReadonly"
    :data-state="dataState"
    :style="areaStyle"
  >
    <slot />
  </Primitive>
</template>
