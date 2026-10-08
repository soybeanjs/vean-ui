<script setup lang="ts">
defineOptions({
  name: 'ThemeEditorPreviewSurfaces'
});

const elevationTiles = [
  { token: '--background', class: 'bg-background text-foreground' },
  { token: '--card', class: 'bg-card text-card-foreground' },
  { token: '--popover', class: 'bg-popover text-popover-foreground' },
  { token: '--carbon', class: 'bg-carbon text-carbon-foreground' }
];

const textStack = [
  { token: '--foreground', class: 'text-foreground' },
  { token: '--muted-foreground', class: 'text-muted-foreground' },
  { token: 'muted-foreground/70', class: 'text-muted-foreground/70' }
];

/**
 * elevation 的四档：阴影**不是**主题 token（docs/design/theme.md §5.3），直接用 UnoCSS
 * 的档位——`shadow-sm` / `shadow` / `shadow-md` / `shadow-lg` 都是它的值。
 */
const shadows = [
  { token: 'shadow-sm', class: 'shadow-sm' },
  { token: 'shadow', class: 'shadow' },
  { token: 'shadow-md', class: 'shadow-md' },
  { token: 'shadow-lg', class: 'shadow-lg' }
];
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Elevation ladder — background → card → popover → carbon</p>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="tile in elevationTiles"
        :key="tile.token"
        :class="tile.class"
        class="flex h-24 flex-col justify-between rounded-lg border border-border p-3"
      >
        <span class="text-sm font-medium">Aa</span>
        <span class="font-mono text-2xs opacity-70">{{ tile.token }}</span>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Nesting — a surface inside a surface</p>
    <div class="rounded-xl border border-border bg-background p-4">
      <div class="space-y-3 rounded-lg border border-border bg-card p-4">
        <p class="text-sm text-foreground">Surface panel</p>
        <div class="flex flex-wrap items-center gap-3 rounded-md border border-border bg-popover p-3">
          <span class="text-xs text-muted-foreground">Elevated popup</span>
          <span class="rounded-sm bg-muted px-2 py-1 text-2xs text-muted-foreground">muted chip</span>
          <span class="rounded-sm bg-accent px-2 py-1 text-2xs text-accent-foreground">accent chip</span>
        </div>
      </div>
    </div>
  </div>

  <div class="grid gap-4 xl:grid-cols-2">
    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">Shadow ladder</p>
      <div class="grid grid-cols-4 gap-3">
        <div
          v-for="shadow in shadows"
          :key="shadow.token"
          :class="shadow.class"
          class="flex h-16 items-end rounded-md bg-card p-2"
        >
          <span class="font-mono text-2xs text-muted-foreground">{{ shadow.token }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">Text roles on the page surface</p>
      <div class="space-y-1 rounded-lg border border-border bg-background p-3">
        <p v-for="item in textStack" :key="item.token" :class="item.class" class="text-sm">
          {{ item.token }} — the quick brown fox
        </p>
      </div>
    </div>
  </div>
</template>
