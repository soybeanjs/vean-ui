<script setup lang="ts">
import { SButton, SButtonGroup } from '@vean/ui';
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <SButtonGroup variant="pure" color="accent" class="whitespace-nowrap">
      <SButton v-for="i in 3" :key="i">Button {{ i }}</SButton>
    </SButtonGroup>
    <SButtonGroup orientation="vertical" class="w-30 mt-4" variant="outline" color="warning">
      <SButton v-for="i in 3" :key="i">Button {{ i }}</SButton>
    </SButtonGroup>
  </div>
</template>
