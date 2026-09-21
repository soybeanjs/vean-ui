<script setup lang="ts">
import { ref } from 'vue';
import {
  SButton,
  SCheckbox,
  SCheckboxGroup,
  SInput,
  SInputNumber,
  SRadioGroup,
  SRating,
  SSegment,
  SSelect,
  SSlider,
  SSwitch,
  STagsInput,
  STextarea,
  SToggleGroup,
  SToggleGroupItem
} from '@vean/ui';
import type { CheckboxGroupOptionData, RadioGroupOptionData, SegmentOptionData, SelectOptionData } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewForms'
});

const fruits: SelectOptionData<string>[] = ['apple', 'banana', 'cherry'].map(fruit => ({
  label: fruit,
  value: fruit
}));

const plans: RadioGroupOptionData<string>[] = [
  { label: 'Starter', value: 'starter' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise' }
];

const channels: CheckboxGroupOptionData<string>[] = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' }
];

const views: SegmentOptionData<string>[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];

const name = ref('');
const note = ref('');
const plan = ref('team');
const channel = ref(['email']);
const view = ref('week');
const format = ref('bold');
const rating = ref(4);
const volume = ref([62]);
const quantity = ref(2);
const tags = ref(['Vue', 'UnoCSS']);
const enabled = ref(true);
const accepted = ref<boolean | 'indeterminate'>(true);
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SInput · SSelect · STextarea · SInputNumber</p>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <SInput v-model="name" placeholder="Project name" />
      <SSelect v-model="plan" :items="fruits" placeholder="Select a fruit" />
      <STextarea v-model="note" placeholder="Description" />
      <SInputNumber v-model="quantity" placeholder="Quantity" />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SCheckbox · SRadioGroup · SSwitch · SRating · SSlider</p>
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <SCheckbox v-model="accepted" label="Accept terms" />
      <SSwitch v-model="enabled" />
      <SRating v-model="rating" />
      <SSlider v-model="volume" class="w-40" :thumb-props="{ 'aria-label': 'Volume' }" />
      <SRadioGroup v-model="plan" :items="plans" />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SSegment · SToggleGroup · STagsInput · SCheckboxGroup</p>
    <div class="flex flex-col gap-3">
      <SSegment v-model="view" :items="views" size="sm" class="self-start" />
      <SToggleGroup v-model="format" class="self-start">
        <SToggleGroupItem value="bold">Bold</SToggleGroupItem>
        <SToggleGroupItem value="italic">Italic</SToggleGroupItem>
        <SToggleGroupItem value="underline">Underline</SToggleGroupItem>
      </SToggleGroup>
      <SCheckboxGroup v-model="channel" :items="channels" />
      <STagsInput v-model="tags" :control-props="{ 'aria-label': 'Add tag', placeholder: 'Add a tag' }" />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">Focus ring · disabled — press Tab to walk the ring token</p>
    <div class="flex flex-wrap items-center gap-3">
      <SInput placeholder="Focus me" class="w-48" />
      <SButton>Focus me</SButton>
      <SButton disabled>Disabled</SButton>
      <SInput placeholder="Disabled" disabled class="w-48" />
    </div>
  </div>
</template>
