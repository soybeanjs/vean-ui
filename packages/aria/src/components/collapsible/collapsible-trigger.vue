<script setup lang="ts">
import { useOmitProps } from '../../composables';
import Button from '../button/button.vue';
import { useCollapsibleRootContext, useCollapsibleUi } from './context';
import type { CollapsibleTriggerProps } from './types';

defineOptions({
  name: 'CollapsibleTrigger'
});

const props = defineProps<CollapsibleTriggerProps>();

const forwardedProps = useOmitProps(props, ['disabledCollapsible']);

const { open, onOpenToggle, contentId, disabled, dataState } = useCollapsibleRootContext('CollapsibleTrigger');

const cls = useCollapsibleUi('trigger');

const onTriggerClick = () => {
  if (props.disabledCollapsible) return;

  onOpenToggle();
};
</script>

<template>
  <Button
    v-bind="forwardedProps"
    data-vean-collapsible-trigger
    :class="cls"
    :disabled="disabled"
    :aria-controls="contentId"
    :aria-expanded="open"
    :data-state="dataState"
    @click="onTriggerClick"
  >
    <slot :open="open" />
  </Button>
</template>
