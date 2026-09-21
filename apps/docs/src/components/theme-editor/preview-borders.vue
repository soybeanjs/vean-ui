<script setup lang="ts">
import { ref } from 'vue';
import { SCard, SCheckbox, SInput, SRadioGroup, SSeparator, SSelect, SSwitch, STag, STextarea } from '@vean/ui';
import type { RadioGroupOptionData, SelectOptionData } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewBorders'
});

const borderTiles = [
  { token: '--border', class: 'border border-border' },
  { token: '--input', class: 'border border-input' },
  { token: '--primary', class: 'border border-primary' },
  { token: 'border-border/40', class: 'border border-border/40' },
  { token: 'dashed', class: 'border border-border border-dashed' }
];

const ringTiles = [
  { token: '--ring', class: 'ring-2 ring-ring' },
  { token: 'ring-ring/50', class: 'ring-4 ring-ring/50' },
  { token: '--ring-width', class: 'ring-3 ring-ring/30' }
];

const options: SelectOptionData<string>[] = [
  { label: 'Option one', value: '1' },
  { label: 'Option two', value: '2' }
];

const radios: RadioGroupOptionData<string>[] = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' }
];

const selected = ref('1');
const radio = ref('1');
const name = ref('');
const note = ref('');
const enabled = ref(true);
const checked = ref<boolean | 'indeterminate'>('indeterminate');
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Hairline tokens</p>
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-for="tile in borderTiles"
        :key="tile.token"
        :class="tile.class"
        class="flex h-12 w-36 items-center justify-center rounded-sm bg-card font-mono text-2xs text-muted-foreground"
      >
        {{ tile.token }}
      </div>
    </div>
  </div>

  <div class="grid gap-4 xl:grid-cols-2">
    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">Control outlines — SInput · SSelect · STextarea</p>
      <div class="flex flex-col gap-3">
        <SInput v-model="name" placeholder="Name" />
        <SSelect v-model="selected" :items="options" />
        <STextarea v-model="note" placeholder="Notes" />
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">SCheckbox · SRadioGroup · SSwitch · STag</p>
      <div class="flex flex-col gap-4">
        <SCheckbox v-model="checked" label="Indeterminate" />
        <SRadioGroup v-model="radio" :items="radios" />
        <SSwitch v-model="enabled" />
        <div class="flex flex-wrap gap-2">
          <STag variant="outline">outline</STag>
          <STag variant="outline" color="primary">primary</STag>
          <STag variant="outline" color="destructive">destructive</STag>
        </div>
      </div>
    </div>
  </div>

  <div class="grid gap-4 xl:grid-cols-2">
    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">SSeparator</p>
      <SCard title="Card border" description="Card outlines read the same hairline tokens" split>
        <div class="space-y-3">
          <div class="flex items-center gap-4 text-sm">
            <span>Blog</span>
            <SSeparator orientation="vertical" class="h-4" />
            <span>Docs</span>
            <SSeparator orientation="vertical" class="h-4" />
            <span>Source</span>
          </div>
          <SSeparator />
          <p class="text-xs text-muted-foreground">Horizontal and vertical separators</p>
        </div>
      </SCard>
    </div>

    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">Focus rings</p>
      <div class="flex flex-wrap items-center gap-3">
        <div
          v-for="tile in ringTiles"
          :key="tile.token"
          :class="tile.class"
          class="flex h-12 w-36 items-center justify-center rounded-sm bg-card font-mono text-2xs text-muted-foreground"
        >
          {{ tile.token }}
        </div>
      </div>
      <p class="text-xs text-muted-foreground">
        Border opacity and ring width are global: the hairline tiles above are the same token at different alpha.
      </p>
    </div>
  </div>
</template>
