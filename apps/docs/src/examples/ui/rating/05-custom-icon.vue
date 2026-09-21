<script setup lang="ts">
import { ref } from 'vue';
import { SRating } from '@vean/ui';

const value = ref(3);
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex-c gap-3">
      <SRating v-model="value">
        <template #icon="{ state }">
          <span class="inline-flex" :class="[state === 'full' ? 'text-primary' : 'text-muted-foreground/30']">★</span>
        </template>
      </SRating>
      <span class="text-sm text-muted-foreground">custom star ({{ value }})</span>
    </div>
  </div>
</template>
