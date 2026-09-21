<script setup lang="ts">
import { SScrollArea } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SScrollArea
      class="h-48 rounded-xl border border-primary/30 bg-card max-w-2xl"
      :ui="{
        viewport: 'rounded-xl',
        scrollbar: 'data-[orientation=vertical]:w-3 data-[orientation=horizontal]:h-3',
        thumb: 'bg-primary/60 hover:bg-primary',
        corner: 'bg-primary/20'
      }"
    >
      <div class="grid gap-3 p-4 pe-7 sm:grid-cols-2">
        <div v-for="index in 16" :key="index" class="rounded-lg bg-muted p-3 text-sm">Custom block {{ index }}</div>
      </div>
    </SScrollArea>
  </div>
</template>
