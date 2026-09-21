<script setup lang="ts">
import { computed } from 'vue';
import { useRovingFocusGroupItem } from '../../composables';
import { Button } from '../button';
import { useToolbarUi } from './context';
import type { ToolbarButtonProps, ToolbarButtonEmits } from './types';

defineOptions({
  name: 'ToolbarButton'
});

const props = defineProps<ToolbarButtonProps>();

const emit = defineEmits<ToolbarButtonEmits>();

const cls = useToolbarUi('button');

const { setItemElement, itemProps } = useRovingFocusGroupItem({
  focusable: computed(() => !props.disabled)
});
</script>

<template>
  <Button
    :ref="setItemElement"
    v-bind="{ ...props, ...itemProps }"
    data-vean-toolbar-button
    :class="cls"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>
