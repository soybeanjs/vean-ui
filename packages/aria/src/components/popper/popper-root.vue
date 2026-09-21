<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { useControllableState } from '../../composables';
import { providePopperPositioningRootContext, providePopperRootContext, usePopperRootContext } from './context';
import type { PopperRootProps, PopperOpenChangeReason, PopperRootEmits, PopperRootSlots } from './types';
import { usePopperNesting } from './use-popper-nesting';

defineOptions({
  name: 'PopperRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<PopperRootProps>(), {
  open: undefined,
  defaultOpen: false,
  modal: undefined,
  disabled: false
});

const emit = defineEmits<PopperRootEmits>();

defineSlots<PopperRootSlots>();

const parent = usePopperRootContext() ?? undefined;
const reason = shallowRef<PopperOpenChangeReason>('imperative');

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value, reason.value);
  },
  props.defaultOpen
);

const popperDir = computed(() => props.dir ?? parent?.dir.value);
const dir = computed(() => popperDir.value ?? 'ltr');
const modal = computed(() => props.modal);
const disabled = computed(() => props.disabled);

function commitOpenChange(value: boolean, nextReason: PopperOpenChangeReason) {
  reason.value = nextReason;
  open.value = value;
}

const context = providePopperRootContext({
  open,
  reason,
  dir,
  modal,
  disabled,
  parent,
  onOpenChange: commitOpenChange
});

// Dual-provide the positioning context with the same refs so shared leaves
// (`PopperAnchor` / `PopperArrow`) work under the interactive shell too.
providePopperPositioningRootContext({
  dir,
  anchorElement: context.anchorElement,
  onAnchorElementChange: context.onAnchorElementChange,
  popupElement: context.popupElement,
  onPopupElementChange: context.onPopupElementChange,
  registerCustomAnchor: context.registerCustomAnchor
});

usePopperNesting(context);

function close() {
  context.onOpenChange(false, 'imperative');
}

watch(disabled, value => {
  if (value) {
    context.onOpenChange(false, 'imperative');
  }
});
</script>

<template>
  <slot :open="open" :reason="reason" :close="close" :dir="dir" />
</template>
