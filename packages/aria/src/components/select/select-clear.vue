<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../_icon/icon.vue';
import { useSelectRootContext, useSelectUi } from './context';
import type { SelectClearProps } from './types';

defineOptions({
  name: 'SelectClear'
});

const props = defineProps<SelectClearProps>();

const { disabled: rootDisabled, isEmptyModelValue, resetModelValue } = useSelectRootContext('SelectClear');

const cls = useSelectUi('clear');

const disabled = computed(() => props.disabled || rootDisabled.value || false);

const onClear = () => {
  if (disabled.value) {
    return;
  }

  resetModelValue();
};
</script>

<template>
  <button
    v-if="!isEmptyModelValue"
    type="button"
    data-vean-select-clear
    :class="cls"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-normal="disabled ? undefined : ''"
    :disabled="disabled || undefined"
    tabindex="-1"
    @click.prevent.stop="onClear"
    @pointerdown.prevent.stop
  >
    <slot>
      <Icon icon="lucide:x" />
    </slot>
  </button>
</template>
