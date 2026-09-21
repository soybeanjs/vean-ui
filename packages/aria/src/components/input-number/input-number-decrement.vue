<script setup lang="ts">
import { computed } from 'vue';
import { useForwardElement } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { usePressedHold } from './shared';
import { useInputNumberRootContext, useInputNumberUi } from './context';
import type { InputNumberDecrementProps } from './types';

defineOptions({
  name: 'InputNumberDecrement'
});

const props = defineProps<InputNumberDecrementProps>();

const { disabled, readonly, isDecreaseDisabled, onDecrease } = useInputNumberRootContext('InputNumberDecrement');

const cls = useInputNumberUi('decrement');
const messages = useLocaleMessages();

const [decrementElement, setDecrementElement] = useForwardElement();

const isDisabled = computed(() => disabled.value || readonly.value || props.disabled || isDecreaseDisabled.value);

const { isPressed, onTrigger } = usePressedHold({ target: decrementElement, disabled: isDisabled });

const style = computed(() => (isPressed.value ? 'user-select:none;' : undefined));

onTrigger(() => {
  onDecrease();
});
</script>

<template>
  <Button
    :ref="setDecrementElement"
    v-bind="props"
    data-vean-input-number-decrement
    :class="cls"
    tabindex="-1"
    :aria-label="messages.inputNumber.decrement"
    :disabled="isDisabled"
    :data-pressed="isPressed ? 'true' : undefined"
    :style="style"
    @contextmenu.prevent
  >
    <slot />
  </Button>
</template>
