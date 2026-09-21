<script setup lang="ts">
import { computed } from 'vue';
import { useForwardElement } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { usePressedHold } from './shared';
import { useInputNumberRootContext, useInputNumberUi } from './context';
import type { InputNumberIncrementProps } from './types';

defineOptions({
  name: 'InputNumberIncrement'
});

const props = defineProps<InputNumberIncrementProps>();

const { disabled, readonly, isIncreaseDisabled, onIncrease } = useInputNumberRootContext('InputNumberIncrement');

const cls = useInputNumberUi('increment');
const messages = useLocaleMessages();

const [incrementElement, setIncrementElement] = useForwardElement();

const isDisabled = computed(() => disabled.value || readonly.value || props.disabled || isIncreaseDisabled.value);

const { isPressed, onTrigger } = usePressedHold({ target: incrementElement, disabled: isDisabled });

const style = computed(() => (isPressed.value ? 'user-select:none;' : undefined));

onTrigger(() => {
  onIncrease();
});
</script>

<template>
  <Button
    :ref="setIncrementElement"
    v-bind="props"
    data-vean-input-number-increment
    :class="cls"
    tabindex="-1"
    :aria-label="messages.inputNumber.increment"
    :disabled="isDisabled"
    :data-pressed="isPressed ? 'true' : undefined"
    :style="style"
    @contextmenu.prevent
  >
    <slot />
  </Button>
</template>
