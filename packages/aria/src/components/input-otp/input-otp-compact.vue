<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, usePickProps } from '../../composables';
import { useInputOtpUi } from './context';
import InputOtpInput from './input-otp-input.vue';
import InputOtpPositioner from './input-otp-positioner.vue';
import InputOtpRoot from './input-otp-root.vue';
import type { InputOtpCompactProps, InputOtpSlotProps, InputOtpCompactEmits, InputOtpCompactSlots } from './types';

defineOptions({
  name: 'InputOtpCompact'
});

const props = defineProps<InputOtpCompactProps>();

const emit = defineEmits<InputOtpCompactEmits>();

defineSlots<InputOtpCompactSlots>();

const listeners = useForwardListeners(emit);

const ui = useInputOtpUi();

const rootProps = usePickProps(props, [
  'id',
  'autocomplete',
  'autofocus',
  'disabled',
  'minlength',
  'placeholder',
  'readonly',
  'ariaLabel',
  'modelValue',
  'defaultValue',
  'maxlength',
  'inputmode',
  'pattern',
  'pushPasswordManagerStrategy',
  'pasteTransformer',
  'name',
  'required'
]);

const columns = computed(() => Math.max(props.maxlength, 1));

const groupStyle = computed(() => ({
  '--columns': columns.value
}));

const getSlotState = (slot: InputOtpSlotProps) => {
  if (slot.isActive) {
    return 'active';
  }

  if (slot.char) {
    return 'filled';
  }

  return 'idle';
};
</script>

<template>
  <InputOtpRoot v-slot="slotProps" v-bind="rootProps" v-on="listeners">
    <slot v-bind="slotProps">
      <div data-vean-input-otp-group aria-hidden="true" :class="ui.group" :style="groupStyle">
        <div
          v-for="(slotItem, index) in slotProps.slots"
          :key="index"
          data-vean-input-otp-slot
          :class="ui.slot"
          :data-state="getSlotState(slotItem)"
        >
          <span v-if="slotItem.char" data-vean-input-otp-char :class="ui.char">{{ slotItem.char }}</span>
          <span v-else-if="slotItem.placeholderChar" data-vean-input-otp-placeholder :class="ui.placeholder">
            {{ slotItem.placeholderChar }}
          </span>
          <span v-if="slotItem.hasFakeCaret" data-vean-input-otp-caret :class="ui.caret" />
        </div>
      </div>
    </slot>
    <InputOtpPositioner>
      <InputOtpInput />
    </InputOtpPositioner>
  </InputOtpRoot>
</template>
