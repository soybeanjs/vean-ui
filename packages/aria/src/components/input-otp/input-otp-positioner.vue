<script setup lang="ts">
import { useInputOtpUi } from './context';
import type { InputOtpPositionerProps } from './types';

defineOptions({
  name: 'InputOtpPositioner'
});

defineProps<InputOtpPositionerProps>();

const cls = useInputOtpUi('positioner');
</script>

<template>
  <div data-vean-input-otp-positioner :class="cls">
    <slot />
  </div>
</template>
