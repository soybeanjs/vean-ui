<script setup lang="ts">
import { shallowRef } from 'vue';
import { createTime } from '@vean/aria/date';
import { STimeField } from '@vean/ui';

const value = shallowRef(createTime(18, 15, 0));
</script>

<template>
  <div class="flex justify-center w-full">
    <STimeField
      v-model="value"
      class="max-w-2xl"
      aria-label="Styled time"
      :ui="{
        root: 'rounded-xl border-primary/40 bg-primary/4',
        input: 'focus-visible:bg-primary/12'
      }"
    />
  </div>
</template>
