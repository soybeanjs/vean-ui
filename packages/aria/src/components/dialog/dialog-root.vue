<script setup lang="ts">
import { computed, watch } from 'vue';
import { toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState } from '../../composables';
import { provideDialogRootContext } from './context';
import type { DialogRootProps, DialogRootEmits, DialogFullscreenStateEmits } from './types';

defineOptions({
  name: 'DialogRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<DialogRootProps>(), {
  open: undefined,
  fullscreen: undefined,
  modal: true
});

const emit = defineEmits<DialogRootEmits & DialogFullscreenStateEmits>();

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen ?? false
);

const fullscreen = useControllableState(
  () => props.fullscreen,
  value => {
    emit('update:fullscreen', value);
  },
  props.defaultFullscreen ?? false
);

const dir = useDirection(() => props.dir);

const modal = computed(() => props.isAlert === true || props.modal);

const { onOpenChange } = provideDialogRootContext({
  dir,
  open,
  modal,
  fullscreen,
  ...toContext(props, ['isAlert', 'alertType', 'draggable'])
});

const close = () => {
  onOpenChange(false);
};

// Reset the uncontrolled fullscreen state when the dialog reopens so a previous
// fullscreen session does not leak into the next one. Controlled `fullscreen`
// props stay untouched — the parent owns that state. The reset runs on reopen
// instead of on close so the exit animation keeps the fullscreen surface until
// the popup unmounts (resetting at close would snap it back to normal size
// mid-fade-out).
watch(open, value => {
  if (value && props.fullscreen === undefined) {
    fullscreen.value = props.defaultFullscreen ?? false;
  }
});
</script>

<template>
  <slot :open="open" :close="close" />
</template>
