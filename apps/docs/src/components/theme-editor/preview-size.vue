<script setup lang="ts">
import { themeSizeKeys } from '@vean/theme';
import {
  SAvatar,
  SBadge,
  SButton,
  SCheckbox,
  SInput,
  SInputNumber,
  SProgress,
  SRadioGroup,
  SSegment,
  SSelect,
  SSlider,
  SSwitch,
  STag,
  STextarea
} from '@vean/ui';
import type { RadioGroupOptionData, SegmentOptionData, SelectOptionData } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewSize'
});

const sizes = themeSizeKeys;

const options: SelectOptionData<string>[] = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' }
];

const radios: RadioGroupOptionData<string>[] = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' }
];

const segments: SegmentOptionData<string>[] = [
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' }
];

// bound via :src — a static src value containing `//` breaks vue-tsc's generated v-for scope (tsgo quirk)
const avatarSrc = 'https://img.soybeanjs.dev/logo-vean-ui.svg?v=202609141212';

const textLadder = [
  { token: 'text-4xs', class: 'text-4xs' },
  { token: 'text-3xs', class: 'text-3xs' },
  { token: 'text-2xs', class: 'text-2xs' },
  { token: 'text-xs', class: 'text-xs' },
  { token: 'text-sm', class: 'text-sm' },
  { token: 'text-base', class: 'text-base' },
  { token: 'text-lg', class: 'text-lg' },
  { token: 'text-xl', class: 'text-xl' },
  { token: 'text-2xl', class: 'text-2xl' }
];
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SButton · SBadge · STag</p>
    <div class="flex flex-wrap items-center gap-3">
      <SButton v-for="size in sizes" :key="size" :size="size" variant="pure">{{ size }}</SButton>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SBadge v-for="size in sizes" :key="size" :size="size">{{ size }}</SBadge>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <STag v-for="size in sizes" :key="size" :size="size" variant="soft">{{ size }}</STag>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SInput · SSelect · STextarea · SInputNumber</p>
    <div class="flex items-center gap-3">
      <SInput v-for="size in sizes" :key="`input-${size}`" :size="size" :placeholder="size" class="flex-1 min-w-0" />
    </div>
    <div class="flex items-center gap-3">
      <SSelect v-for="size in sizes" :key="`select-${size}`" :size="size" :items="options" class="flex-1 min-w-0" />
    </div>
    <div class="flex items-center gap-3">
      <SInputNumber
        v-for="size in sizes"
        :key="`number-${size}`"
        :size="size"
        :placeholder="size"
        class="flex-1 min-w-0"
      />
    </div>
    <div class="flex items-center gap-3">
      <STextarea
        v-for="size in sizes"
        :key="`textarea-${size}`"
        :size="size"
        :placeholder="size"
        class="flex-1 min-w-0"
      />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SCheckbox · SSwitch · SSlider · SRadioGroup · SSegment</p>
    <div class="flex flex-wrap items-center gap-3">
      <SCheckbox v-for="size in sizes" :key="`checkbox-${size}`" :size="size" :default-value="true" :label="size" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SSwitch v-for="size in sizes" :key="`switch-${size}`" :size="size" :default-value="true" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SSlider
        v-for="size in sizes"
        :key="`slider-${size}`"
        :size="size"
        :default-value="[50]"
        class="flex-1 min-w-0"
      />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SRadioGroup v-for="size in sizes" :key="`radio-${size}`" :size="size" :items="radios" default-value="1" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SSegment v-for="size in sizes" :key="`segment-${size}`" :size="size" :items="segments" default-value="on" />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SProgress · SAvatar</p>
    <div class="flex flex-col gap-2">
      <SProgress v-for="size in sizes" :key="`progress-${size}`" :size="size" :model-value="60" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SAvatar v-for="size in sizes" :key="`avatar-${size}`" :size="size" :src="avatarSrc" fallback-label="V" />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Type rungs — 4xs / 3xs / 2xs (ours) then xs → 9xl (UnoCSS)</p>
    <div class="space-y-0.5">
      <p v-for="item in textLadder" :key="item.token" :class="item.class" class="text-foreground">
        {{ item.token }}
      </p>
    </div>
  </div>
</template>
