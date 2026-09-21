<script setup lang="ts">
import { ref } from 'vue';
import {
  SAvatar,
  SBadge,
  SButton,
  SButtonIcon,
  SCheckbox,
  SLink,
  SPagination,
  SProgress,
  SRating,
  SSlider,
  SSwitch,
  STag
} from '@vean/ui';
import type { ButtonVariant, ThemeColor } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewColors'
});

/** the primary-color button ladder, widest-used variants first. */
const variants: ButtonVariant[] = ['solid', 'outline', 'soft', 'pure', 'dashed', 'ghost', 'link'];

/** the fills derived from the base palette (secondary is the control fill). */
const baseFills: ThemeColor[] = ['secondary', 'accent', 'carbon'];

const primaryRamp = [
  'bg-primary-50',
  'bg-primary-100',
  'bg-primary-200',
  'bg-primary-300',
  'bg-primary-400',
  'bg-primary-500',
  'bg-primary-600',
  'bg-primary-700',
  'bg-primary-800',
  'bg-primary-900',
  'bg-primary-950'
];

const primaryRampLabels = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const sliderValue = ref([56]);
const ratingValue = ref(3);
const page = ref(2);
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SButton</p>
    <div class="flex flex-wrap items-center gap-3">
      <SButton v-for="variant in variants" :key="variant" color="primary" :variant="variant">
        {{ variant }}
      </SButton>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SButton · SLink · SBadge · STag</p>
    <div class="flex flex-wrap items-center gap-3">
      <SButton v-for="color in baseFills" :key="color" :color="color">{{ color }}</SButton>
      <SLink to="/overview/theming">Theme docs</SLink>
      <SBadge color="primary" content="9">
        <SButtonIcon icon="lucide:bell" variant="pure" aria-label="Notifications" />
      </SBadge>
      <STag color="secondary">Secondary</STag>
      <STag color="accent">Accent</STag>
      <STag color="carbon" variant="soft">Carbon</STag>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">
      SSwitch · SCheckbox · SSlider · SProgress · SRating · SPagination · SAvatar
    </p>
    <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
      <SSwitch :default-value="true" />
      <SCheckbox :default-value="true" label="Checked" />
      <SSlider v-model="sliderValue" class="w-40" :thumb-props="{ 'aria-label': 'Progress' }" />
      <SProgress :model-value="64" class="w-40" />
      <SRating v-model="ratingValue" />
      <SAvatar src="https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212" fallback-label="S" />
      <SPagination v-model:page="page" :total="120" :items-per-page="10" />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">primary-50 → primary-950</p>
    <div class="flex overflow-hidden rounded-sm border border-border">
      <div
        v-for="(level, index) in primaryRamp"
        :key="level"
        :class="level"
        class="h-6 flex-1"
        :title="primaryRampLabels[index]"
      />
    </div>
  </div>
</template>
