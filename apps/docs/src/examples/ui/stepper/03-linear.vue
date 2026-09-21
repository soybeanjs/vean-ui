<script setup lang="ts">
import { computed, ref } from 'vue';
import { SButton, SStepper } from '@vean/ui';

const value = ref(1);

const items = [
  { title: 'Shipping', description: 'Delivery details' },
  { title: 'Billing', description: 'Payment information' },
  { title: 'Review', description: 'Place your order' }
];

const canGoPrev = computed(() => value.value > 1);
const canGoNext = computed(() => value.value < items.length);
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex-c gap-4">
      <SStepper v-model="value" :items="items" linear />
      <div class="flex items-center gap-2">
        <SButton :disabled="!canGoPrev" @click="value -= 1">Previous</SButton>
        <SButton :disabled="!canGoNext" @click="value += 1">Next</SButton>
      </div>
    </div>
  </div>
</template>
