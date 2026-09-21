<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import { useCascaderRootContext, useCascaderUi } from './context';
import type { CascaderClearProps } from './types';

defineOptions({
  name: 'CascaderClear'
});

const props = withDefaults(defineProps<CascaderClearProps>(), {
  ariaLabel: ''
});

const attrs = useAttrs();

const messages = useLocaleMessages();

const { modelValue, clearValue } = useCascaderRootContext('CascaderClear');

const cls = useCascaderUi('clear');

const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? (props.ariaLabel || messages.value.cascader.clear));

const hasValue = computed(() => {
  const value = modelValue.value;
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null;
});
</script>

<template>
  <button
    v-if="hasValue"
    type="button"
    data-vean-cascader-clear
    :class="cls"
    :aria-label="ariaLabel"
    data-normal=""
    tabindex="-1"
    @click.prevent.stop="clearValue"
    @pointerdown.prevent.stop
  >
    <slot>
      <Icon icon="lucide:x" />
    </slot>
  </button>
</template>
