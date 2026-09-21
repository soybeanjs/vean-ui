<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { InputOtpCompact, provideInputOtpUi } from '@vean/aria/input-otp';
import { inputOtpVariants } from '@/styles/input-otp';
import type { InputOtpProps, InputOtpEmits, InputOtpSlots } from './types';

defineOptions({
  name: 'SInputOtp'
});

const props = defineProps<InputOtpProps>();

const emit = defineEmits<InputOtpEmits>();

defineSlots<InputOtpSlots>();

const listeners = useForwardListeners(emit);

const rootProps = useOmitProps(props, ['class', 'size', 'align', 'ui']);

const ui = computed(() => inputOtpVariants({ size: props.size, align: props.align }, props.ui, { root: props.class }));

provideInputOtpUi(ui);
</script>

<template>
  <InputOtpCompact v-slot="slotProps" v-bind="rootProps" v-on="listeners">
    <slot v-bind="slotProps" />
  </InputOtpCompact>
</template>
