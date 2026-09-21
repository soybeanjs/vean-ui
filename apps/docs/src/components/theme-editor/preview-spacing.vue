<script setup lang="ts">
import {
  SAlert,
  SButton,
  SButtonGroup,
  SCard,
  SKbd,
  SSeparator,
  SToolbar,
  SToolbarButton,
  SToolbarSeparator
} from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewSpacing'
});

/** the padding ladder, in the order the engine declares the rungs. */
const paddings = [
  { token: 'p-2xs', class: 'p-2xs' },
  { token: 'p-xs', class: 'p-xs' },
  { token: 'p-sm', class: 'p-sm' },
  { token: 'p-md', class: 'p-md' },
  { token: 'p-lg', class: 'p-lg' },
  { token: 'p-xl', class: 'p-xl' },
  { token: 'p-2xl', class: 'p-2xl' }
];

const gaps = [
  { token: 'gap-3xs', class: 'gap-3xs' },
  { token: 'gap-2xs', class: 'gap-2xs' },
  { token: 'gap-xs', class: 'gap-xs' },
  { token: 'gap-sm', class: 'gap-sm' },
  { token: 'gap-md', class: 'gap-md' },
  { token: 'gap-lg', class: 'gap-lg' },
  { token: 'gap-xl', class: 'gap-xl' }
];
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Padding ladder — the inner block is fixed, the frame moves</p>
    <div class="flex flex-wrap items-start gap-3">
      <div v-for="item in paddings" :key="item.token" :class="item.class" class="border border-border bg-card">
        <div
          class="flex h-6 w-12 items-center justify-center rounded-2xs bg-primary/15 font-mono text-2xs text-primary"
        >
          {{ item.token.replace('p-', '') }}
        </div>
      </div>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Gap ladder — SButtonGroup · SToolbar · SKbd</p>
    <div class="space-y-3">
      <div v-for="item in gaps" :key="item.token" class="flex flex-wrap items-center gap-3">
        <span class="w-16 shrink-0 font-mono text-2xs text-muted-foreground">{{ item.token.replace('gap-', '') }}</span>
        <div :class="item.class" class="flex flex-wrap items-center">
          <SButton v-for="index in 3" :key="index" variant="pure" size="sm">Button {{ index }}</SButton>
        </div>
        <div :class="item.class" class="flex flex-wrap items-center">
          <SKbd :value="['ctrl', 'K']" />
          <SKbd :value="['ctrl', 'S']" />
        </div>
      </div>
    </div>
  </div>

  <div class="grid gap-4 xl:grid-cols-2">
    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">SButtonGroup · SToolbar · SSeparator</p>
      <div class="space-y-3">
        <SButtonGroup variant="pure">
          <SButton>Left</SButton>
          <SButton>Center</SButton>
          <SButton>Right</SButton>
        </SButtonGroup>
        <SToolbar>
          <SToolbarButton>Cut</SToolbarButton>
          <SToolbarButton>Copy</SToolbarButton>
          <SToolbarSeparator />
          <SToolbarButton>Paste</SToolbarButton>
        </SToolbar>
        <SSeparator />
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">SAlert stack · SCard padding</p>
      <div class="space-y-3">
        <div class="space-y-2">
          <SAlert
            color="info"
            variant="soft"
            icon="lucide:info"
            title="Stacked alert"
            description="space-y-2 between rows"
          />
          <SAlert
            color="success"
            variant="soft"
            icon="lucide:check"
            title="Stacked alert"
            description="space-y-2 between rows"
          />
        </div>
        <SCard title="Card" description="Cards pad their body with the same grid" class="p-0">
          <div class="text-sm text-muted-foreground">Body content</div>
        </SCard>
      </div>
    </div>
  </div>
</template>
