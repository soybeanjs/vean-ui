<script setup lang="ts">
/**
 * Port of `apps/docs/src/components/tailwind-palette.vue`.
 *
 * Same swatch grid, rendered from `@soybeanjs/colord/palette` — the same source the
 * ubean component reads. The original hydrates because it renders through Vue; the
 * palette is static data, so this island exists only because the markdown tag is
 * resolved to a component. `client:visible` keeps it off the first-paint path.
 */
import { paletteColorLevels, tailwindPalette } from '@soybeanjs/colord/palette';

const palettes = Object.entries(tailwindPalette) as [string, Record<string, { hsl: string }>][];
const levels = paletteColorLevels as string[];
</script>

<template>
  <div class="my-6 flex flex-col gap-4">
    <div v-for="[name, palette] in palettes" :key="name" class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-muted-foreground">{{ name }}</span>
      <div class="grid grid-cols-11 gap-1">
        <div
          v-for="level in levels"
          :key="level"
          class="h-8 rounded-sm border border-border/40"
          :style="{ backgroundColor: palette[level]?.hsl }"
          :title="`${name}-${level}`"
        />
      </div>
    </div>
  </div>
</template>
