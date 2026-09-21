<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useForwardListeners, useOmitProps, usePresence } from '../../composables';
import type { FocusOutsideEvent } from '../../types';
import { useMenuContext, useMenuRootContext } from './context';
import MenuContentImpl from './menu-content-impl.vue';
import type { MenuContentProps, MenuContentEmits } from './types';

defineOptions({
  name: 'MenuContent'
});

const props = defineProps<MenuContentProps>();

const emit = defineEmits<MenuContentEmits>();

const forwardedProps = useOmitProps(props, ['forceMount']);

const listeners = useForwardListeners(emit);

const { open, popupElement } = useMenuContext('MenuContent');
const { modal } = useMenuRootContext('MenuContent');

const isPresent = props.forceMount ? shallowRef(true) : usePresence(popupElement, open);

const trapFocus = computed(() => modal.value && open.value);

const focusOutside = (event: FocusOutsideEvent) => {
  if (modal.value) {
    event.preventDefault();
  }
};
</script>

<template>
  <MenuContentImpl
    v-if="isPresent"
    v-bind="forwardedProps"
    data-vean-menu-content
    :trap-focus="trapFocus"
    v-on="listeners"
    @focus-outside="focusOutside"
  >
    <slot />
  </MenuContentImpl>
</template>
