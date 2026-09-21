<script setup lang="ts">
import { ref } from 'vue';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@vean/aria/constants';
import { SInputOtp } from '@vean/ui';

const otp = ref('A3F');
</script>

<template>
  <div class="flex justify-center w-full">
    <SInputOtp
      v-model="otp"
      :maxlength="6"
      inputmode="text"
      :pattern="REGEXP_ONLY_DIGITS_AND_CHARS"
      placeholder="ABC123"
      aria-label="Invite code"
      size="lg"
      class="w-70 lt-md:w-auto"
    />
  </div>
</template>
