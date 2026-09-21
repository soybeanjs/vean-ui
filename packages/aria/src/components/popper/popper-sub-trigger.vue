<script setup lang="ts">
import { usePopperUi } from './context';
import PopperTrigger from './popper-trigger.vue';
import type { PopperSubTriggerProps } from './types';

defineOptions({
  name: 'PopperSubTrigger'
});

const props = withDefaults(defineProps<PopperSubTriggerProps>(), {
  as: 'button',
  trigger: 'click',
  openOnFocus: undefined
});

const cls = usePopperUi('subTrigger');
</script>

<template>
  <PopperTrigger v-bind="props" data-vean-popper-sub-trigger :class="cls">
    <slot />
  </PopperTrigger>
</template>
