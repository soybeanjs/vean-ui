<script setup lang="ts">
import type { VNodeRef } from 'vue';
import { useInputOtpRootContext, useInputOtpUi } from './context';
import type { InputOtpInputProps } from './types';

defineOptions({
  name: 'InputOtpInput'
});

defineProps<InputOtpInputProps>();

const cls = useInputOtpUi('input');

const {
  autocomplete,
  autofocus,
  disabled,
  inputAttrs,
  inputElement,
  inputmode,
  maxlength,
  minlength,
  mirrorSelectionStart,
  mirrorSelectionEnd,
  modelValue,
  name,
  pattern,
  readonly,
  required,
  resolvedAccessibleLabel,
  resolvedId,
  resolvedPlaceholder,
  willPushPWMBadge,
  onBeforeInput,
  onNativeChange,
  onNativeSelect,
  onMouseOver,
  onMouseLeave,
  onPaste,
  onInput,
  onFocus,
  onBlur
} = useInputOtpRootContext('InputOtpInput');

const setInputElement: VNodeRef = element => {
  inputElement.value = element instanceof HTMLInputElement ? element : null;
};
</script>

<template>
  <input
    v-bind="inputAttrs"
    :id="resolvedId"
    :ref="setInputElement"
    data-vean-input-otp-input
    data-input-otp
    :data-password-manager-badge="willPushPWMBadge ? '' : undefined"
    type="text"
    :class="cls"
    :value="modelValue"
    :data-input-otp-placeholder-shown="modelValue.length === 0 || undefined"
    :data-input-otp-mss="mirrorSelectionStart"
    :data-input-otp-mse="mirrorSelectionEnd"
    :aria-label="resolvedAccessibleLabel"
    :aria-placeholder="resolvedPlaceholder"
    :autocomplete="autocomplete"
    autocorrect="off"
    spellcheck="false"
    :autofocus="autofocus"
    :disabled="disabled"
    :inputmode="inputmode"
    :maxlength="maxlength"
    :minlength="minlength"
    :name="name"
    :pattern="pattern"
    :placeholder="resolvedPlaceholder"
    :readonly="readonly"
    :required="required"
    @beforeinput="onBeforeInput"
    @change="onNativeChange"
    @select="onNativeSelect"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @paste="onPaste"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>
