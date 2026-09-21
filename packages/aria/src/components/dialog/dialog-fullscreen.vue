<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogFullscreenProps, DialogFullscreenEmits } from './types';

defineOptions({
  name: 'DialogFullscreen'
});

const props = withDefaults(defineProps<DialogFullscreenProps>(), {
  as: 'button'
});

const emit = defineEmits<DialogFullscreenEmits>();

const cls = useDialogUi('fullscreen');

const { fullscreen, onFullscreenToggle } = useDialogRootContext('DialogFullscreen');

const messages = useLocaleMessages();

const ariaLabel = computed(() =>
  fullscreen.value ? messages.value.dialog.exitFullscreen : messages.value.dialog.fullscreen
);

const onToggle = (event: MouseEvent) => {
  emit('fullscreen', event);

  onFullscreenToggle();
};
</script>

<template>
  <Button
    v-bind="props"
    data-vean-dialog-fullscreen
    :aria-label="ariaLabel"
    :aria-pressed="fullscreen ? 'true' : 'false'"
    :class="cls"
    @click="onToggle"
  >
    <slot>
      <Icon :icon="fullscreen ? 'lucide:minimize' : 'lucide:maximize'" />
    </slot>
  </Button>
</template>
