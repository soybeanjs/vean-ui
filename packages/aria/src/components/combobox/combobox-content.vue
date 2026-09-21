<script setup lang="ts">
import { shallowRef } from 'vue';
import { useForwardListeners, useOmitProps, usePresence } from '../../composables';
import { useComboboxRootContext } from './context';
import ComboboxContentImpl from './combobox-content-impl.vue';
import type { ComboboxContentProps, ComboboxContentEmits } from './types';

defineOptions({
  name: 'ComboboxContent'
});

const props = withDefaults(defineProps<ComboboxContentProps>(), {
  position: 'popper',
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<ComboboxContentEmits>();

const forwardedProps = useOmitProps(props, ['forceMount']);

const listeners = useForwardListeners(emit);

const { open, popupElement, initContentId } = useComboboxRootContext('ComboboxContent');

const isPresent = props.forceMount ? shallowRef(true) : usePresence(popupElement, open);

initContentId();
</script>

<template>
  <ComboboxContentImpl v-if="isPresent" v-bind="forwardedProps" data-vean-combobox-content v-on="listeners">
    <slot />
  </ComboboxContentImpl>
</template>
