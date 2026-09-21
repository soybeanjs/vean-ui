<script setup lang="ts">
import { SButton, SCard, SInput, STag, STextarea } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewRadius'
});

/** the seven seed-driven rungs plus the two extremes, in scale order. */
const rungs = [
  { token: 'rounded-none', class: 'rounded-none' },
  { token: 'rounded-2xs', class: 'rounded-2xs' },
  { token: 'rounded-xs', class: 'rounded-xs' },
  { token: 'rounded-sm', class: 'rounded-sm' },
  { token: 'rounded-md', class: 'rounded-md' },
  { token: 'rounded-lg', class: 'rounded-lg' },
  { token: 'rounded-xl', class: 'rounded-xl' },
  { token: 'rounded-2xl', class: 'rounded-2xl' },
  { token: 'rounded-full', class: 'rounded-full' }
];

/** components re-rounded by hand: only the seed changes, the rung class holds. */
const componentRungs = ['rounded-2xs', 'rounded-sm', 'rounded-md', 'rounded-xl', 'rounded-full'];
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Rung ladder — every rung is a multiple of --radius</p>
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-5 xl:grid-cols-9">
      <div
        v-for="rung in rungs"
        :key="rung.token"
        :class="rung.class"
        class="flex h-16 flex-col items-center justify-center gap-1 border border-border bg-muted text-muted-foreground"
      >
        <span class="font-mono text-2xs">{{ rung.token.replace('rounded-', '') }}</span>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SButton · SInput · STag · STextarea at five rungs</p>
    <div v-for="rung in componentRungs" :key="rung" class="flex flex-wrap items-center gap-3">
      <span class="w-24 shrink-0 font-mono text-2xs text-muted-foreground">{{ rung.replace('rounded-', '') }}</span>
      <SButton :class="rung">Button</SButton>
      <SInput placeholder="Input" :class="rung" class="w-40" />
      <STag :class="rung">Tag</STag>
      <STextarea placeholder="Textarea" :class="rung" class="w-40" />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Nesting — inner radius derived from the outer panel</p>
    <div class="grid gap-3 xl:grid-cols-2">
      <div class="rounded-xl border border-border bg-background p-4">
        <div class="rounded-lg border border-border bg-card p-4">
          <div class="flex flex-wrap items-center gap-3">
            <SButton size="sm">Button</SButton>
            <SInput placeholder="Input" size="sm" class="w-36" />
          </div>
        </div>
      </div>
      <SCard title="Card" description="Card and controls inside it share the seed" split>
        <div class="flex flex-wrap items-center gap-3">
          <SButton size="sm">Button</SButton>
          <SInput placeholder="Input" size="sm" class="w-36" />
        </div>
      </SCard>
    </div>
  </div>
</template>
