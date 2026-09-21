<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import { Button } from '../button';
import { copyTextToClipboard, isClipboardWriteSupported } from './shared';
import type { ClipboardProps, ClipboardSlotProps, ClipboardSlots, ClipboardEmits, ClipboardState } from './types';

defineOptions({
  name: 'Clipboard'
});

const props = withDefaults(defineProps<ClipboardProps>(), {
  copiedDuration: 2000,
  legacy: true,
  copyIcon: 'lucide:copy',
  copiedIcon: 'lucide:check'
});

const emit = defineEmits<ClipboardEmits>();

defineSlots<ClipboardSlots>();

const messages = useLocaleMessages();

const forwardedProps = useOmitProps(props, [
  'value',
  'copiedDuration',
  'legacy',
  'disabled',
  'copyIcon',
  'copiedIcon',
  'copyText',
  'copiedText',
  'onlyIcon'
]);

const copied = shallowRef(false);

const { start: resetCopiedState } = useTimeoutFn(
  () => {
    copied.value = false;
  },
  () => props.copiedDuration,
  { immediate: false }
);

const isSupported = computed(() => isClipboardWriteSupported() || props.legacy);

const disabled = computed(() => props.disabled || !isSupported.value);

const dataState = computed<ClipboardState>(() => {
  if (!isSupported.value) {
    return 'unsupported';
  }

  return copied.value ? 'copied' : 'ready';
});

const displayIcon = computed(() => (copied.value ? props.copiedIcon : props.copyIcon));

const displayText = computed(() =>
  copied.value
    ? (props.copiedText ?? messages.value.clipboard.copied)
    : (props.copyText ?? messages.value.clipboard.copy)
);

const copyValue = async () => {
  if (disabled.value) {
    return;
  }

  try {
    await copyTextToClipboard(props.value, props.legacy);
    copied.value = true;
    resetCopiedState();
    emit('copied', props.value);
  } catch (error) {
    emit('copyError', error);
  }
};

const slotProps = computed<ClipboardSlotProps>(() => ({
  copied: copied.value,
  disabled: disabled.value,
  icon: displayIcon.value,
  supported: isSupported.value,
  state: dataState.value,
  text: displayText.value,
  copy: copyValue
}));

const onClick = async (event: PointerEvent) => {
  emit('click', event);

  await copyValue();
};
</script>

<template>
  <Button v-bind="forwardedProps" data-vean-clipboard :disabled="disabled" :data-state="dataState" @click="onClick">
    <slot name="leading" v-bind="slotProps">
      <span aria-hidden="true">
        <Icon :icon="displayIcon" />
      </span>
    </slot>
    <slot v-if="!onlyIcon" v-bind="slotProps">{{ displayText }}</slot>
    <slot name="trailing" v-bind="slotProps" />
  </Button>
</template>
