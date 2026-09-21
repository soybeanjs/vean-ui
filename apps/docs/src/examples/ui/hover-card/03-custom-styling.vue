<script setup lang="ts">
import { SButton, SHoverCard } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex items-center gap-3">
      <SHoverCard
        :ui="{
          popup: 'border-primary/30 bg-primary/5 text-foreground shadow-lg',
          arrow: 'fill-primary/5 stroke-primary/30'
        }"
      >
        <template #trigger>
          <SButton variant="ghost">Custom card</SButton>
        </template>
        <div class="space-y-1.5">
          <p class="font-medium">UI overrides</p>
          <p class="text-sm text-muted-foreground">Use the ui prop to customize the popup and arrow slots.</p>
        </div>
      </SHoverCard>
    </div>
  </div>
</template>
