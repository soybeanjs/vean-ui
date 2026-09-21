<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { useTagsInputRootContext, useTagsInputUi } from './context';
import type { TagsInputClearProps } from './types';

defineOptions({
  name: 'TagsInputClear'
});

const props = defineProps<TagsInputClearProps>();

const attrs = useAttrs();

const cls = useTagsInputUi('clear');

const messages = useLocaleMessages();

const { disabled, onClear } = useTagsInputRootContext('TagsInputClear');

const isDisabled = computed(() => props.disabled || disabled.value || false);

const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? messages.value.tagsInput.clear);
</script>

<template>
  <Button
    v-bind="props"
    data-vean-tags-input-clear
    :class="cls"
    :aria-label="ariaLabel"
    :disabled="isDisabled"
    @click="onClear"
  >
    <slot>
      <Icon icon="lucide:x" :aria-hidden="true" />
    </slot>
  </Button>
</template>
