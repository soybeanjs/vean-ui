<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { getAriaLabel } from '../../shared';
import { useForwardElement } from '../../composables';
import Button from '../button/button.vue';
import { useSwitchRootContext, useSwitchUi } from './context';
import type { SwitchControlProps } from './types';

defineOptions({
  name: 'SwitchControl'
});

const props = defineProps<SwitchControlProps>();

const attrs = useAttrs();

const { modelValue, disabled, dataState, toggleCheck, required } = useSwitchRootContext('SwitchControl');

const [controlElement, setControlElement] = useForwardElement();

const cls = useSwitchUi('control');

const isDisabled = computed(() => disabled.value || props.disabled);

const ariaLabel = computed(() => getAriaLabel(controlElement.value, props.id, attrs['aria-label'] as string));
</script>

<template>
  <Button
    v-bind="props"
    :ref="setControlElement"
    data-vean-switch-control
    :class="cls"
    :disabled="isDisabled"
    :aria-checked="dataState === 'checked'"
    :aria-label="ariaLabel"
    :aria-required="required"
    :data-state="dataState"
    role="switch"
    @click="toggleCheck"
    @keydown.enter.prevent="toggleCheck"
  >
    <slot :model-value="modelValue" />
  </Button>
</template>
