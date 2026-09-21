<script setup lang="ts">
import { onMounted, ref, shallowRef, useAttrs } from 'vue';
import { useForwardListeners, useOmitProps, usePresence } from '../../composables';
import { provideSelectPopupElementContext, useSelectRootContext } from './context';
import SelectContentImpl from './select-content-impl.vue';
import SelectTeleportProvider from './select-teleport-provider.vue';
import type { SelectContentProps, SelectContentEmits } from './types';

defineOptions({
  name: 'SelectContent',
  inheritAttrs: false
});

const props = withDefaults(defineProps<SelectContentProps>(), {
  position: 'popper',
  avoidCollisions: true,
  prioritizePosition: true,
  bodyLock: true,
  // Mirrored from `SelectContentImpl` on purpose: this layer forwards its own resolved props down, and a
  // Boolean prop without a default resolves to `false` when absent (Vue boolean casting), which would then
  // be forwarded as an explicit `false` and beat the impl's own `true`.
  disableOutsidePointerEvents: true
});

const emit = defineEmits<SelectContentEmits>();

const attrs = useAttrs();

const forwardedProps = useOmitProps(props, ['forceMount'], attrs);

const listeners = useForwardListeners(emit);

const { open } = useSelectRootContext('SelectContent');

const { popupElement } = provideSelectPopupElementContext();

const isPresent = props.forceMount ? shallowRef(true) : usePresence(popupElement, open);

const fragment = ref<DocumentFragment>();

onMounted(() => {
  fragment.value = new DocumentFragment();
});
</script>

<template>
  <SelectContentImpl v-if="isPresent" data-vean-select-content v-bind="forwardedProps" v-on="listeners">
    <slot />
  </SelectContentImpl>
  <div v-else-if="fragment">
    <Teleport :to="fragment">
      <SelectTeleportProvider :position="position" :popup-element="popupElement">
        <slot />
      </SelectTeleportProvider>
    </Teleport>
  </div>
</template>
