<script setup lang="ts">
import { SButton, SEmpty, SIcon } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SEmpty class="min-h-72 max-w-2xl" title="Nothing matched your filters">
      <template #media>
        <SIcon class="text-destructive" icon="lucide:search-x" />
      </template>
      <template #description>Try broadening the criteria or resetting the filters to see more results.</template>
      <SButton variant="outline">Reset filters</SButton>
    </SEmpty>
  </div>
</template>
