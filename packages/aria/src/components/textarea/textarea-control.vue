<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { adjustHeight } from './shared';
import { useTextareaRootContext, useTextareaUi } from './context';
import type { TextareaControlProps } from './types';

defineOptions({
  name: 'TextareaControl'
});

defineProps<TextareaControlProps>();

const { modelValue, id, autofocus, placeholder, disabled, readonly, maxlength, minlength, autosizeOptions } =
  useTextareaRootContext('TextareaControl');

const cls = useTextareaUi('control');

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const onInput = (event: Event) => {
  modelValue.value = (event.target as HTMLTextAreaElement).value;
};

watch(
  [modelValue, autosizeOptions],
  async () => {
    if (!autosizeOptions.value) return;

    await nextTick();
    adjustHeight(textareaRef.value, autosizeOptions.value);
  },
  { immediate: true, flush: 'post' }
);
</script>

<template>
  <textarea
    :id="id"
    ref="textareaRef"
    data-vean-textarea-control
    :class="cls"
    :aria-disabled="disabled ?? undefined"
    aria-roledescription="Textarea"
    autocorrect="off"
    :autofocus="autofocus"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :disabled="disabled"
    :maxlength="maxlength"
    :minlength="minlength"
    :placeholder="placeholder"
    :readonly="readonly"
    spellcheck="false"
    tabindex="0"
    :value="modelValue"
    :style="autosizeOptions ? { resize: 'none', overflowY: 'hidden' } : undefined"
    @input="onInput"
  />
</template>
