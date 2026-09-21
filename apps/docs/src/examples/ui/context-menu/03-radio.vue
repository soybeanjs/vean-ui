<script setup lang="ts">
import { ref } from 'vue';
import { SContextMenuRadio } from '@vean/ui';
import type { MenuRadioOptionData } from '@vean/ui';
import ContextMenuTrigger from './_trigger.vue';

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
</script>

<template>
  <div class="flex justify-center w-full">
    <SContextMenuRadio v-model="placement" class="max-w-2xl" :items="placements">
      <template #trigger>
        <ContextMenuTrigger />
      </template>
    </SContextMenuRadio>
  </div>
</template>
