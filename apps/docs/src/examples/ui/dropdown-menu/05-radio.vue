<script setup lang="ts">
import { computed, ref } from 'vue';
import { SButton, SDropdownMenuRadio } from '@vean/ui';
import type { MenuRadioOptionData } from '@vean/ui';

const placement = ref('top-start');

const placements: MenuRadioOptionData<string>[] = [
  { isGroupLabel: true, value: 'tooltipPlacement', label: 'Tooltip Placement' },
  { value: 'top-start', label: 'Top Start' },
  { value: 'top', label: 'Top' },
  { value: 'top-end', label: 'Top End' },
  { value: 'right-start', label: 'Right Start' },
  { value: 'right', label: 'Right' },
  { value: 'right-end', label: 'Right End' },
  { value: 'bottom-start', label: 'Bottom Start' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-end', label: 'Bottom End' },
  { value: 'left-start', label: 'Left Start' },
  { value: 'left', label: 'Left' },
  { value: 'left-end', label: 'Left End' }
];

const activeLabel = computed(() => placements.find(item => item.value === placement.value)?.label);
</script>

<template>
  <div class="flex justify-center w-full">
    <SDropdownMenuRadio v-model="placement" class="max-w-2xl" :items="placements">
      <template #trigger>
        <SButton variant="pure" class="w-30">{{ activeLabel }}</SButton>
      </template>
    </SDropdownMenuRadio>
  </div>
</template>
