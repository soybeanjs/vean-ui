<script setup lang="ts">
import { computed } from 'vue';
import { useControllableState, useForwardElement, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import InputClear from '../input/input-clear.vue';
import InputControl from '../input/input-control.vue';
import InputRoot from '../input/input-root.vue';
import { usePasswordUi } from './context';
import type { PasswordCompactProps, PasswordCompactEmits, PasswordCompactSlots } from './types';

defineOptions({
  name: 'PasswordCompact'
});

const props = withDefaults(defineProps<PasswordCompactProps>(), {
  visible: undefined,
  defaultVisible: false
});

const emit = defineEmits<PasswordCompactEmits>();

defineSlots<PasswordCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'inputRef',
  'controlProps',
  'clearable',
  'clearProps',
  'visible',
  'visibleProps'
]);

const [_, setInputElement] = useForwardElement(el => props.inputRef?.(el as HTMLInputElement));

const visible = useControllableState(
  () => props.visible,
  value => {
    emit('update:visible', value);
  },
  props.defaultVisible
);

const ui = usePasswordUi();
const messages = useLocaleMessages();

const clearAriaLabel = computed(() => props.clearProps?.['aria-label'] ?? messages.value.password.clearInput);

const visibleDisabled = computed(() => props.disabled || props.readonly || props.visibleProps?.disabled || false);

const visibleLabel = computed(() =>
  visible.value ? messages.value.password.hidePassword : messages.value.password.showPassword
);

const toggleVisible = () => {
  visible.value = !visible.value;
};
</script>

<template>
  <InputRoot
    v-slot="{ clear, modelValue }"
    v-bind="forwardedProps"
    data-vean-password
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot name="leading" :clear="clear" :model-value="modelValue" :toggle="toggleVisible" :visible="visible" />
    <InputControl v-bind="controlProps" :ref="setInputElement" :type="visible ? 'text' : 'password'" />
    <template v-if="clearable">
      <slot name="clear" :clear="clear" :model-value="modelValue" :toggle="toggleVisible" :visible="visible">
        <InputClear v-bind="clearProps" :aria-label="clearAriaLabel" @clear="emit('clear', $event)" />
      </slot>
    </template>
    <slot name="trailing" :clear="clear" :model-value="modelValue" :toggle="toggleVisible" :visible="visible" />
    <slot name="visible" :clear="clear" :model-value="modelValue" :toggle="toggleVisible" :visible="visible">
      <Button
        v-bind="visibleProps"
        data-vean-password-visible
        :class="ui.visible"
        :disabled="visibleDisabled"
        :aria-label="visibleLabel"
        :aria-pressed="visible"
        @click="toggleVisible"
      >
        <Icon :icon="visible ? 'lucide:eye' : 'lucide:eye-off'" :aria-hidden="true" />
      </Button>
    </slot>
  </InputRoot>
</template>
